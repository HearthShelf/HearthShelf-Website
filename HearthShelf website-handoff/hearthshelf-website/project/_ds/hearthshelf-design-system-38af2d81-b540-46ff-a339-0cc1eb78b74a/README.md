# HearthShelf Design System

A design system for **HearthShelf** — a calmer, warmer web client for
[Audiobookshelf](https://www.audiobookshelf.org). It keeps Audiobookshelf's
self-hosted, library-first substance but rehouses it in a warm "hearth"
identity: near-neutral dark surfaces, a gold + cream wordmark, a single
ember accent, and a signature **dynamic cover-glow** that tints the room
around whatever you're listening to.

> Lineage note: HearthShelf began as a fork of the *Audplexus* design
> system (a sibling self-hosted tool, indigo + coral). That was only a
> starting point — every token, component, and card here is HearthShelf.

---

## Brand at a glance

HearthShelf is **dark-first and quiet**. The page is a warm near-black
`#1b1a18`; surfaces step up in warm neutrals (never navy, never muddy
brown). The brand lives in two colors — **Hearth gold `#bd863f`** and
**Shelf cream `#f0e6d6`** — used together in the light/bold `HearthShelf`
wordmark and the flame mark. Interaction is carried by a separate
**ember accent `#e0654a`** (coral) so "brand" and "this does something"
never blur together. The defining motif is the **cover-glow**: the
artwork's color blooms softly from the top of the page and tints the
controls while a title plays.

---

## Production target — HANDOFF

The production build is **shadcn/ui + Tailwind CSS**. Tokens are authored
as **shadcn role variables** on `:root` (light) and `.dark` (dark) in
[`colors_and_type.css`](colors_and_type.css), so they drop straight into a
shadcn `globals.css` / Tailwind v4 `@theme` block.

| HearthShelf surface | shadcn role |
| --- | --- |
| scaffold (page) | `--background` |
| card / shelf surface | `--card`, `--popover` |
| ember accent | `--primary`, `--ring` |
| elevated track | `--muted` |
| neutral hover | `--accent` *(note: NOT the brand accent)* |
| hairline | `--border`, `--input` |
| sidebar group | `--sidebar*` |
| cover palette | `--chart-1…5` |

Components map to shadcn primitives: Button → Button, Badge → Badge,
ProgressBar → Progress/Slider, BookTile → Card, PlayBar → a custom bar
over Card + Slider, NavItem → sidebar menu button. The dynamic-accent +
cover-glow stay as CSS-variable overrides (`--primary` / `--glow-accent`)
layered on top of the static theme at runtime.

`--radius` is `1rem` (16px) so shadcn's derived `sm/md/lg` radii match the
HearthShelf scale automatically.

---

## Index of this folder

```
README.md                     ← this file (design guide + manifest)
SKILL.md                      ← Claude Skill loader
styles.css                    ← @import entry point (consumers link this)
colors_and_type.css           ← all tokens (shadcn :root/.dark) + type utilities
fonts/                        ← Libre Baskerville (brand display face)
preview/                      ← Design System tab cards (Colors · Type · Spacing · Brand · Components)
components/
  core/                       ← Button, Badge, ProgressBar, Stars, NavItem
  media/                      ← Cover, BookTile (+ HoverActions), PlayBar
templates/
  library-screen/             ← copyable HearthShelf library screen (.dc.html)
app/                          ← the full reference prototype (HearthShelf.html)
HearthShelf.html              ← interactive click-thru: home, library, series,
                                player, stats, book detail, settings
HearthShelf — Accent Face-off.html   ← coral vs gold accent comparison
HearthShelf — Card Actions.html      ← hover-action density study
```

The **reference app** (`HearthShelf.html` + `app/`) is the canonical
interactive recreation — sidebar nav, dynamic cover-glow, card/floating
cover styles, two-pane immersive player, stats with a server leaderboard,
and a Tweaks panel (theme, accent source, glow intensity, cover style).

---

## CONTENT FUNDAMENTALS

HearthShelf copy is warm, plain, and second-person — a librarian's voice,
not a marketer's.

**Tone**
- Calm and unhurried. "Good evening, Jordan." "Jump back in." No hype, no
  exclamation points, no growth-speak.
- Sentence case everywhere except the **eyebrow** (tracked uppercase) and
  unit abbreviations.
- Progress is stated gently and specifically: "You're 52% through *The
  Tide Between Us* · 6 books on the go", "9 chapters left".

**Voice — second person, low-key**
- Buttons are short imperatives: "Resume", "Start listening", "Add to
  list", "Mark finished", "Download".
- Empty/▸ states are calm, never cute: "Nothing playing."
- Metadata is middle-dotted: "Cassian Vale · 18.7h · Ch 31/56".

**Numbers & time**
- Set in Geist Mono, tabular: `8:24:11`, `1.4×`, `52%`, `272ʰ54ᵐ`.
- Stats lead with a big number and a quiet label underneath
  ("23 · Day streak").

**No emoji, ever.** Iconography is Material Symbols Rounded only.

**Editorial voice** — long-form book copy and pull-quotes may use Libre
Baskerville italic for a literary touch: *"the only light the glow of the
story itself."* Use sparingly; the UI itself stays in Geist.

---

## VISUAL FOUNDATIONS

**Color vibe — warm neutral + one ember.** Dark is home. The base is
`#1b1a18`; surfaces step up `card #2a2825` → `elevated #322f2b`, separated
by a 1px warm hairline rather than heavy shadow. Exactly one functional
accent, ember `#e0654a`, drives buttons, progress, active nav, and the
focus ring. Light mode swaps the two brand anchors — cream `#f0e6d6`
becomes the page, `#1b1a18` becomes the ink — and cards lift *lighter*
than the page.

**The signature: cover-glow.** A soft radial bloom of the now-playing
cover's color falls from the top edge of the content column (and grows in
the immersive player). Strength is a single token, `--glow-strength`
(60 dark / 14 light). On desktop it's restrained — a tint, not a spotlight.

**Imagery / covers.** When real artwork is missing, covers are *typeset*
from a single hue (`--cv`): a tonal duotone, a faint oversized initial,
and kicker / title / author. That same hue becomes the page glow and
accent while the book plays — so color flows from the art, not a palette.

**Type.** UI is **Geist** (300–700); numerals, time and code are **Geist
Mono**; **Libre Baskerville** is the editorial/pull-quote face. The scale
is display-forward: 76px stat → 34px page title → 25px sheet title → 17px
section → 15/14.5px body → 11px eyebrow. The signature pairing is a
**light, widely-tracked uppercase eyebrow** above a **bold, tight-tracked
title**, used on every header.

**Spacing.** rem-based, 4px cadence. Page gutters 48px, card padding 24px,
grid gaps 20–24px.

**Radii.** Generous and soft — cover 10, row 12, card 16, sheet 24, pill
999. No sharp corners anywhere.

**Cards.** A surface fill + hairline; depth from a soft `--shadow-lift`
on hover, not a resting shadow. Book tiles bleed the cover to the top edge
with the caption attached directly beneath (no gap). Hover reveals quick
actions over the cover (Play primary + Add / Mark finished / More).

**Motion.** Calm and functional. Hovers ~0.18s on background/color; tiles
lift 4px; the player's detail/chapters panel slides in inline (no scrim,
no blur) as the player shifts left. Entrance fades are short (0.4s) and
gated so print/reduced-motion show content. No infinite decorative loops.

**Transparency & blur.** Backdrop blur on the sticky top bar and the play
bar only. The book-detail sheet uses a dim scrim; the player's inline
panels deliberately do **not** (responsive, not modal).

---

## ICONOGRAPHY

**One system: [Material Symbols Rounded](https://fonts.google.com/icons)**,
weight 400, optical size 24. Rounded (not Sharp/Outlined) for a soft,
friendly read that suits the warm palette.

- **Filled** variant marks active / now-playing states (`play_arrow`,
  `graphic_eq`, active nav, the flame mark). **Outlined** for everything
  else.
- The brand mark is `local_fire_department` (filled) in Hearth gold with a
  soft glow.
- Common glyphs: `home`, `grid_view`, `auto_stories`, `insights`,
  `play_arrow`, `pause`, `replay_30`, `forward_30`, `playlist_add`,
  `bookmark_add`, `speed`, `bedtime`, `check`, `local_fire_department`.
- **No emoji. No second icon set.** Load from Google Fonts (or self-host
  the variable font) — do not hand-draw SVG icons.

---

## Components

Reusable React primitives, all styled off the shadcn tokens (so they
follow theme + dynamic-accent automatically). Loaded by consumers via the
compiled `_ds_bundle.js` on `window.AudplexusDesignSystem_019e15`.

| Component | What |
| --- | --- |
| `Button` | primary (ember) / secondary / pill / ghost / destructive; sizes; icons |
| `Badge` | soft status chip; `tone="now"` for now-playing |
| `ProgressBar` | progress line + optional scrubber thumb |
| `Stars` | gold five-star rating (half-stars) |
| `NavItem` | sidebar nav row, ember-tinted active state |
| `Cover` | the typeset cover — the dynamic-accent source |
| `BookTile` | cover + caption + hover actions (card / floating) |
| `HoverActions` | the quick-action overlay (Play · Add · Finish · More) |
| `PlayBar` | persistent now-playing bar — transport + scrubber + speed |

See `preview/*.card.html` (Components group) for live, dense usage demos,
and `templates/library-screen/` for a copyable screen that composes them.

---

## Open items / caveats

- **Geist & Geist Mono are referenced but not yet self-hosted.** The
  tokens point at the correct families with system fallbacks; preview/type
  cards load real Geist from Google Fonts. Upload the font files to clear
  the compiler notice — do not substitute another family.
- **App accent is provisional.** Default is coral `#e0654a`; see
  *HearthShelf — Accent Face-off.html* to lock coral vs gold `#bd863f`.
  It's a single token (`--primary`) to flip.
