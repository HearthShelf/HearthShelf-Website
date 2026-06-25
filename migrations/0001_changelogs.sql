-- Changelog entries uploaded by HearthShelf release CI.
-- One row per (product, version). `product` distinguishes HearthShelf releases
-- from HearthShelf WebApp releases so both can publish to the same site.
CREATE TABLE IF NOT EXISTS changelogs (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  version TEXT NOT NULL,
  released_at TEXT NOT NULL,
  changelog TEXT NOT NULL,
  download_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(product, version)
);

CREATE INDEX IF NOT EXISTS idx_changelogs_released_at
  ON changelogs(released_at DESC, created_at DESC);
