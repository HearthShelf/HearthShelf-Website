import { useEffect, useMemo, useRef, useState } from 'react'
import './AppFrame.css'

type Screen = 'library' | 'player' | 'reader' | 'stats'

interface AppFrameProps {
  screen?: Screen
  scale?: number
  accent?: string
  /** Auto-advance the progress bar (used for the hero). */
  live?: boolean
}

interface Book {
  title: string
  author: string
  cv: string
  progress: number
  finished: boolean
  ebook: boolean
  audio: boolean
}

const VW = 1180
const VH = 760

const mk = (
  title: string,
  author: string,
  cv: string,
  progress = 0,
  finished = false,
  ebook = false,
  audio = true,
): Book => ({ title, author, cv, progress, finished, ebook, audio })

const books: Book[] = [
  mk('The Tide Between Us', 'Marian Holt', '#3f7d8c', 0.52, false, false, true),
  mk('Embers of the North', 'Cassian Vale', '#c4663a', 0, false, true, true),
  mk('Notes on Falling', 'Per Lindqvist', '#7fa86b', 0.74, false, false, true),
  mk('Redshift Country', 'Howard Mbeki', '#cc5b4a', 0.33, false, true, true),
  mk('Saltwater Saints', 'Imelda Reyes', '#4f9db0', 0.18, false, false, true),
  mk('A Geometry of Birds', 'Yuki Tanaka', '#9b6fb8', 0, false, true, false),
  mk('Quiet Machines', 'Dr. Nadia Osei', '#5e76c4', 1, true, false, true),
  mk("The Hollow Crown's Ash", 'Cassian Vale', '#a84738', 0, false, true, true),
  mk('Wavelength', 'Dr. Nadia Osei', '#4db6ac', 0.61, false, false, true),
  mk('The Far Meridian', 'Howard Mbeki', '#5566b8', 0, false, false, true),
]

const nowPlaying = books[0]
const chapterCount = 56
const chapterIndex = 29

const TOTAL_SECS = 13 * 3600 + 8 * 60
const CH_SECS = 11 * 60 + 38

const fmt = (s: number) => {
  s = Math.max(0, Math.round(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`
}

const speed = 1.4
const readerThemes = ['dark', 'sepia', 'light', 'paper'] as const
const readerTheme = 'sepia'

const user = { name: 'avery', host: 'books.home' }

type NavItem =
  | { id: string; icon: string; label: string; badge?: string }
  | { label2: string }
  | { sep: true }

const nav: NavItem[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'library', icon: 'grid_view', label: 'Library', badge: '312' },
  { label2: 'Shelves' },
  { id: 'collections', icon: 'folder_special', label: 'Collections' },
  { id: 'playlists', icon: 'queue_music', label: 'Playlists' },
  { label2: 'Insights' },
  { id: 'stats', icon: 'insights', label: 'Stats' },
  { id: 'history', icon: 'history', label: 'History' },
  { id: 'player', icon: 'graphic_eq', label: 'Now playing' },
  { sep: true },
  { id: 'questgiver', icon: 'favorite', label: 'QuestGiver' },
  { id: 'discover', icon: 'explore', label: 'Discover' },
  { sep: true },
  { id: 'settings', icon: 'settings', label: 'Settings' },
]

const libTabs = [
  { icon: 'grid_view', label: 'Books', n: 312, on: true },
  { icon: 'auto_stories', label: 'Series', n: 24, on: false },
  { icon: 'person', label: 'Authors', n: 96, on: false },
  { icon: 'mic', label: 'Narrators', n: 88, on: false },
]

const topBooks = [
  { title: 'The Tide Between Us', sub: 'Marian Holt · Saoirse Quinn', h: 42, rank: 1, cv: '#3f7d8c' },
  { title: 'Notes on Falling', sub: 'Per Lindqvist · Greta Holm', h: 27, rank: 2, cv: '#7fa86b' },
  { title: 'Redshift Country', sub: 'Howard Mbeki', h: 23, rank: 3, cv: '#cc5b4a' },
  { title: 'Wavelength', sub: 'Dr. Nadia Osei', h: 19, rank: 4, cv: '#4db6ac' },
  { title: 'Quiet Machines', sub: 'Dr. Nadia Osei', h: 15, rank: 5, cv: '#5e76c4' },
]

const week = [
  { d: 'Mon', v: 1.2, key: 'mo' },
  { d: 'Tue', v: 2.4, key: 'tu' },
  { d: 'Wed', v: 0.8, key: 'we' },
  { d: 'Thu', v: 3.1, key: 'th' },
  { d: 'Fri', v: 1.9, key: 'fr' },
  { d: 'Sat', v: 4.2, key: 'sa' },
  { d: 'Sun', v: 2.7, key: 'su' },
]
const weekMax = Math.max(...week.map((d) => d.v))
const hotIdx = week.reduce((m, d, i, a) => (d.v > a[m].v ? i : m), 0)

const urlLabels: Record<Screen, string> = {
  library: 'books.home / library',
  player: 'books.home / player',
  stats: 'books.home / stats',
  reader: 'books.home / read',
}

interface MenuState {
  open: boolean
  x: number
  y: number
  i: number
}

export function AppFrame({ screen = 'library', scale = 0.6, accent = '#e0654a', live = false }: AppFrameProps) {
  const scaledW = Math.round(VW * scale)
  const scaledH = Math.round(VH * scale)

  const [progress, setProgress] = useState(0.52)
  const [playing, setPlaying] = useState(live)
  const [menu, setMenu] = useState<MenuState>({ open: false, x: 0, y: 0, i: 0 })

  const menuBook = books[menu.i] || books[0]

  const screenAccent = screen === 'player' || screen === 'library' ? nowPlaying.cv : accent
  const glow = screen === 'player' ? 75 : 55

  const elapsedLabel = useMemo(() => fmt(progress * TOTAL_SECS), [progress])
  const remainLabel = useMemo(() => fmt((1 - progress) * TOTAL_SECS), [progress])
  const elapsedShort = useMemo(() => fmt(progress * CH_SECS), [progress])
  const remainShort = useMemo(() => fmt((1 - progress) * CH_SECS), [progress])

  // Live progress ticker (hero only).
  useEffect(() => {
    if (!live || !playing) return
    if (typeof document !== 'undefined' && document.hidden) return
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.004
        return next >= 0.99 ? 0.04 : next
      })
    }, 300)
    return () => clearInterval(timer)
  }, [live, playing])

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPlaying(false)
      else if (live) setPlaying(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [live])

  // Context menu open/close (library only).
  const mainRef = useRef<HTMLDivElement>(null)
  const openMenu = (e: React.MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    const main = (e.currentTarget as HTMLElement).closest('.af-main') as HTMLElement | null
    if (!main) return
    const rect = main.getBoundingClientRect()
    const sc = scale || 1
    const x = (e.clientX - rect.left) / sc
    const y = (e.clientY - rect.top) / sc
    const maxX = rect.width / sc - 232
    const maxY = rect.height / sc - 320
    setMenu({ open: true, x: Math.max(8, Math.min(x, maxX)), y: Math.max(8, Math.min(y, maxY)), i })
  }
  const closeMenu = () => setMenu((m) => ({ ...m, open: false }))

  useEffect(() => {
    if (!menu.open) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.af-ctx-menu')) closeMenu()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menu.open])

  const shellStyle = {
    '--primary': screenAccent,
    '--ring': screenAccent,
    '--glow-accent': screenAccent,
    '--glow-strength': glow,
    width: scaledW + 'px',
  } as React.CSSProperties

  const renderSidebar = () =>
    screen !== 'player' && (
      <aside className="af-sidebar">
        <div className="af-sidebar-logo">
          <img className="af-hearth-icon" src="/flame.png" alt="" />
          <span className="af-wordmark">
            <span className="af-wm-hearth">Hearth</span>
            <span className="af-wm-shelf">Shelf</span>
          </span>
        </div>
        <nav className="af-nav">
          {nav.map((item, i) => {
            if ('sep' in item) return <span key={`sep${i}`} className="af-nav-item"><span className="af-nav-sep" /></span>
            if ('label2' in item)
              return (
                <span key={item.label2} className="af-nav-item">
                  <span className="af-nav-label">{item.label2}</span>
                </span>
              )
            const active = item.id === screen
            return (
              <button key={item.id} className={`af-nav-item${active ? ' active' : ''}`} type="button">
                <span className={`ms${active ? ' fill' : ''}`}>{item.icon}</span>
                <span className="af-ni-text">{item.label}</span>
                {item.badge && <span className={`af-ni-badge${active ? ' active' : ''}`}>{item.badge}</span>}
              </button>
            )
          })}
        </nav>
        <div className="af-user-chip">
          <span className="af-sb-avatar">A</span>
          <span className="af-u-meta">
            <span className="af-u-name">{user.name}</span>
            <span className="af-u-sub">{user.host}</span>
          </span>
          <span className="ms af-u-chev">expand_less</span>
        </div>
      </aside>
    )

  return (
    <div className="af-shell dark" style={shellStyle}>
      {/* Browser chrome */}
      <div className="af-bar">
        <div className="af-dots">
          <span className="af-dot af-dot-r" />
          <span className="af-dot af-dot-y" />
          <span className="af-dot af-dot-g" />
        </div>
        <div className="af-url-bar">
          <span className="ms af-lock-icon">lock</span>
          <span>{urlLabels[screen]}</span>
        </div>
        <div style={{ width: 54 }} />
      </div>

      {/* Scaled viewport */}
      <div className="af-viewport" style={{ width: scaledW, height: scaledH }}>
        <div
          className="af-inner"
          style={{ width: VW, height: VH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {renderSidebar()}

          {/* ===== LIBRARY ===== */}
          {screen === 'library' && (
            <div className="af-main af-fade" ref={mainRef}>
              <div className="af-glow-bloom" />
              <div className="af-main-inner af-library-inner">
                <div className="af-lib-header">
                  <div>
                    <div className="af-eyebrow">Your collection</div>
                    <h1 className="af-page-title">
                      Audiobooks<span className="af-lib-count">312 of 312 books</span>
                    </h1>
                  </div>
                  <div className="af-lib-filters">
                    <span className="af-pill">
                      <span className="ms">filter_list</span>Filter
                    </span>
                    <span className="af-pill">
                      <span className="ms">swap_vert</span>Title
                    </span>
                  </div>
                </div>

                <div className="af-qv-tabs">
                  {libTabs.map((t) => (
                    <button key={t.label} className={`af-qv-tab${t.on ? ' on' : ''}`} type="button">
                      <span className={`ms${t.on ? ' fill' : ''}`}>{t.icon}</span>
                      <span>{t.label}</span>
                      <span className="af-qv-count">{t.n}</span>
                    </button>
                  ))}
                </div>

                <div className="af-book-grid">
                  {books.map((b, i) => (
                    <div key={b.title} className="af-book" onContextMenu={(e) => openMenu(e, i)}>
                      <div className="af-cover" style={{ background: b.cv }} data-finished={b.finished}>
                        {b.ebook && (
                          <div className={`af-cv-fmt${b.ebook && !b.audio ? ' af-cv-fmt-solo' : ''}`}>
                            <span className="ms fill">{b.ebook && !b.audio ? 'menu_book' : 'auto_stories'}</span>
                            {b.ebook && !b.audio && <span>Read</span>}
                          </div>
                        )}
                        {b.finished && (
                          <div className="af-finished-badge">
                            <span className="ms fill">check_circle</span>
                          </div>
                        )}
                        <div className="af-hover-actions" onClick={(e) => e.stopPropagation()}>
                          <span className="af-ha-btn" title="Add to list">
                            <span className="ms">playlist_add</span>
                          </span>
                          <span className="af-ha-play" title={b.ebook && !b.audio ? 'Read' : 'Play'}>
                            <span className="ms fill">{b.ebook && !b.audio ? 'menu_book' : 'play_arrow'}</span>
                          </span>
                          <span className="af-ha-btn" title={b.finished ? 'Mark not finished' : 'Mark finished'}>
                            <span className={`ms${b.finished ? ' fill' : ''}`}>check</span>
                          </span>
                        </div>
                        <div className="af-cover-text">
                          <div className="af-cover-title">{b.title}</div>
                          <div className="af-cover-author">{b.author}</div>
                        </div>
                      </div>
                      <div className="af-b-meta">
                        <div className="af-b-title">{b.title}</div>
                        <div className="af-b-author">{b.author}</div>
                        {b.progress > 0 && !b.finished && (
                          <div className="af-b-prog">
                            <i style={{ width: `${b.progress * 100}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Persistent play bar (mini player) */}
              <div className="af-playbar">
                <div className="af-pb-now">
                  <div className="af-pb-cover" style={{ background: nowPlaying.cv }} />
                  <div className="af-pb-meta">
                    <div className="af-pb-title">{nowPlaying.title}</div>
                    <div className="af-pb-sub">{nowPlaying.author}</div>
                  </div>
                </div>
                <div className="af-pb-center">
                  <div className="af-pb-controls">
                    <span className="ms af-pb-skip fill">skip_previous</span>
                    <span className="af-pb-skip">
                      <span className="ms">replay</span>
                      <small>15</small>
                    </span>
                    <span className="af-pb-play">
                      <span className="ms fill">{playing ? 'pause' : 'play_arrow'}</span>
                    </span>
                    <span className="af-pb-skip">
                      <span className="ms af-mirror">replay</span>
                      <small>30</small>
                    </span>
                    <span className="ms af-pb-skip fill">skip_next</span>
                  </div>
                  <div className="af-pb-time">
                    <span>{elapsedShort}</span>
                    <div className="af-scrub">
                      <i style={{ width: `${progress * 100}%` }} />
                      <b style={{ left: `${progress * 100}%` }} />
                    </div>
                    <span>-{remainShort}</span>
                  </div>
                </div>
                <div className="af-pb-right">
                  <span className="af-pill af-pb-speed">{speed}×</span>
                  <span className="af-icon-btn"><span className="ms">list</span></span>
                  <span className="af-icon-btn"><span className="ms">bookmark_border</span></span>
                  <span className="af-icon-btn"><span className="ms">bedtime</span></span>
                  <span className="af-icon-btn"><span className="ms">volume_up</span></span>
                </div>
              </div>

              {/* Right-click context menu */}
              {menu.open && (
                <div
                  className="af-ctx-menu"
                  style={{ left: menu.x, top: menu.y }}
                  onClick={(e) => e.stopPropagation()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="af-ctx-header">
                    <span className="af-ctx-title">{menuBook.title}</span>
                    <span className="af-ctx-author">{menuBook.author}</span>
                  </div>
                  <div className="af-ctx-divider" />
                  <button className="af-mp-item" type="button" onClick={closeMenu}>
                    <span className="ms">info</span>View details
                  </button>
                  {menuBook.audio && (
                    <button className="af-mp-item" type="button" onClick={closeMenu}>
                      <span className="ms fill">play_arrow</span>Play
                    </button>
                  )}
                  {menuBook.ebook && (
                    <button className="af-mp-item" type="button" onClick={closeMenu}>
                      <span className="ms fill">menu_book</span>Read
                    </button>
                  )}
                  <div className="af-ctx-divider" />
                  <button className="af-mp-item" type="button" onClick={closeMenu}>
                    <span className="ms">reorder</span>Add to queue
                  </button>
                  <button className="af-mp-item" type="button" onClick={closeMenu}>
                    <span className="ms">folder_special</span>Add to collection
                  </button>
                  <button className="af-mp-item" type="button" onClick={closeMenu}>
                    <span className="ms">queue_music</span>Add to playlist
                  </button>
                  <div className="af-ctx-divider" />
                  <button
                    className={`af-mp-item${menuBook.finished ? ' af-mp-on' : ''}`}
                    type="button"
                    onClick={closeMenu}
                  >
                    <span className={`ms${menuBook.finished ? ' fill' : ''}`}>check_circle</span>
                    {menuBook.finished ? 'Mark as unfinished' : 'Mark as finished'}
                  </button>
                  {menuBook.progress > 0 && !menuBook.finished && (
                    <button className="af-mp-item" type="button" onClick={closeMenu}>
                      <span className="ms">replay</span>Reset progress
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===== PLAYER ===== */}
          {screen === 'player' && (
            <div className="af-player af-fade">
              <div className="af-player-glow" />
              <div className="af-player-col">
                <div className="af-p-head">
                  <div className="af-p-head-title">
                    <div className="af-eyebrow">HearthShelf</div>
                    <h1 className="af-p-listening">Listening</h1>
                  </div>
                  <div className="af-p-head-pills">
                    <span className="af-pill af-sync-ok">
                      <span className="ms">cloud_done</span>Synced
                    </span>
                    <span className="af-pill">
                      <span className="ms">reorder</span>Queue
                    </span>
                  </div>
                </div>

                <div className="af-p-cover-wrap">
                  <div className="af-p-cover" style={{ background: nowPlaying.cv }}>
                    <div className="af-p-cover-text">
                      <div className="af-pct-title">{nowPlaying.title}</div>
                      <div className="af-pct-author">{nowPlaying.author}</div>
                    </div>
                  </div>
                  <div className="af-p-cover-prog">
                    <i style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>

                <div className="af-p-prog-row">
                  <div className="af-p-pct">
                    {Math.round(progress * 100)}
                    <small>%</small>
                  </div>
                  <div className="af-p-ch">
                    Ch {chapterIndex + 1} / {chapterCount}
                  </div>
                </div>

                <div className="af-prog-line">
                  <i style={{ width: `${progress * 100}%` }} />
                </div>
                <div className="af-p-times">
                  <span>{elapsedLabel} elapsed</span>
                  <span>{remainLabel} left</span>
                </div>

                <div className="af-p-primary">
                  <div className="af-p-primary-label">Full book</div>
                  <div className="af-scrub af-scrub-lg">
                    <i style={{ width: `${progress * 100}%` }} />
                    <b style={{ left: `${progress * 100}%` }} />
                  </div>
                  <div className="af-p-times">
                    <span>{elapsedLabel} elapsed</span>
                    <span>{remainLabel} left</span>
                  </div>
                </div>

                <div className="af-p-transport">
                  <span className="ms af-p-skip lite fill">skip_previous</span>
                  <span className="af-p-skip">
                    <span className="ms">replay</span>
                    <small>15</small>
                  </span>
                  <span className="af-p-play">
                    <span className="ms fill">{playing ? 'pause' : 'play_arrow'}</span>
                  </span>
                  <span className="af-p-skip">
                    <span className="ms af-mirror">replay</span>
                    <small>30</small>
                  </span>
                  <span className="ms af-p-skip lite fill">skip_next</span>
                </div>

                <div className="af-action-grid">
                  <span className="af-pill"><span className="ms">list</span>Chapters</span>
                  <span className="af-pill"><span className="ms">info</span>Book details</span>
                  <span className="af-pill"><span className="ms">speed</span>{speed}×</span>
                  <span className="af-pill"><span className="ms">bedtime</span>Sleep timer</span>
                  <span className="af-pill"><span className="ms">bookmark_add</span>Bookmark</span>
                  <span className="af-pill"><span className="ms">history</span>Recent listens</span>
                </div>
              </div>
            </div>
          )}

          {/* ===== READER ===== */}
          {screen === 'reader' && (
            <div className={`af-reader af-fade af-reader-${readerTheme}`}>
              <div className="af-reader-main">
                <div className="af-reader-topbar">
                  <button className="af-reader-back-btn" type="button">
                    <span className="ms">arrow_back</span>
                  </button>
                  <div className="af-reader-reading-info">
                    <span className="af-reader-eyebrow">Reading · Eira Sundqvist</span>
                    <span className="af-reader-book-title">Ashen Roads</span>
                  </div>
                  <div className="af-reader-topbar-right">
                    <button className="af-reader-btn" type="button">
                      <span className="ms">headphones</span>
                    </button>
                    <button className="af-reader-btn" type="button">
                      <span className="ms">list</span>Chapters
                    </button>
                    <button className="af-reader-btn af-reader-btn-aa" type="button">
                      Aa
                    </button>
                  </div>
                </div>
                <div className="af-reader-themes">
                  <span className="af-reader-themes-label">Theme</span>
                  {readerThemes.map((t) => (
                    <button
                      key={t}
                      className={`af-reader-theme-chip af-rt-${t}${readerTheme === t ? ' af-rt-active' : ''}`}
                      type="button"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="af-reader-body">
                  <div className="af-reader-content">
                    <div className="af-reader-chapter-eyebrow">Ashen Roads · Chapter 27 of 27</div>
                    <h2 className="af-reader-chapter-title">Chapter 27 · What the Tide Keeps</h2>
                    <div className="af-reader-rule" />
                    <p className="af-reader-para">
                      Nothing in the house had been moved and that was the worst of it; the chair still angled toward
                      the window, the book still open on the page, as though the room were waiting for a return that
                      the rest of them had stopped expecting.
                    </p>
                    <p className="af-reader-para">
                      There was a word in the old dialect for the light on water at dusk - not the light itself but the
                      way it made you feel that something had just left. She had never needed it before now.
                    </p>
                  </div>
                </div>
                <div className="af-reader-playerbar">
                  <div className="af-pb-cover" style={{ background: nowPlaying.cv }} />
                  <div className="af-pb-meta">
                    <div className="af-pb-title">{nowPlaying.title}</div>
                    <div className="af-pb-sub">{nowPlaying.author}</div>
                  </div>
                  <div className="af-reader-pb-controls">
                    <span className="ms">skip_previous</span>
                    <span className="af-reader-pb-play">
                      <span className="ms fill">{playing ? 'pause' : 'play_arrow'}</span>
                    </span>
                    <span className="ms">skip_next</span>
                  </div>
                  <div className="af-reader-progress-wrap">
                    <div className="af-scrub" style={{ height: 4 }}>
                      <i style={{ width: `${progress * 100}%` }} />
                    </div>
                    <div className="af-reader-pb-times">
                      <span>{elapsedLabel}</span>
                      <span>{remainLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== STATS ===== */}
          {screen === 'stats' && (
            <div className="af-main af-fade">
              <div className="af-glow-bloom af-glow-short" />
              <div className="af-main-inner af-stats-inner">
                <div className="af-eyebrow">Insights</div>
                <h1 className="af-page-title af-stats-title">Your stats</h1>

                <div className="af-hero-stat">
                  <div className="af-hero-label">Total listening time</div>
                  <div className="af-hero-num">
                    272<u>h</u>54<u>m</u>
                  </div>
                  <div className="af-hero-sub">across 48 books</div>
                </div>

                <div className="af-stat-tiles">
                  <div className="af-tile">
                    <div className="af-t-ico"><span className="ms">menu_book</span></div>
                    <div className="af-t-num">48</div>
                    <div className="af-t-cap">Books listened</div>
                  </div>
                  <div className="af-tile">
                    <div className="af-t-ico"><span className="ms">calendar_today</span></div>
                    <div className="af-t-num">156</div>
                    <div className="af-t-cap">Active days</div>
                  </div>
                  <div className="af-tile">
                    <div className="af-t-ico af-t-ico-hot"><span className="ms fill">local_fire_department</span></div>
                    <div className="af-t-num">42m</div>
                    <div className="af-t-cap">Today</div>
                  </div>
                </div>

                <div className="af-section-head">
                  <span className="ms">trending_up</span>Most listened to
                </div>
                <div className="af-chart-card">
                  {topBooks.map((b) => (
                    <div key={b.title} className="af-ml-row">
                      <span className="af-ml-rank">{b.rank}</span>
                      <span className="af-ml-cover" style={{ background: b.cv }} />
                      <div className="af-ml-meta">
                        <div className="af-ml-t">{b.title}</div>
                        <div className="af-ml-s">{b.sub}</div>
                        <div className="af-ml-bar">
                          <i style={{ width: `${(b.h / topBooks[0].h) * 100}%` }} />
                        </div>
                      </div>
                      <span className="af-ml-h">
                        {b.h.toFixed(1)}
                        <small>h</small>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="af-section-head">
                  <span className="ms">bar_chart</span>Last 7 days
                </div>
                <div className="af-chart-card">
                  <div className="af-bars">
                    {week.map((d, i) => (
                      <div key={d.key} className={`af-bar-col${i === hotIdx ? ' hot' : ''}`}>
                        <span className="af-bar-v">{d.v}h</span>
                        <div className="af-bar" style={{ height: `${(d.v / weekMax) * 100}%` }} />
                        <span className="af-bar-d">{d.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppFrame
