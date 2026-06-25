import type { Context } from 'hono'
import type { AppEnv } from './types'

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
  if (params.channel === 'release') {
    conditions.push(
      "version NOT LIKE '%-Beta%' AND version NOT LIKE '%-Alpha%' AND version NOT LIKE '%-RC%'",
    )
  } else if (params.channel === 'beta') {
    conditions.push(
      "(version LIKE '%-Beta%' OR version LIKE '%-Alpha%' OR version LIKE '%-RC%')",
    )
  }

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
  return (
    !!authHeader?.startsWith('Bearer ') &&
    authHeader.slice(7) === c.env.CHANGELOG_API_KEY
  )
}
