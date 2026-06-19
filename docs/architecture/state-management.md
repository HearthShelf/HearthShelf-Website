# State Management

HearthShelf uses two state management tools with clearly separated responsibilities.

## Zustand Stores

| Store | Holds | Persisted |
|---|---|---|
| `authStore` | user, token, isAuthenticated, defaultLibraryId, isHydrating | `localStorage` (token only) |
| `playerStore` | session id, title/author, duration/currentTime, isPlaying, chapters, tracks, playbackSpeed, seekTarget/seekNonce | No (transient) |

### authStore

`isHydrating` gates the protected layout while the on-load `authorize()` check runs — users see a loading state rather than a flash of the login page.

`defaultLibraryId` comes from the auth payload and seeds the Home and Library pages when no `:libraryId` is in the route.

Only the token is stored in `localStorage`. User state is re-fetched from ABS on every page load via `POST /api/authorize`.

### playerStore

`seekTarget` + `seekNonce`: the AudioEngine seeks whenever the nonce bumps, so repeated seeks to the same time still fire. The `<audio>` element is the source of truth for live `currentTime`; the store mirrors it.

## TanStack Query

All ABS API reads go through TanStack Query for caching, background refetch, and loading/error states.

```typescript
const { data: libraries, isLoading } = useQuery({
  queryKey: libraryKeys.all,
  queryFn: () => absRequest<ABSLibrariesResponse>('/api/libraries'),
})
```

### Cache Defaults

| Data | `staleTime` |
|---|---|
| Libraries | 5 minutes |
| Library items / personalized / series | 2 minutes |
| Book detail | 10 minutes |
| Server status | `Infinity` (doesn't change mid-session) |
| `me` / items-in-progress | 30–60s (invalidated by progress sync) |

### Conventions

- Query keys are arrays, defined as constants in the relevant API file (`libraryKeys`, `meKeys`)
- All mutations invalidate relevant query keys on success
- Error states are always handled — no silent failures
- Read transient values inside callbacks via `useStore.getState()` to avoid stale closures

## How They Work Together

TanStack Query owns **server state** — what's in your ABS library, your progress, your user profile. Zustand owns **client state** — whether you're playing, what's in the player, whether you're logged in.

The progress sync `useProgress` hook bridges them: it reads `currentTime` and `sessionId` from the player store, sends them to ABS via fetch, then invalidates the TanStack Query cache so library tiles and the Home hero reflect the new progress.
