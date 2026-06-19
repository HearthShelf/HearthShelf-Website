# API Integration

HearthShelf communicates with AudiobookShelf via its REST API. All requests are proxied through `/abs-api/*` — the nginx container strips the prefix and forwards to `ABS_SERVER_URL`.

::: info Verified against ABS 2.35.1
Endpoint shapes and behaviors are tested against this version. Some details may vary on older ABS releases.
:::

## Base Client

```typescript
// src/api/client.ts
const BASE = '/abs-api'

async function absRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`ABS API error: ${res.status}`)
  return res.json() as Promise<T>
}
```

Note: the client passes the **full ABS path** as `path`. The proxy strips only the `/abs-api` prefix, so `/abs-api/api/libraries` → `/api/libraries` on the ABS server.

## Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/login` | POST | Username/password auth — returns `{ user, userDefaultLibraryId, ... }` |
| `/auth/openid` | GET | OpenID flow initiation (browser redirect) |
| `/api/authorize` | POST | Validate persisted token (same envelope as `/login`) |
| `/status` | GET | Unauthenticated server info — drives OpenID button visibility |
| `/api/libraries` | GET | All libraries |
| `/api/libraries/:id/items` | GET | Library items, paginated (`?page&limit`) |
| `/api/libraries/:id/personalized` | GET | Home shelves (books, series, authors) |
| `/api/libraries/:id/series` | GET | Series list with books |
| `/api/items/:id` | GET | Single book detail (not minified) |
| `/api/items/:id/cover?token=` | GET | Cover image — token in query string |
| `/api/items/:id/play` | POST | Start/resume a playback session |
| `/api/session/:id/sync` | POST | Sync progress during playback |
| `/api/session/:id/close` | POST | Close session on stop/unload |
| `/api/me` | GET | Current user including `mediaProgress[]` |
| `/api/me/items-in-progress` | GET | In-progress books |

## Known Gotchas

**`/api/session/:id/sync` is POST, not PATCH.**

**`/api/items/:id` (detail) differs from the list shape.** Author is in `metadata.authors[]` (not the flattened `authorName`). Total duration is summed from `media.audioFiles[].duration`. Descriptions are HTML.

**Per-item progress comes from `/api/me`**, not a dedicated progress endpoint. It lives in `user.mediaProgress[]`, keyed by `libraryItemId`.

**Cover and stream URLs use `?token=`** because `<img>` and `<audio>` elements can't set an `Authorization` header.

**Stream URLs go through `/abs-api`**, not direct to ABS. `contentUrl` from a play session is a server-relative path; the stream URL is built as `/abs-api` + contentUrl + `?token=`.

## Response Types

All ABS response shapes are defined in `src/api/types.ts`. This is the single source of truth — no inline shapes anywhere in the codebase.

## Query Keys

```typescript
// libraries.ts
export const libraryKeys = {
  all: ['libraries'] as const,
  items: (id: string) => ['libraries', id, 'items'] as const,
  item: (id: string) => ['libraries', 'item', id] as const,
  personalized: (id: string) => ['libraries', id, 'personalized'] as const,
  series: (id: string) => ['libraries', id, 'series'] as const,
}

// me.ts
export const meKeys = {
  me: ['me'] as const,
  itemsInProgress: ['me', 'itemsInProgress'] as const,
}
```

Progress sync invalidates `meKeys.me` and `meKeys.itemsInProgress` so tile progress bars and the Home hero update immediately after playback.
