<template>
  <div
    class="af-shell dark"
    :class="{ 'af-interactive': interactive }"
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

        <!-- ===== LIBRARY ===== -->
        <div v-if="activeScreen === 'library'" class="af-screen af-library af-fade">
          <aside class="af-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <button
                v-for="item in nav" :key="item.screen"
                class="af-nav-item" :class="{ active: activeScreen === item.screen }"
                type="button" @click="go(item.screen)"
              >
                <span class="ms" :class="{ fill: activeScreen === item.screen }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
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
                <button
                  v-for="(b, i) in books" :key="b.title"
                  class="af-book-tile" type="button"
                  :class="{ 'af-book-now': i === nowIndex }"
                  @click="playBook(i)"
                  @contextmenu.prevent.stop="openMenu($event, i)"
                >
                  <div class="af-cover" :style="{ background: b.cv }">
                    <div v-if="b.progress > 0 && b.progress < 1" class="af-progress-bar">
                      <div class="af-progress-fill" :style="{ width: (b.progress * 100) + '%' }"></div>
                    </div>
                    <div v-if="b.finished" class="af-finished-badge"><span class="ms fill">check_circle</span></div>
                    <div v-if="b.ebook" class="af-cv-fmt" :class="{ 'af-cv-fmt-solo': b.ebook && !b.audio }">
                      <span class="ms fill">{{ b.ebook && !b.audio ? 'menu_book' : 'auto_stories' }}</span>
                      <span v-if="b.ebook && !b.audio">Read</span>
                    </div>
                    <!-- hover-reveal actions, matching the app's BookTile -->
                    <div class="af-hover-actions" @click.stop>
                      <span class="af-ha-btn" title="Add to list"><span class="ms">playlist_add</span></span>
                      <span class="af-ha-play" :title="b.ebook && !b.audio ? 'Read' : 'Play'" @click="playBook(i)">
                        <span class="ms fill">{{ b.ebook && !b.audio ? 'menu_book' : 'play_arrow' }}</span>
                      </span>
                      <span class="af-ha-btn" :title="b.finished ? 'Mark not finished' : 'Mark finished'"><span class="ms" :class="{ fill: b.finished }">check</span></span>
                    </div>
                    <div class="af-cover-text">
                      <div class="af-cover-title">{{ b.title }}</div>
                      <div class="af-cover-author">{{ b.author }}</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="af-playbar" @click="go('player')">
              <div class="af-pb-cover" :style="{ background: nowPlaying.cv }"></div>
              <div class="af-pb-info">
                <div class="af-pb-title">{{ nowPlaying.title }}</div>
                <div class="af-pb-author">{{ nowPlaying.author }} · {{ nowPlaying.kicker }}</div>
              </div>
              <div class="af-pb-controls" @click.stop>
                <span class="ms">replay_30</span>
                <span class="ms">skip_previous</span>
                <span class="ms fill af-pb-play" role="button" @click="togglePlay">{{ playing ? 'pause_circle' : 'play_circle' }}</span>
                <span class="ms">skip_next</span>
                <span class="ms">forward_30</span>
              </div>
              <div class="af-pb-right">
                <span class="af-speed-badge">1.4×</span>
                <div class="af-pb-progress">
                  <div class="af-pb-prog-fill" :style="{ width: (progress * 100) + '%' }"></div>
                </div>
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
              <button class="af-mp-item" type="button" @click="menuAction()"><span class="ms">info</span>View details</button>
              <button v-if="menuBook.audio" class="af-mp-item" type="button" @click="menuAction(() => playBook(menu.i))"><span class="ms fill">play_arrow</span>Play</button>
              <button v-if="menuBook.ebook" class="af-mp-item" type="button" @click="menuAction(() => go('reader'))"><span class="ms fill">menu_book</span>Read</button>
              <div class="af-ctx-divider"></div>
              <button class="af-mp-item" type="button" @click="menuAction()"><span class="ms">reorder</span>Add to queue</button>
              <button class="af-mp-item" type="button" @click="menuAction()"><span class="ms">folder_special</span>Add to collection</button>
              <button class="af-mp-item" type="button" @click="menuAction()"><span class="ms">queue_music</span>Add to playlist</button>
              <div class="af-ctx-divider"></div>
              <button class="af-mp-item" :class="{ 'af-mp-on': menuBook.finished }" type="button" @click="menuAction()">
                <span class="ms" :class="{ fill: menuBook.finished }">check_circle</span>{{ menuBook.finished ? 'Mark as unfinished' : 'Mark as finished' }}
              </button>
              <button v-if="menuBook.progress > 0 && !menuBook.finished" class="af-mp-item" type="button" @click="menuAction()"><span class="ms">replay</span>Reset progress</button>
            </div>
          </div>
        </div>

        <!-- ===== PLAYER ===== -->
        <div v-else-if="activeScreen === 'player'" class="af-screen af-player af-fade">
          <div class="af-player-glow"></div>
          <button class="af-player-back" type="button" @click="go('library')">
            <span class="ms af-muted">expand_more</span>
            <span class="af-eyebrow">Now playing</span>
          </button>
          <div class="af-player-layout">
            <!-- Left: cover + controls -->
            <div class="af-player-left">
              <div class="af-player-cover" :class="{ 'af-cover-spin': playing }" :style="{ background: nowPlaying.cv }">
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
                  <div class="af-scrub-fill" :style="{ width: (progress * 100) + '%' }"></div>
                  <div class="af-scrub-thumb" :style="{ left: (progress * 100) + '%' }"></div>
                </div>
                <div class="af-scrub-times"><span>{{ elapsedLabel }}</span><span>{{ remainLabel }}</span></div>
              </div>
              <div class="af-transport">
                <span class="ms af-muted af-tap" style="font-size:30px" @click="nudge(-0.04)">replay_30</span>
                <span class="ms af-muted af-tap" style="font-size:28px" @click="prevChapter">skip_previous</span>
                <button class="af-play-btn" type="button" @click="togglePlay">
                  <span class="ms fill" style="font-size:34px">{{ playing ? 'pause' : 'play_arrow' }}</span>
                </button>
                <span class="ms af-muted af-tap" style="font-size:28px" @click="nextChapter">skip_next</span>
                <span class="ms af-muted af-tap" style="font-size:30px" @click="nudge(0.04)">forward_30</span>
              </div>
              <div class="af-transport-extras">
                <span class="af-speed-pill af-tap" @click="cycleSpeed">{{ speed }}×</span>
                <span class="af-icon-btn af-tap" :class="{ 'af-icon-on': sleepOn }" @click="sleepOn = !sleepOn"><span class="ms">bedtime</span></span>
                <span class="af-icon-btn af-tap" :class="{ 'af-icon-on': bookmarked }" @click="bookmarked = !bookmarked"><span class="ms">{{ bookmarked ? 'bookmark' : 'bookmark_add' }}</span></span>
              </div>
            </div>
            <!-- Right: chapters -->
            <div class="af-chapters-panel">
              <div class="af-ch-header">
                <span class="af-ch-title">Chapters</span>
                <span class="af-ch-pos af-mono">Ch {{ chapterIndex + 29 }} / 56</span>
              </div>
              <button
                v-for="(c, i) in chapters" :key="c.title"
                class="af-ch-row" type="button"
                :class="{ 'af-ch-now': i === chapterIndex, 'af-ch-done': i < chapterIndex }"
                @click="selectChapter(i)"
              >
                <span class="ms" :class="{ fill: i === chapterIndex || i < chapterIndex }" :style="{ color: chapterColor(i), fontSize: '20px' }">{{ chapterIcon(i) }}</span>
                <span class="af-ch-name" :style="{ color: i === chapterIndex ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: i === chapterIndex ? 700 : 500 }">{{ c.title }}</span>
                <span class="af-ch-dur af-mono">{{ c.dur }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ===== READER ===== -->
        <div v-else-if="activeScreen === 'reader'" class="af-screen af-reader af-fade" :class="'af-reader-' + readerTheme">
          <!-- Left sidebar (collapsed nav) -->
          <aside class="af-sidebar af-reader-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <button
                v-for="item in nav" :key="item.screen"
                class="af-nav-item" :class="{ active: activeScreen === item.screen }"
                type="button" @click="go(item.screen)"
              >
                <span class="ms" :class="{ fill: activeScreen === item.screen }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </aside>
          <!-- Reader main -->
          <div class="af-reader-main">
            <!-- Top chrome -->
            <div class="af-reader-topbar">
              <button class="af-reader-back-btn" type="button" @click="go('library')">
                <span class="ms">arrow_back</span>
              </button>
              <div class="af-reader-reading-info">
                <span class="af-reader-eyebrow">Reading · Eira Sundqvist</span>
                <span class="af-reader-book-title">Ashen Roads</span>
              </div>
              <div class="af-reader-topbar-right">
                <button class="af-reader-btn" type="button" @click="go('player')"><span class="ms">headphones</span></button>
                <button class="af-reader-btn" type="button"><span class="ms">list</span>Chapters</button>
                <button class="af-reader-btn af-reader-btn-aa" type="button" @click="cycleReaderTheme">Aa</button>
              </div>
            </div>
            <!-- Theme switcher row -->
            <div class="af-reader-themes">
              <span class="af-reader-themes-label">Theme</span>
              <button
                v-for="t in readerThemes" :key="t"
                class="af-reader-theme-chip" type="button"
                :class="['af-rt-' + t, { 'af-rt-active': readerTheme === t }]"
                @click="readerTheme = t"
              >{{ t }}</button>
            </div>
            <!-- Reading content -->
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
                <span class="ms fill af-pb-play" role="button" @click="togglePlay">{{ playing ? 'pause_circle' : 'play_circle' }}</span>
                <span class="ms">skip_next</span>
              </div>
              <div class="af-pb-right">
                <div class="af-reader-progress-wrap">
                  <div class="af-scrub-track" style="height:3px">
                    <div class="af-scrub-fill" :style="{ width: (progress * 100) + '%' }"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted-foreground);font-family:var(--font-mono);margin-top:4px">
                    <span>{{ elapsedLabel }}</span><span>{{ remainLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== STATS ===== -->
        <div v-else-if="activeScreen === 'stats'" class="af-screen af-stats-screen af-fade">
          <aside class="af-sidebar">
            <div class="af-sidebar-logo">
              <span class="ms fill af-hearth-icon">local_fire_department</span>
              <span class="af-wordmark"><span class="af-wm-hearth">Hearth</span><span class="af-wm-shelf">Shelf</span></span>
            </div>
            <nav class="af-nav">
              <button
                v-for="item in nav" :key="item.screen"
                class="af-nav-item" :class="{ active: activeScreen === item.screen }"
                type="button" @click="go(item.screen)"
              >
                <span class="ms" :class="{ fill: activeScreen === item.screen }">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
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
                    <div v-for="d in week" :key="d.key" class="af-bar-col">
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  screen: { type: String, default: 'library' },
  scale: { type: Number, default: 0.6 },
  accent: { type: String, default: '#e0654a' },
  // When true the frame drives its own progress and lets the visitor navigate.
  interactive: { type: Boolean, default: false },
  // Auto-advance the progress bar even when not "playing" (used for the hero).
  live: { type: Boolean, default: false },
})

const VW = 1180
const VH = 760
const scaledW = Math.round(VW * props.scale)
const scaledH = Math.round(VH * props.scale)

/* ---- State ---- */
const activeScreen = ref(props.screen)
const playing = ref(props.live)
const progress = ref(0.52)
const chapterIndex = ref(2)
const speed = ref(1.4)
const sleepOn = ref(false)
const bookmarked = ref(false)
const readerTheme = ref('sepia')
const readerThemes = ['dark', 'sepia', 'light', 'paper']

/* ---- Books ---- */
const mk = (title, author, narrator, kicker, cv, progress, finished, ebook, audio) =>
  ({ title, author, narrator, kicker, cv, progress: progress ?? 0, finished: finished ?? false, ebook: ebook ?? false, audio: audio ?? true })

//   mk(title, author, narrator, kicker, cv, progress, finished, ebook, audio)
const books = [
  mk('The Tide Between Us',   'Marian Holt',    'Saoirse Quinn',  'A Novel',   '#3f7d8c', 0.52, false, false, true),
  mk('Embers of the North',   'Cassian Vale',   'Tom Aldridge',   'Ashfall · I','#c4663a', 0,    false, true,  true),
  mk('Notes on Falling',      'Per Lindqvist',  'Greta Holm',     'Memoir',    '#7fa86b', 0.74, false, false, true),
  mk('Redshift Country',      'Howard Mbeki',   'Howard Mbeki',   'Sci-Fi',    '#cc5b4a', 0.33, false, true,  true),
  mk('Saltwater Saints',      'Imelda Reyes',   'Lucia Marin',    'A Novel',   '#4f9db0', 0.18, false, false, true),
  mk('A Geometry of Birds',   'Yuki Tanaka',    'Mei Kowalski',   'Poetry',    '#9b6fb8', 0,    false, true,  false),
  mk('Quiet Machines',        'Dr. Nadia Osei', 'Nadia Osei',     'Nonfiction','#5e76c4', 1,    true,  false, true),
  mk("The Hollow Crown's Ash",'Cassian Vale',   'Tom Aldridge',   'Ashfall · III','#a84738', 0,  false, true,  true),
  mk('Wavelength',            'Dr. Nadia Osei', 'Nadia Osei',     'Nonfiction','#4db6ac', 0.61, false, false, true),
  mk('The Far Meridian',      'Howard Mbeki',   'Howard Mbeki',   'Sci-Fi',    '#5566b8', 0,    false, false, true),
]

const nowIndex = ref(0)
const nowPlaying = computed(() => books[nowIndex.value])

/* The cover-glow accent follows whatever is playing on the player/library
   screens; other screens fall back to the brand accent prop. */
const screenAccent = computed(() => {
  if (activeScreen.value === 'player' || activeScreen.value === 'library') return nowPlaying.value.cv
  return props.accent
})
const glow = computed(() => (activeScreen.value === 'player' ? 75 : 60))

/* ---- Chapters ---- */
const chapters = [
  { title: 'Chapter 29', dur: '14:02' },
  { title: 'Chapter 30', dur: '11:38' },
  { title: 'Chapter 31', dur: '16:20' },
  { title: 'Chapter 32', dur: '12:55' },
  { title: 'Chapter 33', dur: '09:41' },
  { title: 'Chapter 34', dur: '15:10' },
  { title: 'Chapter 35', dur: '13:27' },
]
const chapterIcon = (i) => (i === chapterIndex.value ? (playing.value ? 'graphic_eq' : 'play_circle') : i < chapterIndex.value ? 'check_circle' : 'play_circle')
const chapterColor = (i) => (i === chapterIndex.value ? 'var(--primary)' : 'var(--muted-foreground)')

/* ---- Time labels (a 13h08m book, position = progress) ---- */
const TOTAL_SECS = 13 * 3600 + 8 * 60
const fmt = (s) => {
  s = Math.max(0, Math.round(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
const elapsedLabel = computed(() => fmt(progress.value * TOTAL_SECS))
const remainLabel = computed(() => '-' + fmt((1 - progress.value) * TOTAL_SECS))

/* ---- Interactions ---- */
const canInteract = computed(() => props.interactive)

function go(screen) {
  if (!canInteract.value) return
  activeScreen.value = screen
}
function togglePlay() {
  if (!canInteract.value && !props.live) return
  playing.value = !playing.value
}
function playBook(i) {
  if (!canInteract.value) return
  nowIndex.value = i
  playing.value = true
  if (books[i].progress > 0 && books[i].progress < 1) progress.value = books[i].progress
}
function selectChapter(i) {
  if (!canInteract.value) return
  chapterIndex.value = i
  progress.value = Math.min(0.97, 0.18 + i * 0.12)
}
function nextChapter() { if (canInteract.value && chapterIndex.value < chapters.length - 1) selectChapter(chapterIndex.value + 1) }
function prevChapter() { if (canInteract.value && chapterIndex.value > 0) selectChapter(chapterIndex.value - 1) }
function nudge(d) {
  if (!canInteract.value) return
  progress.value = Math.min(0.99, Math.max(0, progress.value + d))
}
function cycleSpeed() {
  if (!canInteract.value) return
  const steps = [1, 1.2, 1.4, 1.6, 2]
  speed.value = steps[(steps.indexOf(speed.value) + 1) % steps.length]
}
function cycleReaderTheme() {
  if (!canInteract.value) return
  readerTheme.value = readerThemes[(readerThemes.indexOf(readerTheme.value) + 1) % readerThemes.length]
}

/* ---- Cover context menu ---- */
const menu = ref({ open: false, x: 0, y: 0, i: 0 })
const menuBook = computed(() => books[menu.value.i] || books[0])

function openMenu(e, i) {
  if (!canInteract.value) return
  // Position relative to the scaled .af-main container the menu lives in.
  const main = e.currentTarget.closest('.af-main')
  const rect = main.getBoundingClientRect()
  const sc = props.scale || 1
  let x = (e.clientX - rect.left) / sc
  let y = (e.clientY - rect.top) / sc
  // Keep the menu inside the main viewport (menu ~ 220x300 in unscaled units).
  const maxX = rect.width / sc - 224
  const maxY = rect.height / sc - 304
  menu.value = { open: true, x: Math.max(8, Math.min(x, maxX)), y: Math.max(8, Math.min(y, maxY)), i }
}
function closeMenu() { menu.value = { ...menu.value, open: false } }
function menuAction(fn) { closeMenu(); if (fn) fn() }

onMounted(() => {
  const onDown = (e) => { if (menu.value.open && !e.target.closest('.af-ctx-menu')) closeMenu() }
  const onKey = (e) => { if (e.key === 'Escape') closeMenu() }
  window.addEventListener('mousedown', onDown)
  window.addEventListener('keydown', onKey)
  menuCleanup = () => { window.removeEventListener('mousedown', onDown); window.removeEventListener('keydown', onKey) }
})
let menuCleanup = null

/* ---- Live progress ticker ----
   Runs only while something is actually playing, so idle frames hold no timer. */
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

/* ---- Static data ---- */
const tiles = [
  { ico: 'local_fire_department', num: '23',   cap: 'Day streak',       fill: true,  color: 'var(--primary)' },
  { ico: 'emoji_events',          num: '64',   cap: 'Longest streak',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'task_alt',              num: '48',   cap: 'Books finished',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'headphones',            num: '1.4×', cap: 'Avg. speed',       fill: false, color: 'var(--muted-foreground)' },
  { ico: 'calendar_month',        num: '19',   cap: 'This month (h)',   fill: false, color: 'var(--muted-foreground)' },
  { ico: 'menu_book',             num: '6',    cap: 'In progress',      fill: false, color: 'var(--muted-foreground)' },
]

const wraw = [1.2, 2.4, 0.8, 3.1, 1.9, 4.2, 2.7]
const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({ d, key: d + i, h: Math.round(wraw[i] / 4.2 * 108) }))

const friends = [
  { name: 'Ari Mensah',    h: 42, rank: 1, cv: '#c4663a' },
  { name: 'Lena Park',     h: 27, rank: 2, cv: '#5e76c4' },
  { name: 'Theo Vance',    h: 23, rank: 3, cv: '#7fa86b' },
  { name: 'Jordan Reese',  h: 19, rank: 4, cv: '#e0654a', me: true },
  { name: 'Priya Rao',     h: 15, rank: 5, cv: '#4f9db0' },
].map(f => ({ ...f, initial: f.name[0], weight: f.me ? 700 : 500, nameColor: f.me ? 'var(--primary)' : 'var(--foreground)' }))

const nav = [
  { icon: 'grid_view',    label: 'Library', screen: 'library' },
  { icon: 'play_circle',  label: 'Player',  screen: 'player' },
  { icon: 'menu_book',    label: 'Reader',  screen: 'reader' },
  { icon: 'insights',     label: 'Stats',   screen: 'stats' },
]

const urlLabels = { library: 'hearthshelf.home / library', player: 'hearthshelf.home / player', stats: 'hearthshelf.home / stats', reader: 'hearthshelf.home / read' }
const urlLabel = computed(() => urlLabels[activeScreen.value] || urlLabels.library)
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

/* Screen transition */
.af-fade { animation: afFade 0.32s cubic-bezier(.2,.7,.3,1) both; }
@keyframes afFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

/* Interactive affordances */
.af-tap { cursor: pointer; transition: color 0.15s, transform 0.1s; }
.af-interactive .af-tap:hover { color: var(--foreground); }
.af-tap:active { transform: scale(0.92); }
.af-interactive .af-nav-item,
.af-interactive .af-book-tile,
.af-interactive .af-ch-row,
.af-interactive .af-playbar,
.af-interactive .af-pb-play,
.af-interactive .af-play-btn,
.af-interactive .af-reader-back-btn,
.af-interactive .af-player-back,
.af-interactive .af-reader-btn,
.af-interactive .af-reader-theme-chip { cursor: pointer; }

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
  background: none;
  border: none;
  font-family: inherit;
  text-align: left;
  width: 100%;
  transition: background 0.16s, color 0.16s;
}
.af-nav-item.active {
  background: color-mix(in oklab, var(--primary) 14%, transparent);
  color: var(--foreground);
}
.af-interactive .af-nav-item:hover:not(.active) {
  background: var(--fill);
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
  transition: background 0.7s ease;
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
.af-book-tile {
  position: relative;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  display: block;
  text-align: left;
  transition: transform 0.22s cubic-bezier(.2,.7,.3,1);
}
.af-interactive .af-book-tile:hover { transform: translateY(-4px); }
.af-cover {
  border-radius: 10px;
  aspect-ratio: 2/3;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 10px 28px rgba(0,0,0,0.4);
  transition: box-shadow 0.22s;
}
.af-interactive .af-book-tile:hover .af-cover {
  box-shadow: 0 18px 40px rgba(0,0,0,0.55);
}
.af-book-now .af-cover {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
.af-cover-text {
  padding: 10px;
  background: linear-gradient(transparent, rgba(0,0,0,0.65));
  z-index: 2;
}
.af-cover-title  { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; }
.af-cover-author { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; }

/* hover-reveal action buttons over a cover (matches the app's BookTile) */
.af-hover-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.45));
  opacity: 0;
  transition: opacity 0.18s;
  z-index: 5;
}
.af-interactive .af-book-tile:hover .af-hover-actions { opacity: 1; }
.af-ha-btn, .af-ha-play {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(20,18,16,0.72);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(4px);
  transition: transform 0.12s, background 0.15s;
}
.af-ha-btn { width: 30px; height: 30px; }
.af-ha-btn .ms { font-size: 17px; }
.af-ha-play { width: 42px; height: 42px; background: var(--primary); border-color: transparent; }
.af-ha-play .ms { font-size: 24px; }
.af-interactive .af-ha-btn:hover, .af-interactive .af-ha-play:hover { transform: scale(1.1); }

/* format badge (audiobook + ebook, or ebook-only) */
.af-cv-fmt {
  position: absolute;
  top: 8px; left: 8px;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 5px;
  border-radius: 7px;
  background: rgba(20,18,16,0.66);
  color: rgba(255,255,255,0.92);
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}
.af-cv-fmt .ms { font-size: 14px; }
.af-cv-fmt-solo { padding: 3px 8px 3px 6px; }

.af-progress-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.2);
  z-index: 4;
}
.af-progress-fill { height: 100%; background: #f59e0b; }
.af-finished-badge {
  position: absolute;
  top: 6px; right: 6px;
  font-size: 18px;
  color: #7fa86b;
  z-index: 4;
}

/* ── Cover context menu (mirrors the app's .ctx-menu) ── */
.af-ctx-menu {
  position: absolute;
  z-index: 30;
  min-width: 224px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03);
  padding: 6px;
  animation: afCtxPop 0.12s ease;
}
@keyframes afCtxPop { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
.af-ctx-header { padding: 8px 12px 6px; }
.af-ctx-title { display: block; font-size: 13px; font-weight: 600; color: var(--foreground); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.af-ctx-author { display: block; font-size: 11.5px; color: var(--muted-foreground); margin-top: 1px; }
.af-ctx-divider { height: 1px; background: var(--border); margin: 5px 8px; }
.af-mp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 34px;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 9px;
  background: none;
  border: none;
  color: var(--foreground);
  font-family: inherit;
  font-size: 13.5px;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}
.af-mp-item:hover { background: var(--fill); }
.af-mp-item .ms { font-size: 18px; line-height: 1; color: var(--muted-foreground); }
.af-mp-item.af-mp-on, .af-mp-item.af-mp-on .ms { color: var(--primary); }

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
  transition: background 0.15s;
}
.af-interactive .af-playbar:hover { background: var(--sidebar); }
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
.af-pb-play { font-size: 36px !important; color: var(--primary); transition: transform 0.12s; }
.af-interactive .af-pb-play:hover { transform: scale(1.1); }
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
.af-pb-prog-fill { height: 100%; background: var(--primary); transition: width 0.12s linear; }

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
  transition: background 0.7s ease;
}
.af-player-back {
  position: absolute;
  top: 22px; left: 28px;
  display: flex;
  align-items: center;
  gap: 9px;
  z-index: 4;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
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
.af-cover-spin { animation: afBreathe 5s ease-in-out infinite; }
@keyframes afBreathe {
  0%, 100% { transform: scale(1); box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  50% { transform: scale(1.012); box-shadow: 0 14px 54px color-mix(in oklab, var(--primary) 35%, rgba(0,0,0,0.5)); }
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
  transition: width 0.12s linear;
}
.af-scrub-thumb {
  position: absolute;
  top: 50%;
  width: 15px; height: 15px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  transition: left 0.12s linear;
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
  border: none;
  transition: transform 0.12s;
}
.af-interactive .af-play-btn:hover { transform: scale(1.06); }
.af-play-btn:active { transform: scale(0.94); }
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
  transition: background 0.15s, border-color 0.15s;
}
.af-icon-btn .ms { font-size: 20px; color: var(--foreground); }
.af-icon-on {
  background: color-mix(in oklab, var(--primary) 18%, transparent);
  border-color: color-mix(in oklab, var(--primary) 45%, transparent);
}
.af-icon-on .ms { color: var(--primary); }

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
  width: 100%;
  background: none;
  border: none;
  font-family: inherit;
  text-align: left;
  transition: background 0.16s;
}
.af-ch-row.af-ch-now {
  background: color-mix(in oklab, var(--primary) 16%, transparent);
}
.af-interactive .af-ch-row:hover:not(.af-ch-now) { background: var(--fill); }
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

/* ── Reader screen (themeable) ── */
.af-reader {
  display: flex;
  --rd-bg: #f5efe6;
  --rd-bg-2: #ede5d8;
  --rd-bg-3: #f0e9df;
  --rd-text: #2a2218;
  --rd-text-2: #8a7c6a;
  --rd-line: #ddd4c5;
  --rd-accent: #c68e3b;
  background: var(--rd-bg);
  color: var(--rd-text);
}
/* sepia (default) keeps the base tokens */
.af-reader-dark {
  --rd-bg: #161513;
  --rd-bg-2: #0f0e0d;
  --rd-bg-3: #1c1a18;
  --rd-text: #e9e3d8;
  --rd-text-2: #8c8478;
  --rd-line: #2a2825;
  --rd-accent: #d99a52;
}
.af-reader-light {
  --rd-bg: #fbfaf8;
  --rd-bg-2: #f1efe9;
  --rd-bg-3: #f5f3ee;
  --rd-text: #211f1b;
  --rd-text-2: #8a857b;
  --rd-line: #e5e1d8;
  --rd-accent: #c0703a;
}
.af-reader-paper {
  --rd-bg: #e9e2d0;
  --rd-bg-2: #ded5c0;
  --rd-bg-3: #e3dbc8;
  --rd-text: #34301f;
  --rd-text-2: #8a7f63;
  --rd-line: #cfc4a8;
  --rd-accent: #9a7b34;
}

.af-reader-sidebar {
  background: var(--rd-bg-2);
  border-right: 1px solid var(--rd-line);
}
.af-reader-sidebar .af-hearth-icon { color: var(--rd-accent); }
.af-reader-sidebar .af-wm-hearth   { color: var(--rd-accent); }
.af-reader-sidebar .af-wm-shelf    { color: var(--rd-text); }
.af-reader-sidebar .af-nav-item    { color: var(--rd-text-2); }
.af-reader-sidebar .af-nav-item.active { background: color-mix(in oklab, var(--rd-accent) 16%, transparent); color: var(--rd-text); }
.af-interactive .af-reader-sidebar .af-nav-item:hover:not(.active) { background: color-mix(in oklab, var(--rd-accent) 9%, transparent); color: var(--rd-text); }

.af-reader-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--rd-bg);
  position: relative;
}

.af-reader-topbar {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 28px;
  border-bottom: 1px solid var(--rd-line);
  background: var(--rd-bg-3);
  flex-shrink: 0;
}

.af-reader-back-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: color-mix(in oklab, var(--rd-text) 8%, transparent);
  border: none;
  display: grid;
  place-items: center;
  color: var(--rd-text);
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
  color: var(--rd-text-2);
  font-weight: 300;
}
.af-reader-book-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--rd-text);
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
  border: 1px solid color-mix(in oklab, var(--rd-text) 16%, transparent);
  background: color-mix(in oklab, var(--rd-bg) 50%, transparent);
  font-size: 13px;
  color: var(--rd-text);
  font-family: inherit;
  transition: background 0.15s;
}
.af-interactive .af-reader-btn:hover { background: color-mix(in oklab, var(--rd-accent) 14%, transparent); }
.af-reader-btn .ms { font-size: 17px; }
.af-reader-btn-aa { font-weight: 600; font-size: 14px; }

/* Theme switcher row */
.af-reader-themes {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px 0;
}
.af-reader-themes-label {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--rd-text-2);
  margin-right: 4px;
}
.af-reader-theme-chip {
  text-transform: capitalize;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--rd-text) 18%, transparent);
  background: transparent;
  color: var(--rd-text-2);
  transition: border-color 0.16s, color 0.16s, background 0.16s;
}
.af-reader-theme-chip.af-rt-active {
  border-color: var(--rd-accent);
  color: var(--rd-text);
  background: color-mix(in oklab, var(--rd-accent) 16%, transparent);
}

.af-reader-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 40px 0 0;
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
  color: var(--rd-text-2);
  margin-bottom: 18px;
}

.af-reader-chapter-title {
  font-family: var(--font-brand);
  font-size: 28px;
  font-weight: 700;
  color: var(--rd-text);
  line-height: 1.2;
  margin: 0 0 18px;
}

.af-reader-rule {
  width: 48px;
  height: 2px;
  background: var(--rd-accent);
  border-radius: 2px;
  margin-bottom: 28px;
}

.af-reader-para {
  font-family: var(--font-brand);
  font-size: 17px;
  line-height: 1.85;
  color: var(--rd-text);
  margin: 0 0 24px;
}

.af-reader-playerbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 76px;
  border-top: 1px solid var(--rd-line);
  background: var(--rd-bg-2);
  flex-shrink: 0;
}
.af-reader-playerbar .af-pb-cover { border-radius: 8px; }
.af-reader-playerbar .af-pb-title { color: var(--rd-text); }
.af-reader-playerbar .af-pb-author { color: var(--rd-text-2); }
.af-reader-playerbar .af-pb-controls { color: color-mix(in oklab, var(--rd-text) 75%, transparent); }
.af-reader-playerbar .af-pb-play { color: var(--rd-accent); font-size: 34px !important; }
.af-reader-playerbar .af-scrub-track { background: color-mix(in oklab, var(--rd-text) 16%, transparent); }
.af-reader-playerbar .af-scrub-fill { background: var(--rd-accent); }

.af-reader-progress-wrap { min-width: 160px; }

@media (prefers-reduced-motion: reduce) {
  .af-fade, .af-cover-spin { animation: none !important; }
}
</style>
