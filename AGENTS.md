# AGENTS.md

Guardrails for AI agents and contributors working on the HearthShelf marketing
and documentation site (this VitePress repo). The site is public-facing, so its
copy is the single most important place to get the **positioning** right. Treat
these as hard rules.

## Why the website matters legally

HearthShelf is a UI over a server the user runs, in the same category as Plex or
Jellyfin. That protection (substantial non-infringing use; not inducing
infringement) depends heavily on **how the product is described**. Marketing and
docs that frame HearthShelf as a way to *get* content for free are exactly what
courts treat as inducement. The website is where that risk is highest.

## Hard rules for site copy

1. **Never describe HearthShelf as a way to obtain content.** No "free books,"
   "free audiobooks," "pirate," "torrent," "get any book," "download for free,"
   or anything implying paid content can be had at no cost. "Free" is fine only
   when it clearly means *the software is free/open source* - never when it
   could read as *the content is free*.

2. **Describe acquisition/request features as neutral plumbing.** ReadMeABook
   and similar are user-supplied, opt-in integrations. Use words like "request,"
   "connect your own backend," "source-agnostic." Do **not** call them
   "acquisition," "get books," or anything that implies HearthShelf provides a
   content source. (The compare table and feature copy must follow this.)

3. **Keep the legal disclaimer visible.** The site must carry: "HearthShelf is a
   UI. You are responsible for the legality of the content you add and the
   backends you connect." Don't remove or bury it.

4. **No links to infringing sources** anywhere on the site.

5. **Stay accurate.** Don't claim "no backend / no database / no server-side
   logic" - HearthShelf now has the QuestGiver backend and an embedded SQLite
   store. Outdated "pure static, stores nothing" copy should be corrected when
   touched.

6. **Keep the marketing site high-level.** The hosted `app.hearthshelf.com`
   product is open source (AGPLv3) like the rest of the ecosystem; the public
   site may mention it as a service but shouldn't turn into developer docs -
   those live in `HearthShelf-Docs`.

## License

The self-hostable HearthShelf project is AGPLv3. Footer and license references
on the site should say **AGPL v3**, not GPL v3.

## If in doubt

If a piece of copy could be read as "use HearthShelf to get books for free,"
rewrite it or flag it to the maintainer before publishing.

## Related repositories

HearthShelf spans several repos. The servers are AGPLv3; the mobile app and the
shared `@hearthshelf/core` library are MIT.

| Repo | What it is |
| --- | --- |
| **HearthShelf** | Self-hosted SPA + Node backend (`server/`) + Docker |
| **HearthShelf-WebApp** | Hosted front door (`app.hearthshelf.com`): SPA + control-plane Worker |
| **HearthShelf-Mobile** | Mobile app (Expo/React Native); Android Auto via a native Media3 `MediaLibraryService` |
| **HearthShelf-Core** | `@hearthshelf/core`: shared ABS types + pure logic, consumed as a git submodule |
| **HearthShelf-Website** | Marketing site (`hearthshelf.com`) |
| **HearthShelf-Docs** | Docs site (`docs.hearthshelf.com`) |
| **HearthShelf-Direct-Infra** | VPS-side infra for the connect domain (automatic HTTPS for self-hosters) |
| **HearthShelf-DesignSystem** | Logos, favicon, shared design assets |
