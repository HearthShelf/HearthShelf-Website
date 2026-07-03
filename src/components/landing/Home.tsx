import { useState } from 'react'
import { AppFrame } from './AppFrame'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { Button } from '@/components/ui/button'
import { APP_URL, DOCS_URL, GITHUB_URL } from '@/lib/utils'
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
  {
    label: 'Warm "hearth" design with themes & accent presets',
    base: 'One fixed dark theme',
    absIcon: null,
  },
  {
    label: 'Cover-art glow that tints the whole interface',
    base: 'Share pages only',
    absIcon: null,
  },
  { label: 'Immersive full-screen player view', base: 'Mini bar + dialogs', absIcon: null },
  { label: 'Ebook reader woven into the same player', base: 'Separate reader', absIcon: null },
  {
    label: 'QuestGiver — AI next-listen recommender',
    base: '—',
    absIcon: 'remove',
    absColor: 'var(--hs-muted-foreground)',
  },
  {
    label: 'Discover shelves you tune with thumbs up / down',
    base: 'Discover shelf, no feedback',
    absIcon: null,
  },
  {
    label: 'ReadMeABook request tracking (bring your own backend)',
    base: '—',
    absIcon: 'remove',
    absColor: 'var(--hs-muted-foreground)',
  },
  {
    label: 'Same library, files & API — nothing to migrate',
    base: 'Yes',
    absIcon: 'check_circle',
    absColor: 'var(--hs-muted-foreground)',
  },
  {
    label: 'Self-hosted — your data, your hardware',
    base: 'Yes',
    absIcon: 'check_circle',
    absColor: 'var(--hs-muted-foreground)',
  },
]

const steps = [
  {
    n: 1,
    title: 'Install',
    body: 'Drop the compose file, point the audiobooks volume at your library, and run docker compose up -d. The all-in-one image bundles Audiobookshelf.',
  },
  {
    n: 2,
    title: 'Forward a port',
    body: 'Want it from anywhere? Forward one port and HearthShelf gets a free, secure web address on its own — no domain, no certificate wrangling.',
  },
  {
    n: 3,
    title: 'Run the setup wizard',
    body: 'Open it in your browser, follow the first-run wizard, and start listening. Just like standing up a new Plex server.',
  },
]

// The all-in-one image bundles Audiobookshelf, so this one file is a complete
// server — no separate ABS to run. Already have your own Audiobookshelf? The
// slim image points at it instead; see the docs linked below.
const composeText = `services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf-aio:latest
    container_name: hearthshelf
    ports:
      - "9277:80"
    volumes:
      - ./audiobooks:/audiobooks
      - ./config:/config
      - ./metadata:/metadata
      - ./hearthshelf-data:/app/data
    restart: unless-stopped`

// Same all-in-one container as the compose file, as a single command.
const dockerRunText = `docker run -d --name hearthshelf \\
  -p 9277:80 \\
  -v ./audiobooks:/audiobooks \\
  -v ./config:/config \\
  -v ./metadata:/metadata \\
  -v ./hearthshelf-data:/app/data \\
  --restart unless-stopped \\
  ghcr.io/hearthshelf/hearthshelf-aio:latest`

type InstallTab = 'compose' | 'run' | 'unraid'

const installTabs: { id: InstallTab; label: string; icon: string }[] = [
  { id: 'compose', label: 'Compose', icon: 'description' },
  { id: 'run', label: 'Docker run', icon: 'terminal' },
  { id: 'unraid', label: 'Unraid', icon: 'dns' },
]

export function Home() {
  const [copied, setCopied] = useState(false)
  const [installTab, setInstallTab] = useState<InstallTab>('compose')

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="hs-home dark"
      style={
        { '--primary': accent, '--ring': accent, '--glow-accent': accent } as React.CSSProperties
      }
    >
      {/* NAV */}
      <SiteHeader />

      <div id="top" />

      {/* HERO */}
      <header className="hs-hero">
        <div className="hs-hero-glow" />
        <div className="hs-hero-inner">
          <div className="hs-hero-text">
            <div className="hs-eyebrow-badge">
              <span className="ms fill" style={{ fontSize: 15, color: 'var(--brand-hearth)' }}>
                bolt
              </span>
              A warmer home for Audiobookshelf
            </div>
            <h1 className="hs-hero-h1">Your whole library, in one warm place.</h1>
            <p className="hs-hero-sub">
              A single pane of glass for your self-hosted audiobooks and ebooks. HearthShelf keeps
              everything Audiobookshelf does well and rehouses it in an interface you'll actually
              want to open at night.
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
              <span className="hs-feature-icon">
                <span className="ms fill">blur_on</span>
              </span>
              <h3 className="hs-feature-h3">The room glows with the story.</h3>
              <p className="hs-feature-p">
                Every cover carries its own color. When a title plays, that hue blooms softly from
                the top of the page and tints the controls — so the interface quietly takes on the
                mood of whatever you're in. No themes to pick. Color flows from the art.
              </p>
              <ul className="hs-check-list">
                <li>
                  <span className="ms fill">check_circle</span>Dynamic accent from cover artwork
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Typeset covers when artwork is
                  missing
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Tunable glow intensity, light &amp;
                  dark
                </li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="player" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row hs-feature-row-reverse">
            <div className="hs-feature-text">
              <span className="hs-feature-icon">
                <span className="ms fill">graphic_eq</span>
              </span>
              <h3 className="hs-feature-h3">An immersive player, not a toolbar.</h3>
              <p className="hs-feature-p">
                A persistent bar for quick control, and a two-pane immersive view when you want to
                settle in — cover, chapters, sleep timer, and speed, all without leaving the page.
                Chapters slide in inline; nothing gets in your way.
              </p>
              <ul className="hs-check-list">
                <li>
                  <span className="ms fill">check_circle</span>Inline chapter list &amp; jump-to
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Variable speed, sleep timer,
                  bookmarks
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Resume across every device
                </li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="player" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row">
            <div className="hs-feature-text">
              <span className="hs-feature-icon">
                <span className="ms fill">insights</span>
              </span>
              <h3 className="hs-feature-h3">Stats worth opening the app for.</h3>
              <p className="hs-feature-p">
                Hours listened, books finished, and a six-month heatmap of your listening — laid out
                so the picture is clear at a glance. Your numbers stay on your hardware, never a
                third party's.
              </p>
              <ul className="hs-check-list">
                <li>
                  <span className="ms fill">check_circle</span>Weekly bars &amp; a six-month
                  listening heatmap
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Your most-listened books, ranked
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Private by default — your data, your
                  box
                </li>
              </ul>
            </div>
            <div className="hs-feature-media">
              <AppFrame screen="stats" scale={0.5} accent={accent} />
            </div>
          </div>

          <div className="hs-feature-row hs-feature-row-reverse">
            <div className="hs-feature-text">
              <span className="hs-feature-icon">
                <span className="ms fill">menu_book</span>
              </span>
              <h3 className="hs-feature-h3">Reader and player, side by side.</h3>
              <p className="hs-feature-p">
                A full immersive ebook reader, built in. Choose your theme — dark, sepia, light, or
                paper — adjust type size, font, and spacing, then settle in. If the book has both
                audio and an ebook, one tap jumps you to roughly where the narration has reached, so
                you can switch between listening and reading without losing your place.
              </p>
              <ul className="hs-check-list">
                <li>
                  <span className="ms fill">check_circle</span>Four reading themes including sepia
                  &amp; dark
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Adjustable typeface, size, line
                  height &amp; margins
                </li>
                <li>
                  <span className="ms fill">check_circle</span>Jump to the audio's spot without
                  leaving the page
                </li>
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
              HearthShelf isn't a replacement — it's an alternative front-end for the server you
              already run. Same library, same files, same API, nothing to migrate. Audiobookshelf
              already does the essentials well; HearthShelf rehouses them in a warmer interface and
              adds a few things of its own.
            </p>
          </div>
          <div className="hs-compare-table">
            <div className="hs-compare-header">
              <span />
              <span className="hs-compare-col-head hs-compare-col-abs">Audiobookshelf</span>
              <span className="hs-compare-col-head hs-compare-col-hs">
                <span className="ms fill" style={{ fontSize: 17, color: 'var(--brand-hearth)' }}>
                  local_fire_department
                </span>
                HearthShelf
              </span>
            </div>
            {compareRows.map((row) => (
              <div key={row.label} className="hs-compare-row">
                <span className="hs-compare-label">{row.label}</span>
                <span className="hs-compare-base">
                  {row.absIcon ? (
                    <span className="ms fill" style={{ color: row.absColor, fontSize: 20 }}>
                      {row.absIcon}
                    </span>
                  ) : (
                    <span>{row.base}</span>
                  )}
                </span>
                <span className="hs-compare-hs">
                  <span className="ms fill" style={{ color: 'var(--primary)', fontSize: 20 }}>
                    check_circle
                  </span>
                </span>
              </div>
            ))}
            <div className="hs-compare-footer">
              <span className="ms" style={{ fontSize: 17 }}>
                info
              </span>
              HearthShelf connects to your existing Audiobookshelf server — same library, same
              files, nothing to migrate.
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
              A tour of the interface — the library, the immersive player, the built-in reader, and
              your listening stats.
            </p>
          </div>
          <div className="hs-gallery hs-gallery-4">
            <div className="hs-gallery-item">
              <AppFrame screen="library" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption">
                <strong>Library</strong> · your whole collection
              </div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="player" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption">
                <strong>Player</strong> · immersive, cover-lit
              </div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="reader" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption">
                <strong>Reader</strong> · books &amp; read-along
              </div>
            </div>
            <div className="hs-gallery-item">
              <AppFrame screen="stats" scale={0.42} accent={accent} />
              <div className="hs-gallery-caption">
                <strong>Stats</strong> · top books &amp; weekly listening
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SURFACES */}
      <section id="apps" className="hs-section">
        <div className="hs-section-inner">
          <div className="hs-section-header">
            <div className="hs-eyebrow">Listen anywhere</div>
            <h2 className="hs-section-h2">One library, on every screen you own.</h2>
            <p className="hs-compare-sub">
              Run HearthShelf yourself and open it in any browser. Add the free hosted front door for
              one sign-in across every server, and take it on the road with the native mobile app —
              Android Auto included.
            </p>
          </div>
          <div className="hs-surfaces-grid">
            <div className="hs-surface-card">
              <span className="hs-feature-icon">
                <span className="ms fill">public</span>
              </span>
              <h3 className="hs-feature-h3">Web</h3>
              <p className="hs-feature-p">
                The full experience in your browser, served straight from your own container. This is
                the app the rest of this page is showing.
              </p>
              <a className="hs-btn hs-btn-pill hs-btn-sm" href="#quickstart">
                Self-host it<span className="ms">arrow_forward</span>
              </a>
            </div>
            <div className="hs-surface-card">
              <span className="hs-feature-icon">
                <span className="ms fill">directions_car</span>
              </span>
              <h3 className="hs-feature-h3">
                Mobile <span className="hs-tag">Android · beta</span>
              </h3>
              <p className="hs-feature-p">
                A native Android app with <strong>Android Auto</strong> so your books play on the car
                screen. Sideload the beta today; iOS is on the way.
              </p>
              <a className="hs-btn hs-btn-pill hs-btn-sm" href={`${DOCS_URL}/mobile/overview`}>
                Get the app<span className="ms">arrow_forward</span>
              </a>
            </div>
            <div className="hs-surface-card">
              <span className="hs-feature-icon">
                <span className="ms fill">cloud</span>
              </span>
              <h3 className="hs-feature-h3">Hosted front door</h3>
              <p className="hs-feature-p">
                Sign in once at app.hearthshelf.com and reach every server you've been invited to —
                no IPs to remember, and your Audiobookshelf can stay behind the firewall.
              </p>
              <a className="hs-btn hs-btn-pill hs-btn-sm" href={APP_URL}>
                Open the WebApp<span className="ms">arrow_forward</span>
              </a>
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
            <p className="hs-compare-sub">
              The all-in-one image bundles Audiobookshelf, so this is a complete server in a single
              container. Already run your own Audiobookshelf? The{' '}
              <a href={`${DOCS_URL}/setup/docker`}>slim image</a> points HearthShelf at it instead.
            </p>
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
              <div className="hs-code-tabs" role="tablist">
                {installTabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={installTab === tab.id}
                    className={`hs-code-tab${installTab === tab.id ? ' is-active' : ''}`}
                    onClick={() => setInstallTab(tab.id)}
                  >
                    <span className="ms" style={{ fontSize: 16 }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
                {installTab !== 'unraid' && (
                  <button
                    className="hs-copy-btn"
                    onClick={() => copyText(installTab === 'compose' ? composeText : dockerRunText)}
                  >
                    <span className="ms" style={{ fontSize: 16 }}>
                      content_copy
                    </span>
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {installTab === 'compose' && (
                <>
                  <pre className="hs-code-pre">
                    <span className="hs-yaml-key">services:</span>
                    {'\n'} <span className="hs-yaml-val">hearthshelf:</span>
                    {'\n'} <span className="hs-yaml-key">image:</span>{' '}
                    ghcr.io/hearthshelf/hearthshelf-aio:latest{'\n'}{' '}
                    <span className="hs-yaml-key">container_name:</span> hearthshelf{'\n'}{' '}
                    <span className="hs-yaml-key">ports:</span>
                    {'\n'} - <span className="hs-yaml-str">"9277:80"</span>
                    {'\n'} <span className="hs-yaml-key">volumes:</span>
                    {'\n'} - ./audiobooks:/audiobooks{'\n'} - ./config:/config{'\n'} -
                    ./metadata:/metadata{'\n'} - ./hearthshelf-data:/app/data{'\n'}{' '}
                    <span className="hs-yaml-key">restart:</span> unless-stopped
                  </pre>
                  <div className="hs-code-footer">
                    <span className="hs-prompt">$</span>
                    <span className="hs-cmd">docker compose up -d</span>
                    <a
                      className="hs-btn hs-btn-pill hs-btn-sm"
                      href={`${DOCS_URL}/setup/all-in-one`}
                      style={{ marginLeft: 'auto' }}
                    >
                      Full install guide<span className="ms">arrow_forward</span>
                    </a>
                  </div>
                </>
              )}

              {installTab === 'run' && (
                <>
                  <pre className="hs-code-pre">
                    <span className="hs-prompt">$</span> docker run -d --name hearthshelf \{'\n'} -p{' '}
                    <span className="hs-yaml-str">9277:80</span> \{'\n'} -v
                    ./audiobooks:/audiobooks \{'\n'} -v ./config:/config \{'\n'} -v
                    ./metadata:/metadata \{'\n'} -v ./hearthshelf-data:/app/data \{'\n'} --restart
                    unless-stopped \{'\n'} ghcr.io/hearthshelf/hearthshelf-aio:latest
                  </pre>
                  <div className="hs-code-footer">
                    <span className="hs-cmd" style={{ color: 'var(--muted-foreground)' }}>
                      One line, same all-in-one container as the compose file.
                    </span>
                    <a
                      className="hs-btn hs-btn-pill hs-btn-sm"
                      href={`${DOCS_URL}/setup/all-in-one`}
                      style={{ marginLeft: 'auto' }}
                    >
                      Full install guide<span className="ms">arrow_forward</span>
                    </a>
                  </div>
                </>
              )}

              {installTab === 'unraid' && (
                <div className="hs-unraid-panel">
                  <span className="hs-tag">Coming soon</span>
                  <p>
                    HearthShelf is headed to the <strong>Unraid Community Apps</strong> catalog — both
                    the all-in-one and slim images — so you can install it from Unraid's own UI with a
                    couple of clicks. The templates are ready; they'll publish once the build reaches a
                    more feature-complete release.
                  </p>
                  <p className="hs-unraid-hint">
                    Until then, use the Compose or Docker run tab. Running Unraid today? The Docker run
                    command works from Unraid's Docker page.
                  </p>
                </div>
              )}
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
                Free and open source, yours to run forever. Point it at your own Audiobookshelf
                server and open the door.
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
      <SiteFooter />
    </div>
  )
}

export default Home
