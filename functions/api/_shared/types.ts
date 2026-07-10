export type Bindings = {
  DB: D1Database
  // Shared bearer token for CI uploads and admin deletes.
  CHANGELOG_API_KEY: string
}

export type AppEnv = { Bindings: Bindings }

// ---------------------------------------------------------------------------
// Changelog response shapes
// ---------------------------------------------------------------------------

export interface ChangelogItemOut {
  id: string
  section: string
  text: string
  sort_order: number
  tags: string[]
  /** true when this item matched an active ?tag / ?section filter */
  matched?: boolean
}

export interface ChangelogEntryOut {
  id: string
  product: string
  version: string
  released_at: string
  changelog: string // server-rendered blob (legacy render + search fallback)
  download_url: string | null
  items: ChangelogItemOut[]
  /** present only when a tag/section filter is active */
  filtered?: boolean
}

/** One row of the flat cross-release item view (GET /changelogs/items). */
export interface FlatItemOut {
  id: string
  section: string
  text: string
  tags: string[]
  product: string
  version: string
  released_at: string
  changelog_id: string
}
