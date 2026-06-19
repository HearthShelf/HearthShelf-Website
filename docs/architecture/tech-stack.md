# Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript | Ecosystem fit, shadcn/ui compatibility |
| Build Tool | Vite | Fastest SPA build, clean Docker output |
| Styling | Tailwind v4 | Utility-first, pairs with shadcn without friction |
| Component Base | shadcn/ui | Unstyled-first, fully owned components |
| Server State | TanStack Query v5 | ABS API calls, caching, background refetch |
| Client State | Zustand | Player state, auth state, UI state |
| Routing | React Router v7 | Standard, no SSR needed |
| Real-time | socket.io-client | ABS Socket.io events (partially wired) |
| HTTP | Native `fetch` | No Axios dependency needed |
| Container | nginx + Docker | Serves `/dist`, proxies ABS API |
| Icons | Material Symbols Rounded + Lucide React | Material Symbols for UI; Lucide ships with shadcn |
| Fonts | Inter, Libre Baskerville, Material Symbols | All self-hosted in `src/assets/fonts` |

## Division of Responsibility

**TanStack Query** owns all server state — ABS API reads, caching, background refetch, loading/error states.

**Zustand** owns client state — player playback state, auth token and user, transient UI state. The player store is transient (not persisted). The auth store persists only the token.

**Native `fetch`** is wrapped in a typed ABS client (`src/api/client.ts`). Every request is injected with the Bearer token and routed through `/abs-api`.

**socket.io-client** is a dependency for planned real-time events. The proxy and a `lib/socket.ts` stub exist, but subscriptions are not yet wired.

## TypeScript

- Strict mode, no `any`
- All ABS response shapes defined in `src/api/types.ts` — one source of truth
- No implicit `any` from fetch — all responses are typed

## Tailwind v4 Notes

Tailwind v4 is configured via CSS (`@theme` in `index.css`), not `tailwind.config.ts`. The `@tailwindcss/vite` plugin handles the rest. Design tokens are CSS variables mapped into Tailwind via `@theme`.

shadcn uses the unified `radix-ui` package (the nova preset), not individual `@radix-ui/react-*` packages.

## shadcn/ui

shadcn components are generated into `src/components/ui/` and treated as owned source code — not a `node_modules` dependency. They share the design system's token layer: the CSS variables are shadcn role variables (`--background`, `--primary`, ...), so shadcn primitives and HearthShelf classes resolve from one source of truth.

## Design System

The HearthShelf design system lives in two files:

- `src/index.css` — Tailwind v4 entry, CSS variable tokens, font loading, `@theme`
- `src/design.css` — HearthShelf design-system classes (cover-glow bloom, duotone cover washes, hover-lift transforms, glassy player bar, series cover clusters)

These classes rely on pseudo-elements, `color-mix`, and coordinated transitions that don't translate cleanly to inline utilities. New design-system classes go in `design.css`; ad-hoc styling stays in Tailwind utilities.
