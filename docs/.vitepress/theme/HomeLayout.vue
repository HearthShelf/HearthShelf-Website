<template>
  <div class="hs-home dark" :style="{ '--primary': accent, '--ring': accent, '--glow-accent': accent }">

    <!-- NAV -->
    <nav class="hs-nav">
      <a href="#top" class="hs-nav-logo">
        <img class="hs-logo-icon" src="/flame.png" alt="" />
        <span class="hs-wordmark"><span class="hs-hearth">Hearth</span><span class="hs-shelf">Shelf</span></span>
      </a>
      <div class="hs-nav-links">
        <a class="navlink" href="#features">Features</a>
        <a class="navlink" href="#compare">Compare</a>
        <a class="navlink" href="#gallery">Screenshots</a>
        <a class="navlink" href="/guide/what-is-hearthshelf">Docs</a>
      </div>
      <div class="hs-nav-right">
        <a class="navlink hs-github-star" href="https://github.com/HearthShelf/HearthShelf" target="_blank">
          <span class="ms">star</span>4.2k
        </a>
        <a class="hs-btn hs-btn-primary hs-btn-sm" href="#quickstart">
          <span class="ms fill">rocket_launch</span>Deploy
        </a>
      </div>
    </nav>

    <div id="top"></div>

    <!-- HERO -->
    <header class="hs-hero">
      <div class="hs-hero-glow"></div>
      <div class="hs-hero-inner">
        <div class="hs-hero-text">
          <div class="hs-eyebrow-badge">
            <span class="ms fill" style="font-size:15px;color:var(--brand-hearth)">bolt</span>
            A warmer home for Audiobookshelf
          </div>
          <h1 class="hs-hero-h1">Your whole library, in one warm place.</h1>
          <p class="hs-hero-sub">A single pane of glass for your self-hosted audiobooks and ebooks. HearthShelf keeps everything Audiobookshelf does well and rehouses it in an interface you'll actually want to open at night.</p>
          <div class="hs-hero-actions">
            <a class="hs-btn hs-btn-primary hs-btn-lg" href="#quickstart">
              <span class="ms fill">rocket_launch</span>Deploy with Docker
            </a>
            <a class="hs-btn hs-btn-pill hs-btn-lg" href="/guide/what-is-hearthshelf">
              <span class="ms fill">menu_book</span>Read the docs
            </a>
          </div>
          <div class="hs-hero-stats">
            <div class="hs-stat"><div class="hs-stat-num">100%</div><div class="hs-stat-label">Self-hosted</div></div>
            <div class="hs-stat"><div class="hs-stat-num">AGPL v3</div><div class="hs-stat-label">Open source</div></div>
            <div class="hs-stat"><div class="hs-stat-num">1</div><div class="hs-stat-label">Docker command</div></div>
          </div>
        </div>
        <div class="hs-hero-screen">
          <div class="hs-hero-frame-wrap">
            <AppFrame screen="library" :scale="0.72" :accent="accent" live />
          </div>
        </div>
      </div>
    </header>

    <!-- FEATURES -->
    <section id="features" class="hs-section">
      <div class="hs-section-inner">
        <div class="hs-section-header">
          <div class="hs-eyebrow">Why HearthShelf</div>
          <h2 class="hs-section-h2">Built for the way you actually listen — and read.</h2>
        </div>

        <!-- Feature 1: cover-glow -->
        <div class="hs-feature-row">
          <div class="hs-feature-text">
            <span class="hs-feature-icon"><span class="ms fill">blur_on</span></span>
            <h3 class="hs-feature-h3">The room glows with the story.</h3>
            <p class="hs-feature-p">Every cover carries its own color. When a title plays, that hue blooms softly from the top of the page and tints the controls — so the interface quietly takes on the mood of whatever you're in. No themes to pick. Color flows from the art.</p>
            <ul class="hs-check-list">
              <li><span class="ms fill">check_circle</span>Dynamic accent from cover artwork</li>
              <li><span class="ms fill">check_circle</span>Typeset covers when artwork is missing</li>
              <li><span class="ms fill">check_circle</span>Tunable glow intensity, light &amp; dark</li>
            </ul>
          </div>
          <div class="hs-feature-media">
            <AppFrame screen="player" :scale="0.5" :accent="accent" />
          </div>
        </div>

        <!-- Feature 2: player -->
        <div class="hs-feature-row hs-feature-row-reverse">
          <div class="hs-feature-text">
            <span class="hs-feature-icon"><span class="ms fill">graphic_eq</span></span>
            <h3 class="hs-feature-h3">An immersive player, not a toolbar.</h3>
            <p class="hs-feature-p">A persistent bar for quick control, and a two-pane immersive view when you want to settle in — cover, chapters, sleep timer, and speed, all without leaving the page. Chapters slide in inline; nothing gets in your way.</p>
            <ul class="hs-check-list">
              <li><span class="ms fill">check_circle</span>Inline chapter list &amp; jump-to</li>
              <li><span class="ms fill">check_circle</span>Variable speed, sleep timer, bookmarks</li>
              <li><span class="ms fill">check_circle</span>Resume across every device</li>
            </ul>
          </div>
          <div class="hs-feature-media">
            <AppFrame screen="player" :scale="0.5" :accent="accent" />
          </div>
        </div>

        <!-- Feature 3: stats -->
        <div class="hs-feature-row">
          <div class="hs-feature-text">
            <span class="hs-feature-icon"><span class="ms fill">insights</span></span>
            <h3 class="hs-feature-h3">Stats worth opening the app for.</h3>
            <p class="hs-feature-p">Hours listened, books finished, and a six-month heatmap of your listening — laid out so the picture is clear at a glance. Your numbers stay on your hardware, never a third party's.</p>
            <ul class="hs-check-list">
              <li><span class="ms fill">check_circle</span>Weekly bars &amp; a six-month listening heatmap</li>
              <li><span class="ms fill">check_circle</span>Your most-listened books, ranked</li>
              <li><span class="ms fill">check_circle</span>Private by default — your data, your box</li>
            </ul>
          </div>
          <div class="hs-feature-media">
            <AppFrame screen="stats" :scale="0.5" :accent="accent" />
          </div>
        </div>

        <!-- Feature 4: ebook reader -->
        <div class="hs-feature-row hs-feature-row-reverse">
          <div class="hs-feature-text">
            <span class="hs-feature-icon"><span class="ms fill">menu_book</span></span>
            <h3 class="hs-feature-h3">Reader and player, side by side.</h3>
            <p class="hs-feature-p">A full immersive ebook reader, built in. Choose your theme — dark, sepia, light, or paper — adjust type size, font, and spacing, then settle in. If the book has both audio and an ebook, one tap jumps you to roughly where the narration has reached, so you can switch between listening and reading without losing your place.</p>
            <ul class="hs-check-list">
              <li><span class="ms fill">check_circle</span>Four reading themes including sepia &amp; dark</li>
              <li><span class="ms fill">check_circle</span>Adjustable typeface, size, line height &amp; margins</li>
              <li><span class="ms fill">check_circle</span>Jump to the audio's spot without leaving the page</li>
            </ul>
          </div>
          <div class="hs-feature-media">
            <AppFrame screen="reader" :scale="0.5" :accent="accent" />
          </div>
        </div>
      </div>
    </section>

    <!-- COMPARE -->
    <section id="compare" class="hs-section">
      <div class="hs-compare-inner">
        <div class="hs-section-header">
          <div class="hs-eyebrow">Same engine, warmer room</div>
          <h2 class="hs-section-h2">HearthShelf vs. vanilla Audiobookshelf</h2>
          <p class="hs-compare-sub">HearthShelf isn't a replacement — it's an alternative front-end for the server you already run. Same library, same files, same API, nothing to migrate. Audiobookshelf already does the essentials well; HearthShelf rehouses them in a warmer interface and adds a few things of its own.</p>
        </div>
        <div class="hs-compare-table">
          <div class="hs-compare-header">
            <span></span>
            <span class="hs-compare-col-head hs-compare-col-abs">Audiobookshelf</span>
            <span class="hs-compare-col-head hs-compare-col-hs">
              <span class="ms fill" style="font-size:17px;color:var(--brand-hearth)">local_fire_department</span>HearthShelf
            </span>
          </div>
          <div v-for="row in compareRows" :key="row.label" class="hs-compare-row">
            <span class="hs-compare-label">{{ row.label }}</span>
            <span class="hs-compare-base">
              <span v-if="row.absIcon" class="ms fill" :style="{ color: row.absColor, fontSize: '20px' }">{{ row.absIcon }}</span>
              <span v-else>{{ row.base }}</span>
            </span>
            <span class="hs-compare-hs"><span class="ms fill" style="color:var(--primary);font-size:20px">check_circle</span></span>
          </div>
          <div class="hs-compare-footer">
            <span class="ms" style="font-size:17px">info</span>
            HearthShelf connects to your existing Audiobookshelf server — same library, same files, nothing to migrate.
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section id="gallery" class="hs-section">
      <div class="hs-section-inner">
        <div class="hs-section-header">
          <div class="hs-eyebrow">A look around</div>
          <h2 class="hs-section-h2">Every screen, reconsidered.</h2>
          <p class="hs-compare-sub">A tour of the interface — the library, the immersive player, the built-in reader, and your listening stats.</p>
        </div>
        <div class="hs-gallery hs-gallery-4">
          <div class="hs-gallery-item">
            <AppFrame screen="library" :scale="0.42" :accent="accent" />
            <div class="hs-gallery-caption"><strong>Library</strong> · your whole collection</div>
          </div>
          <div class="hs-gallery-item">
            <AppFrame screen="player" :scale="0.42" :accent="accent" />
            <div class="hs-gallery-caption"><strong>Player</strong> · immersive, cover-lit</div>
          </div>
          <div class="hs-gallery-item">
            <AppFrame screen="reader" :scale="0.42" :accent="accent" />
            <div class="hs-gallery-caption"><strong>Reader</strong> · books &amp; read-along</div>
          </div>
          <div class="hs-gallery-item">
            <AppFrame screen="stats" :scale="0.42" :accent="accent" />
            <div class="hs-gallery-caption"><strong>Stats</strong> · top books &amp; weekly listening</div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICKSTART -->
    <section id="quickstart" class="hs-section">
      <div class="hs-quickstart-inner">
        <div class="hs-section-header">
          <div class="hs-eyebrow">Up in two minutes</div>
          <h2 class="hs-section-h2">Self-host it with one command.</h2>
        </div>
        <div class="hs-quickstart-grid">
          <div class="hs-steps">
            <div v-for="step in steps" :key="step.n" class="hs-step">
              <span class="hs-step-num">{{ step.n }}</span>
              <div>
                <div class="hs-step-title">{{ step.title }}</div>
                <div class="hs-step-body">{{ step.body }}</div>
              </div>
            </div>
          </div>
          <div class="hs-code-card">
            <div class="hs-code-header">
              <span class="ms" style="font-size:18px;color:var(--muted-foreground)">description</span>
              <span class="hs-code-filename">docker-compose.yml</span>
              <button class="hs-copy-btn" @click="copyCompose">
                <span class="ms" style="font-size:16px">content_copy</span>{{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <pre class="hs-code-pre"><span class="hs-yaml-key">services:</span>
  <span class="hs-yaml-val">hearthshelf:</span>
    <span class="hs-yaml-key">image:</span> ghcr.io/hearthshelf/hearthshelf:latest
    <span class="hs-yaml-key">container_name:</span> hearthshelf
    <span class="hs-yaml-key">ports:</span>
      - <span class="hs-yaml-str">"8200:80"</span>
    <span class="hs-yaml-key">volumes:</span>
      - ./config:/config
      - ./metadata:/metadata
      - <span class="hs-yaml-str">/path/to/audiobooks</span>:/audiobooks
    <span class="hs-yaml-key">environment:</span>
      - TZ=America/New_York
    <span class="hs-yaml-key">restart:</span> unless-stopped</pre>
            <div class="hs-code-footer">
              <span class="hs-prompt">$</span>
              <span class="hs-cmd">docker compose up -d</span>
              <a class="hs-btn hs-btn-pill hs-btn-sm" href="/setup/docker" style="margin-left:auto">
                Full install guide<span class="ms">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA STRIP -->
    <section class="hs-section">
      <div class="hs-cta-inner">
        <div class="hs-cta-card">
          <div class="hs-cta-glow"></div>
          <div class="hs-cta-body">
            <img class="hs-cta-icon" src="/flame.png" alt="" />
            <h2 class="hs-cta-h2">Bring your library home.</h2>
            <p class="hs-cta-sub">Free and open source, yours to run forever. Point it at your own Audiobookshelf server and open the door.</p>
            <div class="hs-cta-actions">
              <a class="hs-btn hs-btn-primary hs-btn-lg" href="#quickstart">
                <span class="ms fill">rocket_launch</span>Deploy with Docker
              </a>
              <a class="hs-btn hs-btn-pill hs-btn-lg" href="https://github.com/HearthShelf/HearthShelf" target="_blank">
                <span class="ms fill">star</span>Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="hs-footer">
      <div class="hs-footer-inner">
        <div class="hs-footer-grid">
          <div class="hs-footer-brand">
            <a href="#top" class="hs-nav-logo">
              <img class="hs-logo-icon" src="/flame.png" alt="" />
              <span class="hs-wordmark"><span class="hs-hearth">Hearth</span><span class="hs-shelf">Shelf</span></span>
            </a>
            <p class="hs-footer-tagline">A calmer, self-hosted web client for your audiobook and ebook library.</p>
            <div class="hs-footer-quote">"the only light the glow of the story itself."</div>
          </div>
          <div class="hs-footer-col">
            <div class="hs-footer-col-head">Product</div>
            <a class="navlink" href="#features">Features</a>
            <a class="navlink" href="#compare">Compare</a>
            <a class="navlink" href="#gallery">Screenshots</a>
            <a class="navlink" href="#quickstart">Self-host</a>
          </div>
          <div class="hs-footer-col">
            <div class="hs-footer-col-head">Resources</div>
            <a class="navlink" href="/guide/what-is-hearthshelf">Documentation</a>
            <a class="navlink" href="/setup/docker">Installation</a>
            <a class="navlink" href="https://github.com/HearthShelf/HearthShelf" target="_blank">GitHub</a>
            <a class="navlink" href="#">Changelog</a>
          </div>
          <div class="hs-footer-col">
            <div class="hs-footer-col-head">Community</div>
            <a class="navlink" href="https://discord.gg/c62ECD4EuC" target="_blank">Discord</a>
          </div>
        </div>
        <div class="hs-footer-bottom">
          <span>© 2026 HearthShelf · AGPL v3 · Not affiliated with Audiobookshelf</span>
          <span class="hs-footer-ver">v0.9.2</span>
        </div>
        <div class="hs-footer-legal">
          HearthShelf is a user interface. It does not host, source, or distribute content.
          You are responsible for the legality of the content you add and the backends you connect.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const accent = '#e0654a'
const copied = ref(false)

// Every row is verified against current source in both projects. The Audiobookshelf
// column reflects what its web client actually ships; rows where both are equal
// (mini player, sleep timer, bookmarks, speed, chapters) are intentionally left
// out because they aren't differentiators.
const compareRows = [
  // ── Look & feel
  { label: 'Warm "hearth" design with themes & accent presets', base: 'One fixed dark theme', absIcon: null },
  { label: 'Cover-art glow that tints the whole interface', base: 'Share pages only', absIcon: null },
  { label: 'Immersive full-screen player view', base: 'Mini bar + dialogs', absIcon: null },
  // ── Reading
  { label: 'Ebook reader woven into the same player', base: 'Separate reader', absIcon: null },
  // ── Discovery & requests
  { label: 'QuestGiver — AI next-listen recommender', base: '—', absIcon: 'remove', absColor: 'var(--muted-foreground)' },
  { label: 'Discover shelves you tune with thumbs up / down', base: 'Discover shelf, no feedback', absIcon: null },
  { label: 'ReadMeABook request tracking (bring your own backend)', base: '—', absIcon: 'remove', absColor: 'var(--muted-foreground)' },
  // ── Same foundation
  { label: 'Same library, files & API — nothing to migrate', base: 'Yes', absIcon: 'check_circle', absColor: 'var(--muted-foreground)' },
  { label: 'Self-hosted — your data, your hardware', base: 'Yes', absIcon: 'check_circle', absColor: 'var(--muted-foreground)' },
]

const steps = [
  { n: 1, title: 'Add the compose file', body: 'Drop docker-compose.yml in a folder and point a volume at your audiobooks.' },
  { n: 2, title: 'Bring it up', body: 'Run docker compose up -d. The image pulls and starts in seconds.' },
  { n: 3, title: 'Open the door', body: 'Visit http://localhost:8200 and connect your Audiobookshelf server.' },
]

const composeText = `services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    container_name: hearthshelf
    ports:
      - "8200:80"
    volumes:
      - ./config:/config
      - ./metadata:/metadata
      - /path/to/audiobooks:/audiobooks
    environment:
      - TZ=America/New_York
    restart: unless-stopped`

function copyCompose() {
  navigator.clipboard.writeText(composeText).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}
</script>

<style scoped>
/* ── Reset & base ── */
.hs-home {
  background: var(--background, #1b1a18);
  color: var(--foreground, #f4f1ea);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  min-height: 100vh;
  overflow-x: clip;
  --background: #1b1a18;
  --foreground: #f4f1ea;
  --card: #2a2825;
  --popover: #242220;
  --primary: #e0654a;
  --muted-foreground: #aba498;
  --border: #383530;
  --sidebar: #131211;
  --fill: rgba(255,255,255,0.06);
  --brand-hearth: #bd863f;
  --wordmark-shelf: #f0e6d6;
  --font-mono: 'Geist Mono', 'DM Mono', ui-monospace, monospace;
  --font-brand: 'Libre Baskerville', Georgia, serif;
}

/* Material Symbols font */
.ms {
  font-family: 'Material Symbols Rounded';
  font-variation-settings: 'FILL' 0, 'wght' 400;
  line-height: 1;
  user-select: none;
}
.ms.fill { font-variation-settings: 'FILL' 1, 'wght' 400; }

a { color: inherit; text-decoration: none; }
.navlink { transition: color 0.15s; color: var(--muted-foreground); }
.navlink:hover { color: var(--foreground); }

/* ── Nav ── */
.hs-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 40px;
  height: 68px;
  background: color-mix(in oklab, var(--background) 78%, transparent);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid var(--border);
}

.hs-nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.hs-logo-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--brand-hearth) 55%, transparent));
}

.hs-wordmark {
  font-size: 20px;
  font-family: var(--font-brand);
}
.hs-hearth { font-weight: 400; color: var(--brand-hearth); }
.hs-shelf { font-weight: 700; color: var(--wordmark-shelf); }

.hs-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-left: 18px;
  font-size: 14px;
}

.hs-nav-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.hs-github-star {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
}
.hs-github-star .ms { font-size: 19px; }

/* ── Buttons ── */
.hs-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: inherit;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.hs-btn-primary {
  background: var(--primary);
  color: #fffaf6;
  border-radius: 10px;
  padding: 0 18px;
}
.hs-btn-primary:hover { background: color-mix(in oklab, var(--primary) 85%, black); box-shadow: 0 0 22px color-mix(in oklab, var(--primary) 40%, transparent); }

.hs-btn-pill {
  background: var(--fill);
  color: var(--foreground);
  border-radius: 999px;
  border: 1px solid var(--border);
  padding: 0 18px;
}
.hs-btn-pill:hover { border-color: var(--primary); color: var(--primary); }

.hs-btn-sm { height: 36px; font-size: 13.5px; }
.hs-btn-lg { height: 50px; font-size: 15px; }

/* ── Hero ── */
.hs-hero {
  position: relative;
  overflow: hidden;
}

.hs-hero-glow {
  position: absolute;
  inset: 0 0 auto 0;
  height: 760px;
  pointer-events: none;
  background: radial-gradient(80% 60% at 50% -8%, color-mix(in oklab, var(--primary) 54%, transparent) 0%, transparent 60%);
}

.hs-hero-inner {
  position: relative;
  max-width: 1340px;
  margin: 0 auto;
  padding: 88px 56px 80px;
  display: grid;
  grid-template-columns: minmax(400px, 520px) 1fr;
  align-items: center;
  gap: 48px;
}

.hs-hero-text { display: flex; flex-direction: column; }

.hs-eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: var(--fill);
  border: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--muted-foreground);
  margin-bottom: 28px;
  width: fit-content;
}

.hs-hero-h1 {
  font-size: 62px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.03;
  margin: 0;
  color: var(--foreground);
}

.hs-hero-sub {
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted-foreground);
  max-width: 46ch;
  margin: 22px 0 0;
}

.hs-hero-actions {
  display: flex;
  gap: 14px;
  margin-top: 34px;
  flex-wrap: wrap;
}

.hs-hero-stats {
  display: flex;
  gap: 30px;
  margin-top: 40px;
}

.hs-stat-num {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--foreground);
}

.hs-stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.hs-hero-screen {
  perspective: 1800px;
  display: flex;
  justify-content: flex-start;
}

.hs-hero-frame-wrap { position: relative; }

/* ── App mockup ── */
.hs-app-mockup {
  background: var(--card);
  border-radius: 14px;
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
}

.hs-app-mockup-hero {
  width: 640px;
  transform: rotateY(-14deg) rotate(1deg);
  transform-origin: left center;
}

.hs-app-mockup-sm {
  width: 380px;
}

.hs-mock-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--sidebar);
  border-bottom: 1px solid var(--border);
}

.hs-mock-dots {
  display: flex;
  gap: 5px;
}
.hs-mock-dots span {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--border);
}
.hs-mock-dots span:first-child { background: #c4463a; }
.hs-mock-dots span:nth-child(2) { background: #bd863f; }
.hs-mock-dots span:nth-child(3) { background: #7fa86b; }

.hs-mock-url {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--muted-foreground);
  flex: 1;
  text-align: center;
}

.hs-mock-body { display: flex; flex: 1; }

.hs-mock-library { height: 300px; }
.hs-mock-library-sm { height: 200px; }

.hs-mock-sidebar {
  width: 48px;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 4px;
}

.hs-mock-nav-item {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: var(--muted-foreground);
  font-size: 20px;
  cursor: pointer;
}
.hs-mock-nav-item.active {
  background: color-mix(in oklab, var(--primary) 16%, transparent);
  color: var(--primary);
}

.hs-mock-content {
  flex: 1;
  padding: 14px;
  overflow: hidden;
}

.hs-mock-heading {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
  margin-bottom: 10px;
}

.hs-mock-covers {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

.hs-mock-covers-sm .hs-mock-cover {
  width: 60px;
  height: 60px;
}

.hs-mock-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: var(--c, var(--primary));
  opacity: 0.85;
  flex-shrink: 0;
}

/* ── Persistent player bar ── */
.hs-mock-player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--sidebar);
  border-top: 1px solid var(--border);
  position: relative;
}
.hs-mock-player-sm { padding: 7px 10px; }

.hs-mock-player-cover {
  width: 34px; height: 34px;
  border-radius: 6px;
  background: var(--c, var(--primary));
  flex-shrink: 0;
}

.hs-mock-player-info { flex: 1; overflow: hidden; }

.hs-mock-player-title {
  height: 8px;
  border-radius: 4px;
  background: var(--muted-foreground);
  opacity: 0.4;
  width: 60%;
  margin-bottom: 5px;
}

.hs-mock-player-sub {
  height: 6px;
  border-radius: 3px;
  background: var(--muted-foreground);
  opacity: 0.25;
  width: 40%;
}

.hs-mock-player-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
  font-size: 18px;
}

.hs-play-btn {
  font-size: 28px !important;
  color: var(--primary);
}

.hs-mock-player-progress {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--border);
}
.hs-mock-player-bar {
  height: 100%;
  width: 38%;
  background: var(--primary);
}

/* ── Full player view ── */
.hs-mock-player-full {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  min-height: 240px;
}

.hs-mock-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 50% at 50% -10%, color-mix(in oklab, var(--gc) 40%, transparent), transparent 70%);
  pointer-events: none;
}

.hs-mock-album-art {
  width: 100px; height: 100px;
  border-radius: 12px;
  background: var(--c, var(--primary));
  box-shadow: 0 8px 32px color-mix(in oklab, var(--c, var(--primary)) 40%, transparent);
}

.hs-mock-player-meta { text-align: center; }
.hs-mock-meta-title {
  height: 10px; border-radius: 5px;
  background: var(--foreground); opacity: 0.5;
  width: 140px; margin-bottom: 7px;
}
.hs-mock-meta-author {
  height: 7px; border-radius: 4px;
  background: var(--muted-foreground); opacity: 0.4;
  width: 100px; margin: 0 auto;
}

.hs-mock-controls-row {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--muted-foreground);
  font-size: 20px;
}

.hs-mock-track {
  width: 100%;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.hs-mock-track-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
}

/* ── Section layout ── */
.hs-section { padding: 140px 0 0; }

.hs-section-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 40px;
}

.hs-section-header {
  text-align: center;
  margin-bottom: 72px;
}

.hs-eyebrow {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 12px;
}

.hs-section-h2 {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
  color: var(--foreground);
  line-height: 1.1;
}

/* ── Feature rows ── */
.hs-feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  margin-bottom: 128px;
}

.hs-feature-row-reverse .hs-feature-text { order: 2; }
.hs-feature-row-reverse .hs-feature-media { order: 1; }

.hs-feature-media { display: flex; justify-content: center; }

.hs-feature-icon {
  display: inline-grid;
  place-items: center;
  width: 46px; height: 46px;
  border-radius: 13px;
  background: color-mix(in oklab, var(--primary) 18%, transparent);
  color: var(--primary);
  font-size: 24px;
}

.hs-feature-h3 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 22px 0 0;
  color: var(--foreground);
}

.hs-feature-p {
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted-foreground);
  margin: 14px 0 0;
}

.hs-check-list {
  list-style: none;
  padding: 0;
  margin: 24px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hs-check-list li {
  display: flex;
  gap: 11px;
  align-items: center;
  font-size: 15px;
  color: var(--foreground);
}

.hs-check-list li .ms { font-size: 19px; color: var(--primary); }

/* ── Stats mockup ── */
.hs-mock-stats-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hs-mock-stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.hs-mock-stat-card {
  background: var(--sidebar);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
}

.hs-mock-stat-label {
  font-size: 10px;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.hs-mock-stat-val {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.hs-mock-chart {
  background: var(--sidebar);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 12px 6px;
  height: 80px;
  display: flex;
  align-items: flex-end;
}

.hs-mock-bar-group {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  width: 100%;
  height: 100%;
}

.hs-mock-bar-item {
  flex: 1;
  border-radius: 3px 3px 0 0;
  background: var(--border);
}
.hs-bar-active { background: var(--primary); }

.hs-mock-leaderboard {
  background: var(--sidebar);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
}

.hs-mock-lb-heading {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground);
  margin-bottom: 10px;
}

.hs-mock-lb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.hs-rank {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted-foreground);
  width: 12px;
  text-align: center;
}

.hs-lb-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--primary);
  opacity: 0.7;
}

.hs-lb-hrs {
  font-size: 10px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
  white-space: nowrap;
}

/* ── Compare ── */
.hs-compare-inner {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 40px;
}

.hs-compare-sub {
  font-size: 16px;
  color: var(--muted-foreground);
  max-width: 60ch;
  margin: 14px auto 48px;
  line-height: 1.6;
  text-align: center;
}

.hs-compare-table {
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  background: var(--card);
}

.hs-compare-header {
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr;
  align-items: center;
  padding: 18px 26px;
  border-bottom: 1px solid var(--border);
  background: var(--sidebar);
}

.hs-compare-col-head {
  font-size: 13.5px;
  font-weight: 600;
  text-align: center;
}

.hs-compare-col-abs { color: var(--muted-foreground); }
.hs-compare-col-hs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--foreground);
}

.hs-compare-row {
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr;
  align-items: center;
  padding: 17px 26px;
  border-bottom: 1px solid var(--border);
}
.hs-compare-row:last-of-type { border-bottom: 1px solid var(--border); }

.hs-compare-label { font-size: 14.5px; font-weight: 500; color: var(--foreground); }
.hs-compare-base { text-align: center; font-size: 13px; color: var(--muted-foreground); }
.hs-compare-hs { text-align: center; display: flex; justify-content: center; }
.hs-compare-hs .ms { font-size: 21px; }

.hs-compare-footer {
  padding: 16px 26px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: var(--muted-foreground);
}
.hs-compare-footer .ms { font-size: 17px; }

/* ── Gallery ── */
.hs-gallery {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: flex-start;
}
.hs-gallery-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  justify-items: center;
}

.hs-gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.hs-gallery-caption {
  font-size: 14px;
  color: var(--muted-foreground);
}
.hs-gallery-caption strong { color: var(--foreground); font-weight: 600; }

/* ── Quickstart ── */
.hs-quickstart-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
}

.hs-quickstart-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 36px;
  align-items: start;
}

.hs-steps {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hs-step {
  display: flex;
  gap: 14px;
  padding: 14px 0;
}

.hs-step-num {
  flex: none;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--primary) 16%, transparent);
  color: var(--primary);
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
}

.hs-step-title { font-size: 15px; font-weight: 600; color: var(--foreground); }
.hs-step-body { font-size: 13px; color: var(--muted-foreground); margin-top: 3px; line-height: 1.5; }

.hs-code-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--popover);
}

.hs-code-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--sidebar);
}

.hs-code-filename {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--foreground);
}

.hs-copy-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s;
}
.hs-copy-btn:hover { color: var(--foreground); }

.hs-code-pre {
  margin: 0;
  padding: 22px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.75;
  color: #cdbfae;
  overflow-x: auto;
}

.hs-yaml-key { color: #8aa6a0; }
.hs-yaml-val { color: #e0a36a; }
.hs-yaml-str { color: #9ec48a; }

.hs-code-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card);
}

.hs-prompt { color: var(--primary); font-family: var(--font-mono); font-size: 14px; }
.hs-cmd { font-family: var(--font-mono); font-size: 14px; color: var(--foreground); }

/* ── CTA strip ── */
.hs-cta-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 40px;
}

.hs-cta-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 26px;
  background: var(--card);
  padding: 72px 48px;
  text-align: center;
}

.hs-cta-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(70% 120% at 50% -20%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 60%);
  pointer-events: none;
}

.hs-cta-body { position: relative; }

.hs-cta-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: drop-shadow(0 0 16px color-mix(in oklab, var(--brand-hearth) 55%, transparent));
}

.hs-cta-h2 {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 18px 0 0;
  color: var(--foreground);
}

.hs-cta-sub {
  font-size: 17px;
  color: var(--muted-foreground);
  margin: 14px auto 0;
  max-width: 50ch;
  line-height: 1.6;
}

.hs-cta-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 32px;
  flex-wrap: wrap;
}

/* ── Footer ── */
.hs-footer { padding: 80px 0 0; }

.hs-footer-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 40px 56px;
}

.hs-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--border);
}

.hs-footer-brand { display: flex; flex-direction: column; gap: 0; }

.hs-footer-tagline {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 16px 0 0;
  max-width: 34ch;
  line-height: 1.6;
}

.hs-footer-quote {
  font-family: var(--font-brand);
  font-style: italic;
  font-size: 15px;
  color: var(--muted-foreground);
  margin-top: 18px;
}

.hs-footer-col {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.hs-footer-col-head {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 5px;
}

.hs-footer-col a { font-size: 14px; }

.hs-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.hs-footer-legal {
  padding-top: 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted-foreground);
  opacity: 0.7;
  max-width: 720px;
}

.hs-footer-ver { font-family: var(--font-mono); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .hs-hero-inner {
    grid-template-columns: 1fr;
    padding: 60px 40px 60px;
  }
  .hs-hero-screen { display: none; }
  .hs-hero-h1 { font-size: 48px; }

  .hs-feature-row {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 80px;
  }
  .hs-feature-row-reverse .hs-feature-text { order: 0; }
  .hs-feature-row-reverse .hs-feature-media { order: 0; }

  .hs-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .hs-nav { padding: 0 20px; gap: 16px; }
  .hs-nav-links { display: none; }
  .hs-hero-inner { padding: 48px 20px 48px; }
  .hs-hero-h1 { font-size: 36px; }
  .hs-section { padding: 80px 0 0; }
  .hs-section-inner, .hs-compare-inner, .hs-quickstart-inner, .hs-cta-inner { padding: 0 20px; }
  .hs-section-h2 { font-size: 30px; }
  .hs-quickstart-grid { grid-template-columns: 1fr; }
  .hs-cta-card { padding: 48px 24px; }
  .hs-cta-h2 { font-size: 28px; }
  .hs-footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
  .hs-gallery { flex-direction: column; align-items: center; }
}
</style>
