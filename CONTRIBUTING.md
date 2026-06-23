# Contributing to the HearthShelf Website &amp; Docs

Thanks for helping improve the HearthShelf docs. This repo is the public website and
documentation for the HearthShelf ecosystem. Most welcome contributions are small and
practical: fixing typos, repairing broken links, clarifying a confusing step, or
correcting something that is out of date.

## Before you start: read the guardrails

The site is public-facing, and **how HearthShelf is described matters legally**.
[AGENTS.md](AGENTS.md) is the source of truth for positioning. Please read it before
editing any page copy. The short version:

- Never describe HearthShelf as a way to *obtain* content. No "free books," "free
  audiobooks," "download," "torrent," or anything implying paid content can be had at
  no cost. "Free" is fine only when it clearly means the **software** is free/open
  source.
- Describe acquisition/request features as neutral plumbing - "request," "connect your
  own backend," "source-agnostic." Never "get books" or "acquisition."
- Keep the legal disclaimer visible: HearthShelf is a UI, and users are responsible for
  the legality of the content they add and the backends they connect.
- No links to infringing sources.
- Stay accurate - don't claim "no backend / stores nothing"; HearthShelf has the
  QuestGiver backend and an embedded SQLite store.
- Don't document the hosted web app's proprietary internals. It can be mentioned as a
  service only.

If a piece of copy could be read as "use HearthShelf to get books for free," rewrite it
or flag it to the maintainer before publishing.

## How to contribute

1. **Fork** this repo and create a branch off `main`.
2. **Make your change.** Docs live in `docs/` as Markdown. The "Edit this page on
   GitHub" link at the bottom of every docs page takes you straight to the right file.
3. **Run it locally** to check it renders:
   ```bash
   npm install
   npm run dev
   ```
   For anything beyond a typo, also run `npm run build` to confirm the site still
   builds (broken links and bad config fail the build).
4. **Open a pull request** against `main` with a short description of what changed and
   why.

## What we're looking for

**Great contributions:**

- Typo, grammar, and formatting fixes
- Broken or outdated links
- Clearer wording for an existing explanation
- Corrections where the docs no longer match how the software works
- Accessibility and rendering fixes in the theme

**Please open an issue to discuss first:**

- New pages or large restructures of the docs
- Changes to positioning, the compare table, or feature framing (these touch the legal
  guardrails above)
- Theme/design changes that alter the site's look and feel

## Style notes

- **Plain language.** Write for someone setting up self-hosted software for the first
  time. Short sentences, concrete steps.
- **Use standard hyphens, not em dashes.**
- **License footer says "AGPL v3," not "GPL v3."**
- Match the tone and structure of the surrounding pages.

## Scope: this repo is docs only

This repo is the website and documentation - not the HearthShelf application code. Bugs
in the app, the QuestGiver backend, or the hosted web app belong in their own repos, not
here. If you're unsure where something goes, open an issue and we'll point you in the
right direction.

## License

By contributing, you agree that your contributions are licensed under the
[AGPL v3](LICENSE), the same license as this repo.
