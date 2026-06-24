import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { AppFrame } from './AppFrame'
import { Button } from '@/components/ui/button'
import { APP_URL, DOCS_URL, GITHUB_URL, DISCORD_URL, clerkEnabled } from '@/lib/utils'
import './home.css'

const accent = '#e0654a'

interface CompareRow {
  label: string
  base: string
  absIcon: string | null
  absColor?: string
}

// Every row is verified against current source in both projects. The Audiobookshelf
// column reflects what its web client actually ships; rows where both are equal
// (mini player, sleep timer, bookmarks, speed, chapters) are intentionally left
// out because they aren't differentiators.
const compareRows: CompareRow[] = [
  { label: 'Warm "hearth" design with themes & accent presets', base: 'One fixed dark theme', absIcon: null },
  { label: 'Cover-art glow that tints the whole interface', base: 'Share pages only', absIcon: null },
  { label: 'Immersive full-screen player view', base: 'Mini bar + dialogs', absIcon: null },
  { label: 'Ebook reader woven into the same player', base: 'Separate reader', absIcon: null },
  { label: 'QuestGiver — AI next-listen recommender', base: '—', absIcon: 'remove', absColor: 'var(--hs-muted-foreground)' },
  { label: 'Discover shelves you tune with thumbs up / down', base: 'Discover shelf, no feedback', absIcon: null },
  { label: 'ReadMeABook request tracking (bring your own backend)', base: '—', absIcon: 'remove', absColor: 'var(--hs-muted-foreground)' },
  { label: 'Same library, files & API — nothing to migrate', base: 'Yes', absIcon: 'check_circle', absColor: 'var(--hs-muted-foreground)' },
  { label: 'Self-hosted — your data, your hardware', base: 'Yes', absIcon: 'check_circle', absColor: 'var(--hs-muted-foreground)' },
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

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export function Home() {
  const [copied, setCopied] = useState(false)

  const copyCompose = () => {
    navigator.clipboard.writeText(composeText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="hs-home dark"
      style={{ '--primary': accent, '--ring': accent, '--glow-accent': accent } as React.CSSProperties}
    >
      {/* NAV */}
      <nav className="hs-nav">
        <a href="#top" className="hs-nav-logo">
          <img className="hs-logo-icon" src="/flame.png" alt="" />
          <span className="hs-wordmark">
            <span className="hs-hearth">Hearth</span>
            <span className="hs-shelf">Shelf</span>
          </span>
        </a>
        <div className="hs-nav-links">
          <a className="navlink" href="#features">Features</a>
          <a className="navlink" href="#compare">Compare</a>
          <a className="navlink" href="#gallery">Screenshots</a>
          <a className="navlink" href={DOCS_URL}>Docs</a>
        </div>
        <div className="hs-nav-right">
          <a
            className="navlink hs-github-star"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener"
            aria-label="HearthShelf on GitHub"
          >
            <GitHubIcon />
            GitHub
          </a>
          {clerkEnabled ? (
            <>
              <SignedOut>
                <Link className="navlink hs-login-link" to="/sign-in">Log in</Link>
                <Link className="hs-btn hs-btn-primary hs-btn-sm" to="/sign-up">Sign up</Link>
              </SignedOut>
              <SignedIn>
                <a className="hs-btn hs-btn-primary hs-btn-sm" href={APP_URL}>
                  <span className="ms fill">rocket_launch</span>Open HearthShelf
                </a>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          ) : (
            <>
              <a className="navlink hs-login-link" href={`${APP_URL}/sign-in`}>Log in</a>
              <a className="hs-btn hs-btn-primary hs-btn-sm" href={`${APP_URL}/sign-up`}>Sign up</a>
            </>
          )}
        </div>
      </nav>

      <div id="top" />

      {/* HERO */}
      <header className="hs-hero">
        <div className="hs-hero-glow" />
        <div className="hs-hero-inner">
          <div className="hs-hero-text">
            <div className="hs-eyebrow-badge">
              <span className="ms fill" style={{ fontSize: 15, color: 'var(--brand-hearth)' }}>bolt</span>
              A warmer home for Audiobookshelf
            </div>
            <h1 className="hs-hero-h1">Your whole library, in one warm place.</h1>
            <p className="hs-hero-sub">
              A single pane of glass for your self-hosted audiobooks and ebooks. HearthShelf keeps everything
              Audiobookshelf does well and rehouses it in an interface you'll actually want to open at night.
            </p>
            <div className="hs-hero-actions">
              <Button variant="primary" size="lg" href="#quickstart">
                <span className="ms fill">rocket_launch</span>Deploy with Docker
              </Button>
              <Button variant="pill" size="lg" href={`${DOCS_URL}/guide/what-is-hearthshelf`}>
                <span className="ms fill">menu_book</span>Read the docs
              </Button>
            </div>
            <div className="hs-hero-stats">
              <div className="hs-stat">
                <div className="hs-stat-num">100%</div>
                <div className="hs-stat-label">Self-hosted</div>
              </div>
              <div className="hs-stat">
                <div className="hs-stat-num">AGPL v3</div>
                <div className="hs-stat-label">Open source</div>
              </div>
              <div className="hs-stat">
                <div className="hs-stat-num">1</div>
                <div className="hs-stat-label">Docker command</div>
              </div>
            </div>
          </div>
          <div className="hs-hero-screen">
            <div className="hs-hero-frame-wrap">
              <AppFrame screen="library" scale={0.72} accent={accent} live />
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="hs-section">
        <div className="hs-section-inner">
          <div className="hs-section-header">
            <div className="hs-eyebrow">Why HearthShelf</div>
            <h2 className="hs-section-h2">Built for the way you actually listen — and read.</h2>
          </div>

          <div className="hs-feature-row">
            <div className="hs-feature-text">
              <span className="hs-feature-icon"><span className="ms fill">blur_on</span></span>
              <h3 className="hs-feature-h3">The room glows with the story.</h3>
              <p className="hs-feature-p">
                Every cover carries its own color. When a title plays, that hue blooms softly from the top of the page
                and tints the controls — so the interface quietly takes on the mood of whatever you're in. No themes to
                pick. Color flows from the art.
              </p>
              <ul className="hs-check-list">
                <li><span className="ms fill">check_circle</span>Dynamic accent from cover artwork</li>
                <li><span className="ms fill">check_circle</span>Typeset covers when artwork is missing</li>
                <li><span className="ms fill">check_circle</span>Tunable glow intensity, light &amp; dark</li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="player" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row hs-feature-row-reverse">
            <div className="hs-feature-text">
              <span className="hs-feature-icon"><span className="ms fill">graphic_eq</span></span>
              <h3 className="hs-feature-h3">An immersive player, not a toolbar.</h3>
              <p className="hs-feature-p">
                A persistent bar for quick control, and a two-pane immersive view when you want to settle in — cover,
                chapters, sleep timer, and speed, all without leaving the page. Chapters slide in inline; nothing gets
                in your way.
              </p>
              <ul className="hs-check-list">
                <li><span className="ms fill">check_circle</span>Inline chapter list &amp; jump-to</li>
                <li><span className="ms fill">check_circle</span>Variable speed, sleep timer, bookmarks</li>
                <li><span className="ms fill">check_circle</span>Resume across every device</li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="player" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row">
            <div className="hs-feature-text">
              <span className="hs-feature-icon"><span className="ms fill">insights</span></span>
              <h3 className="hs-feature-h3">Stats worth opening the app for.</h3>
              <p className="hs-feature-p">
                Hours listened, books finished, and a six-month heatmap of your listening — laid out so the picture is
                clear at a glance. Your numbers stay on your hardware, never a third party's.
              </p>
              <ul className="hs-check-list">
                <li><span className="ms fill">check_circle</span>Weekly bars &amp; a six-month listening heatmap</li>
                <li><span className="ms fill">check_circle</span>Your most-listened books, ranked</li>
                <li><span className="ms fill">check_circle</span>Private by default — your data, your box</li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="stats" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row hs-feature-row-reverse">
            <div className="hs-feature-text">
              <span className="hs-feature-icon"><span className="ms fill">menu_book</span></span>
              <h3 className="hs-feature-h3">Reader and player, side by side.</h3>
              <p className="hs-feature-p">
                A full immersive ebook reader, built in. Choose your theme — dark, sepia, light, or paper — adjust type
                size, font, and spacing, then settle in. If the book has both audio and an ebook, one tap jumps you to
                roughly where the narration has reached, so you can switch between listening and reading without losing
                your place.
              </p>
              <ul className="hs-check-list">
                <li><span className="ms fill">check_circle</span>Four reading themes including sepia &amp; dark</li>
                <li><span className="ms fill">check_circle</span>Adjustable typeface, size, line height &amp; margins</li>
                <li><span className="ms fill">check_circle</span>Jump to the audio's spot without leaving the page</li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="reader" scale={0.5} accent={accent} />
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" className="hs-section">
        <div className="hs-compare-inner">
          <div className="hs-section-header">
            <div className="hs-eyebrow">Same engine, warmer room</div>
            <h2 className="hs-section-h2">HearthShelf vs. vanilla Audiobookshelf</h2>
            <p className="hs-compare-sub">
              HearthShelf isn't a replacement — it's an alternative front-end for the server you already run. Same
              library, same files, same API, nothing to migrate. Audiobookshelf already does the essentials well;
              HearthShelf rehouses them in a warmer interface and adds a few things of its own.
            </p>
          </div>
          <div className="hs-compare-table">
            <div className="hs-compare-header">
              <span />
              <span className="hs-compare-col-head hs-compare-col-abs">Audiobookshelf</span>
              <span className="hs-compare-col-head hs-compare-col-hs">
                <span className="ms fill" style={{ fontSize: 17, color: 'var(--brand-hearth)' }}>local_fire_department</span>
                HearthShelf
              </span>
            </div>
            {compareRows.map((row) => (
              <div key={row.label} className="hs-compare-row">
                <span className="hs-compare-label">{row.label}</span>
                <span className="hs-compare-base">
                  {row.absIcon ? (
                    <span className="ms fill" style={{ color: row.absColor, fontSize: 20 }}>{row.absIcon}</span>
                  ) : (
                    <span>{row.base}</span>
                  )}
                </span>
                <span className="hs-compare-hs">
                  <span className="ms fill" style={{ color: 'var(--primary)', fontSize: 20 }}>check_circle</span>
                </span>
              </div>
            ))}
            <div className="hs-compare-footer">
              <span className="ms" style={{ fontSize: 17 }}>info</span>
              HearthShelf connects to your existing Audiobookshelf server — same library, same files, nothing to
              migrate.
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="hs-section">
        <div className="hs-section-inner">
          <div className="hs-section-header">
            <div className="hs-eyebrow">A look around</div>
            <h2 className="hs-section-h2">Every screen, reconsidered.</h2>
            <p className="hs-compare-sub">
              A tour of the interface — the library, the immersive player, the built-in reader, and your listening
              stats.
            </p>
          </div>
          <div className="hs-gallery hs-gallery-4">
            <div className="hs-gallery-item">
              <AppFrame screen="library" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption"><strong>Library</strong> · your whole collection</div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="player" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption"><strong>Player</strong> · immersive, cover-lit</div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="reader" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption"><strong>Reader</strong> · books &amp; read-along</div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="stats" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption"><strong>Stats</strong> · top books &amp; weekly listening</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICKSTART */}
      <section id="quickstart" className="hs-section">
        <div className="hs-quickstart-inner">
          <div className="hs-section-header">
            <div className="hs-eyebrow">Up in two minutes</div>
            <h2 className="hs-section-h2">Self-host it with one command.</h2>
          </div>
          <div className="hs-quickstart-grid">
            <div className="hs-steps">
              {steps.map((step) => (
                <div key={step.n} className="hs-step">
                  <span className="hs-step-num">{step.n}</span>
                  <div>
                    <div className="hs-step-title">{step.title}</div>
                    <div className="hs-step-body">{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hs-code-card">
              <div className="hs-code-header">
                <span className="ms" style={{ fontSize: 18, color: 'var(--hs-muted-foreground)' }}>description</span>
                <span className="hs-code-filename">docker-compose.yml</span>
                <button className="hs-copy-btn" onClick={copyCompose}>
                  <span className="ms" style={{ fontSize: 16 }}>content_copy</span>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="hs-code-pre">
<span className="hs-yaml-key">services:</span>{'\n'}  <span className="hs-yaml-val">hearthshelf:</span>{'\n'}    <span className="hs-yaml-key">image:</span> ghcr.io/hearthshelf/hearthshelf:latest{'\n'}    <span className="hs-yaml-key">container_name:</span> hearthshelf{'\n'}    <span className="hs-yaml-key">ports:</span>{'\n'}      - <span className="hs-yaml-str">"8200:80"</span>{'\n'}    <span className="hs-yaml-key">volumes:</span>{'\n'}      - ./config:/config{'\n'}      - ./metadata:/metadata{'\n'}      - <span className="hs-yaml-str">/path/to/audiobooks</span>:/audiobooks{'\n'}    <span className="hs-yaml-key">environment:</span>{'\n'}      - TZ=America/New_York{'\n'}    <span className="hs-yaml-key">restart:</span> unless-stopped</pre>
              <div className="hs-code-footer">
                <span className="hs-prompt">$</span>
                <span className="hs-cmd">docker compose up -d</span>
                <a className="hs-btn hs-btn-pill hs-btn-sm" href={`${DOCS_URL}/setup/docker`} style={{ marginLeft: 'auto' }}>
                  Full install guide<span className="ms">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="hs-section">
        <div className="hs-cta-inner">
          <div className="hs-cta-card">
            <div className="hs-cta-glow" />
            <div className="hs-cta-body">
              <img className="hs-cta-icon" src="/flame.png" alt="" />
              <h2 className="hs-cta-h2">Bring your library home.</h2>
              <p className="hs-cta-sub">
                Free and open source, yours to run forever. Point it at your own Audiobookshelf server and open the
                door.
              </p>
              <div className="hs-cta-actions">
                <Button variant="primary" size="lg" href="#quickstart">
                  <span className="ms fill">rocket_launch</span>Deploy with Docker
                </Button>
                <Button variant="pill" size="lg" href={GITHUB_URL} target="_blank">
                  <span className="ms fill">star</span>Star on GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hs-footer">
        <div className="hs-footer-inner">
          <div className="hs-footer-grid">
            <div className="hs-footer-brand">
              <a href="#top" className="hs-nav-logo">
                <img className="hs-logo-icon" src="/flame.png" alt="" />
                <span className="hs-wordmark">
                  <span className="hs-hearth">Hearth</span>
                  <span className="hs-shelf">Shelf</span>
                </span>
              </a>
              <p className="hs-footer-tagline">
                A calmer, self-hosted web client for your audiobook and ebook library.
              </p>
              <div className="hs-footer-quote">"the only light the glow of the story itself."</div>
            </div>
            <div className="hs-footer-col">
              <div className="hs-footer-col-head">Product</div>
              <a className="navlink" href="#features">Features</a>
              <a className="navlink" href="#compare">Compare</a>
              <a className="navlink" href="#gallery">Screenshots</a>
              <a className="navlink" href="#quickstart">Self-host</a>
            </div>
            <div className="hs-footer-col">
              <div className="hs-footer-col-head">Resources</div>
              <a className="navlink" href={`${DOCS_URL}/guide/what-is-hearthshelf`}>Documentation</a>
              <a className="navlink" href={`${DOCS_URL}/setup/docker`}>Installation</a>
              <a className="navlink" href={GITHUB_URL} target="_blank">GitHub</a>
              <a className="navlink" href={`${DOCS_URL}/`}>Changelog</a>
            </div>
            <div className="hs-footer-col">
              <div className="hs-footer-col-head">Community</div>
              <a className="navlink" href={DISCORD_URL} target="_blank">Discord</a>
            </div>
          </div>
          <div className="hs-footer-bottom">
            <span>© 2026 HearthShelf · AGPL v3 · Not affiliated with Audiobookshelf</span>
            <span className="hs-footer-ver">v0.9.2</span>
          </div>
          <div className="hs-footer-legal">
            HearthShelf is a user interface. It does not host, source, or distribute content. You are responsible for
            the legality of the content you add and the backends you connect.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
