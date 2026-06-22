<template>
  <div class="af-shell dark" :style="{ '--primary': accent, '--ring': accent, '--glow-accent': accent, width: scaledW + 'px' }">
    <!-- Browser chrome -->
    <div class="af-bar">
      <div class="af-dots">
        <span class="af-dot af-dot-r"></span>
        <span class="af-dot af-dot-y"></span>
        <span class="af-dot af-dot-g"></span>
      </div>
      <div class="af-url-bar">
        <span class="ms af-lock-icon">lock</span>
        <span>{{ urlLabel }}</span>
      </div>
      <div style="width:54px"></div>
    </div>

    <!-- Scaled viewport -->
    <div class="af-viewport" :style="{ width: scaledW + 'px', height: scaledH + 'px' }">
      <div class="af-inner" :style="{ width: VW + 'px', height: VH + 'px', transform: `scale(${scale})`, transformOrigin: 'top left' }">

        <!-- ===== LIBRARY ===== -->
        <div v-if="screen === 'library'" class="af-screen af-library">
          <aside class="af-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <div v-for="item in libNav" :key="item.label" class="af-nav-item" :class="{ active: item.active }">
                <span class="ms" :class="{ fill: item.active }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </div>
            </nav>
            <div class="af-library-chip">
              <div class="af-chip-label">Library</div>
              <div class="af-chip-val">312 titles · 272ʰ54ᵐ</div>
            </div>
          </aside>
          <div class="af-main">
            <div class="af-glow-bloom"></div>
            <div class="af-main-inner af-library-inner">
              <div class="af-lib-header">
                <div>
                  <div class="af-eyebrow">Your collection</div>
                  <h1 class="af-page-title">Library</h1>
                </div>
                <div class="af-lib-filters">
                  <span class="af-pill"><span class="ms">tune</span>All genres</span>
                  <span class="af-pill"><span class="ms">sort</span>Recent</span>
                </div>
              </div>
              <div class="af-book-grid">
                <div v-for="b in books" :key="b.title" class="af-book-tile">
                  <div class="af-cover" :style="{ background: b.cv }">
                    <div v-if="b.progress > 0 && b.progress < 1" class="af-progress-bar">
                      <div class="af-progress-fill" :style="{ width: (b.progress * 100) + '%' }"></div>
                    </div>
                    <div v-if="b.finished" class="af-finished-badge"><span class="ms fill">check_circle</span></div>
                    <div class="af-cover-text">
                      <div class="af-cover-title">{{ b.title }}</div>
                      <div class="af-cover-author">{{ b.author }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="af-playbar">
              <div class="af-pb-cover" :style="{ background: nowPlaying.cv }"></div>
              <div class="af-pb-info">
                <div class="af-pb-title">{{ nowPlaying.title }}</div>
                <div class="af-pb-author">{{ nowPlaying.author }} · {{ nowPlaying.kicker }}</div>
              </div>
              <div class="af-pb-controls">
                <span class="ms">replay_30</span>
                <span class="ms">skip_previous</span>
                <span class="ms fill af-pb-play">pause_circle</span>
                <span class="ms">skip_next</span>
                <span class="ms">forward_30</span>
              </div>
              <div class="af-pb-right">
                <span class="af-speed-badge">1.4×</span>
                <div class="af-pb-progress">
                  <div class="af-pb-prog-fill" :style="{ width: (nowPlaying.progress * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== PLAYER ===== -->
        <div v-else-if="screen === 'player'" class="af-screen af-player" :style="{ '--primary': npAccent, '--glow-accent': npAccent }">
          <div class="af-player-glow"></div>
          <div class="af-player-back">
            <span class="ms af-muted">expand_more</span>
            <span class="af-eyebrow">Now playing</span>
          </div>
          <div class="af-player-layout">
            <!-- Left: cover + controls -->
            <div class="af-player-left">
              <div class="af-player-cover" :style="{ background: nowPlaying.cv }">
                <div class="af-player-cover-text">
                  <div class="af-pct-title">{{ nowPlaying.title }}</div>
                  <div class="af-pct-author">{{ nowPlaying.author }}</div>
                </div>
              </div>
              <div class="af-player-meta">
                <div class="af-eyebrow" style="letter-spacing:0.2em">{{ nowPlaying.kicker }}</div>
                <h1 class="af-player-title">{{ nowPlaying.title }}</h1>
                <div class="af-player-author">{{ nowPlaying.author }} · Read by {{ nowPlaying.narrator }}</div>
              </div>
              <div class="af-scrubber">
                <div class="af-scrub-track">
                  <div class="af-scrub-fill" style="width:52%"></div>
                  <div class="af-scrub-thumb" style="left:52%"></div>
                </div>
                <div class="af-scrub-times"><span>6:51:20</span><span>-6:18:40</span></div>
              </div>
              <div class="af-transport">
                <span class="ms af-muted" style="font-size:30px">replay_30</span>
                <span class="ms af-muted" style="font-size:28px">skip_previous</span>
                <span class="af-play-btn"><span class="ms fill" style="font-size:34px">pause</span></span>
                <span class="ms af-muted" style="font-size:28px">skip_next</span>
                <span class="ms af-muted" style="font-size:30px">forward_30</span>
              </div>
              <div class="af-transport-extras">
                <span class="af-speed-pill">1.4×</span>
                <span class="af-icon-btn"><span class="ms">bedtime</span></span>
                <span class="af-icon-btn"><span class="ms">bookmark_add</span></span>
              </div>
            </div>
            <!-- Right: chapters -->
            <div class="af-chapters-panel">
              <div class="af-ch-header">
                <span class="af-ch-title">Chapters</span>
                <span class="af-ch-pos af-mono">Ch 31 / 56</span>
              </div>
              <div v-for="c in chapters" :key="c.title" class="af-ch-row" :class="{ 'af-ch-now': c.now }">
                <span class="ms" :class="{ fill: c.now }" :style="{ color: c.iconColor, fontSize: '20px' }">{{ c.icon }}</span>
                <span class="af-ch-name" :style="{ color: c.titleColor, fontWeight: c.weight }">{{ c.title }}</span>
                <span class="af-ch-dur af-mono">{{ c.dur }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== READER ===== -->
        <div v-else-if="screen === 'reader'" class="af-screen af-reader">
          <!-- Left sidebar (collapsed nav) -->
          <aside class="af-sidebar af-reader-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <div v-for="item in readerNav" :key="item.label" class="af-nav-item" :class="{ active: item.active }">
                <span class="ms" :class="{ fill: item.active }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </div>
            </nav>
          </aside>
          <!-- Reader main -->
          <div class="af-reader-main">
            <!-- Top chrome -->
            <div class="af-reader-topbar">
              <button class="af-reader-back-btn">
                <span class="ms">arrow_back</span>
              </button>
              <div class="af-reader-reading-info">
                <span class="af-reader-eyebrow">Reading · Eira Sundqvist</span>
                <span class="af-reader-book-title">Ashen Roads</span>
              </div>
              <div class="af-reader-topbar-right">
                <button class="af-reader-btn"><span class="ms">headphones</span></button>
                <button class="af-reader-btn"><span class="ms">list</span>Chapters</button>
                <button class="af-reader-btn af-reader-btn-aa">Aa</button>
              </div>
            </div>
            <!-- Reading content (sepia theme) -->
            <div class="af-reader-body">
              <div class="af-reader-content">
                <div class="af-reader-chapter-eyebrow">Ashen Roads · Chapter 27 of 27</div>
                <h2 class="af-reader-chapter-title">Chapter 27 · What the Tide Keeps</h2>
                <div class="af-reader-rule"></div>
                <p class="af-reader-para">Nothing in the house had been moved and that was the worst of it; the chair still angled toward the window, the book still open on the page, as though the room were waiting for a return that the rest of them had stopped expecting.</p>
                <p class="af-reader-para">There was a word in the old dialect for the light on water at dusk — not the light itself but the way it made you feel that something had just left. She had never needed it before now.</p>
              </div>
            </div>
            <!-- Persistent mini-player at bottom -->
            <div class="af-reader-playerbar">
              <div class="af-pb-cover" :style="{ background: nowPlaying.cv }"></div>
              <div class="af-pb-info">
                <div class="af-pb-title">{{ nowPlaying.title }}</div>
                <div class="af-pb-author">{{ nowPlaying.author }}</div>
              </div>
              <div class="af-pb-controls">
                <span class="ms">skip_previous</span>
                <span class="ms fill af-pb-play">play_circle</span>
                <span class="ms">skip_next</span>
              </div>
              <div class="af-pb-right">
                <div class="af-reader-progress-wrap">
                  <div class="af-scrub-track" style="height:3px">
                    <div class="af-scrub-fill" style="width:52%"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted-foreground);font-family:var(--font-mono);margin-top:4px">
                    <span>6:51:50</span><span>-6:20:10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== STATS ===== -->
        <div v-else-if="screen === 'stats'" class="af-screen af-stats-screen">
          <aside class="af-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <div v-for="item in statsNav" :key="item.label" class="af-nav-item" :class="{ active: item.active }">
                <span class="ms" :class="{ fill: item.active }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </div>
            </nav>
          </aside>
          <div class="af-main">
            <div class="af-glow-bloom af-glow-short"></div>
            <div class="af-main-inner">
              <div class="af-eyebrow">This year</div>
              <div class="af-stats-hero">
                <div class="af-stats-big">272ʰ54ᵐ</div>
                <div class="af-stats-sub af-muted">11.4 days of audio<br>across 48 finished books</div>
              </div>
              <div class="af-tiles-grid">
                <div v-for="t in tiles" :key="t.cap" class="af-tile">
                  <span class="ms" :class="{ fill: t.fill }" :style="{ color: t.color, fontSize: '24px' }">{{ t.ico }}</span>
                  <div class="af-tile-num">{{ t.num }}</div>
                  <div class="af-tile-cap af-muted">{{ t.cap }}</div>
                </div>
              </div>
              <div class="af-stats-bottom">
                <div class="af-week-card">
                  <div class="af-card-title">This week</div>
                  <div class="af-bar-chart">
                    <div v-for="d in week" :key="d.d" class="af-bar-col">
                      <div class="af-bar-fill" :style="{ height: d.h + 'px' }"></div>
                      <span class="af-bar-label af-muted">{{ d.d }}</span>
                    </div>
                  </div>
                </div>
                <div class="af-leaderboard-card">
                  <div class="af-card-title">Server leaderboard</div>
                  <div v-for="f in friends" :key="f.name" class="af-lb-row">
                    <span class="af-lb-rank af-mono">{{ f.rank }}</span>
                    <span class="af-lb-avatar" :style="{ background: f.cv }">{{ f.initial }}</span>
                    <span class="af-lb-name" :style="{ color: f.nameColor, fontWeight: f.weight }">{{ f.name }}</span>
                    <span class="af-lb-hrs af-mono">{{ f.h }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  screen: { type: String, default: 'library' },
  scale: { type: Number, default: 0.6 },
  accent: { type: String, default: '#e0654a' },
})

const VW = 1180
const VH = 760
const scaledW = Math.round(VW * props.scale)
const scaledH = Math.round(VH * props.scale)

const urlLabels = { library: 'hearthshelf.home / library', player: 'hearthshelf.home / player', stats: 'hearthshelf.home / stats', reader: 'hearthshelf.home / read' }
const urlLabel = urlLabels[props.screen] || urlLabels.library

const mk = (title, author, narrator, kicker, cv, progress, finished) =>
  ({ title, author, narrator, kicker, cv, progress: progress ?? 0, finished: finished ?? false, hours: 13 })

const books = [
  mk('The Tide Between Us',   'Marian Holt',    'Saoirse Quinn',  'A Novel',   '#3f7d8c', 0.52),
  mk('Embers of the North',   'Cassian Vale',   'Tom Aldridge',   'Ashfall · I','#c4663a', 0),
  mk('Notes on Falling',      'Per Lindqvist',  'Greta Holm',     'Memoir',    '#7fa86b', 0.74),
  mk('Redshift Country',      'Howard Mbeki',   'Howard Mbeki',   'Sci-Fi',    '#cc5b4a', 0.33),
  mk('Saltwater Saints',      'Imelda Reyes',   'Lucia Marin',    'A Novel',   '#4f9db0', 0.18),
  mk('A Geometry of Birds',   'Yuki Tanaka',    'Mei Kowalski',   'Poetry',    '#9b6fb8', 0),
  mk('Quiet Machines',        'Dr. Nadia Osei', 'Nadia Osei',     'Nonfiction','#5e76c4', 1, true),
  mk("The Hollow Crown's Ash",'Cassian Vale',   'Tom Aldridge',   'Ashfall · III','#a84738', 0),
  mk('Wavelength',            'Dr. Nadia Osei', 'Nadia Osei',     'Nonfiction','#4db6ac', 0.61),
  mk('The Far Meridian',      'Howard Mbeki',   'Howard Mbeki',   'Sci-Fi',    '#5566b8', 0),
]

const nowPlaying = books[0]
const npAccent = nowPlaying.cv

const chapters = [
  { title: 'Chapter 29', dur: '14:02', done: true },
  { title: 'Chapter 30', dur: '11:38', done: true },
  { title: 'Chapter 31', dur: '16:20', now: true },
  { title: 'Chapter 32', dur: '12:55' },
  { title: 'Chapter 33', dur: '09:41' },
  { title: 'Chapter 34', dur: '15:10' },
  { title: 'Chapter 35', dur: '13:27' },
].map(c => ({
  ...c,
  icon: c.now ? 'graphic_eq' : c.done ? 'check_circle' : 'play_circle',
  iconColor: c.now ? 'var(--primary)' : 'var(--muted-foreground)',
  titleColor: c.now ? 'var(--foreground)' : c.done ? 'var(--muted-foreground)' : 'var(--foreground)',
  weight: c.now ? 700 : 500,
}))

const tiles = [
  { ico: 'local_fire_department', num: '23',   cap: 'Day streak',       fill: true,  color: 'var(--primary)' },
  { ico: 'emoji_events',          num: '64',   cap: 'Longest streak',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'task_alt',              num: '48',   cap: 'Books finished',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'headphones',            num: '1.4×', cap: 'Avg. speed',       fill: false, color: 'var(--muted-foreground)' },
  { ico: 'calendar_month',        num: '19',   cap: 'This month (h)',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'menu_book',             num: '6',    cap: 'In progress',      fill: false, color: 'var(--muted-foreground)' },
]

const wraw = [1.2, 2.4, 0.8, 3.1, 1.9, 4.2, 2.7]
const week = ['M','T','W','T','F','S','S'].map((d, i) => ({ d, h: Math.round(wraw[i] / 4.2 * 108) }))

const friends = [
  { name: 'Ari Mensah',    h: 42, rank: 1, cv: '#c4663a' },
  { name: 'Lena Park',     h: 27, rank: 2, cv: '#5e76c4' },
  { name: 'Theo Vance',    h: 23, rank: 3, cv: '#7fa86b' },
  { name: 'Jordan Reese',  h: 19, rank: 4, cv: '#e0654a', me: true },
  { name: 'Priya Rao',     h: 15, rank: 5, cv: '#4f9db0' },
].map(f => ({ ...f, initial: f.name[0], weight: f.me ? 700 : 500, nameColor: f.me ? 'var(--primary)' : 'var(--foreground)' }))

const libNav = [
  { icon: 'home',        label: 'Home' },
  { icon: 'grid_view',   label: 'Library', active: true },
  { icon: 'auto_stories',label: 'Series' },
  { icon: 'insights',    label: 'Stats' },
]
const statsNav = [
  { icon: 'home',        label: 'Home' },
  { icon: 'grid_view',   label: 'Library' },
  { icon: 'auto_stories',label: 'Series' },
  { icon: 'insights',    label: 'Stats', active: true },
]
const readerNav = [
  { icon: 'home',        label: 'Home' },
  { icon: 'grid_view',   label: 'Library' },
  { icon: 'auto_stories',label: 'Series' },
  { icon: 'insights',    label: 'Stats' },
]
</script>

<style scoped>
/* ── CSS tokens (dark defaults; parent passes --primary) ── */
.af-shell {
  --background: #1b1a18;
  --foreground: #f4f1ea;
  --card:       #2a2825;
  --popover:    #242220;
  --primary:    #e0654a;
  --muted-foreground: #aba498;
  --border:     #383530;
  --sidebar:    #131211;
  --elevated:   #322f2b;
  --fill:       rgba(255,255,255,0.06);
  --brand-hearth: #bd863f;
  --wordmark-shelf: #f0e6d6;
  --glow-strength: 60;
  --font-mono:  'Geist Mono', 'DM Mono', ui-monospace, monospace;
  --font-brand: 'Libre Baskerville', Georgia, serif;

  border-radius: 14px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: 0 40px 90px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  color: var(--foreground);
  display: inline-block;
}

/* Material Symbols */
.ms { font-family: 'Material Symbols Rounded'; font-variation-settings: 'FILL' 0, 'wght' 400; line-height: 1; user-select: none; }
.ms.fill { font-variation-settings: 'FILL' 1, 'wght' 400; }
.af-muted { color: var(--muted-foreground); }
.af-mono  { font-family: var(--font-mono); }

/* ── Browser bar ── */
.af-bar {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 16px;
  background: var(--sidebar);
  border-bottom: 1px solid var(--border);
}
.af-dots { display: flex; gap: 8px; }
.af-dot  { width: 11px; height: 11px; border-radius: 50%; }
.af-dot-r { background: #e0654a; }
.af-dot-y { background: #e8b54a; }
.af-dot-g { background: #7fa86b; }

.af-url-bar {
  flex: 1;
  max-width: 340px;
  margin: 0 auto;
  height: 24px;
  border-radius: 999px;
  background: var(--fill);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px;
  font-size: 11px;
  color: var(--muted-foreground);
  font-family: var(--font-mono);
}
.af-lock-icon { font-size: 13px; }

/* ── Viewport + scaling ── */
.af-viewport { overflow: hidden; position: relative; background: var(--background); }
.af-inner    { position: absolute; top: 0; left: 0; }

/* ── Shared screen layout ── */
.af-screen { display: flex; width: 1180px; height: 760px; }

/* ── Sidebar ── */
.af-sidebar {
  width: 248px;
  flex-shrink: 0;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 3;
}
.af-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 28px;
}
.af-hearth-icon {
  font-size: 22px;
  color: var(--brand-hearth);
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--brand-hearth) 50%, transparent));
}
.af-wordmark { font-size: 19px; font-family: var(--font-brand); }
.af-wm-hearth { font-weight: 400; color: var(--brand-hearth); }
.af-wm-shelf  { font-weight: 700; color: var(--wordmark-shelf); }

.af-nav { display: flex; flex-direction: column; gap: 2px; }
.af-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  font-size: 14px;
  color: var(--muted-foreground);
  cursor: default;
}
.af-nav-item.active {
  background: color-mix(in oklab, var(--primary) 14%, transparent);
  color: var(--foreground);
}
.af-nav-item .ms { font-size: 20px; }

.af-library-chip {
  margin-top: auto;
  padding: 14px 12px;
  border-radius: 12px;
  background: var(--fill);
  border: 1px solid var(--border);
}
.af-chip-label { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted-foreground); }
.af-chip-val   { font-family: var(--font-mono); font-size: 13px; color: var(--foreground); margin-top: 4px; }

/* ── Main area ── */
.af-main { flex: 1; overflow: hidden; position: relative; }

.af-glow-bloom {
  position: absolute;
  inset: 0 0 auto 0;
  height: 62%;
  pointer-events: none;
  background: radial-gradient(120% 80% at 50% -18%, color-mix(in oklab, var(--primary) calc(var(--glow-strength) * 1%), transparent) 0%, transparent 62%);
}
.af-glow-short { height: 50%; }

.af-main-inner { position: relative; padding: 40px 44px 120px; }

/* ── Library ── */
.af-library-inner { padding-bottom: 120px; }

.af-lib-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30px;
}
.af-eyebrow {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
.af-page-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 8px 0 0;
  color: var(--foreground);
}
.af-lib-filters { display: flex; gap: 10px; align-items: center; }
.af-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--fill);
  border: 1px solid var(--border);
  font-size: 13px;
  color: var(--muted-foreground);
}
.af-pill .ms { font-size: 17px; }

.af-book-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px 20px;
}
.af-book-tile { position: relative; }
.af-cover {
  border-radius: 10px;
  aspect-ratio: 2/3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.af-cover-text {
  padding: 10px;
  background: linear-gradient(transparent, rgba(0,0,0,0.65));
}
.af-cover-title  { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; }
.af-cover-author { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; }

.af-progress-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.2);
}
.af-progress-fill { height: 100%; background: #f59e0b; }
.af-finished-badge {
  position: absolute;
  top: 6px; right: 6px;
  font-size: 18px;
  color: #7fa86b;
}

/* ── Playbar ── */
.af-playbar {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 84px;
  background: color-mix(in oklab, var(--sidebar) 95%, transparent);
  border-top: 1px solid var(--border);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  z-index: 6;
}
.af-pb-cover {
  width: 52px; height: 52px;
  border-radius: 8px;
  flex-shrink: 0;
}
.af-pb-info { flex: 1; min-width: 0; }
.af-pb-title  { font-size: 14px; font-weight: 600; color: var(--foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-pb-author { font-size: 12px; color: var(--muted-foreground); margin-top: 2px; }
.af-pb-controls { display: flex; align-items: center; gap: 16px; color: var(--muted-foreground); }
.af-pb-controls .ms { font-size: 22px; }
.af-pb-play { font-size: 36px !important; color: var(--primary); }
.af-pb-right { display: flex; flex-direction: column; gap: 8px; min-width: 120px; }
.af-speed-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  border: 1px solid color-mix(in oklab, var(--primary) 45%, transparent);
  padding: 3px 10px;
  border-radius: 999px;
  width: fit-content;
}
.af-pb-progress {
  height: 3px;
  background: var(--elevated);
  border-radius: 999px;
  overflow: hidden;
}
.af-pb-prog-fill { height: 100%; background: var(--primary); }

/* ── Player screen ── */
.af-player {
  position: relative;
  height: 760px;
  overflow: hidden;
  background: var(--background);
  color: var(--foreground);
}
.af-player-glow {
  position: absolute;
  inset: 0 0 auto 0;
  height: 80%;
  pointer-events: none;
  background: radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--primary) 56%, transparent) 0%, transparent 60%);
}
.af-player-back {
  position: absolute;
  top: 22px; left: 28px;
  display: flex;
  align-items: center;
  gap: 9px;
  z-index: 4;
}
.af-player-back .ms { font-size: 24px; }

.af-player-layout {
  position: relative;
  max-width: 1040px;
  margin: 0 auto;
  padding: 104px 56px 56px;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 56px;
  align-items: start;
}
.af-player-cover {
  width: 380px;
  height: 380px;
  border-radius: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.af-player-cover-text {
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}
.af-pct-title  { font-size: 18px; font-weight: 700; color: #fff; }
.af-pct-author { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }

.af-player-meta { margin-top: 28px; }
.af-player-title { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; margin: 9px 0 6px; line-height: 1.1; }
.af-player-author { font-size: 15px; color: var(--muted-foreground); }

.af-scrubber { margin-top: 26px; }
.af-scrub-track {
  height: 6px;
  background: var(--elevated);
  border-radius: 999px;
  position: relative;
}
.af-scrub-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--primary);
  border-radius: 999px;
}
.af-scrub-thumb {
  position: absolute;
  top: 50%;
  width: 15px; height: 15px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
.af-scrub-times {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted-foreground);
}

.af-transport {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 24px;
}
.af-play-btn {
  width: 66px; height: 66px;
  border-radius: 50%;
  background: var(--foreground);
  color: var(--background);
  display: grid;
  place-items: center;
}
.af-transport-extras {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 24px;
}
.af-speed-pill {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  border: 1px solid color-mix(in oklab, var(--primary) 45%, transparent);
  padding: 7px 14px;
  border-radius: 999px;
}
.af-icon-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--fill);
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
}
.af-icon-btn .ms { font-size: 20px; color: var(--foreground); }

/* Chapters panel */
.af-chapters-panel {
  background: color-mix(in oklab, var(--card) 70%, transparent);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 8px;
  backdrop-filter: blur(8px);
}
.af-ch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}
.af-ch-title { font-size: 15px; font-weight: 600; }
.af-ch-pos   { font-size: 12px; color: var(--muted-foreground); }
.af-ch-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 16px;
  border-radius: 12px;
}
.af-ch-row.af-ch-now {
  background: color-mix(in oklab, var(--primary) 16%, transparent);
}
.af-ch-name { flex: 1; font-size: 14px; }
.af-ch-dur  { font-size: 12px; color: var(--muted-foreground); }

/* ── Stats screen ── */
.af-stats-screen { display: flex; }
.af-stats-hero { display: flex; align-items: flex-end; gap: 18px; margin: 6px 0 4px; }
.af-stats-big  { font-size: 76px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.af-stats-sub  { font-size: 15px; padding-bottom: 14px; line-height: 1.5; }

.af-tiles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 30px;
}
.af-tile {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
}
.af-tile-num { font-size: 34px; font-weight: 700; letter-spacing: -0.02em; margin-top: 10px; }
.af-tile-cap { font-size: 13px; margin-top: 2px; }

.af-stats-bottom {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
.af-week-card,
.af-leaderboard-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
}
.af-card-title { font-size: 15px; font-weight: 600; margin-bottom: 18px; }

.af-bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 120px;
}
.af-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}
.af-bar-fill {
  width: 100%;
  border-radius: 6px;
  background: linear-gradient(var(--primary), color-mix(in oklab, var(--primary) 55%, transparent));
}
.af-bar-label { font-size: 12px; }

.af-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.af-lb-rank    { font-size: 13px; color: var(--muted-foreground); width: 18px; }
.af-lb-avatar  { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 12px; font-weight: 700; }
.af-lb-name    { flex: 1; font-size: 14px; }
.af-lb-hrs     { font-size: 13px; color: var(--foreground); }

.af-stats-screen .af-main-inner { padding: 40px 44px; }

/* ── Reader screen ── */
.af-reader { display: flex; background: #f5efe6; color: #2a2218; }

.af-reader-sidebar {
  background: #ede5d8;
  border-right: 1px solid #d8cfc3;
}
.af-reader-sidebar .af-hearth-icon { color: #c68e3b; }
.af-reader-sidebar .af-wm-hearth   { color: #c68e3b; }
.af-reader-sidebar .af-wm-shelf    { color: #3a2f20; }
.af-reader-sidebar .af-nav-item    { color: #8a7c6a; }
.af-reader-sidebar .af-nav-item.active { background: rgba(198,142,59,0.14); color: #2a2218; }

.af-reader-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5efe6;
  position: relative;
}

.af-reader-topbar {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 28px;
  border-bottom: 1px solid #ddd4c5;
  background: #f0e9df;
  flex-shrink: 0;
}

.af-reader-back-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.07);
  border: none;
  display: grid;
  place-items: center;
  cursor: default;
  color: #4a3f30;
}
.af-reader-back-btn .ms { font-size: 20px; }

.af-reader-reading-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
}
.af-reader-eyebrow {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #8a7c6a;
  font-weight: 300;
}
.af-reader-book-title {
  font-size: 13px;
  font-weight: 600;
  color: #2a2218;
}

.af-reader-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.af-reader-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid #d0c6b8;
  background: rgba(255,255,255,0.5);
  font-size: 13px;
  color: #4a3f30;
  cursor: default;
  font-family: inherit;
}
.af-reader-btn .ms { font-size: 17px; }
.af-reader-btn-aa { font-weight: 600; font-size: 14px; }

.af-reader-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 56px 0 0;
}

.af-reader-content {
  max-width: 640px;
  width: 100%;
  padding: 0 24px;
}

.af-reader-chapter-eyebrow {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #8a7c6a;
  margin-bottom: 18px;
}

.af-reader-chapter-title {
  font-family: var(--font-brand);
  font-size: 28px;
  font-weight: 700;
  color: #1e1810;
  line-height: 1.2;
  margin: 0 0 18px;
}

.af-reader-rule {
  width: 48px;
  height: 2px;
  background: #e0654a;
  border-radius: 2px;
  margin-bottom: 28px;
}

.af-reader-para {
  font-family: var(--font-brand);
  font-size: 17px;
  line-height: 1.85;
  color: #2a2218;
  margin: 0 0 24px;
}

.af-reader-playerbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 76px;
  border-top: 1px solid #ddd4c5;
  background: #ede5d8;
  flex-shrink: 0;
}
.af-reader-playerbar .af-pb-cover { border-radius: 8px; }
.af-reader-playerbar .af-pb-title { color: #2a2218; }
.af-reader-playerbar .af-pb-author { color: #8a7c6a; }
.af-reader-playerbar .af-pb-controls { color: #6a5d4a; }
.af-reader-playerbar .af-pb-play { color: #e0654a; font-size: 34px !important; }
.af-reader-playerbar .af-scrub-track { background: #d0c6b8; }

.af-reader-progress-wrap { min-width: 160px; }
</style>
