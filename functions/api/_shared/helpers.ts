import type { Context } from 'hono'
import type { AppEnv } from './types'
import { TAG_RULES, TAG_ALIASES } from './tagRules'

// ---------------------------------------------------------------------------
// Section normalization
//
// The canonical stored section vocabulary is exactly these six. The product
// generators categorize commits into them; the frontend maps them to badge
// colors. There is no `added`/`removed` - a "Remove X" commit is a `change`.
// ---------------------------------------------------------------------------

export type Section = 'feature' | 'fix' | 'change' | 'docs' | 'breaking' | 'other'

/** Display order used everywhere (blob assembler and card render). */
export const SECTION_ORDER: Section[] = ['breaking', 'feature', 'fix', 'change', 'docs', 'other']

const SECTION_ALIASES: Record<string, Section> = {
  feature: 'feature',
  features: 'feature',
  feat: 'feature',
  new: 'feature',
  added: 'feature',
  add: 'feature',
  fix: 'fix',
  fixes: 'fix',
  fixed: 'fix',
  bug: 'fix',
  bugfix: 'fix',
  change: 'change',
  changed: 'change',
  changes: 'change',
  improved: 'change',
  improvement: 'change',
  refactor: 'change',
  perf: 'change',
  chore: 'change',
  removed: 'change',
  remove: 'change',
  docs: 'docs',
  documentation: 'docs',
  breaking: 'breaking',
}

/** Fold whatever the uploader sent into one of the six canonical sections. */
export function normalizeSection(raw: string | undefined | null): Section {
  if (!raw) return 'other'
  return SECTION_ALIASES[raw.trim().toLowerCase()] ?? 'other'
}

// ---------------------------------------------------------------------------
// Tag computation (server-side, single source of truth)
// ---------------------------------------------------------------------------

function canonicalTag(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
  return TAG_ALIASES[s] ?? s
}

/**
 * Full tag set for one item: the author's explicit tags (canonicalized through
 * the alias table) unioned with every auto-rule that fires on the text. Returns
 * a sorted, de-duped slug list. Explicit tags never suppress auto tags.
 */
export function computeTags(text: string, explicit?: string[]): string[] {
  const set = new Set<string>()
  for (const t of explicit ?? []) {
    const slug = canonicalTag(t)
    if (slug) set.add(slug)
  }
  for (const rule of TAG_RULES) {
    if (rule.patterns.some((re) => re.test(text))) set.add(rule.tag)
  }
  return Array.from(set).sort()
}

// ---------------------------------------------------------------------------
// Blob rebuild (keeps the legacy list render + client-side search working)
// ---------------------------------------------------------------------------

const SECTION_HEADINGS: Record<Section, string> = {
  breaking: '### Breaking Changes',
  feature: '### Features',
  fix: '### Fixes',
  change: '### Changes',
  docs: '### Documentation',
  other: '### Other',
}

/** Rebuild a section-grouped markdown blob from structured items. */
export function rebuildChangelogBlob(items: Array<{ section: Section; text: string }>): string {
  const bySection = new Map<Section, string[]>()
  for (const it of items) {
    const arr = bySection.get(it.section) ?? []
    arr.push(`- ${it.text}`)
    bySection.set(it.section, arr)
  }
  const parts: string[] = []
  for (const section of SECTION_ORDER) {
    const lines = bySection.get(section)
    if (lines && lines.length > 0) {
      parts.push(SECTION_HEADINGS[section], ...lines, '')
    }
  }
  return parts.join('\n').trim()
}

/** Channel WHERE fragment for a given column alias (e.g. 'cl.version'). */
export function channelWhere(channel: string | null | undefined, column = 'version'): string {
  if (channel === 'release') {
    return `${column} NOT LIKE '%-Beta%' AND ${column} NOT LIKE '%-Alpha%' AND ${column} NOT LIKE '%-RC%'`
  }
  if (channel === 'beta') {
    return `(${column} LIKE '%-Beta%' OR ${column} LIKE '%-Alpha%' OR ${column} LIKE '%-RC%')`
  }
  return ''
}

/**
 * Strip the generator's redundant scaffolding from an uploaded changelog blob:
 * the AI "This Release" summary section and the per-version "## Version X.Y.Z"
 * headings (the website renders version + date from columns, not the markdown).
 */
export function cleanChangelog(text: string): string {
  return text
    .replace(/^##\s+[^\n]*This Release[^\n]*\n[\s\S]*?(?=\n##\s)/m, '')
    .replace(/^##\s+[^\n]*This Release[^\n]*\n[\s\S]*$/m, '')
    .replace(/^## Version [^\n]*\n/gm, '')
    .trim()
}

/** Build the WHERE clause + bind values for the changelog list query. */
export function buildChangelogWhere(params: {
  product?: string | null
  year?: string | null
  month?: string | null
  channel?: string | null
}) {
  const conditions: string[] = []
  const binds: (string | number)[] = []

  if (params.product) {
    const products = params.product.split(',').map((p) => p.trim())
    conditions.push(`product IN (${products.map(() => '?').join(',')})`)
    binds.push(...products)
  }
  if (params.year) {
    conditions.push("CAST(strftime('%Y', released_at) AS INTEGER) = ?")
    binds.push(parseInt(params.year, 10))
  }
  if (params.month && params.year) {
    conditions.push("CAST(strftime('%m', released_at) AS INTEGER) = ?")
    binds.push(parseInt(params.month, 10))
  }
  const channel = channelWhere(params.channel)
  if (channel) conditions.push(channel)

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    binds,
  }
}

/**
 * Verify the request carries the shared bearer token. Returns true when the
 * Authorization header matches CHANGELOG_API_KEY. Used for both CI uploads and
 * admin deletes - the website itself never needs to call those endpoints.
 */
export function hasApiKey(c: Context<AppEnv>): boolean {
  const authHeader = c.req.header('Authorization')
  return !!authHeader?.startsWith('Bearer ') && authHeader.slice(7) === c.env.CHANGELOG_API_KEY
}
