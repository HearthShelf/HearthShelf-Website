# QuestGiver & Database

AudiobookShelf is the source of truth for your library, progress, and playback sessions. But HearthShelf has a few things ABS has no concept of: your app preferences, AI recommendation config and history, and request/feedback data. That state lives in **QuestGiver** — a small Node backend that ships inside the HearthShelf container — backed by an **embedded SQLite database**.

QuestGiver never duplicates ABS data. It does no file management and no transcoding. It exists only to hold HearthShelf-specific state and to keep the AI provider key server-side.

## What QuestGiver does

- **Persists HearthShelf app state** keyed by your ABS user id, so settings sync across your devices.
- **Holds the AI provider key** and enforces rate limits, so the key never reaches the browser.
- **Serves the `/api/qg/*` endpoints** that the SPA calls for anything that isn't library data.

The SPA talks to QuestGiver through the nginx proxy at `/api/qg/*`, the same way it reaches ABS through `/abs-api/*`. From the browser's point of view everything is same-origin.

## Storage engine

| Aspect | Detail |
|---|---|
| Driver | `@libsql/client` (libSQL — the SQLite engine Turso runs), used **embedded against a local file** |
| File | `${QG_DATA_DIR}/hearthshelf.db` (default `/app/data/hearthshelf.db`) |
| Volume | The `hearthshelf-data` Docker volume |
| Journal mode | WAL, so readers and the single writer don't block each other |

Library data, playback progress, and sessions stay in ABS — this database is only for HearthShelf-specific state.

### Going distributed later (optional)

Because it uses libSQL, the same code can point at a remote Turso primary instead of a local file by setting `HS_DB_URL` (a `libsql://…` URL) and `HS_DB_TOKEN`. With neither set, it falls back to the embedded file. Self-hosters never need this; it exists only if HearthShelf is ever run as a central multi-instance service.

## Schema

Tables are created on boot via `CREATE TABLE IF NOT EXISTS`:

| Table | Holds |
|---|---|
| `app_settings` | Per-user app settings (theme, accent, sleep prefs…), one JSON blob per ABS user id — drives cross-device sync |
| `ai_config` | The editable QuestGiver AI config (provider, model, key, rate limit) — single row, seeded from `QG_*` env on first boot |
| `qg_feedback` | Per-user Discover votes / ratings |
| `qg_monthly` | The per-user monthly AI shelf cache |
| `qg_runs` | Per-user QuestGiver run history (last 30) |
| `popular_signals` | Daily server-wide popular-item aggregate |
| `rate_limits` | Durable per-user QuestGiver usage counts (survive restarts) |

## AI config precedence

On first boot the `ai_config` row is seeded from the `QG_PROVIDER`, `QG_MODEL`, `QG_API_KEY`, `QG_BASE_URL`, `QG_LIMIT`, and `QG_ENABLED` environment variables, so existing deployments keep working unchanged. After that, edits made on the admin **QuestGiver** page are written to the database and **the database value wins**.

The API key is held server-side and is never sent to the browser. To revert to env-managed config, clear the row — the next boot reseeds from the environment.

::: tip Migration from the old JSON file
Earlier builds stored Discover state in `discover.json`. On first boot the backend imports that file into the database (feedback, monthly shelves, popular signals) and renames it to `discover.json.migrated`, so nothing is lost.
:::

## Backups

Back up `hearthshelf.db` (and its `-wal` / `-shm` sidecars while the service is stopped) the same way you back up ABS's own `absdatabase.sqlite`. Losing it only costs HearthShelf-specific state — your library, progress, and sessions are safe in ABS.
