export type Bindings = {
  DB: D1Database
  // Shared bearer token for CI uploads and admin deletes.
  CHANGELOG_API_KEY: string
}

export type AppEnv = { Bindings: Bindings }
