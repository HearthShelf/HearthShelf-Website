<template>
  <div
    class="af-shell dark"
    :style="{ '--primary': screenAccent, '--ring': screenAccent, '--glow-accent': screenAccent, '--glow-strength': glow, width: scaledW + 'px' }"
  >
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

        <!-- Sidebar (shared by every full-app screen) -->
        <aside v-if="screen !== 'player'" class="af-sidebar">
          <div class="af-sidebar-logo">
            <img class="af-hearth-icon" src="/flame.png" alt="" />
            <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
          </div>
          <nav class="af-nav">
            <button
              v-for="item in nav" :key="item.id"
              class="af-nav-item" :class="{ active: item.id === screen }"
              type="button"
            >
              <template v-if="item.sep === true"><span class="af-nav-sep"></span></template>
              <template v-else-if="item.label2"><span class="af-nav-label">{{ item.label2 }}</span></template>
              <template v-else>
                <span class="ms" :class="{ fill: item.id === screen }">{{ item.icon }}</span>
                <span class="af-ni-text">{{ item.label }}</span>
                <span v-if="item.badge" class="af-ni-badge" :class="{ active: item.id === screen }">{{ item.badge }}</span>
              </template>
            </button>
          </nav>
          <div class="af-user-chip">
            <span class="af-sb-avatar">A</span>
            <span class="af-u-meta">
              <span class="af-u-name">{{ user.name }}</span>
              <span class="af-u-sub">{{ user.host }}</span>
            </span>
            <span class="ms af-u-chev">expand_less</span>
          </div>
        </aside>

        <!-- ===== LIBRARY ===== -->
        <div v-if="screen === 'library'" class="af-main af-fade">
          <div class="af-glow-bloom"></div>
          <div class="af-main-inner af-library-inner">
            <div class="af-lib-header">
              <div>
                <div class="af-eyebrow">Your collection</div>
                <h1 class="af-page-title">Audiobooks<span class="af-lib-count">312 of 312 books</span></h1>
              </div>
              <div class="af-lib-filters">
                <span class="af-pill"><span class="ms">filter_list</span>Filter</span>
                <span class="af-pill"><span class="ms">swap_vert</span>Title</span>
              </div>
            </div>

            <div class="af-qv-tabs">
              <button v-for="t in libTabs" :key="t.label" class="af-qv-tab" :class="{ on: t.on }" type="button">
                <span class="ms" :class="{ fill: t.on }">{{ t.icon }}</span>
                <span>{{ t.label }}</span>
                <span class="af-qv-count">{{ t.n }}</span>
              </button>
            </div>

            <div class="af-book-grid">
              <div
                v-for="(b, i) in books" :key="b.title"
                class="af-book" type="button"
                @contextmenu.prevent.stop="openMenu($event, i)"
              >
                <div class="af-cover" :style="{ background: b.cv }" :data-finished="b.finished">
                  <div v-if="b.ebook" class="af-cv-fmt" :class="{ 'af-cv-fmt-solo': b.ebook && !b.audio }">
                    <span class="ms fill">{{ b.ebook && !b.audio ? 'menu_book' : 'auto_stories' }}</span>
                    <span v-if="b.ebook && !b.audio">Read</span>
                  </div>
                  <div v-if="b.finished" class="af-finished-badge"><span class="ms fill">check_circle</span></div>
                  <!-- hover-reveal actions, matching the app's BookTile -->
                  <div class="af-hover-actions" @click.stop>
                    <span class="af-ha-btn" title="Add to list"><span class="ms">playlist_add</span></span>
                    <span class="af-ha-play" :title="b.ebook && !b.audio ? 'Read' : 'Play'">
                      <span class="ms fill">{{ b.ebook && !b.audio ? 'menu_book' : 'play_arrow' }}</span>
                    </span>
                    <span class="af-ha-btn" :title="b.finished ? 'Mark not finished' : 'Mark finished'"><span class="ms" :class="{ fill: b.finished }">check</span></span>
                  </div>
                  <div class="af-cover-text">
                    <div class="af-cover-title">{{ b.title }}</div>
                    <div class="af-cover-author">{{ b.author }}</div>
                  </div>
                </div>
                <div class="af-b-meta">
                  <div class="af-b-title">{{ b.title }}</div>
                  <div class="af-b-author">{{ b.author }}</div>
                  <div v-if="b.progress > 0 && !b.finished" class="af-b-prog">
                    <i :style="{ width: (b.progress * 100) + '%' }"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Persistent play bar (mini player), mirroring the app's PlayerBar -->
          <div class="af-playbar">
            <div class="af-pb-now">
              <div class="af-pb-cover" :style="{ background: nowPlaying.cv }"></div>
              <div class="af-pb-meta">
                <div class="af-pb-title">{{ nowPlaying.title }}</div>
                <div class="af-pb-sub">{{ nowPlaying.author }}</div>
              </div>
            </div>
            <div class="af-pb-center">
              <div class="af-pb-controls">
                <span class="ms af-pb-skip fill">skip_previous</span>
                <span class="af-pb-skip"><span class="ms">replay</span><small>15</small></span>
                <span class="af-pb-play"><span class="ms fill">{{ playing ? 'pause' : 'play_arrow' }}</span></span>
                <span class="af-pb-skip"><span class="ms af-mirror">replay</span><small>30</small></span>
                <span class="ms af-pb-skip fill">skip_next</span>
              </div>
              <div class="af-pb-time">
                <span>{{ elapsedShort }}</span>
                <div class="af-scrub"><i :style="{ width: (progress * 100) + '%' }"></i><b :style="{ left: (progress * 100) + '%' }"></b></div>
                <span>-{{ remainShort }}</span>
              </div>
            </div>
            <div class="af-pb-right">
              <span class="af-pill af-pb-speed">{{ speed }}×</span>
              <span class="af-icon-btn"><span class="ms">list</span></span>
              <span class="af-icon-btn"><span class="ms">bookmark_border</span></span>
              <span class="af-icon-btn"><span class="ms">bedtime</span></span>
              <span class="af-icon-btn"><span class="ms">volume_up</span></span>
            </div>
          </div>

          <!-- Right-click context menu, mirroring the app's BookContextMenu -->
          <div
            v-if="menu.open"
            class="af-ctx-menu"
            :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
            @click.stop
            @contextmenu.prevent
          >
            <div class="af-ctx-header">
              <span class="af-ctx-title">{{ menuBook.title }}</span>
              <span class="af-ctx-author">{{ menuBook.author }}</span>
            </div>
            <div class="af-ctx-divider"></div>
            <button class="af-mp-item" type="button" @click="closeMenu"><span class="ms">info</span>View details</button>
            <button v-if="menuBook.audio" class="af-mp-item" type="button" @click="closeMenu"><span class="ms fill">play_arrow</span>Play</button>
            <button v-if="menuBook.ebook" class="af-mp-item" type="button" @click="closeMenu"><span class="ms fill">menu_book</span>Read</button>
            <div class="af-ctx-divider"></div>
            <button class="af-mp-item" type="button" @click="closeMenu"><span class="ms">reorder</span>Add to queue</button>
            <button class="af-mp-item" type="button" @click="closeMenu"><span class="ms">folder_special</span>Add to collection</button>
            <button class="af-mp-item" type="button" @click="closeMenu"><span class="ms">queue_music</span>Add to playlist</button>
            <div class="af-ctx-divider"></div>
            <button class="af-mp-item" :class="{ 'af-mp-on': menuBook.finished }" type="button" @click="closeMenu">
              <span class="ms" :class="{ fill: menuBook.finished }">check_circle</span>{{ menuBook.finished ? 'Mark as unfinished' : 'Mark as finished' }}
            </button>
            <button v-if="menuBook.progress > 0 && !menuBook.finished" class="af-mp-item" type="button" @click="closeMenu"><span class="ms">replay</span>Reset progress</button>
          </div>
        </div>

        <!-- ===== PLAYER (Now Playing) ===== -->
        <div v-else-if="screen === 'player'" class="af-player af-fade">
          <div class="af-player-glow"></div>
          <div class="af-player-col">
            <div class="af-p-head">
              <div class="af-p-head-title">
                <div class="af-eyebrow">HearthShelf</div>
                <h1 class="af-p-listening">Listening</h1>
              </div>
              <div class="af-p-head-pills">
                <span class="af-pill af-sync-ok"><span class="ms">cloud_done</span>Synced</span>
                <span class="af-pill"><span class="ms">reorder</span>Queue</span>
              </div>
            </div>

            <div class="af-p-cover-wrap">
              <div class="af-p-cover" :style="{ background: nowPlaying.cv }">
                <div class="af-p-cover-text">
                  <div class="af-pct-title">{{ nowPlaying.title }}</div>
                  <div class="af-pct-author">{{ nowPlaying.author }}</div>
                </div>
              </div>
              <div class="af-p-cover-prog"><i :style="{ width: (progress * 100) + '%' }"></i></div>
            </div>

            <div class="af-p-prog-row">
              <div class="af-p-pct">{{ Math.round(progress * 100) }}<small>%</small></div>
              <div class="af-p-ch">Ch {{ chapterIndex + 1 }} / {{ chapters.length }}</div>
            </div>

            <div class="af-prog-line"><i :style="{ width: (progress * 100) + '%' }"></i></div>
            <div class="af-p-times"><span>{{ elapsedLabel }} elapsed</span><span>{{ remainLabel }} left</span></div>

            <div class="af-p-primary">
              <div class="af-p-primary-label">Full book</div>
              <div class="af-scrub af-scrub-lg"><i :style="{ width: (progress * 100) + '%' }"></i><b :style="{ left: (progress * 100) + '%' }"></b></div>
              <div class="af-p-times"><span>{{ elapsedLabel }} elapsed</span><span>{{ remainLabel }} left</span></div>
            </div>

            <div class="af-p-transport">
              <span class="ms af-p-skip lite fill">skip_previous</span>
              <span class="af-p-skip"><span class="ms">replay</span><small>15</small></span>
              <span class="af-p-play"><span class="ms fill">{{ playing ? 'pause' : 'play_arrow' }}</span></span>
              <span class="af-p-skip"><span class="ms af-mirror">replay</span><small>30</small></span>
              <span class="ms af-p-skip lite fill">skip_next</span>
            </div>

            <div class="af-action-grid">
              <span class="af-pill"><span class="ms">list</span>Chapters</span>
              <span class="af-pill"><span class="ms">info</span>Book details</span>
              <span class="af-pill"><span class="ms">speed</span>{{ speed }}×</span>
              <span class="af-pill"><span class="ms">bedtime</span>Sleep timer</span>
              <span class="af-pill"><span class="ms">bookmark_add</span>Bookmark</span>
              <span class="af-pill"><span class="ms">history</span>Recent listens</span>
            </div>
          </div>
        </div>

        <!-- ===== READER ===== -->
        <div v-else-if="screen === 'reader'" class="af-reader af-fade" :class="'af-reader-' + readerTheme">
          <!-- Reader main -->
          <div class="af-reader-main">
            <div class="af-reader-topbar">
              <button class="af-reader-back-btn" type="button"><span class="ms">arrow_back</span></button>
              <div class="af-reader-reading-info">
                <span class="af-reader-eyebrow">Reading · Eira Sundqvist</span>
                <span class="af-reader-book-title">Ashen Roads</span>
              </div>
              <div class="af-reader-topbar-right">
                <button class="af-reader-btn" type="button"><span class="ms">headphones</span></button>
                <button class="af-reader-btn" type="button"><span class="ms">list</span>Chapters</button>
                <button class="af-reader-btn af-reader-btn-aa" type="button">Aa</button>
              </div>
            </div>
            <div class="af-reader-themes">
              <span class="af-reader-themes-label">Theme</span>
              <button
                v-for="t in readerThemes" :key="t"
                class="af-reader-theme-chip" type="button"
                :class="['af-rt-' + t, { 'af-rt-active': readerTheme === t }]"
              >{{ t }}</button>
            </div>
            <div class="af-reader-body">
              <div class="af-reader-content">
                <div class="af-reader-chapter-eyebrow">Ashen Roads · Chapter 27 of 27</div>
                <h2 class="af-reader-chapter-title">Chapter 27 · What the Tide Keeps</h2>
                <div class="af-reader-rule"></div>
                <p class="af-reader-para">Nothing in the house had been moved and that was the worst of it; the chair still angled toward the window, the book still open on the page, as though the room were waiting for a return that the rest of them had stopped expecting.</p>
                <p class="af-reader-para">There was a word in the old dialect for the light on water at dusk - not the light itself but the way it made you feel that something had just left. She had never needed it before now.</p>
              </div>
            </div>
            <!-- Persistent mini-player at bottom -->
            <div class="af-reader-playerbar">
              <div class="af-pb-cover" :style="{ background: nowPlaying.cv }"></div>
              <div class="af-pb-meta">
                <div class="af-pb-title">{{ nowPlaying.title }}</div>
                <div class="af-pb-sub">{{ nowPlaying.author }}</div>
              </div>
              <div class="af-reader-pb-controls">
                <span class="ms">skip_previous</span>
                <span class="af-reader-pb-play"><span class="ms fill">{{ playing ? 'pause' : 'play_arrow' }}</span></span>
                <span class="ms">skip_next</span>
              </div>
              <div class="af-reader-progress-wrap">
                <div class="af-scrub" style="height:4px"><i :style="{ width: (progress * 100) + '%' }"></i></div>
                <div class="af-reader-pb-times"><span>{{ elapsedLabel }}</span><span>{{ remainLabel }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== STATS ===== -->
        <div v-else-if="screen === 'stats'" class="af-main af-fade">
          <div class="af-glow-bloom af-glow-short"></div>
          <div class="af-main-inner af-stats-inner">
            <div class="af-eyebrow">Insights</div>
            <h1 class="af-page-title af-stats-title">Your stats</h1>

            <div class="af-hero-stat">
              <div class="af-hero-label">Total listening time</div>
              <div class="af-hero-num">272<u>h</u>54<u>m</u></div>
              <div class="af-hero-sub">across 48 books</div>
            </div>

            <div class="af-stat-tiles">
              <div class="af-tile">
                <div class="af-t-ico"><span class="ms">menu_book</span></div>
                <div class="af-t-num">48</div>
                <div class="af-t-cap">Books listened</div>
              </div>
              <div class="af-tile">
                <div class="af-t-ico"><span class="ms">calendar_today</span></div>
                <div class="af-t-num">156</div>
                <div class="af-t-cap">Active days</div>
              </div>
              <div class="af-tile">
                <div class="af-t-ico af-t-ico-hot"><span class="ms fill">local_fire_department</span></div>
                <div class="af-t-num">42m</div>
                <div class="af-t-cap">Today</div>
              </div>
            </div>

            <div class="af-section-head"><span class="ms">trending_up</span>Most listened to</div>
            <div class="af-chart-card">
              <div v-for="b in topBooks" :key="b.title" class="af-ml-row">
                <span class="af-ml-rank">{{ b.rank }}</span>
                <span class="af-ml-cover" :style="{ background: b.cv }"></span>
                <div class="af-ml-meta">
                  <div class="af-ml-t">{{ b.title }}</div>
                  <div class="af-ml-s">{{ b.sub }}</div>
                  <div class="af-ml-bar"><i :style="{ width: (b.h / topBooks[0].h * 100) + '%' }"></i></div>
                </div>
                <span class="af-ml-h">{{ b.h.toFixed(1) }}<small>h</small></span>
              </div>
            </div>

            <div class="af-section-head"><span class="ms">bar_chart</span>Last 7 days</div>
            <div class="af-chart-card">
              <div class="af-bars">
                <div v-for="(d, i) in week" :key="d.key" class="af-bar-col" :class="{ hot: i === hotIdx }">
                  <span class="af-bar-v">{{ d.v }}h</span>
                  <div class="af-bar" :style="{ height: (d.v / weekMax * 100) + '%' }"></div>
                  <span class="af-bar-d">{{ d.d }}</span>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  screen: { type: String, default: 'library' },
  scale: { type: Number, default: 0.6 },
  accent: { type: String, default: '#e0654a' },
  // Auto-advance the progress bar (used for the hero).
  live: { type: Boolean, default: false },
})

const VW = 1180
const VH = 760
const scaledW = Math.round(VW * props.scale)
const scaledH = Math.round(VH * props.scale)

/* ---- State ---- */
const playing = ref(props.live)
const progress = ref(0.52)
const chapterIndex = ref(29)
const speed = ref(1.4)
const readerTheme = ref('sepia')
const readerThemes = ['dark', 'sepia', 'light', 'paper']

/* ---- Books ---- */
const mk = (title, author, cv, progress, finished, ebook, audio) =>
  ({ title, author, cv, progress: progress ?? 0, finished: finished ?? false, ebook: ebook ?? false, audio: audio ?? true })

const books = [
  mk('The Tide Between Us',    'Marian Holt',    '#3f7d8c', 0.52, false, false, true),
  mk('Embers of the North',    'Cassian Vale',   '#c4663a', 0,    false, true,  true),
  mk('Notes on Falling',       'Per Lindqvist',  '#7fa86b', 0.74, false, false, true),
  mk('Redshift Country',       'Howard Mbeki',   '#cc5b4a', 0.33, false, true,  true),
  mk('Saltwater Saints',       'Imelda Reyes',   '#4f9db0', 0.18, false, false, true),
  mk('A Geometry of Birds',    'Yuki Tanaka',    '#9b6fb8', 0,    false, true,  false),
  mk('Quiet Machines',         'Dr. Nadia Osei', '#5e76c4', 1,    true,  false, true),
  mk("The Hollow Crown's Ash", 'Cassian Vale',   '#a84738', 0,    false, true,  true),
  mk('Wavelength',             'Dr. Nadia Osei', '#4db6ac', 0.61, false, false, true),
  mk('The Far Meridian',       'Howard Mbeki',   '#5566b8', 0,    false, false, true),
]

const nowPlaying = computed(() => books[0])

/* The cover-glow accent follows whatever is playing on the player/library
   screens; other screens fall back to the brand accent prop. */
const screenAccent = computed(() => {
  if (props.screen === 'player' || props.screen === 'library') return nowPlaying.value.cv
  return props.accent
})
const glow = computed(() => (props.screen === 'player' ? 75 : 55))

/* ---- Chapters (count only; for the "Ch X / Y" label) ---- */
const chapters = { length: 56 }

/* ---- Time labels (a 13h08m book, position = progress) ---- */
const TOTAL_SECS = 13 * 3600 + 8 * 60
const fmt = (s) => {
  s = Math.max(0, Math.round(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`
}
const elapsedLabel = computed(() => fmt(progress.value * TOTAL_SECS))
const remainLabel = computed(() => fmt((1 - progress.value) * TOTAL_SECS))
// Short forms for the mini player (chapter-relative-ish, just for show)
const CH_SECS = 11 * 60 + 38
const elapsedShort = computed(() => fmt(progress.value * CH_SECS))
const remainShort = computed(() => fmt((1 - progress.value) * CH_SECS))

/* ---- Cover context menu (Library only) ---- */
const menu = ref({ open: false, x: 0, y: 0, i: 0 })
const menuBook = computed(() => books[menu.value.i] || books[0])

function openMenu(e, i) {
  const main = e.currentTarget.closest('.af-main')
  if (!main) return
  const rect = main.getBoundingClientRect()
  const sc = props.scale || 1
  let x = (e.clientX - rect.left) / sc
  let y = (e.clientY - rect.top) / sc
  const maxX = rect.width / sc - 232
  const maxY = rect.height / sc - 320
  menu.value = { open: true, x: Math.max(8, Math.min(x, maxX)), y: Math.max(8, Math.min(y, maxY)), i }
}
function closeMenu() { menu.value = { ...menu.value, open: false } }

let menuCleanup = null
onMounted(() => {
  const onDown = (e) => { if (menu.value.open && !e.target.closest('.af-ctx-menu')) closeMenu() }
  const onKey = (e) => { if (e.key === 'Escape') closeMenu() }
  window.addEventListener('mousedown', onDown)
  window.addEventListener('keydown', onKey)
  menuCleanup = () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey) }
})

/* ---- Live progress ticker (hero only) ---- */
let timer = null
function startTicker() {
  if (timer) return
  if (typeof document !== 'undefined' && document.hidden) return
  timer = setInterval(() => {
    if (!playing.value) { stopTicker(); return }
    progress.value += 0.004
    if (progress.value >= 0.99) progress.value = 0.04
  }, 300)
}
function stopTicker() { if (timer) { clearInterval(timer); timer = null } }
function onVisibility() {
  if (typeof document === 'undefined') return
  if (document.hidden) stopTicker()
  else if (playing.value) startTicker()
}
watch(playing, (v) => { if (v) startTicker(); else stopTicker() })
onMounted(() => {
  if (props.live && playing.value) startTicker()
  if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  stopTicker()
  if (menuCleanup) menuCleanup()
  if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisibility)
})

/* ---- Sidebar (mirrors the app's Sidebar component) ---- */
const user = { name: 'avery', host: 'books.home' }
const nav = [
  { id: 'home',        icon: 'home',           label: 'Home' },
  { id: 'library',     icon: 'grid_view',      label: 'Library', badge: '312' },
  { label2: 'Shelves' },
  { id: 'collections', icon: 'folder_special', label: 'Collections' },
  { id: 'playlists',   icon: 'queue_music',    label: 'Playlists' },
  { label2: 'Insights' },
  { id: 'stats',       icon: 'insights',       label: 'Stats' },
  { id: 'history',     icon: 'history',        label: 'History' },
  { id: 'player',      icon: 'graphic_eq',     label: 'Now playing' },
  { sep: true },
  { id: 'questgiver',  icon: 'favorite',       label: 'QuestGiver' },
  { id: 'discover',    icon: 'explore',        label: 'Discover' },
  { sep: true },
  { id: 'settings',    icon: 'settings',       label: 'Settings' },
]

/* ---- Library tabs (mirror the app's LibraryPage tabs) ---- */
const libTabs = [
  { icon: 'grid_view',    label: 'Books',     n: 312, on: true },
  { icon: 'auto_stories', label: 'Series',    n: 24 },
  { icon: 'person',       label: 'Authors',   n: 96 },
  { icon: 'mic',          label: 'Narrators', n: 88 },
]

/* ---- Stats (mirror the app's StatsPage) ---- */
const topBooks = [
  { title: 'The Tide Between Us', sub: 'Marian Holt · Saoirse Quinn', h: 42, rank: 1, cv: '#3f7d8c' },
  { title: 'Notes on Falling',    sub: 'Per Lindqvist · Greta Holm',  h: 27, rank: 2, cv: '#7fa86b' },
  { title: 'Redshift Country',    sub: 'Howard Mbeki',                h: 23, rank: 3, cv: '#cc5b4a' },
  { title: 'Wavelength',          sub: 'Dr. Nadia Osei',              h: 19, rank: 4, cv: '#4db6ac' },
  { title: 'Quiet Machines',      sub: 'Dr. Nadia Osei',              h: 15, rank: 5, cv: '#5e76c4' },
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

const urlLabels = { library: 'books.home / library', player: 'books.home / player', stats: 'books.home / stats', reader: 'books.home / read' }
const urlLabel = computed(() => urlLabels[props.screen] || urlLabels.library)
</script>

<style scoped>
/* CSS tokens (dark; parent passes --primary). Mirrors the app's index.css. */
.af-shell {
  --background: #1b1a18;
  --foreground: #f4f1ea;
  --card:       #2a2825;
  --popover:    #242220;
  --primary:    #e0654a;
  --muted-foreground: #aba498;
  --text-faint: #7d766b;
  --border:     #383530;
  --hairline:   rgba(255,255,255,0.08);
  --sidebar:    #131211;
  --elevated:   #322f2b;
  --fill:       rgba(255,255,255,0.06);
  --fill-strong: rgba(255,255,255,0.1);
  --brand-hearth: #bd863f;
  --wordmark-shelf: #f0e6d6;
  --on-accent:  #1b1a18;
  --glow-strength: 55;
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
.af-mono  { font-family: var(--font-mono); }
.af-mirror { transform: scaleX(-1); }

/* Screen transition */
.af-fade { animation: afFade 0.32s cubic-bezier(.2,.7,.3,1) both; }
@keyframes afFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* Browser bar */
.af-bar {
  height: 40px; display: flex; align-items: center; gap: 14px;
  padding: 0 16px; background: var(--sidebar); border-bottom: 1px solid var(--border);
}
.af-dots { display: flex; gap: 8px; }
.af-dot  { width: 11px; height: 11px; border-radius: 50%; }
.af-dot-r { background: #e0654a; }
.af-dot-y { background: #e8b54a; }
.af-dot-g { background: #7fa86b; }
.af-url-bar {
  flex: 1; max-width: 340px; margin: 0 auto; height: 24px;
  border-radius: 999px; background: var(--fill); border: 1px solid var(--border);
  display: flex; align-items: center; gap: 7px; padding: 0 12px;
  font-size: 11px; color: var(--muted-foreground); font-family: var(--font-mono);
}
.af-lock-icon { font-size: 13px; }

/* Viewport + scaling. The app shell is a [248px sidebar | 1fr] grid; we lay the
   sidebar and the main column side-by-side inside the fixed 1180x760 stage. */
.af-viewport { overflow: hidden; position: relative; background: var(--background); }
.af-inner { position: absolute; top: 0; left: 0; display: flex; }

/* Sidebar (mirrors the app's .sidebar) */
.af-sidebar {
  width: 248px; flex-shrink: 0; height: 760px;
  background: var(--sidebar); border-right: 1px solid var(--hairline);
  display: flex; flex-direction: column; padding: 24px 16px 16px; z-index: 3;
}
.af-sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0 8px 28px; }
.af-hearth-icon {
  width: 24px; height: 24px; object-fit: contain;
  filter: drop-shadow(0 0 10px color-mix(in oklab, var(--brand-hearth) 50%, transparent));
}
.af-wordmark { font-size: 19px; font-family: var(--font-brand); line-height: 1; }
.af-wm-hearth { font-weight: 400; color: var(--brand-hearth); }
.af-wm-shelf  { font-weight: 700; color: var(--wordmark-shelf); }

.af-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow: hidden; }
.af-nav-item {
  position: relative; display: flex; align-items: center; gap: 14px;
  padding: 11px 14px; border-radius: 10px; font-size: 14px; font-weight: 500;
  color: var(--muted-foreground); background: none; border: none;
  font-family: inherit; text-align: left; width: 100%;
}
.af-nav-item.active { color: var(--primary); background: color-mix(in oklab, var(--primary) 15%, transparent); }
.af-nav-item .ms { font-size: 21px; }
.af-ni-text { flex: 1; }
.af-ni-badge {
  margin-left: auto; min-width: 19px; height: 19px; padding: 0 5px; border-radius: 99px;
  background: var(--fill-strong); color: var(--muted-foreground);
  font-size: 10.5px; font-weight: 700; display: grid; place-items: center; font-variant-numeric: tabular-nums;
}
.af-ni-badge.active { background: color-mix(in oklab, var(--primary) 26%, transparent); color: var(--primary); }
/* nav-item that holds only a label/separator should not show row padding box */
.af-nav-item:has(.af-nav-label), .af-nav-item:has(.af-nav-sep) { padding: 0; }
.af-nav-label {
  display: block; width: 100%; font-size: 11px; font-weight: 600; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--text-faint); padding: 16px 14px 6px;
}
.af-nav-sep { display: block; width: calc(100% - 24px); height: 1px; background: var(--hairline); margin: 12px 12px; }

/* user chip (bottom) */
.af-user-chip {
  margin-top: auto; display: flex; align-items: center; gap: 11px;
  padding: 9px; border-radius: 14px; border: 1px solid transparent;
}
.af-sb-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-weight: 700; font-size: 14px; color: var(--on-accent);
  background: linear-gradient(150deg, var(--primary), color-mix(in oklab, var(--primary) 45%, #000));
}
.af-u-meta { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.af-u-name { font-size: 13.5px; font-weight: 600; color: var(--foreground); }
.af-u-sub  { font-size: 11.5px; color: var(--muted-foreground); }
.af-u-chev { font-size: 18px; color: var(--muted-foreground); flex: none; }

/* Main area */
.af-main { flex: 1; min-width: 0; height: 760px; overflow: hidden; position: relative; }
.af-glow-bloom {
  position: absolute; inset: 0 0 auto 0; height: 62%; pointer-events: none;
  background: radial-gradient(120% 80% at 50% -18%, color-mix(in oklab, var(--primary) calc(var(--glow-strength) * 1%), transparent) 0%, transparent 62%);
  transition: background 0.7s ease;
}
.af-glow-short { height: 50%; }
.af-main-inner { position: relative; padding: 40px 44px; height: 100%; overflow: hidden; }
.af-library-inner { padding-bottom: 110px; }

/* Library header */
.af-lib-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; }
.af-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--text-faint);
}
.af-page-title {
  font-size: 32px; font-weight: 700; letter-spacing: -0.02em; margin: 6px 0 0;
  color: var(--foreground); display: flex; align-items: baseline; gap: 14px;
}
.af-lib-count { font-size: 14px; font-weight: 500; color: var(--muted-foreground); letter-spacing: 0; }
.af-lib-filters { display: flex; gap: 8px; align-items: center; }

.af-pill {
  display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px;
  border-radius: 999px; background: var(--fill); border: 1px solid var(--hairline);
  font-size: 13px; font-weight: 500; color: var(--foreground);
}
.af-pill .ms { font-size: 17px; color: var(--muted-foreground); }
.af-lib-filters .af-pill { font-size: 12px; padding: 7px 12px; }
.af-lib-filters .af-pill .ms { font-size: 16px; }

/* Library tabs */
.af-qv-tabs { display: flex; gap: 6px; margin-bottom: 24px; }
.af-qv-tab {
  display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px;
  background: var(--fill); border: 1px solid var(--hairline); font-family: inherit;
  font-size: 13px; font-weight: 500; color: var(--muted-foreground);
}
.af-qv-tab.on { background: color-mix(in oklab, var(--primary) 15%, transparent); border-color: color-mix(in oklab, var(--primary) 40%, transparent); color: var(--primary); }
.af-qv-tab .ms { font-size: 18px; }
.af-qv-count {
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 99px; font-size: 10.5px; font-weight: 700;
  display: grid; place-items: center; background: var(--fill-strong); color: inherit; font-variant-numeric: tabular-nums;
}
.af-qv-tab.on .af-qv-count { background: color-mix(in oklab, var(--primary) 24%, transparent); }

/* Library grid */
.af-book-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 22px 18px; }
.af-book {
  position: relative; background: none; border: none; padding: 0; font-family: inherit;
  display: block; text-align: left; transition: transform 0.22s cubic-bezier(.2,.7,.3,1);
}
.af-book:hover { transform: translateY(-4px); }
.af-cover {
  border-radius: 10px; aspect-ratio: 2/3; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  box-shadow: 0 10px 28px rgba(0,0,0,0.4); transition: box-shadow 0.22s;
}
.af-book:hover .af-cover { box-shadow: 0 18px 40px rgba(0,0,0,0.55); }
.af-cover-text { padding: 9px; background: linear-gradient(transparent, rgba(0,0,0,0.65)); z-index: 2; }
.af-cover-title  { font-size: 11px; font-weight: 600; color: #fff; line-height: 1.3; }
.af-cover-author { font-size: 9px; color: rgba(255,255,255,0.7); margin-top: 2px; }

.af-hover-actions {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px;
  background: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.45)); opacity: 0; transition: opacity 0.18s; z-index: 5;
}
.af-book:hover .af-hover-actions { opacity: 1; }
.af-ha-btn, .af-ha-play {
  display: grid; place-items: center; border-radius: 50%; background: rgba(20,18,16,0.72);
  color: #fff; border: 1px solid rgba(255,255,255,0.16); backdrop-filter: blur(4px); transition: transform 0.12s, background 0.15s;
}
.af-ha-btn { width: 28px; height: 28px; }
.af-ha-btn .ms { font-size: 16px; }
.af-ha-play { width: 40px; height: 40px; background: var(--primary); border-color: transparent; }
.af-ha-play .ms { font-size: 22px; }
.af-ha-btn:hover, .af-ha-play:hover { transform: scale(1.1); }

.af-cv-fmt {
  position: absolute; top: 8px; left: 8px; z-index: 4; display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 5px; border-radius: 7px; background: rgba(20,18,16,0.66); color: rgba(255,255,255,0.92);
  font-size: 10px; font-weight: 600; backdrop-filter: blur(4px);
}
.af-cv-fmt .ms { font-size: 13px; }
.af-cv-fmt-solo { padding: 3px 8px 3px 6px; }
.af-finished-badge { position: absolute; top: 6px; right: 6px; font-size: 18px; color: #7fa86b; z-index: 4; }

.af-b-meta { padding-top: 8px; }
.af-b-title { font-size: 12.5px; font-weight: 600; color: var(--foreground); line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-b-author { font-size: 11px; color: var(--muted-foreground); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-b-prog { height: 4px; background: var(--elevated); border-radius: 99px; overflow: hidden; margin-top: 6px; }
.af-b-prog > i { display: block; height: 100%; background: var(--primary); border-radius: 99px; }

/* Cover context menu (mirrors the app's .ctx-menu) */
.af-ctx-menu {
  position: absolute; z-index: 30; min-width: 232px; background: var(--card);
  border: 1px solid var(--border); border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
  padding: 6px; animation: afCtxPop 0.12s ease;
}
@keyframes afCtxPop { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
.af-ctx-header { padding: 8px 12px 6px; }
.af-ctx-title { display: block; font-size: 13px; font-weight: 600; color: var(--foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.af-ctx-author { display: block; font-size: 11.5px; color: var(--muted-foreground); margin-top: 1px; }
.af-ctx-divider { height: 1px; background: var(--hairline); margin: 5px 8px; }
.af-mp-item {
  display: flex; align-items: center; gap: 11px; width: 100%; min-height: 34px; box-sizing: border-box;
  padding: 8px 12px; border-radius: 9px; background: none; border: none; color: var(--foreground);
  font-family: inherit; font-size: 13.5px; cursor: pointer; text-align: left; transition: background 0.12s;
}
.af-mp-item:hover { background: var(--fill); }
.af-mp-item .ms { font-size: 19px; line-height: 1; color: var(--muted-foreground); }
.af-mp-item.af-mp-on, .af-mp-item.af-mp-on .ms { color: var(--primary); }

/* Playbar (mini player) - mirrors the app's .playbar 3-column grid */
.af-playbar {
  position: absolute; left: 0; right: 0; bottom: 0; height: 84px; z-index: 6;
  display: grid; grid-template-columns: 230px 1fr 230px; align-items: center; gap: 18px; padding: 0 24px;
  background: color-mix(in oklab, var(--sidebar) 86%, transparent);
  backdrop-filter: blur(20px); border-top: 1px solid var(--hairline);
}
.af-pb-now { display: flex; align-items: center; gap: 14px; min-width: 0; }
.af-pb-cover { width: 56px; height: 56px; border-radius: 8px; flex: none; }
.af-pb-meta { min-width: 0; }
.af-pb-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-pb-sub { font-size: 12px; color: var(--muted-foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.af-pb-center { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.af-pb-controls { display: flex; align-items: center; gap: 20px; color: var(--muted-foreground); }
.af-pb-skip { position: relative; display: grid; place-items: center; color: var(--muted-foreground); }
.af-pb-skip .ms { font-size: 26px; }
.af-pb-skip small { position: absolute; top: 54%; left: 50%; transform: translate(-50%, -50%); font-size: 8px; font-weight: 700; }
.af-pb-play {
  width: 46px; height: 46px; border-radius: 50%; background: var(--foreground); color: var(--background);
  display: grid; place-items: center; flex: none;
}
.af-pb-play .ms { font-size: 26px; }
.af-pb-time { display: flex; align-items: center; gap: 12px; width: 100%; max-width: 460px; font-size: 11.5px; color: var(--muted-foreground); font-variant-numeric: tabular-nums; }
.af-pb-time .af-scrub { flex: 1; }
.af-pb-right { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.af-pb-speed { padding: 7px 12px; font-size: 12.5px; }
.af-icon-btn {
  width: 40px; height: 40px; border-radius: 50%; background: var(--fill); border: 1px solid var(--hairline);
  color: var(--foreground); display: grid; place-items: center; flex: none;
}
.af-icon-btn .ms { font-size: 20px; }

/* Scrub + progress */
.af-scrub { height: 6px; background: var(--elevated); border-radius: 99px; position: relative; }
.af-scrub > i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--primary); border-radius: 99px; }
.af-scrub > b { position: absolute; top: 50%; width: 14px; height: 14px; border-radius: 50%; background: #fff; transform: translate(-50%, -50%); box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
.af-prog-line { height: 4px; background: var(--elevated); border-radius: 99px; overflow: hidden; width: 100%; }
.af-prog-line > i { display: block; height: 100%; background: var(--primary); border-radius: 99px; }

/* Player (Now Playing) - mirrors the app's centered .player layout */
.af-player { flex: 1; min-width: 0; position: relative; height: 760px; overflow: hidden; background: var(--background); display: flex; justify-content: center; }
.af-player-glow {
  position: absolute; inset: 0 0 auto 0; height: 100%; pointer-events: none;
  background: radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--primary) 56%, transparent) 0%, transparent 60%);
}
.af-player-col { position: relative; z-index: 2; width: 460px; max-width: 100%; display: flex; flex-direction: column; align-items: center; padding: 14px 24px; }
.af-p-head { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.af-p-listening { font-size: 25px; font-weight: 700; letter-spacing: -0.02em; margin: 6px 0 0; }
.af-p-head-pills { display: flex; gap: 8px; }
.af-p-head-pills .af-pill { padding: 8px 14px; font-size: 12.5px; }
.af-sync-ok .ms { color: #7fa86b; }

.af-p-cover-wrap { position: relative; line-height: 0; }
.af-p-cover {
  width: 240px; height: 240px; border-radius: 16px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.af-p-cover-text { padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
.af-pct-title  { font-size: 18px; font-weight: 700; color: #fff; }
.af-pct-author { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.af-p-cover-prog { position: absolute; left: 12px; right: 12px; bottom: 11px; height: 3px; border-radius: 99px; background: rgba(255,255,255,0.22); overflow: hidden; }
.af-p-cover-prog > i { display: block; height: 100%; border-radius: 99px; background: rgba(255,255,255,0.9); }

.af-p-prog-row { width: 100%; display: flex; justify-content: space-between; align-items: baseline; margin: 16px 0 6px; }
.af-p-pct { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
.af-p-pct small { font-size: 16px; color: var(--muted-foreground); font-weight: 500; }
.af-p-ch { font-size: 13px; color: var(--muted-foreground); }
.af-p-times { width: 100%; display: flex; justify-content: space-between; font-size: 12px; color: var(--muted-foreground); margin-top: 8px; font-variant-numeric: tabular-nums; }

.af-p-primary { width: 100%; margin-top: 16px; text-align: center; }
.af-p-primary-label { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
.af-scrub-lg { height: 6px; }

.af-p-transport { display: flex; align-items: center; justify-content: center; gap: 24px; margin: 14px 0; }
.af-p-skip { position: relative; display: grid; place-items: center; color: var(--foreground); }
.af-p-skip .ms { font-size: 34px; }
.af-p-skip small { position: absolute; top: 54%; left: 50%; transform: translate(-50%, -50%); font-size: 9px; font-weight: 700; }
.af-p-skip.lite { color: var(--muted-foreground); }
.af-p-play {
  width: 78px; height: 78px; border-radius: 50%; background: var(--foreground); color: var(--background);
  display: grid; place-items: center; flex: none;
}
.af-p-play .ms { font-size: 40px; }

.af-action-grid { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 4px; }
.af-action-grid .af-pill { justify-content: center; padding: 11px; }

/* Stats - mirrors the app's StatsPage */
.af-stats-inner { overflow: hidden; }
.af-stats-title { margin-bottom: 22px; }
.af-hero-stat { margin-bottom: 24px; }
.af-hero-label { font-size: 13px; color: var(--muted-foreground); margin-bottom: 6px; }
.af-hero-num { font-size: 64px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.af-hero-num u { font-size: 30px; color: var(--muted-foreground); font-weight: 500; text-decoration: none; margin: 0 2px 0 1px; }
.af-hero-sub { color: var(--muted-foreground); font-size: 14px; margin-top: 10px; }

.af-stat-tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
.af-tile { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px; }
.af-t-ico { width: 38px; height: 38px; border-radius: 10px; background: var(--fill); display: grid; place-items: center; color: var(--muted-foreground); }
.af-t-ico .ms { font-size: 20px; }
.af-t-ico-hot { background: color-mix(in oklab, var(--primary) 22%, transparent); color: var(--primary); }
.af-t-num { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; margin-top: 12px; }
.af-t-cap { font-size: 13px; color: var(--muted-foreground); margin-top: 2px; }

.af-section-head { display: flex; align-items: center; gap: 9px; font-size: 15px; font-weight: 600; margin: 0 0 12px; }
.af-section-head .ms { font-size: 19px; color: var(--muted-foreground); }
.af-chart-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-bottom: 24px; }

.af-ml-row { display: flex; align-items: center; gap: 14px; padding: 7px 0; }
.af-ml-rank { font-size: 13px; color: var(--muted-foreground); width: 16px; font-variant-numeric: tabular-nums; }
.af-ml-cover { width: 28px; height: 38px; border-radius: 4px; flex: none; }
.af-ml-meta { flex: 1; min-width: 0; }
.af-ml-t { font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-ml-s { font-size: 11.5px; color: var(--muted-foreground); margin: 1px 0 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.af-ml-bar { height: 4px; background: var(--elevated); border-radius: 99px; overflow: hidden; }
.af-ml-bar > i { display: block; height: 100%; background: var(--primary); border-radius: 99px; }
.af-ml-h { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
.af-ml-h small { font-size: 11px; color: var(--muted-foreground); font-weight: 500; }

.af-bars { display: flex; align-items: flex-end; gap: 14px; height: 120px; }
.af-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.af-bar-v { font-size: 11px; color: var(--muted-foreground); font-variant-numeric: tabular-nums; }
.af-bar { width: 100%; border-radius: 6px 6px 0 0; background: var(--elevated); min-height: 4px; }
.af-bar-col.hot .af-bar { background: linear-gradient(var(--primary), color-mix(in oklab, var(--primary) 55%, transparent)); }
.af-bar-d { font-size: 11px; color: var(--muted-foreground); }

/* Reader screen (themeable) */
.af-reader {
  flex: 1; min-width: 0; height: 760px; display: flex;
  --rd-bg: #f5efe6; --rd-bg-2: #ede5d8; --rd-bg-3: #f0e9df;
  --rd-text: #2a2218; --rd-text-2: #8a7c6a; --rd-line: #ddd4c5; --rd-accent: #c68e3b;
  background: var(--rd-bg); color: var(--rd-text);
}
.af-reader-dark  { --rd-bg: #161513; --rd-bg-2: #0f0e0d; --rd-bg-3: #1c1a18; --rd-text: #e9e3d8; --rd-text-2: #8c8478; --rd-line: #2a2825; --rd-accent: #d99a52; }
.af-reader-light { --rd-bg: #fbfaf8; --rd-bg-2: #f1efe9; --rd-bg-3: #f5f3ee; --rd-text: #211f1b; --rd-text-2: #8a857b; --rd-line: #e5e1d8; --rd-accent: #c0703a; }
.af-reader-paper { --rd-bg: #e9e2d0; --rd-bg-2: #ded5c0; --rd-bg-3: #e3dbc8; --rd-text: #34301f; --rd-text-2: #8a7f63; --rd-line: #cfc4a8; --rd-accent: #9a7b34; }

.af-reader-main { flex: 1; display: flex; flex-direction: column; background: var(--rd-bg); position: relative; }
.af-reader-topbar { height: 56px; display: flex; align-items: center; gap: 16px; padding: 0 28px; border-bottom: 1px solid var(--rd-line); background: var(--rd-bg-3); flex-shrink: 0; }
.af-reader-back-btn { width: 36px; height: 36px; border-radius: 50%; background: color-mix(in oklab, var(--rd-text) 8%, transparent); border: none; display: grid; place-items: center; color: var(--rd-text); }
.af-reader-back-btn .ms { font-size: 20px; }
.af-reader-reading-info { display: flex; flex-direction: column; gap: 1px; flex: 1; }
.af-reader-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--rd-text-2); font-weight: 300; }
.af-reader-book-title { font-size: 13px; font-weight: 600; color: var(--rd-text); }
.af-reader-topbar-right { display: flex; align-items: center; gap: 8px; }
.af-reader-btn {
  display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--rd-text) 16%, transparent);
  background: color-mix(in oklab, var(--rd-bg) 50%, transparent); font-size: 13px; color: var(--rd-text); font-family: inherit;
}
.af-reader-btn .ms { font-size: 17px; }
.af-reader-btn-aa { font-weight: 600; font-size: 14px; }
.af-reader-themes { display: flex; align-items: center; gap: 10px; padding: 14px 28px 0; }
.af-reader-themes-label { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--rd-text-2); margin-right: 4px; }
.af-reader-theme-chip {
  text-transform: capitalize; font-family: inherit; font-size: 12.5px; font-weight: 600; padding: 6px 14px; border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--rd-text) 18%, transparent); background: transparent; color: var(--rd-text-2);
}
.af-reader-theme-chip.af-rt-active { border-color: var(--rd-accent); color: var(--rd-text); background: color-mix(in oklab, var(--rd-accent) 16%, transparent); }
.af-reader-body { flex: 1; overflow: hidden; display: flex; justify-content: center; padding: 40px 0 0; }
.af-reader-content { max-width: 640px; width: 100%; padding: 0 24px; }
.af-reader-chapter-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rd-text-2); margin-bottom: 18px; }
.af-reader-chapter-title { font-family: var(--font-brand); font-size: 28px; font-weight: 700; color: var(--rd-text); line-height: 1.2; margin: 0 0 18px; }
.af-reader-rule { width: 48px; height: 2px; background: var(--rd-accent); border-radius: 2px; margin-bottom: 28px; }
.af-reader-para { font-family: var(--font-brand); font-size: 17px; line-height: 1.85; color: var(--rd-text); margin: 0 0 24px; }

.af-reader-playerbar { display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 76px; border-top: 1px solid var(--rd-line); background: var(--rd-bg-2); flex-shrink: 0; }
.af-reader-playerbar .af-pb-cover { border-radius: 8px; }
.af-reader-playerbar .af-pb-title { color: var(--rd-text); }
.af-reader-playerbar .af-pb-sub { color: var(--rd-text-2); }
.af-reader-pb-controls { display: flex; align-items: center; gap: 16px; color: color-mix(in oklab, var(--rd-text) 75%, transparent); }
.af-reader-pb-controls .ms { font-size: 22px; }
.af-reader-pb-play { color: var(--rd-accent); }
.af-reader-pb-play .ms { font-size: 34px; }
.af-reader-progress-wrap { min-width: 180px; }
.af-reader-playerbar .af-scrub { background: color-mix(in oklab, var(--rd-text) 16%, transparent); }
.af-reader-playerbar .af-scrub > i { background: var(--rd-accent); }
.af-reader-pb-times { display: flex; justify-content: space-between; font-size: 11px; color: var(--rd-text-2); font-family: var(--font-mono); margin-top: 5px; }

@media (prefers-reduced-motion: reduce) {
  .af-fade { animation: none !important; }
}
</style>
