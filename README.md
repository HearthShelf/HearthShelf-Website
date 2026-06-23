# HearthShelf Website &amp; Docs

The public website and documentation for [HearthShelf](https://hearthshelf.com) - a
self-hostable reading and listening UI for the library you run. This repo holds the
marketing pages and the docs for the whole HearthShelf ecosystem.

Built with [VitePress](https://vitepress.dev).

## What HearthShelf is

HearthShelf is a UI over a server you run, in the same category as Plex or Jellyfin.
You connect your own backend and you are responsible for the legality of the content
you add and the backends you connect. See the [guide](docs/guide/what-is-hearthshelf.md)
for the full picture.

This repo documents several projects:

- **HearthShelf** - the self-hostable, AGPLv3 app and its QuestGiver backend.
- **Hosted Web App** (`app.hearthshelf.com`) - a closed-source hosted service. The
  site links to it and documents it at the service level only; its internals are not
  in this repo.

## Local development

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # build the static site to docs/.vitepress/dist
npm run preview  # preview the production build locally
```

## Project layout

```
docs/
  index.md                  # home page
  guide/                    # what HearthShelf is, getting started, FAQ
  setup/                    # docker, configuration, auth, reverse proxy
  webapp/                   # hosted web app docs (overview, pairing, architecture)
  public/                   # static assets (logo, favicon, images)
  .vitepress/
    config.mts              # site config, nav, sidebar
    theme/                  # custom VitePress theme (Vue components, CSS)
```

### A note on auth

The "Log in / Sign up" controls in the nav are a thin stub
([NavAuth.vue](docs/.vitepress/theme/NavAuth.vue)) that redirects to the hosted web
app's own Clerk-hosted pages at `app.hearthshelf.com`. There is no authentication
logic, no secrets, and no proprietary code in this repo - it is just links. The
Clerk **publishable** key used by the stub is public by design (it ships in browser
bundles) and lives in a gitignored `.env.local`; it is not a secret.

## Deployment

The site deploys to Cloudflare Pages. The build output directory is
`docs/.vitepress/dist` (see [wrangler.toml](wrangler.toml)). Pushing to `main`
triggers a deploy.

## Contributing

Documentation fixes and improvements are welcome - typos, broken links, clearer
explanations. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and note the
positioning guardrails in [AGENTS.md](AGENTS.md): how HearthShelf is described
matters legally, so site copy follows specific rules.

## License

[AGPL v3](LICENSE), matching the self-hostable HearthShelf project.
