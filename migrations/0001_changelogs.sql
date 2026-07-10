-- HearthShelf changelog store.
--
-- One RELEASE header per (product, version); many structured ITEMS per release;
-- many TAGS per item. Releases are uploaded by each product's CI on a tag push.
-- `product` distinguishes HearthShelf, HearthShelf WebApp, and HearthShelf
-- Mobile releases so they share this one site.
--
-- The `changelog` column on the header is a server-rendered markdown cache
-- assembled from the items at upload time (never client-authored). It keeps the
-- existing list/search/resolve UI working while structured section + tag
-- filtering is built on top of the item + tag tables. Items are authoritative.
--
-- Pre-release: the remote D1 is empty, so we drop the old single-blob table and
-- rebuild in place rather than shipping a throwaway additive migration.
DROP TABLE IF EXISTS item_tags;
DROP TABLE IF EXISTS changelog_items;
DROP TABLE IF EXISTS changelogs;

-- ---------------------------------------------------------------------------
-- Release header: one row per (product, version). Carries everything the
-- channel filter, date-tree, and /resolve page math need at release grain.
-- ---------------------------------------------------------------------------
CREATE TABLE changelogs (
  id           TEXT PRIMARY KEY,               -- nanoid()
  product      TEXT NOT NULL,                  -- stable slug, e.g. 'HearthShelf-Mobile'
  version      TEXT NOT NULL,                  -- '0.1.0', '0.2.0-Beta1' (channel via LIKE)
  released_at  TEXT NOT NULL,                  -- ISO8601; drives the date tree + ordering
  changelog    TEXT NOT NULL DEFAULT '',       -- server-rendered markdown cache of the items
  download_url TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(product, version)
);

-- Ordering + date-tree scans (matches ORDER BY released_at DESC, created_at DESC).
CREATE INDEX idx_changelogs_released_at
  ON changelogs(released_at DESC, created_at DESC);
-- Product-scoped queries (list filter, /resolve position count).
CREATE INDEX idx_changelogs_product
  ON changelogs(product, released_at DESC);

-- ---------------------------------------------------------------------------
-- Structured line items: one row per changelog bullet. `section` is the
-- generator's canonical category (authoritative, no longer re-parsed at render):
--   feature | fix | change | docs | breaking | other
-- ---------------------------------------------------------------------------
CREATE TABLE changelog_items (
  id           TEXT PRIMARY KEY,               -- nanoid()
  changelog_id TEXT NOT NULL
               REFERENCES changelogs(id) ON DELETE CASCADE,
  section      TEXT NOT NULL,
  text         TEXT NOT NULL,                  -- bullet body, verb prefix already stripped
  sort_order   INTEGER NOT NULL DEFAULT 0,     -- preserves generator emission order
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Fetch + order all items for a release (card render).
CREATE INDEX idx_items_changelog
  ON changelog_items(changelog_id, sort_order);
-- Filter/sort by section across releases (the flat /items view).
CREATE INDEX idx_items_section
  ON changelog_items(section, changelog_id);

-- ---------------------------------------------------------------------------
-- Item tags: exact, indexed, multi-valued. One row per (item, tag). Tags are
-- lowercase kebab slugs from the server-side rules engine unioned with any
-- explicit tags the author wrote. The composite PK makes explicit+auto overlap
-- an INSERT OR IGNORE no-op.
-- ---------------------------------------------------------------------------
CREATE TABLE item_tags (
  item_id TEXT NOT NULL
          REFERENCES changelog_items(id) ON DELETE CASCADE,
  tag     TEXT NOT NULL,                       -- 'android-auto', 'ios', 'player', ...
  PRIMARY KEY (item_id, tag)
);

-- "show all items tagged android-auto" + distinct-tag list for the filter UI.
-- Covering (tag, item_id) so the tag facet + item filter never touch the row.
CREATE INDEX idx_item_tags_tag
  ON item_tags(tag, item_id);
