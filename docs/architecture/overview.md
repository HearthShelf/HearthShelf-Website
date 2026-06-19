# Architecture Overview

HearthShelf is a **static Single Page Application** served by nginx. It has no backend logic of its own — every piece of data comes from your AudiobookShelf server via its REST API.

## System Diagram

```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│                                               │
│   HearthShelf SPA (React + Vite)              │
│   - UI / UX layer only                        │
│   - No local data storage                     │
│   - Token stored in memory + localStorage     │
└──────────────┬────────────────────────────────┘
               │ /abs-api/* (proxied)
               │ /abs-socket/* (proxied)
               ▼
┌──────────────────────────────────────────────┐
│        HearthShelf nginx Container            │
│                                               │
│   - Serves /dist (static SPA)                 │
│   - Proxy: /abs-api/*    → ABS_SERVER_URL     │
│   - Proxy: /abs-socket/* → ABS_SERVER_URL     │
│   - Proxy: native ABS paths (ABSORB support)  │
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
| `/api/*`, `/socket.io/*` etc. | ABS transparent | For ABSORB and native ABS clients |
| Audio stream URLs | ABS via `/abs-api` proxy | Native `<audio>`, token in query string |

## Key Design Decisions

### Runtime config over build-time
The ABS server URL is injected at container start via `envsubst`, not baked into the JavaScript bundle. One Docker image works for any ABS setup.

### No body rewriting
CORS and redirect rewriting is handled at the nginx proxy level. The JavaScript app never sees raw ABS responses — it only sees same-origin paths. This keeps the app code simple and avoids brittle response body manipulation.

### Single persistent audio element
The `<audio>` element mounts once in `AppShell` and never unmounts across route changes. This is what makes playback continuous when you navigate between pages. The player store and audio engine are decoupled: controls mutate the store, the engine reacts.

### Sparse state storage
HearthShelf stores nothing except your auth token in `localStorage`. All library data, progress, and settings live in ABS. On every page load, the token is validated and user state is re-fetched from ABS.
