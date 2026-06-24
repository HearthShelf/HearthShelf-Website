# HearthShelf Website

The marketing landing page for [HearthShelf](https://hearthshelf.com) - a
self-hostable reading and listening UI for the library you run.

Built with **Vite + React + TypeScript + Tailwind + ShadCN**, hosted on Cloudflare
Pages at **hearthshelf.com**.

The documentation lives in a separate repo:
[HearthShelf-Docs](https://github.com/HearthShelf/HearthShelf-Docs) (docs.hearthshelf.com).

## What HearthShelf is

HearthShelf is a UI over a server you run, in the same category as Plex or Jellyfin.
You connect your own backend and you are responsible for the legality of the content
you add and the backends you connect.

This site links to several projects:

- **HearthShelf** - the self-hostable, AGPLv3 app and its QuestGiver backend.
- **Hosted Web App** (`app.hearthshelf.com`) - a closed-source hosted service the
  nav links to for Log in / Sign up.

## Local development

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check and build the static site to dist/
npm run preview  # preview the production build locally
```

## Project layout

```
index.html                  # entry HTML (fonts, meta)
src/
  main.tsx                  # React entry
  App.tsx                   # renders <Home />
  index.css                 # Tailwind layers + brand/ShadCN tokens
  lib/utils.ts              # cn() + canonical external URLs
  components/
    ui/button.tsx           # ShadCN-style button primitive
    landing/
      Home.tsx              # the full landing page
      home.css              # landing page styles
      AppFrame.tsx          # the in-browser app mockup (library/player/reader/stats)
      AppFrame.css          # mockup styles
public/                     # static assets (logo, favicon, _redirects)
```

### A note on auth

The "Log in / Sign up" controls in the nav are plain links to the hosted web app's
own Clerk-hosted pages at `app.hearthshelf.com/sign-in` and `/sign-up`. There is no
authentication logic, no secrets, and no proprietary code in this repo.

## Deployment

The site deploys to Cloudflare Pages. The build command is `npm run build` and the
output directory is `dist` (see [wrangler.toml](wrangler.toml)). The `public/_redirects`
file routes all paths to `index.html` for the single-page app.

## License

[AGPL v3](LICENSE), matching the self-hostable HearthShelf project.
