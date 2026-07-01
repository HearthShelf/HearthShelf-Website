import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import type { AppEnv } from '../_shared/types'
import { cleanChangelog, buildChangelogWhere, hasApiKey } from '../_shared/helpers'

const app = new Hono<AppEnv>()

// POST /changelogs - CI upload (API key auth)
app.post('/', async (c) => {
  if (!hasApiKey(c)) return c.json({ error: 'Unauthorized' }, 401)

  const body = await c.req.json<{
    product: string
    version: string
    released_at: string
    changelog: string
    download_url?: string
  }>()

  if (!body.product || !body.version || !body.released_at || !body.changelog) {
    return c.json(
      {
        error: 'Missing required fields: product, version, released_at, changelog',
      },
      400,
    )
  }

  const changelog = cleanChangelog(body.changelog)
  const id = nanoid()

  await c.env.DB.prepare(
    `INSERT INTO changelogs (id, product, version, released_at, changelog, download_url)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(product, version) DO UPDATE SET
       changelog = excluded.changelog,
       released_at = excluded.released_at,
       download_url = excluded.download_url`,
  )
    .bind(id, body.product, body.version, body.released_at, changelog, body.download_url || null)
    .run()

  return c.json({ id }, 201)
})

// GET /changelogs - Paginated entries
app.get('/', async (c) => {
  const url = new URL(c.req.url)
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') ?? '25', 10)))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10))

  // Absent channel defaults to "release" to match the UI's default tab, so the
  // landing view never surfaces beta/alpha builds unless explicitly requested.
  const { where, binds } = buildChangelogWhere({
    product: url.searchParams.get('product'),
    year: url.searchParams.get('year'),
    month: url.searchParams.get('month'),
    channel: url.searchParams.get('channel') ?? 'release',
  })

  const [entriesResult, countResult] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, product, version, released_at, changelog, download_url
       FROM changelogs ${where}
       ORDER BY released_at DESC, created_at DESC
       LIMIT ? OFFSET ?`,
    )
      .bind(...binds, limit, offset)
      .all(),
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM changelogs ${where}`)
      .bind(...binds)
      .first<{ total: number }>(),
  ])

  const entries = entriesResult.results.map((row) => ({
    ...row,
    changelog: cleanChangelog(row.changelog as string),
  }))

  return c.json({ entries, total: countResult?.total ?? 0 })
})

// GET /changelogs/filters - Sidebar filter data (channel + date tree)
app.get('/filters', async (c) => {
  const url = new URL(c.req.url)
  const channel = url.searchParams.get('channel') ?? 'release'

  const conditions: string[] = []
  if (channel === 'release') {
    conditions.push(
      "version NOT LIKE '%-Beta%' AND version NOT LIKE '%-Alpha%' AND version NOT LIKE '%-RC%'",
    )
  } else if (channel === 'beta') {
    conditions.push("(version LIKE '%-Beta%' OR version LIKE '%-Alpha%' OR version LIKE '%-RC%')")
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const [dateAgg, countResult] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, product, version,
          CAST(strftime('%Y', released_at) AS INTEGER) as year,
          CAST(strftime('%m', released_at) AS INTEGER) as month
       FROM changelogs ${where}
       ORDER BY released_at DESC`,
    ).all(),
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM changelogs ${where}`).first<{
      total: number
    }>(),
  ])

  const yearMap: Record<
    number,
    {
      count: number
      months: Record<
        number,
        {
          count: number
          versions: Array<{ version: string; product: string; id: string }>
        }
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

  return c.json({ years, total: countResult?.total ?? 0 })
})

// GET /changelogs/resolve - Find entry + compute its page number
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

  let channelCondition = ''
  if (channel === 'release') {
    channelCondition =
      "AND version NOT LIKE '%-Beta%' AND version NOT LIKE '%-Alpha%' AND version NOT LIKE '%-RC%'"
  } else if (channel === 'beta') {
    channelCondition =
      "AND (version LIKE '%-Beta%' OR version LIKE '%-Alpha%' OR version LIKE '%-RC%')"
  }

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

  return c.json({
    entry: { ...entry, changelog: cleanChangelog(entry.changelog as string) },
    page,
  })
})

// DELETE /changelogs/:id - API key auth
app.delete('/:id', async (c) => {
  if (!hasApiKey(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM changelogs WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default app
