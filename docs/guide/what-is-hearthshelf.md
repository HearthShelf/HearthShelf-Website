# What is HearthShelf?

HearthShelf is a **replacement UI for [AudiobookShelf](https://www.audiobookshelf.org/)** (ABS) — a self-hosted audiobook server you already run on your network.

| Field | Value |
|---|---|
| Domain | hearthshelf.com |
| Type | Static SPA served via nginx in a Docker container |
| Backend | Your AudiobookShelf server |
| Target | Browser (desktop-first, responsive) |
| Language | TypeScript |

## What it is

HearthShelf is **only the face**. Your ABS server stays exactly where it is and keeps doing everything it already does — managing your files, transcoding audio, tracking progress. HearthShelf replaces the web UI that ABS ships with a redesigned, browser-first experience.

All data comes from ABS via its REST API. HearthShelf has:

- No database
- No file management
- No transcoding
- No server-side logic beyond the nginx proxy that eliminates CORS

## What it is not

HearthShelf does **not** replace AudiobookShelf itself. You need a running ABS instance to use HearthShelf. Think of it as a theme — but one that runs as its own container.

## The relationship

```
┌──────────────────────────────────────┐
│           Your Browser               │
│                                      │
│   HearthShelf SPA  ←  UI only        │
└──────────────┬───────────────────────┘
               │ /abs-api/* (proxied)
               ▼
┌──────────────────────────────────────┐
│      HearthShelf nginx Container     │
│  Serves the SPA + proxies ABS API    │
└──────────────┬───────────────────────┘
               │ internal network
               ▼
┌──────────────────────────────────────┐
│      Your AudiobookShelf Server      │
│  REST API · Socket.io · Audio files  │
└──────────────────────────────────────┘
```

## Design direction

- **Dark by default** — warm near-neutral dark surfaces on a `#1b1a18` base
- **Ember accent** — a single warm accent color (`#e0654a`) used sparingly
- **Desktop-first** — designed for the browser, responsive enough for tablets
- **Libre Baskerville** brand wordmark — editorial serif for a warm, bookish feel

## What's already built

- Login (username/password + OAuth2/OpenID button)
- Token persistence with on-load validation and protected routes
- Persistent app shell: sidebar, cover-glow bloom, persistent player bar
- Home with personalized shelves and a "jump back in" hero
- Library browsing (responsive grid, paginated), multi-library support
- Series browsing (index + detail)
- Book detail page (cover, metadata chips, description, chapters)
- Native audio playback with transport controls, speed, and chapter navigation
- Progress sync (every 30s + on pause + `sendBeacon` on tab close)
- Cover images (real artwork + typeset fallback), full design system

## What's planned

See [Scope](/architecture/scope) for the full phased roadmap. Upcoming phases include:
authors/narrators, collections, an immersive player, podcast support, editing tools, admin panel, and optional AI recommendations.

::: tip AudiobookShelf
HearthShelf requires AudiobookShelf v2.x running on your network. [Get ABS here.](https://www.audiobookshelf.org/)
:::
