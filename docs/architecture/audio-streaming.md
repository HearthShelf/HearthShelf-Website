# Audio Streaming

HearthShelf uses the browser's native `<audio>` element. AudiobookShelf handles all transcoding and format negotiation server-side.

## Architecture

A single, persistent `<audio>` element lives in `AudioEngine` (`src/components/player/AudioEngine.tsx`). It is mounted once by `AppShell` outside the routed `Outlet`, so it never unmounts on navigation.

The engine is a **two-way bridge** between the player store and the DOM:

- **Store → element:** source URL, play/pause, playback rate, seek requests
- **Element → store:** `currentTime`, `duration`, `ended`

The `PlayerBar` and Play buttons only mutate the store. The engine reacts. This architecture is what makes playback continuous across route changes — navigating from Library to Book Detail never interrupts audio.

## Playback Flow

```
1. User clicks Play on a book
2. usePlayer.playItem(itemId):
     POST /abs-api/api/items/:id/play
     → { id, displayTitle, displayAuthor, duration, currentTime,
         chapters, audioTracks[] }
3. playerStore.openSession(session) — sets tracks + seek to resume position
4. AudioEngine sets <audio>.src and calls .play()
     streamUrl = /abs-api + contentUrl + ?token=...
5. useProgress: every 30s while playing → POST /abs-api/api/session/:id/sync
6. On pause → one final sync + invalidate progress queries
7. On tab unload → navigator.sendBeacon to /abs-api/api/session/:id/close?token=
```

## Progress Sync

| Trigger | Action |
|---|---|
| Every 30s while playing | `POST /api/session/:id/sync` with `{currentTime, timeListened, duration}` |
| On pause | One sync, then invalidate `meKeys.me` and `meKeys.itemsInProgress` |
| Tab close / navigate away | `navigator.sendBeacon` to close endpoint (token in query string since Beacon can't set headers) |

## Player Store

```typescript
interface PlayerState {
  sessionId: string | null
  libraryItemId: string | null
  title: string | null
  author: string | null
  duration: number
  currentTime: number
  isPlaying: boolean
  chapters: ABSChapter[]
  tracks: ABSAudioTrack[]
  playbackSpeed: number
  seekTarget: number
  seekNonce: number     // bumped on each seek so repeated seeks to the same time still fire
}
```

The player store is **not persisted**. Session state is rebuilt on play from the ABS response. The seek nonce pattern ensures repeated seeks to the same timestamp always fire — the engine watches for nonce changes, not just `seekTarget` changes.

## Streaming Notes

Stream URLs route **through** `/abs-api` proxy, not direct to ABS. One origin handles both API and media — no CORS, no second host to configure.

Only the first audio track is currently wired. Most library books are single-file. Multi-file track stitching is planned for a future phase.
