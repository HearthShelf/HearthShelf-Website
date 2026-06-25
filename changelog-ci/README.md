# Changelog CI scripts

These scripts live **in this website repo for reference**, but at runtime they
belong in each **product repo** (HearthShelf, HearthShelf-WebApp). They generate
a categorized `CHANGELOG.md` from git history and upload the current release to
the website's changelog API for display at `/changelog`.

## How it works

```
product repo commits  ->  generate-changelog.sh  ->  CHANGELOG.md
                                                          |
                          (on tag push) upload-changelog.sh
                                                          |
                                            POST /api/v1/changelogs
                                                          |
                                       website D1 table `changelogs`
                                                          |
                                          /changelog page renders cards
```

Commits are categorized by their message prefix (matching the commit convention):

- `new:` / `feat:` / "Add..." -> **Features**
- `fixes:` / `fix:` / "Fix..." -> **Fixes**
- `improved:` / `chore:` / "Update..." / "Refactor..." -> **Changes**

## Setup per product repo

1. Copy `generate-changelog.sh` and `upload-changelog.sh` into `.github/scripts/`.
2. Copy `.changelog.yml.example` to the repo root as `.changelog.yml` and edit it
   (set a stable `product-name` - it is the unique key per release on the site).
3. Add the steps from `changelog.yml.workflow-example` to the repo's workflow.
4. Add repo secrets:
   - `CHANGELOG_API_KEY` - must equal the website's `CHANGELOG_API_KEY` binding.
   - `GEMINI_API_KEY` - optional, enables the AI monthly/release summaries.

## Website setup (this repo)

The backend lives in `functions/api/` (Cloudflare Pages Functions + Hono) and is
backed by a D1 database. One-time setup:

```sh
# Create the D1 database, then paste its id into wrangler.toml -> database_id
wrangler d1 create hearthshelf-changelog

# Apply the schema
wrangler d1 migrations apply hearthshelf-changelog --remote

# Set the shared upload/delete token (must match the product repos' secret)
wrangler pages secret put CHANGELOG_API_KEY
```

Local dev with the API + D1:

```sh
npm run build
wrangler d1 migrations apply hearthshelf-changelog --local
wrangler pages dev dist           # serves the site + /api together on :8788
```

## API surface

- `POST   /api/v1/changelogs`         - upload (Bearer `CHANGELOG_API_KEY`)
- `GET    /api/v1/changelogs`         - paginated entries (channel defaults to `release`)
- `GET    /api/v1/changelogs/filters` - date-tree + counts for the sidebar
- `GET    /api/v1/changelogs/resolve` - find an entry's page (for deep links)
- `DELETE /api/v1/changelogs/:id`     - delete (Bearer `CHANGELOG_API_KEY`)
