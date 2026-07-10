import { Hono } from 'hono'
import type { Context } from 'hono'
import { nanoid } from 'nanoid'
import type { AppEnv, ChangelogItemOut } from '../_shared/types'
import {
  cleanChangelog,
  buildChangelogWhere,
  hasApiKey,
  normalizeSection,
  computeTags,
  rebuildChangelogBlob,
  channelWhere,
  SECTION_ORDER,
} from '../_shared/helpers'

const app = new Hono<AppEnv>()

// ---------------------------------------------------------------------------
// Shared: fetch structured items + tags for a set of release ids, grouped by
// release. Two-query stitch (page releases, then their items) avoids a 3-way
// join cross-product and keeps LIMIT/OFFSET over releases correct.
// ---------------------------------------------------------------------------

async function fetchItemsForReleases(
  c: Context<AppEnv>,
  ids: string[],
): Promise<Map<string, ChangelogItemOut[]>> {
  const byRelease = new Map<string, ChangelogItemOut[]>()
  if (ids.length === 0) return byRelease

  const placeholders = ids.map(() => '?').join(',')
  const rows = await c.env.DB.prepare(
    `SELECT ci.id, ci.changelog_id, ci.section, ci.text, ci.sort_order, it.tag AS tag
     FROM changelog_items ci
     LEFT JOIN item_tags it ON it.item_id = ci.id
     WHERE ci.changelog_id IN (${placeholders})
     ORDER BY ci.changelog_id, ci.sort_order`,
  )
    .bind(...ids)
    .all<{
      id: string
      changelog_id: string
      section: string
      text: string
      sort_order: number
      tag: string | null
    }>()

  const seen = new Map<string, ChangelogItemOut>()
  for (const row of rows.results) {
    let item = seen.get(row.id)
    if (!item) {
      item = {
        id: row.id,
        section: row.section,
        text: row.text,
        sort_order: row.sort_order,
        tags: [],
      }
      seen.set(row.id, item)
      const arr = byRelease.get(row.changelog_id) ?? []
      arr.push(item)
      byRelease.set(row.changelog_id, arr)
    }
    if (row.tag) item.tags.push(row.tag)
  }
  return byRelease
}

// ---------------------------------------------------------------------------
// POST /changelogs - CI upload of a structured release (API key auth).
// Payload: { product, version, released_at, download_url?, items:[{section,text,tags?}] }
// ---------------------------------------------------------------------------

interface ItemInput {
  section?: string
  text: string
  tags?: string[]
}

app.post('/', async (c) => {
  if (!hasApiKey(c)) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{
    product: string
    version: string
    released_at: string
    download_url?: string
    items: ItemInput[]
  }>()

  if (
    !body.product ||
    !body.version ||
    !body.released_at ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return c.json({ error: 'Missing required fields: product, version, released_at, items[]' }, 400)
  }

  // Normalize once: canonical section, server-computed tags, order preserved.
  const normalized = body.items
    .filter((it) => it && typeof it.text === 'string' && it.text.trim().length > 0)
    .map((it, idx) => {
      const text = it.text.trim()
      return {
        id: nanoid(),
        section: normalizeSection(it.section),
        text,
        sort_order: idx,
        tags: computeTags(text, it.tags),
      }
    })

  if (normalized.length === 0) {
    return c.json({ error: 'items[] contained no usable bullets' }, 400)
  }

  const blob = rebuildChangelogBlob(normalized)

  // Upsert the header first so we can read back its id (the on-conflict path
  // keeps the original id), then rebuild all children in one atomic batch.
  const headerId = nanoid()
  await c.env.DB.prepare(
    `INSERT INTO changelogs (id, product, version, released_at, changelog, download_url)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(product, version) DO UPDATE SET
       released_at  = excluded.released_at,
       changelog    = excluded.changelog,
       download_url = excluded.download_url`,
  )
    .bind(headerId, body.product, body.version, body.released_at, blob, body.download_url || null)
    .run()

  const header = await c.env.DB.prepare(
    `SELECT id FROM changelogs WHERE product = ? AND version = ?`,
  )
    .bind(body.product, body.version)
    .first<{ id: string }>()
  const changelogId = header!.id

  // Idempotent child rebuild: wipe old items + tags, insert new. item_tags is
  // deleted explicitly - D1 does not keep PRAGMA foreign_keys ON across a batch,
  // so ON DELETE CASCADE is documentation, not the mechanism.
  const stmts: D1PreparedStatement[] = [
    c.env.DB.prepare(
      `DELETE FROM item_tags WHERE item_id IN
         (SELECT id FROM changelog_items WHERE changelog_id = ?)`,
    ).bind(changelogId),
    c.env.DB.prepare(`DELETE FROM changelog_items WHERE changelog_id = ?`).bind(changelogId),
  ]
  for (const it of normalized) {
    stmts.push(
      c.env.DB.prepare(
        `INSERT INTO changelog_items (id, changelog_id, section, text, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
      ).bind(it.id, changelogId, it.section, it.text, it.sort_order),
    )
    for (const tag of it.tags) {
      stmts.push(
        c.env.DB.prepare(`INSERT OR IGNORE INTO item_tags (item_id, tag) VALUES (?, ?)`).bind(
          it.id,
          tag,
        ),
      )
    }
  }
  await c.env.DB.batch(stmts)

  return c.json(
    {
      id: changelogId,
      items: normalized.length,
      tags: [...new Set(normalized.flatMap((n) => n.tags))].sort(),
    },
    201,
  )
})

// ---------------------------------------------------------------------------
// GET /changelogs - paginated releases, each with nested items + tags.
// ?tag= (single) and ?section= filter to releases that have >=1 matching item.
// ---------------------------------------------------------------------------

app.get('/', async (c) => {
  const url = new URL(c.req.url)
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '25', 10)))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10))
  const tag = url.searchParams.get('tag')
  const section = url.searchParams.get('section')

  const { where, binds } = buildChangelogWhere({
    product: url.searchParams.get('product'),
    year: url.searchParams.get('year'),
    month: url.searchParams.get('month'),
    channel: url.searchParams.get('channel') ?? 'release',
  })

  // EXISTS predicate keeps pagination + count operating on "releases that have
  // >=1 matching item", not on items. Both predicates apply to the SAME item.
  const existsParts: string[] = []
  const existsBinds: (string | number)[] = []
  if (section) {
    existsParts.push('ci.section = ?')
    existsBinds.push(section)
  }
  if (tag) {
    existsParts.push('EXISTS (SELECT 1 FROM item_tags it WHERE it.item_id = ci.id AND it.tag = ?)')
    existsBinds.push(tag)
  }
  const existsClause =
    existsParts.length > 0
      ? `${where ? 'AND' : 'WHERE'} EXISTS (
           SELECT 1 FROM changelog_items ci
           WHERE ci.changelog_id = changelogs.id AND ${existsParts.join(' AND ')}
         )`
      : ''
  const listBinds = [...binds, ...existsBinds]

  const [pageResult, countResult] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, product, version, released_at, changelog, download_url
       FROM changelogs ${where} ${existsClause}
       ORDER BY released_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
    )
      .bind(...listBinds, limit, offset)
      .all(),
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM changelogs ${where} ${existsClause}`)
      .bind(...listBinds)
      .first<{ total: number }>(),
  ])

  const releaseRows = pageResult.results as Array<{
    id: string
    product: string
    version: string
    released_at: string
    changelog: string
    download_url: string | null
  }>

  const itemsByRelease = await fetchItemsForReleases(
    c,
    releaseRows.map((r) => r.id),
  )

  const filterActive = !!(tag || section)
  const entries = releaseRows.map((r) => {
    const items = (itemsByRelease.get(r.id) ?? []).map((it) => ({
      ...it,
      matched: filterActive
        ? (!section || it.section === section) && (!tag || it.tags.includes(tag))
        : undefined,
    }))
    return {
      ...r,
      changelog: cleanChangelog(r.changelog),
      items,
      filtered: filterActive || undefined,
    }
  })

  return c.json({ entries, total: countResult?.total ?? 0 })
})

// ---------------------------------------------------------------------------
// GET /changelogs/items - flat cross-release item stream, filtered + sorted.
// The "sort large changelogs by section and tag" payoff. Each row carries its
// release context so the UI can link back to the version.
//   ?tag= ?section= ?product= ?channel= ?sort=released|section  ?limit ?offset
// ---------------------------------------------------------------------------

app.get('/items', async (c) => {
  const url = new URL(c.req.url)
  const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') ?? '50', 10)))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10))
  const tag = url.searchParams.get('tag')
  const section = url.searchParams.get('section')
  const product = url.searchParams.get('product')
  const channel = url.searchParams.get('channel') ?? 'release'
  const sort = url.searchParams.get('sort') === 'section' ? 'section' : 'released'

  const conditions: string[] = []
  const binds: (string | number)[] = []
  const chan = channelWhere(channel, 'cl.version')
  if (chan) conditions.push(chan)
  if (product) {
    const products = product.split(',').map((p) => p.trim())
    conditions.push(`cl.product IN (${products.map(() => '?').join(',')})`)
    binds.push(...products)
  }
  if (section) {
    conditions.push('ci.section = ?')
    binds.push(section)
  }
  if (tag) {
    conditions.push('EXISTS (SELECT 1 FROM item_tags it WHERE it.item_id = ci.id AND it.tag = ?)')
    binds.push(tag)
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Sort: newest-release-first is the default; 'section' groups by the canonical
  // order (via a CASE rank) then newest release within each section.
  const sectionRank = SECTION_ORDER.map((s, i) => `WHEN '${s}' THEN ${i}`).join(' ')
  const orderBy =
    sort === 'section'
      ? `ORDER BY CASE ci.section ${sectionRank} ELSE ${SECTION_ORDER.length} END ASC,
                 cl.released_at DESC, ci.sort_order ASC`
      : `ORDER BY cl.released_at DESC, ci.sort_order ASC`

  const [rows, countRow] = await Promise.all([
    c.env.DB.prepare(
      `SELECT ci.id, ci.section, ci.text, ci.changelog_id,
              cl.product, cl.version, cl.released_at
       FROM changelog_items ci
       JOIN changelogs cl ON cl.id = ci.changelog_id
       ${where}
       ${orderBy}
       LIMIT ? OFFSET ?`,
    )
      .bind(...binds, limit, offset)
      .all<{
        id: string
        section: string
        text: string
        changelog_id: string
        product: string
        version: string
        released_at: string
      }>(),
    c.env.DB.prepare(
      `SELECT COUNT(*) as total
       FROM changelog_items ci
       JOIN changelogs cl ON cl.id = ci.changelog_id
       ${where}`,
    )
      .bind(...binds)
      .first<{ total: number }>(),
  ])

  // Attach tags for just this page of items.
  const ids = rows.results.map((r) => r.id)
  const tagsByItem = new Map<string, string[]>()
  if (ids.length > 0) {
    const ph = ids.map(() => '?').join(',')
    const tagRows = await c.env.DB.prepare(
      `SELECT item_id, tag FROM item_tags WHERE item_id IN (${ph}) ORDER BY tag`,
    )
      .bind(...ids)
      .all<{ item_id: string; tag: string }>()
    for (const t of tagRows.results) {
      const arr = tagsByItem.get(t.item_id) ?? []
      arr.push(t.tag)
      tagsByItem.set(t.item_id, arr)
    }
  }

  const items = rows.results.map((r) => ({
    id: r.id,
    section: r.section,
    text: r.text,
    tags: tagsByItem.get(r.id) ?? [],
    product: r.product,
    version: r.version,
    released_at: r.released_at,
    changelog_id: r.changelog_id,
  }))

  return c.json({ items, total: countRow?.total ?? 0 })
})

// ---------------------------------------------------------------------------
// GET /changelogs/filters - date tree + tag/section universe for the sidebar.
// ---------------------------------------------------------------------------

app.get('/filters', async (c) => {
  const url = new URL(c.req.url)
  const channel = url.searchParams.get('channel') ?? 'release'

  const chanHeader = channelWhere(channel) // over the bare `version` column
  const whereHeader = chanHeader ? `WHERE ${chanHeader}` : ''
  const chanAliased = channelWhere(channel, 'cl.version')
  const whereAliased = chanAliased ? `WHERE ${chanAliased}` : ''

  const [dateAgg, countResult, tagAgg, sectionAgg] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, product, version,
          CAST(strftime('%Y', released_at) AS INTEGER) as year,
          CAST(strftime('%m', released_at) AS INTEGER) as month
       FROM changelogs ${whereHeader}
       ORDER BY released_at DESC`,
    ).all(),
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM changelogs ${whereHeader}`).first<{
      total: number
    }>(),
    c.env.DB.prepare(
      `SELECT it.tag AS tag, COUNT(DISTINCT cl.id) AS count
       FROM item_tags it
       JOIN changelog_items ci ON ci.id = it.item_id
       JOIN changelogs cl ON cl.id = ci.changelog_id
       ${whereAliased}
       GROUP BY it.tag
       ORDER BY count DESC, tag ASC`,
    ).all<{ tag: string; count: number }>(),
    c.env.DB.prepare(
      `SELECT ci.section AS section, COUNT(DISTINCT cl.id) AS count
       FROM changelog_items ci
       JOIN changelogs cl ON cl.id = ci.changelog_id
       ${whereAliased}
       GROUP BY ci.section
       ORDER BY count DESC, section ASC`,
    ).all<{ section: string; count: number }>(),
  ])

  const yearMap: Record<
    number,
    {
      count: number
      months: Record<
        number,
        { count: number; versions: Array<{ version: string; product: string; id: string }> }
      >
    }
  > = {}
  for (const row of dateAgg.results) {
    const y = row.year as number
    const m = row.month as number
    if (!yearMap[y]) yearMap[y] = { count: 0, months: {} }
    yearMap[y].count++
    if (!yearMap[y].months[m]) yearMap[y].months[m] = { count: 0, versions: [] }
    yearMap[y].months[m].count++
    yearMap[y].months[m].versions.push({
      version: row.version as string,
      product: row.product as string,
      id: row.id as string,
    })
  }

  const years = Object.entries(yearMap)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, data]) => ({
      year: Number(year),
      count: data.count,
      months: Object.entries(data.months)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([month, mData]) => ({
          month: Number(month),
          count: mData.count,
          versions: mData.versions,
        })),
    }))

  return c.json({
    years,
    total: countResult?.total ?? 0,
    tags: tagAgg.results,
    sections: sectionAgg.results,
  })
})

// ---------------------------------------------------------------------------
// GET /changelogs/resolve - find an entry + compute its page (deep links).
// ---------------------------------------------------------------------------

app.get('/resolve', async (c) => {
  const url = new URL(c.req.url)
  const product = url.searchParams.get('product')
  const version = url.searchParams.get('version')
  if (!product || !version) {
    return c.json({ error: 'Both product and version are required' }, 400)
  }

  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get('pageSize') ?? '25', 10)),
  )
  const channel = url.searchParams.get('channel') ?? 'release'

  const entry = await c.env.DB.prepare(
    `SELECT id, product, version, released_at, changelog, download_url
     FROM changelogs WHERE product = ? AND version = ?`,
  )
    .bind(product, version)
    .first()

  if (!entry) return c.json({ error: 'Entry not found' }, 404)

  const chan = channelWhere(channel)
  const channelCondition = chan ? `AND ${chan}` : ''

  const posResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as position FROM changelogs
     WHERE product = ?
     AND (released_at > ? OR (released_at = ? AND created_at > (SELECT created_at FROM changelogs WHERE product = ? AND version = ?)))
     ${channelCondition}`,
  )
    .bind(product, entry.released_at, entry.released_at, product, version)
    .first<{ position: number }>()

  const position = posResult?.position ?? 0
  const page = Math.floor(position / pageSize) + 1

  const items = await fetchItemsForReleases(c, [entry.id as string])

  return c.json({
    entry: {
      ...entry,
      changelog: cleanChangelog(entry.changelog as string),
      items: items.get(entry.id as string) ?? [],
    },
    page,
  })
})

// ---------------------------------------------------------------------------
// DELETE /changelogs/:id - remove a release + its children (API key auth).
// Children deleted explicitly (D1 does not cascade across a batch).
// ---------------------------------------------------------------------------

app.delete('/:id', async (c) => {
  if (!hasApiKey(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')

  await c.env.DB.batch([
    c.env.DB.prepare(
      `DELETE FROM item_tags WHERE item_id IN
         (SELECT id FROM changelog_items WHERE changelog_id = ?)`,
    ).bind(id),
    c.env.DB.prepare(`DELETE FROM changelog_items WHERE changelog_id = ?`).bind(id),
    c.env.DB.prepare(`DELETE FROM changelogs WHERE id = ?`).bind(id),
  ])

  return c.json({ ok: true })
})

export default app
