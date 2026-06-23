# Architecture Overview

HearthShelf is a **Single Page Application** served by nginx, paired with one small backend of its own called **QuestGiver**. Every piece of *library* data — books, progress, playback sessions — comes from your AudiobookShelf server via its REST API. QuestGiver only holds HearthShelf-specific state that ABS has no concept of (app settings, AI recommendation config and history, request/feedback data). It never duplicates ABS data.

## System Diagram

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│                                               │
│   HearthShelf SPA (React + Vite)              │
│   - UI / UX layer                             │
│   - Auth token in memory + localStorage       │
└──────────────┬────────────────────────────────┘
               │ /abs-api/*  /abs-socket/*  (library data → ABS)
               │ /api/qg/*                   (app state → QuestGiver)
               ▼
┌──────────────────────────────────────────────┐
│        HearthShelf nginx Container            │
│                                               │
│   - Serves /dist (static SPA)                 │
│   - Proxy: /abs-api/*    → ABS_SERVER_URL     │
│   - Proxy: /abs-socket/* → ABS_SERVER_URL     │
│   - Proxy: native ABS paths (ABSORB support)  │
│   - Proxy: /api/qg/*     → QuestGiver         │
│                                               │
│   ┌────────────────────────────────────────┐ │
│   │ QuestGiver (Node backend)              │ │
│   │  - app settings, AI config / history   │ │
│   │  - embedded SQLite (libSQL)            │ │
│   └────────────────────────────────────────┘ │
└──────────────┬────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│       AudiobookShelf Server (user-run)        │
│                                               │
│   - REST API (/api/*)                         │
│   - Socket.io                                 │
│   - Audio file streaming                      │
└──────────────────────────────────────────────┘
```

QuestGiver is the only stateful piece HearthShelf owns, and the state it keeps is deliberately small. See [QuestGiver & Database](/architecture/questgiver) for what it stores and why.

## CORS Strategy

All ABS API calls are routed through `/abs-api/*` on the HearthShelf nginx container, which proxies to `ABS_SERVER_URL`. This eliminates all CORS issues without any ABS configuration changes.

Audio stream URLs go through the same proxy (also `/abs-api`) so there is no second origin to deal with.

Cover images and streams use a `?token=` query parameter because `<img>` and `<audio>` elements can't attach an `Authorization` header.

## Request Flow

| Path | Destination | Notes |
|---|---|---|
| `/` and SPA routes | nginx static `/dist` | SPA fallback to `index.html` |
| `/abs-api/*` | ABS (prefix stripped) | Client sends full ABS path: `/api/...` for REST, `/login` for auth |
| `/abs-socket/*` | ABS Socket.io | Websocket upgrade headers |
| `/api/qg/*` | QuestGiver backend | HearthShelf app state (settings, AI config/history, feedback) |
| `/api/*`, `/socket.io/*` etc. | ABS transparent | For ABSORB and native ABS clients |
| Audio stream URLs | ABS via `/abs-api` proxy | Native `<audio>`, token in query string |

## Key Design Decisions

### Runtime config over build-time
The ABS server URL is injected at container start via `envsubst`, not baked into the JavaScript bundle. One Docker image works for any ABS setup.

### No body rewriting
CORS and redirect rewriting is handled at the nginx proxy level. The JavaScript app never sees raw ABS responses — it only sees same-origin paths. This keeps the app code simple and avoids brittle response body manipulation.

### Single persistent audio element
The `<audio>` element mounts once in `AppShell` and never unmounts across route changes. This is what makes playback continuous when you navigate between pages. The player store and audio engine are decoupled: controls mutate the store, the engine reacts.

### Library data lives in ABS, app state in QuestGiver
The browser persists nothing but your ABS auth token in `localStorage`. All library data, progress, and sessions live in ABS and are re-fetched on every page load after the token is validated. HearthShelf-specific state that ABS has no concept of (your app settings, AI config and history, feedback) lives in QuestGiver's embedded SQLite database, keyed by your ABS user id so it syncs across devices. See [QuestGiver & Database](/architecture/questgiver).
