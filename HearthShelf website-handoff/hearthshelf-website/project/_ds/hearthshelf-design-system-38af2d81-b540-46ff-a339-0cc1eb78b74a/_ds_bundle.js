/* @ds-bundle: {"format":3,"namespace":"AudplexusDesignSystem_019e15","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"NavItem","sourcePath":"components/core/NavItem.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"Stars","sourcePath":"components/core/Stars.jsx"},{"name":"HoverActions","sourcePath":"components/media/BookTile.jsx"},{"name":"BookTile","sourcePath":"components/media/BookTile.jsx"},{"name":"Cover","sourcePath":"components/media/Cover.jsx"},{"name":"PlayBar","sourcePath":"components/media/PlayBar.jsx"}],"sourceHashes":{"app/app.jsx":"a50352847477","app/components.jsx":"64a68e906231","app/data.js":"f0cf98d71bfd","app/screens.jsx":"fbd274dbca39","app/tweaks-panel.jsx":"6591467622ed","components/core/Badge.jsx":"f23d009e5e19","components/core/Button.jsx":"ed3d98b8acd8","components/core/NavItem.jsx":"3fad62bd768b","components/core/ProgressBar.jsx":"71b2de7032d6","components/core/Stars.jsx":"fb0a70acd885","components/media/BookTile.jsx":"affb5583ff24","components/media/Cover.jsx":"28233ce3f16b","components/media/PlayBar.jsx":"20c4ea37f05c"},"inlinedExternals":[],"unexposedExports":[{"name":"onColor","sourcePath":"components/media/Cover.jsx"}]} */

;(() => {
  const __ds_ns = (window.AudplexusDesignSystem_019e15 = window.AudplexusDesignSystem_019e15 || {})

  const __ds_scope = {}

  __ds_ns.__errors = __ds_ns.__errors || []

  // app/app.jsx
  try {
    ;(() => {
      /* HearthShelf — app shell: routing, now-playing, dynamic glow, settings. */
      const EMBER = '#e0654a'
      const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
        theme: 'dark',
        accentMode: 'manual',
        accentHex: '#e0654a',
        glow: 60,
        coverStyle: 'cards',
        colorEverywhere: true,
      } /*EDITMODE-END*/

      /* ---------- Settings screen (mirrors the Tweaks panel) ---------- */
      function Settings({ t, setTweak }) {
        const Seg = ({ value, options, onChange }) =>
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'seg',
            },
            options.map((o) =>
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  key: o.v,
                  className: value === o.v ? 'on' : '',
                  onClick: () => onChange(o.v),
                },
                o.l,
              ),
            ),
          )
        const Toggle = ({ on, onClick }) =>
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'toggle' + (on ? ' on' : ''),
              onClick: onClick,
            },
            /*#__PURE__*/ React.createElement('i', null),
          )
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'page fade-in',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page-head',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'eyebrow',
              },
              'Make it yours',
            ),
            /*#__PURE__*/ React.createElement(
              'h1',
              {
                className: 'title-xl',
              },
              'Settings',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'nav-label',
              style: {
                padding: '0 4px 10px',
              },
            },
            'Appearance',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'set-group',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Theme',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Dark is home; light for daytime reading.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Seg, {
                value: t.theme,
                onChange: (v) => setTweak('theme', v),
                options: [
                  {
                    v: 'dark',
                    l: 'Dark',
                  },
                  {
                    v: 'light',
                    l: 'Light',
                  },
                ],
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Accent from cover',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Let the artwork colour the controls and glow.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Toggle, {
                on: t.accentMode === 'dynamic',
                onClick: () =>
                  setTweak('accentMode', t.accentMode === 'dynamic' ? 'manual' : 'dynamic'),
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
                style: {
                  opacity: t.accentMode === 'dynamic' ? 0.45 : 1,
                  pointerEvents: t.accentMode === 'dynamic' ? 'none' : 'auto',
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Manual accent',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Pick a fixed colour for chrome.',
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'swatch-row',
                },
                HS.PRESETS.map((p) =>
                  /*#__PURE__*/ React.createElement('div', {
                    key: p.name,
                    title: p.name,
                    className: 'swatch' + (t.accentHex === p.hex ? ' on' : ''),
                    style: {
                      background: p.hex,
                    },
                    onClick: () => setTweak('accentHex', p.hex),
                  }),
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Cover-glow intensity',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'How strongly the cover blooms behind the page.',
                ),
              ),
              /*#__PURE__*/ React.createElement('input', {
                type: 'range',
                min: '0',
                max: '60',
                value: t.glow,
                onChange: (e) => setTweak('glow', +e.target.value),
                style: {
                  width: 180,
                  accentColor: 'var(--accent)',
                },
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Cover style',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Float artwork on the page, or sit it on cards.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Seg, {
                value: t.coverStyle,
                onChange: (v) => setTweak('coverStyle', v),
                options: [
                  {
                    v: 'floating',
                    l: 'Floating',
                  },
                  {
                    v: 'cards',
                    l: 'Cards',
                  },
                ],
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Colour everywhere',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Tint the whole app, not just the player.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Toggle, {
                on: t.colorEverywhere,
                onClick: () => setTweak('colorEverywhere', !t.colorEverywhere),
              }),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'nav-label',
              style: {
                padding: '16px 4px 10px',
              },
            },
            'Playback',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'set-group',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Default speed',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Starting playback rate for new books.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Seg, {
                value: '1.4',
                onChange: () => {},
                options: [
                  {
                    v: '1',
                    l: '1×',
                  },
                  {
                    v: '1.2',
                    l: '1.2×',
                  },
                  {
                    v: '1.4',
                    l: '1.4×',
                  },
                  {
                    v: '1.6',
                    l: '1.6×',
                  },
                ],
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Skip intervals',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Rewind / fast-forward jump length.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Seg, {
                value: '30',
                onChange: () => {},
                options: [
                  {
                    v: '15',
                    l: '15s',
                  },
                  {
                    v: '30',
                    l: '30s',
                  },
                  {
                    v: '60',
                    l: '60s',
                  },
                ],
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'set-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sr-meta',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-t',
                  },
                  'Autoplay next in series',
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-d',
                  },
                  'Roll into the next book automatically.',
                ),
              ),
              /*#__PURE__*/ React.createElement(Toggle, {
                on: true,
                onClick: () => {},
              }),
            ),
          ),
        )
      }

      /* ---------- App ---------- */
      function App() {
        const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
        const [route, setRoute] = React.useState('home')
        const [nowId, setNowId] = React.useState('b1')
        const [playing, setPlaying] = React.useState(false)
        const [speed, setSpeed] = React.useState(1.4)
        const [book, setBook] = React.useState(null) // detail sheet
        const [seriesSel, setSeriesSel] = React.useState(null) // full-page series
        const appRef = React.useRef(null)
        const now = HS.byId[nowId]
        const effectiveAccent =
          t.accentMode === 'manual'
            ? t.accentHex
            : t.colorEverywhere || route === 'player'
              ? now
                ? now.cv
                : EMBER
              : EMBER
        const glowBase = now ? now.cv : effectiveAccent
        const glowRef = React.useRef(glowBase)
        glowRef.current = glowBase
        React.useEffect(() => {
          const root = document.documentElement
          root.setAttribute('data-theme', t.theme)
          root.style.setProperty('--accent', effectiveAccent)
          root.style.setProperty('--on-accent', onColor(effectiveAccent))
          root.style.setProperty('--glow-strength', t.glow)
          root.style.setProperty('--glow-accent', glowBase)
        }, [t.theme, t.glow, effectiveAccent, glowBase])

        // novel: hovering a cover previews its colour in the page glow
        React.useEffect(() => {
          const el = appRef.current
          if (!el) return
          const set = (v) => document.documentElement.style.setProperty('--glow-accent', v)
          const over = (e) => {
            const b = e.target.closest('[data-cv]')
            if (b) set(b.getAttribute('data-cv'))
          }
          const out = (e) => {
            const b = e.target.closest('[data-cv]')
            if (b) set(glowRef.current)
          }
          el.addEventListener('mouseover', over)
          el.addEventListener('mouseout', out)
          return () => {
            el.removeEventListener('mouseover', over)
            el.removeEventListener('mouseout', out)
          }
        }, [])
        const go = (r) => {
          setRoute(r)
          const c = document.querySelector('.content')
          if (c) c.scrollTop = 0
        }
        const openBook = (b) => setBook(b)
        const openPlayer = (b) => {
          if (b) {
            setNowId(b.id)
            setPlaying(true)
          }
          go('player')
        }
        const openSeries = (s) => {
          setSeriesSel(s)
          go('seriesDetail')
        }
        const toggle = () => setPlaying((p) => !p)
        const isPlayer = route === 'player'
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            ref: appRef,
            className:
              'app' + (t.coverStyle === 'cards' ? ' cards' : '') + (isPlayer ? ' player-mode' : ''),
          },
          /*#__PURE__*/ React.createElement('div', {
            className: 'app-glow',
          }),
          /*#__PURE__*/ React.createElement(Sidebar, {
            route: route,
            go: go,
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'content',
            },
            route === 'home' &&
              /*#__PURE__*/ React.createElement(Home, {
                now: now,
                openBook: openBook,
                onPlay: openPlayer,
                playing: playing,
                playToggle: toggle,
                openPlayer: openPlayer,
              }),
            route === 'library' &&
              /*#__PURE__*/ React.createElement(Library, {
                openBook: openBook,
                onPlay: openPlayer,
              }),
            route === 'series' &&
              /*#__PURE__*/ React.createElement(SeriesView, {
                openSeries: openSeries,
              }),
            route === 'seriesDetail' &&
              /*#__PURE__*/ React.createElement(SeriesDetail, {
                series: seriesSel,
                openBook: openBook,
                onPlay: openPlayer,
                back: () => go('series'),
              }),
            route === 'stats' && /*#__PURE__*/ React.createElement(Stats, null),
            route === 'settings' &&
              /*#__PURE__*/ React.createElement(Settings, {
                t: t,
                setTweak: setTweak,
              }),
            route === 'player' &&
              /*#__PURE__*/ React.createElement(Player, {
                now: now,
                playing: playing,
                toggle: toggle,
                openBook: openBook,
                speed: speed,
                setSpeed: setSpeed,
              }),
          ),
          /*#__PURE__*/ React.createElement(PlayBar, {
            now: now,
            playing: playing,
            toggle: toggle,
            openPlayer: () => go('player'),
            hidden: isPlayer,
            speed: speed,
          }),
          book &&
            /*#__PURE__*/ React.createElement(BookSheet, {
              book: book,
              onClose: () => setBook(null),
              openPlayer: openPlayer,
            }),
          /*#__PURE__*/ React.createElement(
            TweaksPanel,
            null,
            /*#__PURE__*/ React.createElement(TweakSection, {
              label: 'Theme',
            }),
            /*#__PURE__*/ React.createElement(TweakRadio, {
              label: 'Mode',
              value: t.theme,
              options: ['dark', 'light'],
              onChange: (v) => setTweak('theme', v),
            }),
            /*#__PURE__*/ React.createElement(TweakSection, {
              label: 'Accent',
            }),
            /*#__PURE__*/ React.createElement(TweakRadio, {
              label: 'Source',
              value: t.accentMode,
              options: ['dynamic', 'manual'],
              onChange: (v) => setTweak('accentMode', v),
            }),
            /*#__PURE__*/ React.createElement(TweakColor, {
              label: 'Manual accent',
              value: t.accentHex,
              options: HS.PRESETS.map((p) => p.hex),
              onChange: (v) => setTweak('accentHex', v),
            }),
            /*#__PURE__*/ React.createElement(TweakSection, {
              label: 'Cover',
            }),
            /*#__PURE__*/ React.createElement(TweakSlider, {
              label: 'Glow intensity',
              value: t.glow,
              min: 0,
              max: 60,
              unit: '%',
              onChange: (v) => setTweak('glow', v),
            }),
            /*#__PURE__*/ React.createElement(TweakRadio, {
              label: 'Cover style',
              value: t.coverStyle,
              options: ['floating', 'cards'],
              onChange: (v) => setTweak('coverStyle', v),
            }),
            /*#__PURE__*/ React.createElement(TweakToggle, {
              label: 'Colour everywhere',
              value: t.colorEverywhere,
              onChange: (v) => setTweak('colorEverywhere', v),
            }),
          ),
        )
      }

      /* Render only when a real mount point exists. The DS compiler bundles
   every .jsx in the project; this guard keeps that bundle from throwing
   when this prototype module is evaluated outside HearthShelf.html. */
      const __hsRoot = typeof document !== 'undefined' && document.getElementById('root')
      if (__hsRoot)
        ReactDOM.createRoot(__hsRoot).render(/*#__PURE__*/ React.createElement(App, null))
    })()
  } catch (e) {
    __ds_ns.__errors.push({ path: 'app/app.jsx', error: String((e && e.message) || e) })
  }

  // app/components.jsx
  try {
    ;(() => {
      /* HearthShelf — shared components. Exported to window for cross-file use. */

      function Icon({ name, fill, className = '', style }) {
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            className: 'ms' + (fill ? ' fill' : '') + (className ? ' ' + className : ''),
            style: style,
          },
          name,
        )
      }

      /* relative-luminance pick: black or white text on a given accent */
      function onColor(hex) {
        const h = hex.replace('#', '')
        const r = parseInt(h.slice(0, 2), 16) / 255
        const g = parseInt(h.slice(2, 4), 16) / 255
        const b = parseInt(h.slice(4, 6), 16) / 255
        const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
        const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
        return L > 0.42 ? '#1a1509' : '#fff'
      }

      /* Typeset cover — the dynamic-accent source. `fs` scales the internals. */
      function Cover({ book, fs = 14, className = '', onClick, badge, overlay, style }) {
        const initial = (book.title || '?').trim()[0]
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'cover' + (className ? ' ' + className : ''),
            onClick: onClick,
            style: {
              '--cv': book.cv,
              '--cv-bg': book.cv,
              fontSize: fs + 'px',
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'cv-mono',
              'aria-hidden': true,
            },
            initial,
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'cv-body',
            },
            /*#__PURE__*/ React.createElement('div', {
              className: 'cv-rule',
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'cv-kicker',
              },
              book.kicker,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'cv-title',
              },
              book.title,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'cv-author',
              },
              book.author,
            ),
          ),
          /*#__PURE__*/ React.createElement('span', {
            className: 'cv-shine',
          }),
          badge,
          overlay,
        )
      }
      function coverBadge(book) {
        if (book.finished)
          return /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'cover-badge',
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'check',
              fill: true,
            }),
          )
        return null
      }

      /* hover actions overlay shown on a book tile's cover */
      function HoverActions({ book, onPlay, onOpen }) {
        const stop = (fn) => (e) => {
          e.stopPropagation()
          fn && fn(book)
        }
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hover-actions',
            onClick: (e) => e.stopPropagation(),
          },
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'ha-btn',
              title: 'Add to list',
              onClick: stop(),
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'playlist_add',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'ha-play',
              title: 'Play',
              onClick: stop(onPlay),
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'play_arrow',
              fill: true,
            }),
          ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'ha-btn',
              title: 'Mark finished',
              onClick: stop(),
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'check',
            }),
          ),
        )
      }

      /* book tile used in grids + shelves */
      function BookTile({ book, onOpen, onPlay, fs = 15 }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'book fade-in',
            'data-cv': book.cv,
            onClick: () => onOpen(book),
          },
          /*#__PURE__*/ React.createElement(Cover, {
            book: book,
            fs: fs,
            badge: coverBadge(book),
            overlay: /*#__PURE__*/ React.createElement(HoverActions, {
              book: book,
              onPlay: onPlay || onOpen,
              onOpen: onOpen,
            }),
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'b-meta',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'b-title',
              },
              book.title,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'b-author',
              },
              book.author,
            ),
            book.progress > 0 &&
              !book.finished &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'b-prog',
                },
                /*#__PURE__*/ React.createElement('i', {
                  style: {
                    width: book.progress * 100 + '%',
                  },
                }),
              ),
          ),
        )
      }
      function SectionHead({ icon, title, onMore }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'section-head',
          },
          icon &&
            /*#__PURE__*/ React.createElement(Icon, {
              name: icon,
            }),
          /*#__PURE__*/ React.createElement('h2', null, title),
          onMore &&
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'more',
                onClick: onMore,
              },
              'See all \u2192',
            ),
        )
      }
      function Stars({ rating }) {
        const full = Math.floor(rating)
        const half = rating - full >= 0.4
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            className: 'stars',
          },
          [0, 1, 2, 3, 4].map((i) =>
            /*#__PURE__*/ React.createElement(Icon, {
              key: i,
              name: i < full ? 'star' : i === full && half ? 'star_half' : 'star',
              fill: i < full || (i === full && half),
            }),
          ),
        )
      }

      /* ---- Sidebar ------------------------------------------------------- */
      function UserMenu() {
        const [open, setOpen] = React.useState(false)
        React.useEffect(() => {
          if (!open) return
          const close = () => setOpen(false)
          window.addEventListener('click', close)
          return () => window.removeEventListener('click', close)
        }, [open])
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'user-wrap',
            onClick: (e) => e.stopPropagation(),
          },
          open &&
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'user-menu',
              },
              /*#__PURE__*/ React.createElement(
                'button',
                null,
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'person',
                }),
                ' Profile',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                null,
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'group',
                }),
                ' Switch user',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                null,
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'manage_accounts',
                }),
                ' Account & server',
              ),
              /*#__PURE__*/ React.createElement('div', {
                className: 'sep',
              }),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'danger',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'logout',
                }),
                ' Log out',
              ),
            ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'user-chip' + (open ? ' on' : ''),
              onClick: () => setOpen((o) => !o),
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'sb-avatar',
              },
              'J',
            ),
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'u-meta',
              },
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'u-name',
                },
                'Jordan Reese',
              ),
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'u-sub',
                },
                'hearthshelf.local',
              ),
            ),
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'expand_less',
              className: 'u-chev',
            }),
          ),
        )
      }
      function Sidebar({ route, go }) {
        const nav = [
          {
            id: 'home',
            icon: 'home',
            label: 'Home',
          },
          {
            id: 'library',
            icon: 'grid_view',
            label: 'Library',
          },
          {
            id: 'series',
            icon: 'auto_stories',
            label: 'Series',
          },
          {
            id: 'stats',
            icon: 'insights',
            label: 'Stats',
          },
        ]
        const seriesRoutes = route === 'series' || route === 'seriesDetail'
        return /*#__PURE__*/ React.createElement(
          'aside',
          {
            className: 'sidebar',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'brand',
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'local_fire_department',
              fill: true,
              className: 'mark',
            }),
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'wordmark',
              },
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'lt',
                },
                'Hearth',
              ),
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'bd',
                },
                'Shelf',
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'nav',
            {
              className: 'nav',
            },
            nav.map((n) => {
              const active = n.id === 'series' ? seriesRoutes : route === n.id
              return /*#__PURE__*/ React.createElement(
                'button',
                {
                  key: n.id,
                  className: 'nav-item' + (active ? ' active' : ''),
                  onClick: () => go(n.id),
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: n.icon,
                  fill: active,
                }),
                n.label,
              )
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'nav-label',
              },
              'Now',
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'nav-item' + (route === 'player' ? ' active' : ''),
                onClick: () => go('player'),
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'graphic_eq',
                fill: route === 'player',
              }),
              'Listening',
            ),
            /*#__PURE__*/ React.createElement('div', {
              className: 'nav-sep',
            }),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'nav-item' + (route === 'settings' ? ' active' : ''),
                onClick: () => go('settings'),
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'settings',
                fill: route === 'settings',
              }),
              'Settings',
            ),
          ),
          /*#__PURE__*/ React.createElement(UserMenu, null),
        )
      }

      /* ---- Persistent play bar ------------------------------------------ */
      function fmt(mins) {
        const h = Math.floor(mins / 60)
        const m = Math.floor(mins % 60)
        const s = Math.floor((mins * 60) % 60)
        if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
        return m + ':' + String(s).padStart(2, '0')
      }
      function PlayBar({ now, playing, toggle, openPlayer, hidden, speed }) {
        if (!now) return null
        const total = now.hours * 60
        const elapsed = total * now.progress
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'playbar' + (hidden ? ' hidden' : ''),
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'pb-now',
              onClick: openPlayer,
            },
            /*#__PURE__*/ React.createElement(Cover, {
              book: now,
              fs: 5,
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'pb-meta',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'pb-title',
                },
                now.title,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'pb-sub',
                },
                now.author,
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'pb-center',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'pb-controls',
              },
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pb-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'skip_previous',
                  fill: true,
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pb-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'replay_30',
                }),
                /*#__PURE__*/ React.createElement('small', null, '30'),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pb-play',
                  onClick: toggle,
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: playing ? 'pause' : 'play_arrow',
                  fill: true,
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pb-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'forward_30',
                }),
                /*#__PURE__*/ React.createElement('small', null, '30'),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pb-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'skip_next',
                  fill: true,
                }),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'pb-time',
              },
              /*#__PURE__*/ React.createElement('span', null, fmt(elapsed)),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'scrub',
                },
                /*#__PURE__*/ React.createElement('i', {
                  style: {
                    width: now.progress * 100 + '%',
                  },
                }),
                /*#__PURE__*/ React.createElement('b', {
                  style: {
                    left: now.progress * 100 + '%',
                  },
                }),
              ),
              /*#__PURE__*/ React.createElement('span', null, '-', fmt(total - elapsed)),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'pb-right',
            },
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'pill',
              },
              speed,
              '\xD7',
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'icon-btn',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'bedtime',
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'icon-btn',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'queue_music',
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'icon-btn',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'volume_up',
              }),
            ),
          ),
        )
      }
      Object.assign(window, {
        Icon,
        onColor,
        Cover,
        coverBadge,
        HoverActions,
        BookTile,
        SectionHead,
        Stars,
        Sidebar,
        UserMenu,
        PlayBar,
        fmt,
      })
    })()
  } catch (e) {
    __ds_ns.__errors.push({ path: 'app/components.jsx', error: String((e && e.message) || e) })
  }

  // app/data.js
  try {
    ;(() => {
      /* HearthShelf demo library. Each book carries its own `accent` — the
   dynamic color the cover "glows," driving the page glow + controls when
   it's the now-playing title. Covers are typeset (no external images). */
      ;(function () {
        const BOOKS = [
          {
            id: 'b1',
            title: 'The Tide Between Us',
            author: 'Marian Holt',
            narrator: 'Saoirse Quinn',
            kicker: 'A Novel',
            cv: '#3f7d8c',
            rating: 4.6,
            year: 2023,
            hours: 13.2,
            chapters: 38,
            genre: 'Literary Fiction',
            series: 's1',
            seriesNum: 1,
            progress: 0.52,
            finished: false,
          },
          {
            id: 'b2',
            title: 'Embers of the North',
            author: 'Cassian Vale',
            narrator: 'Tom Aldridge',
            kicker: 'Ashfall · I',
            cv: '#c4663a',
            rating: 4.8,
            year: 2022,
            hours: 18.7,
            chapters: 52,
            genre: 'Epic Fantasy',
            series: 's2',
            seriesNum: 1,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b3',
            title: 'Quiet Machines',
            author: 'Dr. Nadia Osei',
            narrator: 'Nadia Osei',
            kicker: 'Nonfiction',
            cv: '#5e76c4',
            rating: 4.3,
            year: 2024,
            hours: 9.4,
            chapters: 22,
            genre: 'Science',
            series: null,
            seriesNum: 0,
            progress: 1.0,
            finished: true,
          },
          {
            id: 'b4',
            title: 'Saltwater Saints',
            author: 'Imelda Reyes',
            narrator: 'Lucia Marin',
            kicker: 'A Novel',
            cv: '#4f9db0',
            rating: 4.5,
            year: 2021,
            hours: 11.9,
            chapters: 31,
            genre: 'Literary Fiction',
            series: null,
            seriesNum: 0,
            progress: 0.18,
            finished: false,
          },
          {
            id: 'b5',
            title: 'The Lantern Keeper',
            author: 'Cassian Vale',
            narrator: 'Tom Aldridge',
            kicker: 'Ashfall · II',
            cv: '#b85c4a',
            rating: 4.7,
            year: 2023,
            hours: 20.1,
            chapters: 56,
            genre: 'Epic Fantasy',
            series: 's2',
            seriesNum: 2,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b6',
            title: 'Notes on Falling',
            author: 'Per Lindqvist',
            narrator: 'Greta Holm',
            kicker: 'Memoir',
            cv: '#7fa86b',
            rating: 4.2,
            year: 2020,
            hours: 7.8,
            chapters: 16,
            genre: 'Memoir',
            series: null,
            seriesNum: 0,
            progress: 0.74,
            finished: false,
          },
          {
            id: 'b7',
            title: 'A Geometry of Birds',
            author: 'Yuki Tanaka',
            narrator: 'Mei Kowalski',
            kicker: 'Poetry',
            cv: '#9b6fb8',
            rating: 4.1,
            year: 2024,
            hours: 4.3,
            chapters: 12,
            genre: 'Poetry',
            series: null,
            seriesNum: 0,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b8',
            title: 'Redshift Country',
            author: 'Howard Mbeki',
            narrator: 'Howard Mbeki',
            kicker: 'Sci-Fi',
            cv: '#cc5b4a',
            rating: 4.4,
            year: 2022,
            hours: 15.6,
            chapters: 44,
            genre: 'Science Fiction',
            series: null,
            seriesNum: 0,
            progress: 0.33,
            finished: false,
          },
          {
            id: 'b9',
            title: 'The Salt Path Home',
            author: 'Imelda Reyes',
            narrator: 'Lucia Marin',
            kicker: 'A Novel',
            cv: '#2f9d8f',
            rating: 4.6,
            year: 2024,
            hours: 12.4,
            chapters: 29,
            genre: 'Literary Fiction',
            series: null,
            seriesNum: 0,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b10',
            title: 'Steeped in Smoke',
            author: 'Marian Holt',
            narrator: 'Saoirse Quinn',
            kicker: 'A Novel',
            cv: '#b07a3c',
            rating: 4.0,
            year: 2019,
            hours: 10.7,
            chapters: 27,
            genre: 'Mystery',
            series: null,
            seriesNum: 0,
            progress: 1.0,
            finished: true,
          },
          {
            id: 'b11',
            title: 'Wavelength',
            author: 'Dr. Nadia Osei',
            narrator: 'Nadia Osei',
            kicker: 'Nonfiction',
            cv: '#4db6ac',
            rating: 4.5,
            year: 2023,
            hours: 8.9,
            chapters: 19,
            genre: 'Science',
            series: null,
            seriesNum: 0,
            progress: 0.61,
            finished: false,
          },
          {
            id: 'b12',
            title: "The Hollow Crown's Ash",
            author: 'Cassian Vale',
            narrator: 'Tom Aldridge',
            kicker: 'Ashfall · III',
            cv: '#a84738',
            rating: 4.9,
            year: 2025,
            hours: 22.3,
            chapters: 61,
            genre: 'Epic Fantasy',
            series: 's2',
            seriesNum: 3,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b13',
            title: 'Osmosis',
            author: 'Per Lindqvist',
            narrator: 'Greta Holm',
            kicker: 'Essays',
            cv: '#3d8c7a',
            rating: 4.2,
            year: 2021,
            hours: 6.2,
            chapters: 14,
            genre: 'Essays',
            series: null,
            seriesNum: 0,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b14',
            title: 'Inkwell Days',
            author: 'Yuki Tanaka',
            narrator: 'Mei Kowalski',
            kicker: 'A Novel',
            cv: '#3d4a8c',
            rating: 4.3,
            year: 2022,
            hours: 9.9,
            chapters: 24,
            genre: 'Literary Fiction',
            series: null,
            seriesNum: 0,
            progress: 0.45,
            finished: false,
          },
          {
            id: 'b15',
            title: 'The Far Meridian',
            author: 'Howard Mbeki',
            narrator: 'Howard Mbeki',
            kicker: 'Sci-Fi',
            cv: '#5566b8',
            rating: 4.6,
            year: 2024,
            hours: 17.0,
            chapters: 47,
            genre: 'Science Fiction',
            series: 's3',
            seriesNum: 1,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b16',
            title: 'Tincture & Tide',
            author: 'Imelda Reyes',
            narrator: 'Lucia Marin',
            kicker: 'A Novel',
            cv: '#7c6fbf',
            rating: 4.1,
            year: 2020,
            hours: 11.1,
            chapters: 28,
            genre: 'Romance',
            series: null,
            seriesNum: 0,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b17',
            title: 'Saturate',
            author: 'Marian Holt',
            narrator: 'Saoirse Quinn',
            kicker: 'A Novel',
            cv: '#c8487e',
            rating: 4.4,
            year: 2023,
            hours: 13.8,
            chapters: 35,
            genre: 'Mystery',
            series: null,
            seriesNum: 0,
            progress: 0.0,
            finished: false,
          },
          {
            id: 'b18',
            title: 'The Quiet Wards',
            author: 'Dr. Nadia Osei',
            narrator: 'Nadia Osei',
            kicker: 'Nonfiction',
            cv: '#2e6fb0',
            rating: 4.7,
            year: 2025,
            hours: 10.2,
            chapters: 21,
            genre: 'History',
            series: null,
            seriesNum: 0,
            progress: 0.08,
            finished: false,
          },
        ]
        const SERIES = [
          {
            id: 's1',
            name: 'The Tide Cycle',
            author: 'Marian Holt',
            books: ['b1'],
          },
          {
            id: 's2',
            name: 'Ashfall',
            author: 'Cassian Vale',
            books: ['b2', 'b5', 'b12'],
          },
          {
            id: 's3',
            name: 'The Meridian Saga',
            author: 'Howard Mbeki',
            books: ['b15'],
          },
        ]

        // chapters for the now-playing book
        function chaptersFor(book) {
          const out = []
          const per = (book.hours * 60) / book.chapters
          const playedCh = Math.round(book.chapters * book.progress)
          for (let i = 0; i < book.chapters; i++) {
            out.push({
              n: i + 1,
              title: i === 0 ? 'Prologue' : 'Chapter ' + i,
              mins: per,
              done: i < playedCh,
              now: i === playedCh,
            })
          }
          return out
        }
        const SHELVES = [
          {
            id: 'continue',
            icon: 'play_circle',
            title: 'Continue listening',
            books: ['b1', 'b6', 'b11', 'b8', 'b14'],
          },
          {
            id: 'series',
            icon: 'auto_stories',
            title: 'Continue the series',
            books: ['b5', 'b12', 'b15'],
          },
          {
            id: 'recent',
            icon: 'schedule',
            title: 'Recently added',
            books: ['b18', 'b9', 'b12', 'b15', 'b17', 'b13'],
          },
          {
            id: 'again',
            icon: 'replay',
            title: 'Listen again',
            books: ['b3', 'b10', 'b6'],
          },
          {
            id: 'discover',
            icon: 'explore',
            title: 'Discover',
            books: ['b7', 'b16', 'b13', 'b4', 'b2', 'b17'],
          },
        ]
        const STATS = {
          totalH: 272,
          totalM: 54,
          days: '11.4 days of audio',
          tiles: [
            {
              ico: 'local_fire_department',
              num: '23',
              cap: 'Day streak',
              hot: true,
            },
            {
              ico: 'emoji_events',
              num: '64',
              cap: 'Longest streak',
            },
            {
              ico: 'task_alt',
              num: '48',
              cap: 'Books finished',
            },
            {
              ico: 'headphones',
              num: '1.4×',
              cap: 'Avg. speed',
            },
            {
              ico: 'calendar_month',
              num: '19',
              cap: 'This month (h)',
            },
            {
              ico: 'menu_book',
              num: '6',
              cap: 'In progress',
            },
          ],
          week: [
            {
              d: 'M',
              v: 1.2,
            },
            {
              d: 'T',
              v: 2.4,
            },
            {
              d: 'W',
              v: 0.8,
            },
            {
              d: 'T',
              v: 3.1,
            },
            {
              d: 'F',
              v: 1.9,
            },
            {
              d: 'S',
              v: 4.2,
            },
            {
              d: 'S',
              v: 2.7,
            },
          ],
          compare: {
            percentile: 88,
            bars: [
              {
                label: 'You',
                v: 19,
                me: true,
              },
              {
                label: 'Friends avg',
                v: 14,
              },
              {
                label: 'Community avg',
                v: 9,
              },
              {
                label: 'Top 10%',
                v: 31,
              },
            ],
            friends: [
              {
                name: 'Ari Mensah',
                h: 42,
                rank: 1,
                cv: '#c4663a',
              },
              {
                name: 'Lena Park',
                h: 27,
                rank: 2,
                cv: '#5e76c4',
              },
              {
                name: 'Theo Vance',
                h: 23,
                rank: 3,
                cv: '#7fa86b',
              },
              {
                name: 'Jordan Reese',
                h: 19,
                rank: 4,
                me: true,
                cv: '#e0654a',
              },
              {
                name: 'Priya Rao',
                h: 15,
                rank: 5,
                cv: '#4f9db0',
              },
            ],
          },
        }
        const PRESETS = [
          {
            name: 'Ember',
            hex: '#ea9648',
          },
          {
            name: 'Hearth',
            hex: '#e0654a',
          },
          {
            name: 'Cinder',
            hex: '#c4463a',
          },
          {
            name: 'Amber',
            hex: '#e8b54a',
          },
          {
            name: 'Sage',
            hex: '#7fa86b',
          },
          {
            name: 'Tide',
            hex: '#4f9db0',
          },
          {
            name: 'Dusk',
            hex: '#5e76c4',
          },
          {
            name: 'Plum',
            hex: '#9b6fb8',
          },
          {
            name: 'Rose',
            hex: '#d2689a',
          },
          {
            name: 'Slate',
            hex: '#6b7280',
          },
        ]
        const byId = {}
        BOOKS.forEach((b) => (byId[b.id] = b))

        // ---- A long (20-book) series, to stress-test the Series page ----
        ;(function () {
          const PAL = [
            '#c4663a',
            '#b85c4a',
            '#a84738',
            '#cc5b4a',
            '#b07a3c',
            '#3f7d8c',
            '#4f9db0',
            '#2f9d8f',
            '#3d8c7a',
            '#5e76c4',
            '#5566b8',
            '#3d4a8c',
            '#9b6fb8',
            '#7c6fbf',
            '#7fa86b',
            '#b6843a',
            '#c8487e',
            '#2e6fb0',
            '#4db6ac',
            '#a84738',
          ]
          const TITLES = [
            'The First Ember',
            'Ashen Roads',
            'The Kiln King',
            'Smoke & Salt',
            'The Ninth Forge',
            'Cinderwake',
            'The Hollow Hearth',
            'Emberfall',
            'The Long Banking',
            'Coals of the Deep',
            'The Tinder Court',
            'Ash Lanterns',
            'The Quenching',
            'Firebreak',
            'The Last Bellows',
            'Ashes, Rising',
            'The Ember Throne',
            'Glasswork',
            'The Dying Light',
            'Hearthbound',
          ]
          const ids = []
          TITLES.forEach((t, i) => {
            const id = 'e' + (i + 1)
            ids.push(id)
            // first 9 finished, next 2 in progress, rest not started
            const finished = i < 9
            const progress = finished ? 1 : i === 9 ? 0.62 : i === 10 ? 0.18 : 0
            const b = {
              id,
              title: t,
              author: 'Eira Sundqvist',
              narrator: 'Tom Aldridge',
              kicker: 'Emberfall · ' + (i + 1),
              cv: PAL[i % PAL.length],
              rating: +(4.0 + ((i * 7) % 9) / 10).toFixed(1),
              year: 2008 + i,
              hours: +(9 + ((i * 13) % 14)).toFixed(1),
              chapters: 22 + ((i * 5) % 30),
              genre: 'Epic Fantasy',
              series: 's4',
              seriesNum: i + 1,
              progress,
              finished,
            }
            BOOKS.push(b)
            byId[id] = b
          })
          SERIES.push({
            id: 's4',
            name: 'The Emberfall Chronicles',
            author: 'Eira Sundqvist',
            books: ids,
          })
        })()

        // weighted overall progress for a series (0..1), by hours listened
        function seriesProgress(series) {
          let total = 0,
            done = 0
          series.books.forEach((bid) => {
            const b = byId[bid]
            total += b.hours
            done += b.hours * (b.finished ? 1 : b.progress)
          })
          return total ? done / total : 0
        }
        window.HS = {
          BOOKS,
          SERIES,
          SHELVES,
          STATS,
          PRESETS,
          byId,
          chaptersFor,
          seriesProgress,
        }
      })()
    })()
  } catch (e) {
    __ds_ns.__errors.push({ path: 'app/data.js', error: String((e && e.message) || e) })
  }

  // app/screens.jsx
  try {
    ;(() => {
      /* HearthShelf — screens. Relies on window globals (HS data + components). */

      const DESC =
        'A quietly absorbing listen, narrated with warmth and restraint. The kind of book you put on at dusk and look up to find the room has gone dark around you — the only light the glow of the story itself.'

      /* ---------- Home / Discover ---------- */
      function Home({ now, openBook, onPlay, playToggle, playing, openPlayer }) {
        const hero = now || HS.byId[HS.SHELVES[0].books[0]]
        const heroOn = now && now.id === hero.id && playing
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'page fade-in',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page-head',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'eyebrow',
              },
              'HearthShelf',
            ),
            /*#__PURE__*/ React.createElement(
              'h1',
              {
                className: 'title-xl',
              },
              'Good evening, Jordan',
            ),
            /*#__PURE__*/ React.createElement(
              'p',
              {
                className: 'page-sub',
              },
              "You're 52% through ",
              /*#__PURE__*/ React.createElement(
                'b',
                {
                  style: {
                    color: 'var(--text)',
                  },
                },
                hero.title,
              ),
              ' \xB7 6 books on the go',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                gap: 32,
                alignItems: 'center',
                background: 'var(--c-high)',
                borderRadius: 20,
                padding: 28,
                marginBottom: 8,
              },
            },
            /*#__PURE__*/ React.createElement(Cover, {
              book: hero,
              fs: 20,
              onClick: () => openBook(hero),
              style: {
                width: 220,
                height: 220,
                borderRadius: 16,
                boxShadow: 'var(--shadow-lift)',
                cursor: 'pointer',
              },
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  flex: 1,
                  minWidth: 0,
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'eyebrow',
                  style: {
                    marginBottom: 6,
                  },
                },
                'Jump back in',
              ),
              /*#__PURE__*/ React.createElement(
                'h2',
                {
                  style: {
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    margin: '0 0 8px',
                  },
                },
                hero.title,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    color: 'var(--text-muted)',
                    fontSize: 14.5,
                    marginBottom: 14,
                  },
                },
                hero.author,
                ' \xB7 Narrated by ',
                hero.narrator,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 20,
                  },
                },
                /*#__PURE__*/ React.createElement(Stars, {
                  rating: hero.rating,
                }),
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    style: {
                      color: 'var(--text-muted)',
                      fontSize: 13,
                    },
                  },
                  hero.rating,
                  ' \xB7 ',
                  hero.hours,
                  'h \xB7 Ch ',
                  Math.round(hero.chapters * hero.progress),
                  '/',
                  hero.chapters,
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'prog-line',
                  style: {
                    maxWidth: 460,
                    marginBottom: 22,
                  },
                },
                /*#__PURE__*/ React.createElement('i', {
                  style: {
                    width: hero.progress * 100 + '%',
                  },
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: 12,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'btn btn-primary',
                    onClick: () => {
                      openPlayer(hero)
                    },
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: heroOn ? 'pause' : 'play_arrow',
                    fill: true,
                  }),
                  ' ',
                  hero.progress > 0 ? 'Resume' : 'Start listening',
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                    onClick: () => openBook(hero),
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'info',
                  }),
                  ' Details',
                ),
              ),
            ),
          ),
          HS.SHELVES.map((sh) =>
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'section',
                key: sh.id,
              },
              /*#__PURE__*/ React.createElement(SectionHead, {
                icon: sh.icon,
                title: sh.title,
                onMore: () => {},
              }),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'shelf-row',
                },
                sh.books.map((bid) =>
                  /*#__PURE__*/ React.createElement(BookTile, {
                    key: bid,
                    book: HS.byId[bid],
                    onOpen: openBook,
                    onPlay: onPlay,
                    fs: 15,
                  }),
                ),
              ),
            ),
          ),
        )
      }

      /* ---------- Library ---------- */
      function Library({ openBook, onPlay }) {
        const [filter, setFilter] = React.useState('All')
        const [sort, setSort] = React.useState('Recent')
        const filters = ['All', 'In progress', 'Finished', 'Not started']
        let books = HS.BOOKS.filter((b) => {
          if (filter === 'In progress') return b.progress > 0 && !b.finished
          if (filter === 'Finished') return b.finished
          if (filter === 'Not started') return b.progress === 0
          return true
        })
        if (sort === 'Title') books = [...books].sort((a, b) => a.title.localeCompare(b.title))
        if (sort === 'Author') books = [...books].sort((a, b) => a.author.localeCompare(b.author))
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'fade-in',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'topbar bare',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'search',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'search',
              }),
              /*#__PURE__*/ React.createElement('input', {
                placeholder: 'Search your library\u2026',
              }),
            ),
            /*#__PURE__*/ React.createElement('div', {
              className: 'topbar-spacer',
            }),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'pill',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'swap_vert',
              }),
              ' ',
              sort,
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'pill',
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'grid_view',
              }),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page',
              style: {
                paddingTop: 8,
              },
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'page-head',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'eyebrow',
                },
                'Your collection',
              ),
              /*#__PURE__*/ React.createElement(
                'h1',
                {
                  className: 'title-xl',
                },
                'Library',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: 8,
                  marginBottom: 28,
                },
              },
              filters.map((f) =>
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    key: f,
                    className: 'pill' + (filter === f ? ' on' : ''),
                    onClick: () => setFilter(f),
                  },
                  f,
                ),
              ),
              /*#__PURE__*/ React.createElement('div', {
                style: {
                  flex: 1,
                },
              }),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill' + (sort === 'Title' ? ' on' : ''),
                  onClick: () => setSort(sort === 'Title' ? 'Recent' : 'Title'),
                },
                'A\u2013Z',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'lib-grid',
              },
              books.map((b) =>
                /*#__PURE__*/ React.createElement(BookTile, {
                  key: b.id,
                  book: b,
                  onOpen: openBook,
                  onPlay: onPlay,
                  fs: 15,
                }),
              ),
            ),
          ),
        )
      }

      /* ---------- Series (index) ---------- */
      function SeriesView({ openSeries }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'page fade-in',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page-head',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'eyebrow',
              },
              'Collected works',
            ),
            /*#__PURE__*/ React.createElement(
              'h1',
              {
                className: 'title-xl',
              },
              'Series',
            ),
            /*#__PURE__*/ React.createElement(
              'p',
              {
                className: 'page-sub',
              },
              HS.SERIES.length,
              ' series \xB7 grouped by metadata',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'series-grid',
            },
            HS.SERIES.map((s) => {
              const done = s.books.filter((b) => HS.byId[b].finished).length
              const pct = HS.seriesProgress(s)
              const extra = s.books.length - 4
              return /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'series-card',
                  key: s.id,
                  onClick: () => openSeries(s),
                  'data-cv': HS.byId[s.books[0]].cv,
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'series-stack',
                  },
                  s.books.slice(0, 4).map((b) =>
                    /*#__PURE__*/ React.createElement(Cover, {
                      key: b,
                      book: HS.byId[b],
                      fs: 7,
                    }),
                  ),
                  extra > 0 &&
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'stack-more sm',
                      },
                      '+',
                      extra,
                    ),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'series-meta',
                  },
                  /*#__PURE__*/ React.createElement('h3', null, s.name),
                  /*#__PURE__*/ React.createElement(
                    'p',
                    null,
                    s.author,
                    ' \xB7 ',
                    s.books.length,
                    ' ',
                    s.books.length === 1 ? 'book' : 'books',
                    ' \xB7 ',
                    done,
                    ' finished',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sc-prog',
                    },
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'prog-line',
                        style: {
                          flex: 1,
                        },
                      },
                      /*#__PURE__*/ React.createElement('i', {
                        style: {
                          width: pct * 100 + '%',
                        },
                      }),
                    ),
                    /*#__PURE__*/ React.createElement('span', null, Math.round(pct * 100), '%'),
                  ),
                ),
              )
            }),
          ),
        )
      }

      /* ---------- Series detail (full page) ---------- */
      /* Count-aware cover cluster for the hero:
   1 → solo · 2 → stacked · 3 → two stacked + one centered below · 4 → 2×2 square
   5+ → 2×2 square with the 5th centered, dimmed, "+N" over it */
      function HeroCovers({ books }) {
        const n = books.length
        const extra = n - 5
        const layout = n >= 4 ? 'square' : n === 3 ? 'tri' : n === 2 ? 'duo' : 'solo'
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hero-covers ' + layout,
          },
          layout === 'solo' &&
            /*#__PURE__*/ React.createElement(Cover, {
              book: books[0],
              fs: 13,
            }),
          layout === 'duo' &&
            books.slice(0, 2).map((b) =>
              /*#__PURE__*/ React.createElement(Cover, {
                key: b.id,
                book: b,
                fs: 11,
              }),
            ),
          layout === 'tri' &&
            /*#__PURE__*/ React.createElement(
              React.Fragment,
              null,
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hc-row',
                },
                books.slice(0, 2).map((b) =>
                  /*#__PURE__*/ React.createElement(Cover, {
                    key: b.id,
                    book: b,
                    fs: 10,
                  }),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hc-btm',
                },
                /*#__PURE__*/ React.createElement(Cover, {
                  book: books[2],
                  fs: 10,
                }),
              ),
            ),
          layout === 'square' &&
            /*#__PURE__*/ React.createElement(
              React.Fragment,
              null,
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hc-grid',
                },
                books.slice(0, 4).map((b) =>
                  /*#__PURE__*/ React.createElement(Cover, {
                    key: b.id,
                    book: b,
                    fs: 8,
                  }),
                ),
              ),
              n >= 5 &&
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'hc-center',
                  },
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'hc-fifth',
                    },
                    /*#__PURE__*/ React.createElement(Cover, {
                      book: books[4],
                      fs: 8,
                    }),
                    extra > 0 &&
                      /*#__PURE__*/ React.createElement(
                        'span',
                        {
                          className: 'hc-more',
                        },
                        '+',
                        extra,
                      ),
                  ),
                ),
            ),
        )
      }
      function SeriesDetail({ series, openBook, onPlay, back }) {
        if (!series) return null
        const books = series.books.map((b) => HS.byId[b])
        const totalH = books.reduce((a, b) => a + b.hours, 0)
        const done = books.filter((b) => b.finished).length
        const pct = HS.seriesProgress(series)
        const listenedH = totalH * pct
        const nextUp = books.find((b) => !b.finished) || books[0]
        const firstCv = books[0].cv
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'page fade-in',
            style: {
              '--glow-accent': firstCv,
            },
          },
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'pill',
              style: {
                marginBottom: 24,
              },
              onClick: back,
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'arrow_back',
            }),
            ' All series',
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'series-hero',
              'data-comment-anchor': 'c42e7ae56d-div-137-7',
            },
            /*#__PURE__*/ React.createElement(HeroCovers, {
              books: books,
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'series-hero-meta',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'eyebrow',
                },
                'Series',
              ),
              /*#__PURE__*/ React.createElement(
                'h1',
                {
                  className: 'title-xl',
                },
                series.name,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    color: 'var(--text-muted)',
                    fontSize: 14.5,
                    margin: '8px 0 18px',
                  },
                },
                series.author,
                ' \xB7 ',
                books.length,
                ' books \xB7 ',
                totalH.toFixed(0),
                'h total',
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'series-prog',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sp-top',
                  },
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'sp-pct',
                    },
                    Math.round(pct * 100),
                    '%',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'sp-cap',
                    },
                    done,
                    ' of ',
                    books.length,
                    ' finished \xB7 ',
                    listenedH.toFixed(0),
                    'h of ',
                    totalH.toFixed(0),
                    'h',
                  ),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sp-track',
                  },
                  books.map((b) =>
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        key: b.id,
                        className:
                          'sp-seg' + (b.finished ? ' done' : b.progress > 0 ? ' part' : ''),
                        title:
                          'Book ' +
                          b.seriesNum +
                          ' · ' +
                          (b.finished
                            ? 'finished'
                            : b.progress > 0
                              ? Math.round(b.progress * 100) + '%'
                              : 'not started'),
                      },
                      b.progress > 0 &&
                        !b.finished &&
                        /*#__PURE__*/ React.createElement('i', {
                          style: {
                            width: b.progress * 100 + '%',
                          },
                        }),
                    ),
                  ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: 12,
                    marginTop: 22,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'btn btn-primary',
                    onClick: () => onPlay(nextUp),
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'play_arrow',
                    fill: true,
                  }),
                  ' Continue \xB7 Book ',
                  nextUp.seriesNum,
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'playlist_add',
                  }),
                  ' Add series to list',
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'hero-prog',
                title: listenedH.toFixed(0) + 'h of ' + totalH.toFixed(0) + 'h listened',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hp-fill',
                  style: {
                    width: pct * 100 + '%',
                  },
                },
                /*#__PURE__*/ React.createElement('span', {
                  className: 'hp-head',
                }),
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'section',
            },
            /*#__PURE__*/ React.createElement(SectionHead, {
              icon: 'format_list_numbered',
              title: 'In reading order',
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'series-list',
              },
              books.map((b) =>
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sl-row',
                    key: b.id,
                    'data-cv': b.cv,
                    onClick: () => openBook(b),
                  },
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sl-num',
                    },
                    b.seriesNum,
                  ),
                  /*#__PURE__*/ React.createElement(Cover, {
                    book: b,
                    fs: 6,
                    className: 'sl-cover',
                  }),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sl-meta',
                    },
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'sl-title',
                      },
                      b.title,
                      b.finished &&
                        /*#__PURE__*/ React.createElement(Icon, {
                          name: 'check_circle',
                          fill: true,
                          style: {
                            fontSize: 16,
                            color: 'var(--text-muted)',
                            marginLeft: 8,
                            verticalAlign: '-3px',
                          },
                        }),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'sl-sub',
                      },
                      b.narrator,
                      ' \xB7 ',
                      b.hours,
                      'h \xB7 ',
                      b.chapters,
                      ' chapters',
                    ),
                    b.progress > 0 &&
                      !b.finished &&
                      /*#__PURE__*/ React.createElement(
                        'div',
                        {
                          className: 'prog-line',
                          style: {
                            marginTop: 8,
                            maxWidth: 280,
                          },
                        },
                        /*#__PURE__*/ React.createElement('i', {
                          style: {
                            width: b.progress * 100 + '%',
                          },
                        }),
                      ),
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sl-rating',
                    },
                    /*#__PURE__*/ React.createElement(Stars, {
                      rating: b.rating,
                    }),
                  ),
                  /*#__PURE__*/ React.createElement(
                    'button',
                    {
                      className: 'icon-btn sl-play',
                      onClick: (e) => {
                        e.stopPropagation()
                        onPlay(b)
                      },
                    },
                    /*#__PURE__*/ React.createElement(Icon, {
                      name: 'play_arrow',
                      fill: true,
                    }),
                  ),
                ),
              ),
            ),
          ),
        )
      }

      /* ---------- Stats ---------- */
      function Stats() {
        const s = HS.STATS
        const max = Math.max(...s.week.map((d) => d.v))
        const hotIdx = s.week.reduce((mi, d, i, a) => (d.v > a[mi].v ? i : mi), 0)
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'page fade-in',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page-head',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'eyebrow',
              },
              'HearthShelf',
            ),
            /*#__PURE__*/ React.createElement(
              'h1',
              {
                className: 'title-xl',
              },
              'Your stats',
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hero-stat',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'label',
              },
              'Total listening time',
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'big-num',
              },
              s.totalH,
              /*#__PURE__*/ React.createElement('u', null, 'h'),
              s.totalM,
              /*#__PURE__*/ React.createElement('u', null, 'm'),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  color: 'var(--text-muted)',
                  fontSize: 14,
                },
              },
              "That's ",
              s.days,
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'stat-tiles',
            },
            s.tiles.map((t, i) =>
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'tile',
                  key: i,
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 't-ico',
                    style: t.hot
                      ? {
                          background: 'color-mix(in oklab, var(--accent) 22%, transparent)',
                          color: 'var(--accent)',
                        }
                      : {},
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: t.ico,
                    fill: t.hot,
                  }),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 't-num',
                  },
                  t.num,
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 't-cap',
                  },
                  t.cap,
                ),
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'chart-card',
            },
            /*#__PURE__*/ React.createElement(SectionHead, {
              icon: 'bar_chart',
              title: 'Last 7 days',
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'bars',
              },
              s.week.map((d, i) =>
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'bar-col' + (i === hotIdx ? ' hot' : ''),
                    key: i,
                  },
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'v',
                    },
                    d.v,
                    'h',
                  ),
                  /*#__PURE__*/ React.createElement('div', {
                    className: 'bar',
                    style: {
                      height: (d.v / max) * 100 + '%',
                    },
                  }),
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'd',
                    },
                    d.d,
                  ),
                ),
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(Compare, {
            c: s.compare,
          }),
        )
      }

      /* ---------- Stats: compare to other listeners ---------- */
      function Compare({ c }) {
        const max = Math.max(...c.bars.map((b) => b.v))
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'section',
          },
          /*#__PURE__*/ React.createElement(SectionHead, {
            icon: 'groups',
            title: 'Compared to other listeners',
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'compare-grid',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'chart-card',
                style: {
                  marginTop: 0,
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'cmp-pct',
                },
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'cmp-ring',
                    style: {
                      '--p': c.percentile,
                    },
                  },
                  /*#__PURE__*/ React.createElement(
                    'span',
                    null,
                    c.percentile,
                    /*#__PURE__*/ React.createElement('u', null, 'th'),
                  ),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  null,
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      style: {
                        fontSize: 15,
                        fontWeight: 600,
                      },
                    },
                    'Top ',
                    100 - c.percentile,
                    '% this month',
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      style: {
                        fontSize: 13,
                        color: 'var(--text-muted)',
                        marginTop: 4,
                      },
                    },
                    'You listened more than ',
                    c.percentile,
                    '% of HearthShelf readers.',
                  ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'cmp-bars',
                },
                c.bars.map((b, i) =>
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'cmp-row',
                      key: i,
                    },
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'cmp-label',
                      },
                      b.label,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'cmp-track',
                      },
                      /*#__PURE__*/ React.createElement('i', {
                        className: b.me ? 'me' : '',
                        style: {
                          width: (b.v / max) * 100 + '%',
                        },
                      }),
                    ),
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'cmp-val',
                      },
                      b.v,
                      'h',
                    ),
                  ),
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'chart-card',
                style: {
                  marginTop: 0,
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                  },
                },
                'Server leaderboard',
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    fontSize: 12.5,
                    color: 'var(--text-muted)',
                    marginBottom: 14,
                  },
                },
                'Hours listened \xB7 last 30 days',
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'lb-list',
                },
                c.friends.map((f) =>
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'lb-row' + (f.me ? ' me' : ''),
                      key: f.name,
                    },
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'lb-rank',
                      },
                      f.rank,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'lb-av',
                        style: {
                          background: f.cv,
                        },
                      },
                      f.name[0],
                    ),
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'lb-name',
                      },
                      f.name,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        className: 'lb-h',
                      },
                      f.h,
                      'h',
                    ),
                  ),
                ),
              ),
            ),
          ),
        )
      }

      /* ---------- Immersive player (two-pane, inline detail) ---------- */
      function Player({ now, playing, toggle, openBook, speed, setSpeed }) {
        const [panel, setPanel] = React.useState(null) // null | "details" | "chapters"
        if (!now)
          return /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'page',
            },
            /*#__PURE__*/ React.createElement(
              'p',
              {
                className: 'page-sub',
              },
              'Nothing playing.',
            ),
          )
        const chapters = HS.chaptersFor(now)
        const curIdx = chapters.findIndex((c) => c.now)
        const cur = chapters[curIdx] || chapters[0]
        const total = now.hours * 60
        const elapsed = total * now.progress
        const chElapsedRatio = 0.46
        const togglePanel = (p) => setPanel((cur) => (cur === p ? null : p))
        const open = !!panel
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'player' + (open ? ' with-panel' : ''),
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'player-col',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'p-head',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                null,
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'eyebrow',
                  },
                  'HearthShelf',
                ),
                /*#__PURE__*/ React.createElement(
                  'h1',
                  {
                    style: {
                      fontSize: 26,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      margin: 0,
                    },
                  },
                  'Listening',
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: 8,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'cloud_done',
                  }),
                  ' Synced',
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'reorder',
                  }),
                  ' Queue',
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(Cover, {
              book: now,
              fs: 26,
              onClick: () => openBook(now),
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'p-prog-row',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'p-pct',
                },
                Math.round(now.progress * 100),
                /*#__PURE__*/ React.createElement('small', null, '.0%'),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'p-ch',
                },
                'Ch ',
                curIdx + 1,
                ' / ',
                now.chapters,
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'prog-line',
              },
              /*#__PURE__*/ React.createElement('i', {
                style: {
                  width: now.progress * 100 + '%',
                },
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'p-times',
              },
              /*#__PURE__*/ React.createElement('span', null, fmt(elapsed), ' elapsed'),
              /*#__PURE__*/ React.createElement('span', null, fmt(total - elapsed), ' left'),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  width: '100%',
                  marginTop: 28,
                  textAlign: 'center',
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                  },
                },
                cur.title,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'scrub',
                },
                /*#__PURE__*/ React.createElement('i', {
                  style: {
                    width: chElapsedRatio * 100 + '%',
                  },
                }),
                /*#__PURE__*/ React.createElement('b', {
                  style: {
                    left: chElapsedRatio * 100 + '%',
                  },
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'p-times',
                },
                /*#__PURE__*/ React.createElement('span', null, fmt(cur.mins * chElapsedRatio)),
                /*#__PURE__*/ React.createElement(
                  'span',
                  null,
                  '-',
                  fmt(cur.mins * (1 - chElapsedRatio)),
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'p-transport',
              },
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'p-skip lite',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'skip_previous',
                  fill: true,
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'p-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'replay_30',
                }),
                /*#__PURE__*/ React.createElement('small', null, '30'),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'p-play',
                  onClick: toggle,
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: playing ? 'pause' : 'play_arrow',
                  fill: true,
                }),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'p-skip',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'forward_30',
                }),
                /*#__PURE__*/ React.createElement('small', null, '30'),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'p-skip lite',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'skip_next',
                  fill: true,
                }),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'action-grid',
              },
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill' + (panel === 'chapters' ? ' on' : ''),
                  onClick: () => togglePanel('chapters'),
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'list',
                }),
                ' Chapters',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill' + (panel === 'details' ? ' on' : ''),
                  onClick: () => togglePanel('details'),
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'info',
                }),
                ' Book details',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill',
                  onClick: () => setSpeed(speed >= 2 ? 1 : +(speed + 0.25).toFixed(2)),
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'speed',
                }),
                ' ',
                speed,
                '\xD7',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'bedtime',
                }),
                ' Sleep timer',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'bookmark_add',
                }),
                ' Bookmark',
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'pill',
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'playlist_add',
                }),
                ' Add to list',
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'p-panel' + (open ? ' open' : ''),
              'aria-hidden': !open,
            },
            panel === 'chapters' &&
              /*#__PURE__*/ React.createElement(PlayerChapters, {
                book: now,
                chapters: chapters,
                curIdx: curIdx,
                onClose: () => setPanel(null),
              }),
            panel === 'details' &&
              /*#__PURE__*/ React.createElement(PlayerDetails, {
                book: now,
                onClose: () => setPanel(null),
              }),
          ),
        )
      }
      function PanelHead({ icon, title, sub, onClose }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'pp-head',
          },
          /*#__PURE__*/ React.createElement(Icon, {
            name: icon,
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'pp-htext',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'pp-title',
              },
              title,
            ),
            sub &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'pp-sub',
                },
                sub,
              ),
          ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              className: 'icon-btn',
              onClick: onClose,
            },
            /*#__PURE__*/ React.createElement(Icon, {
              name: 'close',
            }),
          ),
        )
      }
      function PlayerChapters({ book, chapters, curIdx, onClose }) {
        const left = chapters.filter((c) => !c.done).length
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'pp-inner',
          },
          /*#__PURE__*/ React.createElement(PanelHead, {
            icon: 'list',
            title: 'Chapters',
            sub: book.chapters + ' chapters · ' + left + ' left',
            onClose: onClose,
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'chap-list pp-scroll',
            },
            chapters.map((c) =>
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'chap' + (c.now ? ' now' : '') + (c.done ? ' done' : ''),
                  key: c.n,
                },
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'n',
                  },
                  c.now
                    ? /*#__PURE__*/ React.createElement(Icon, {
                        name: 'graphic_eq',
                        fill: true,
                        style: {
                          fontSize: 16,
                        },
                      })
                    : c.done
                      ? /*#__PURE__*/ React.createElement(Icon, {
                          name: 'check',
                          style: {
                            fontSize: 15,
                          },
                        })
                      : c.n,
                ),
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'ct',
                  },
                  c.title,
                ),
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'cd',
                  },
                  fmt(c.mins),
                ),
              ),
            ),
          ),
        )
      }
      function PlayerDetails({ book, onClose }) {
        const series = book.series ? HS.SERIES.find((s) => s.id === book.series) : null
        const chips = [
          {
            i: 'calendar_today',
            t: book.year,
          },
          {
            i: 'schedule',
            t: book.hours + 'h',
          },
          {
            i: 'list',
            t: book.chapters + ' chapters',
          },
          {
            i: 'category',
            t: book.genre,
          },
        ]
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'pp-inner',
          },
          /*#__PURE__*/ React.createElement(PanelHead, {
            icon: 'info',
            title: 'Book details',
            onClose: onClose,
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'pp-scroll',
              style: {
                padding: '0 4px',
              },
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: 18,
                  marginBottom: 18,
                },
              },
              /*#__PURE__*/ React.createElement(Cover, {
                book: book,
                fs: 9,
                style: {
                  width: 116,
                  height: 116,
                  borderRadius: 12,
                  flex: 'none',
                },
              }),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    minWidth: 0,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'h2',
                  {
                    style: {
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      margin: '0 0 6px',
                      lineHeight: 1.15,
                    },
                  },
                  book.title,
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'by',
                  },
                  'by ',
                  /*#__PURE__*/ React.createElement('b', null, book.author),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'by',
                    style: {
                      marginTop: 2,
                    },
                  },
                  'Read by ',
                  /*#__PURE__*/ React.createElement('b', null, book.narrator),
                ),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 10,
                    },
                  },
                  /*#__PURE__*/ React.createElement(Stars, {
                    rating: book.rating,
                  }),
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      style: {
                        fontSize: 12.5,
                        color: 'var(--text-muted)',
                      },
                    },
                    book.rating,
                  ),
                ),
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'meta-chips',
                style: {
                  margin: '0 0 18px',
                },
              },
              chips.map((c, i) =>
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'chip',
                    key: i,
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: c.i,
                  }),
                  ' ',
                  c.t,
                ),
              ),
            ),
            series &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'set-row',
                  style: {
                    background: 'var(--c)',
                    borderRadius: 12,
                    padding: '13px 15px',
                    border: 'none',
                    marginBottom: 18,
                  },
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'auto_stories',
                  style: {
                    color: 'var(--text-muted)',
                  },
                }),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'sr-meta',
                  },
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sr-t',
                    },
                    series.name,
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sr-d',
                    },
                    'Book ',
                    book.seriesNum,
                    ' of ',
                    series.books.length,
                  ),
                ),
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'chevron_right',
                  style: {
                    color: 'var(--text-muted)',
                  },
                }),
              ),
            /*#__PURE__*/ React.createElement(
              'p',
              {
                className: 'desc',
              },
              DESC,
            ),
          ),
        )
      }

      /* ---------- Book detail sheet ---------- */
      function BookSheet({ book, onClose, openPlayer }) {
        const [open, setOpen] = React.useState(false)
        React.useEffect(() => {
          const r = requestAnimationFrame(() => setOpen(true))
          return () => cancelAnimationFrame(r)
        }, [])
        React.useEffect(() => {
          const onKey = (e) => {
            if (e.key === 'Escape') close()
          }
          window.addEventListener('keydown', onKey)
          return () => window.removeEventListener('keydown', onKey)
        }, [])
        function close() {
          setOpen(false)
          setTimeout(onClose, 300)
        }
        if (!book) return null
        const chapters = HS.chaptersFor(book)
        const series = book.series ? HS.SERIES.find((s) => s.id === book.series) : null
        const chips = [
          {
            i: 'calendar_today',
            t: book.year,
          },
          {
            i: 'schedule',
            t: book.hours + 'h',
          },
          {
            i: 'list',
            t: book.chapters + ' chapters',
          },
          {
            i: 'category',
            t: book.genre,
          },
        ]
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'scrim' + (open ? ' open' : ''),
            onClick: close,
            style: {
              '--glow-accent': book.cv,
            },
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'sheet',
              onClick: (e) => e.stopPropagation(),
            },
            /*#__PURE__*/ React.createElement('div', {
              className: 'sheet-glow',
            }),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                className: 'icon-btn sheet-close',
                onClick: close,
              },
              /*#__PURE__*/ React.createElement(Icon, {
                name: 'close',
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'sheet-inner',
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'sheet-top',
                },
                /*#__PURE__*/ React.createElement(Cover, {
                  book: book,
                  fs: 14,
                }),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    style: {
                      flex: 1,
                      minWidth: 0,
                    },
                  },
                  /*#__PURE__*/ React.createElement('h1', null, book.title),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'by',
                    },
                    'by ',
                    /*#__PURE__*/ React.createElement('b', null, book.author),
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'by',
                      style: {
                        marginTop: 2,
                      },
                    },
                    'Narrated by ',
                    /*#__PURE__*/ React.createElement('b', null, book.narrator),
                  ),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        margin: '12px 0',
                      },
                    },
                    /*#__PURE__*/ React.createElement(Stars, {
                      rating: book.rating,
                    }),
                    /*#__PURE__*/ React.createElement(
                      'span',
                      {
                        style: {
                          fontSize: 13,
                          color: 'var(--text-muted)',
                        },
                      },
                      book.rating,
                      ' on Audible',
                    ),
                  ),
                  book.progress > 0 &&
                    !book.finished &&
                    /*#__PURE__*/ React.createElement(
                      React.Fragment,
                      null,
                      /*#__PURE__*/ React.createElement(
                        'div',
                        {
                          className: 'prog-line',
                        },
                        /*#__PURE__*/ React.createElement('i', {
                          style: {
                            width: book.progress * 100 + '%',
                          },
                        }),
                      ),
                      /*#__PURE__*/ React.createElement(
                        'div',
                        {
                          style: {
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            marginTop: 6,
                          },
                        },
                        Math.round(book.progress * 100),
                        '% \xB7 ',
                        Math.round(book.chapters * (1 - book.progress)),
                        ' chapters left',
                      ),
                    ),
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'btn btn-primary',
                  style: {
                    width: '100%',
                    marginTop: 22,
                  },
                  onClick: () => {
                    openPlayer(book)
                    close()
                  },
                },
                /*#__PURE__*/ React.createElement(Icon, {
                  name: 'play_arrow',
                  fill: true,
                }),
                ' ',
                book.finished
                  ? 'Listen again'
                  : book.progress > 0
                    ? 'Resume listening'
                    : 'Start listening',
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: 10,
                    marginTop: 12,
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                    style: {
                      flex: 1,
                      justifyContent: 'center',
                    },
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'download',
                  }),
                  ' Download',
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                    style: {
                      flex: 1,
                      justifyContent: 'center',
                    },
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'task_alt',
                  }),
                  ' ',
                  book.finished ? 'Finished' : 'Mark finished',
                ),
                /*#__PURE__*/ React.createElement(
                  'button',
                  {
                    className: 'pill',
                    style: {
                      flex: 1,
                      justifyContent: 'center',
                    },
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'restart_alt',
                  }),
                  ' Reset',
                ),
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'meta-chips',
                },
                chips.map((c, i) =>
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'chip',
                      key: i,
                    },
                    /*#__PURE__*/ React.createElement(Icon, {
                      name: c.i,
                    }),
                    ' ',
                    c.t,
                  ),
                ),
              ),
              series &&
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'set-row',
                    style: {
                      background: 'var(--c)',
                      borderRadius: 12,
                      padding: '14px 16px',
                      border: 'none',
                    },
                  },
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'auto_stories',
                    style: {
                      color: 'var(--text-muted)',
                    },
                  }),
                  /*#__PURE__*/ React.createElement(
                    'div',
                    {
                      className: 'sr-meta',
                    },
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'sr-t',
                      },
                      series.name,
                    ),
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'sr-d',
                      },
                      'Book ',
                      book.seriesNum,
                      ' of ',
                      series.books.length,
                    ),
                  ),
                  /*#__PURE__*/ React.createElement(Icon, {
                    name: 'chevron_right',
                    style: {
                      color: 'var(--text-muted)',
                    },
                  }),
                ),
              /*#__PURE__*/ React.createElement(
                'p',
                {
                  className: 'desc',
                  style: {
                    marginTop: 20,
                  },
                },
                DESC,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'section',
                  style: {
                    marginTop: 28,
                  },
                },
                /*#__PURE__*/ React.createElement(SectionHead, {
                  icon: 'list',
                  title: 'Chapters',
                }),
                /*#__PURE__*/ React.createElement(
                  'div',
                  {
                    className: 'chap-list',
                  },
                  chapters.slice(0, 8).map((c) =>
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'chap' + (c.now ? ' now' : '') + (c.done ? ' done' : ''),
                        key: c.n,
                      },
                      /*#__PURE__*/ React.createElement(
                        'span',
                        {
                          className: 'n',
                        },
                        c.now
                          ? /*#__PURE__*/ React.createElement(Icon, {
                              name: 'graphic_eq',
                              fill: true,
                              style: {
                                fontSize: 16,
                              },
                            })
                          : c.done
                            ? /*#__PURE__*/ React.createElement(Icon, {
                                name: 'check',
                                style: {
                                  fontSize: 15,
                                },
                              })
                            : c.n,
                      ),
                      /*#__PURE__*/ React.createElement(
                        'span',
                        {
                          className: 'ct',
                        },
                        c.title,
                      ),
                      /*#__PURE__*/ React.createElement(
                        'span',
                        {
                          className: 'cd',
                        },
                        fmt(c.mins),
                      ),
                    ),
                  ),
                  chapters.length > 8 &&
                    /*#__PURE__*/ React.createElement(
                      'div',
                      {
                        className: 'chap',
                        style: {
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                          fontSize: 13,
                        },
                      },
                      '+ ',
                      chapters.length - 8,
                      ' more chapters',
                    ),
                ),
              ),
            ),
          ),
        )
      }
      Object.assign(window, {
        Home,
        Library,
        SeriesView,
        SeriesDetail,
        Stats,
        Compare,
        Player,
        PanelHead,
        PlayerChapters,
        PlayerDetails,
        BookSheet,
      })
    })()
  } catch (e) {
    __ds_ns.__errors.push({ path: 'app/screens.jsx', error: String((e && e.message) || e) })
  }

  // app/tweaks-panel.jsx
  try {
    ;(() => {
      // @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

      /* BEGIN USAGE */
      // tweaks-panel.jsx
      // Reusable Tweaks shell + form-control helpers.
      // Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
      //   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
      //
      // Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
      // posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
      // individual prototypes don't re-roll it. Ships a consistent set of controls so you
      // don't hand-draw <input type="range">, segmented radios, steppers, etc.
      //
      // Usage (in an HTML file that loads React + Babel):
      //
      //   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      //     "primaryColor": "#D97757",
      //     "palette": ["#D97757", "#29261b", "#f6f4ef"],
      //     "fontSize": 16,
      //     "density": "regular",
      //     "dark": false
      //   }/*EDITMODE-END*/;
      //
      //   function App() {
      //     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
      //     return (
      //       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
      //         Hello
      //         <TweaksPanel>
      //           <TweakSection label="Typography" />
      //           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
      //                        onChange={(v) => setTweak('fontSize', v)} />
      //           <TweakRadio  label="Density" value={t.density}
      //                        options={['compact', 'regular', 'comfy']}
      //                        onChange={(v) => setTweak('density', v)} />
      //           <TweakSection label="Theme" />
      //           <TweakColor  label="Primary" value={t.primaryColor}
      //                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
      //                        onChange={(v) => setTweak('primaryColor', v)} />
      //           <TweakColor  label="Palette" value={t.palette}
      //                        options={[['#D97757', '#29261b', '#f6f4ef'],
      //                                  ['#475569', '#0f172a', '#f1f5f9']]}
      //                        onChange={(v) => setTweak('palette', v)} />
      //           <TweakToggle label="Dark mode" value={t.dark}
      //                        onChange={(v) => setTweak('dark', v)} />
      //         </TweaksPanel>
      //       </div>
      //     );
      //   }
      //
      // TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
      // TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
      // options are many or long. For color tweaks always curate 3-4 options rather than
      // a free picker; an option can also be a whole 2–5 color palette (the stored value
      // is the array). The Tweak* controls are a floor, not a ceiling — build custom
      // controls inside the panel if a tweak calls for UI they don't cover.
      /* END USAGE */
      // ─────────────────────────────────────────────────────────────────────────────

      const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`

      // ── useTweaks ───────────────────────────────────────────────────────────────
      // Single source of truth for tweak values. setTweak persists via the host
      // (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
      function useTweaks(defaults) {
        const [values, setValues] = React.useState(defaults)
        // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
        // useState-style call doesn't write a "[object Object]" key into the persisted
        // JSON block.
        const setTweak = React.useCallback((keyOrEdits, val) => {
          const edits =
            typeof keyOrEdits === 'object' && keyOrEdits !== null
              ? keyOrEdits
              : {
                  [keyOrEdits]: val,
                }
          setValues((prev) => ({
            ...prev,
            ...edits,
          }))
          window.parent.postMessage(
            {
              type: '__edit_mode_set_keys',
              edits,
            },
            '*',
          )
          // Same-window signal so in-page listeners (deck-stage rail thumbnails)
          // can react — the parent message only reaches the host, not peers.
          window.dispatchEvent(
            new CustomEvent('tweakchange', {
              detail: edits,
            }),
          )
        }, [])
        return [values, setTweak]
      }

      // ── TweaksPanel ─────────────────────────────────────────────────────────────
      // Floating shell. Registers the protocol listener BEFORE announcing
      // availability — if the announce ran first, the host's activate could land
      // before our handler exists and the toolbar toggle would silently no-op.
      // The close button posts __edit_mode_dismissed so the host's toolbar toggle
      // flips off in lockstep; the host echoes __deactivate_edit_mode back which
      // is what actually hides the panel.
      function TweaksPanel({ title = 'Tweaks', children }) {
        const [open, setOpen] = React.useState(false)
        const dragRef = React.useRef(null)
        const offsetRef = React.useRef({
          x: 16,
          y: 16,
        })
        const PAD = 16
        const clampToViewport = React.useCallback(() => {
          const panel = dragRef.current
          if (!panel) return
          const w = panel.offsetWidth,
            h = panel.offsetHeight
          const maxRight = Math.max(PAD, window.innerWidth - w - PAD)
          const maxBottom = Math.max(PAD, window.innerHeight - h - PAD)
          offsetRef.current = {
            x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
            y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
          }
          panel.style.right = offsetRef.current.x + 'px'
          panel.style.bottom = offsetRef.current.y + 'px'
        }, [])
        React.useEffect(() => {
          if (!open) return
          clampToViewport()
          if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', clampToViewport)
            return () => window.removeEventListener('resize', clampToViewport)
          }
          const ro = new ResizeObserver(clampToViewport)
          ro.observe(document.documentElement)
          return () => ro.disconnect()
        }, [open, clampToViewport])
        React.useEffect(() => {
          const onMsg = (e) => {
            const t = e?.data?.type
            if (t === '__activate_edit_mode') setOpen(true)
            else if (t === '__deactivate_edit_mode') setOpen(false)
          }
          window.addEventListener('message', onMsg)
          window.parent.postMessage(
            {
              type: '__edit_mode_available',
            },
            '*',
          )
          return () => window.removeEventListener('message', onMsg)
        }, [])
        const dismiss = () => {
          setOpen(false)
          window.parent.postMessage(
            {
              type: '__edit_mode_dismissed',
            },
            '*',
          )
        }
        const onDragStart = (e) => {
          const panel = dragRef.current
          if (!panel) return
          const r = panel.getBoundingClientRect()
          const sx = e.clientX,
            sy = e.clientY
          const startRight = window.innerWidth - r.right
          const startBottom = window.innerHeight - r.bottom
          const move = (ev) => {
            offsetRef.current = {
              x: startRight - (ev.clientX - sx),
              y: startBottom - (ev.clientY - sy),
            }
            clampToViewport()
          }
          const up = () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseup', up)
          }
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        }
        if (!open) return null
        return /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          /*#__PURE__*/ React.createElement('style', null, __TWEAKS_STYLE),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              ref: dragRef,
              className: 'twk-panel',
              'data-omelette-chrome': '',
              style: {
                right: offsetRef.current.x,
                bottom: offsetRef.current.y,
              },
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'twk-hd',
                onMouseDown: onDragStart,
              },
              /*#__PURE__*/ React.createElement('b', null, title),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  className: 'twk-x',
                  'aria-label': 'Close tweaks',
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: dismiss,
                },
                '\u2715',
              ),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'twk-body',
              },
              children,
            ),
          ),
        )
      }

      // ── Layout helpers ──────────────────────────────────────────────────────────

      function TweakSection({ label, children }) {
        return /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'twk-sect',
            },
            label,
          ),
          children,
        )
      }
      function TweakRow({ label, value, children, inline = false }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: inline ? 'twk-row twk-row-h' : 'twk-row',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'twk-lbl',
            },
            /*#__PURE__*/ React.createElement('span', null, label),
            value != null &&
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'twk-val',
                },
                value,
              ),
          ),
          children,
        )
      }

      // ── Controls ────────────────────────────────────────────────────────────────

      function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
        return /*#__PURE__*/ React.createElement(
          TweakRow,
          {
            label: label,
            value: `${value}${unit}`,
          },
          /*#__PURE__*/ React.createElement('input', {
            type: 'range',
            className: 'twk-slider',
            min: min,
            max: max,
            step: step,
            value: value,
            onChange: (e) => onChange(Number(e.target.value)),
          }),
        )
      }
      function TweakToggle({ label, value, onChange }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'twk-row twk-row-h',
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'twk-lbl',
            },
            /*#__PURE__*/ React.createElement('span', null, label),
          ),
          /*#__PURE__*/ React.createElement(
            'button',
            {
              type: 'button',
              className: 'twk-toggle',
              'data-on': value ? '1' : '0',
              role: 'switch',
              'aria-checked': !!value,
              onClick: () => onChange(!value),
            },
            /*#__PURE__*/ React.createElement('i', null),
          ),
        )
      }
      function TweakRadio({ label, value, options, onChange }) {
        const trackRef = React.useRef(null)
        const [dragging, setDragging] = React.useState(false)
        // The active value is read by pointer-move handlers attached for the lifetime
        // of a drag — ref it so a stale closure doesn't fire onChange for every move.
        const valueRef = React.useRef(value)
        valueRef.current = value

        // Segments wrap mid-word once per-segment width runs out. The track is
        // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
        // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
        // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
        // back to a dropdown rather than wrap.
        const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length
        const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0)
        const fitsAsSegments =
          maxLen <=
          ({
            2: 16,
            3: 10,
          }[options.length] ?? 0)
        if (!fitsAsSegments) {
          // <select> emits strings — map back to the original option value so the
          // fallback stays type-preserving (numbers, booleans) like the segment path.
          const resolve = (s) => {
            const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s)
            return m === undefined ? s : typeof m === 'object' ? m.value : m
          }
          return /*#__PURE__*/ React.createElement(TweakSelect, {
            label: label,
            value: value,
            options: options,
            onChange: (s) => onChange(resolve(s)),
          })
        }
        const opts = options.map((o) =>
          typeof o === 'object'
            ? o
            : {
                value: o,
                label: o,
              },
        )
        const idx = Math.max(
          0,
          opts.findIndex((o) => o.value === value),
        )
        const n = opts.length
        const segAt = (clientX) => {
          const r = trackRef.current.getBoundingClientRect()
          const inner = r.width - 4
          const i = Math.floor(((clientX - r.left - 2) / inner) * n)
          return opts[Math.max(0, Math.min(n - 1, i))].value
        }
        const onPointerDown = (e) => {
          setDragging(true)
          const v0 = segAt(e.clientX)
          if (v0 !== valueRef.current) onChange(v0)
          const move = (ev) => {
            if (!trackRef.current) return
            const v = segAt(ev.clientX)
            if (v !== valueRef.current) onChange(v)
          }
          const up = () => {
            setDragging(false)
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        }
        return /*#__PURE__*/ React.createElement(
          TweakRow,
          {
            label: label,
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              ref: trackRef,
              role: 'radiogroup',
              onPointerDown: onPointerDown,
              className: dragging ? 'twk-seg dragging' : 'twk-seg',
            },
            /*#__PURE__*/ React.createElement('div', {
              className: 'twk-seg-thumb',
              style: {
                left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                width: `calc((100% - 4px) / ${n})`,
              },
            }),
            opts.map((o) =>
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  key: o.value,
                  type: 'button',
                  role: 'radio',
                  'aria-checked': o.value === value,
                },
                o.label,
              ),
            ),
          ),
        )
      }
      function TweakSelect({ label, value, options, onChange }) {
        return /*#__PURE__*/ React.createElement(
          TweakRow,
          {
            label: label,
          },
          /*#__PURE__*/ React.createElement(
            'select',
            {
              className: 'twk-field',
              value: value,
              onChange: (e) => onChange(e.target.value),
            },
            options.map((o) => {
              const v = typeof o === 'object' ? o.value : o
              const l = typeof o === 'object' ? o.label : o
              return /*#__PURE__*/ React.createElement(
                'option',
                {
                  key: v,
                  value: v,
                },
                l,
              )
            }),
          ),
        )
      }
      function TweakText({ label, value, placeholder, onChange }) {
        return /*#__PURE__*/ React.createElement(
          TweakRow,
          {
            label: label,
          },
          /*#__PURE__*/ React.createElement('input', {
            className: 'twk-field',
            type: 'text',
            value: value,
            placeholder: placeholder,
            onChange: (e) => onChange(e.target.value),
          }),
        )
      }
      function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
        const clamp = (n) => {
          if (min != null && n < min) return min
          if (max != null && n > max) return max
          return n
        }
        const startRef = React.useRef({
          x: 0,
          val: 0,
        })
        const onScrubStart = (e) => {
          e.preventDefault()
          startRef.current = {
            x: e.clientX,
            val: value,
          }
          const decimals = (String(step).split('.')[1] || '').length
          const move = (ev) => {
            const dx = ev.clientX - startRef.current.x
            const raw = startRef.current.val + dx * step
            const snapped = Math.round(raw / step) * step
            onChange(clamp(Number(snapped.toFixed(decimals))))
          }
          const up = () => {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        }
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'twk-num',
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'twk-num-lbl',
              onPointerDown: onScrubStart,
            },
            label,
          ),
          /*#__PURE__*/ React.createElement('input', {
            type: 'number',
            value: value,
            min: min,
            max: max,
            step: step,
            onChange: (e) => onChange(clamp(Number(e.target.value))),
          }),
          unit &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'twk-num-unit',
              },
              unit,
            ),
        )
      }

      // Relative-luminance contrast pick — checkmarks drawn over a swatch need to
      // read on both #111 and #fafafa without per-option configuration. Hex input
      // only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
      function __twkIsLight(hex) {
        const h = String(hex).replace('#', '')
        const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0')
        const n = parseInt(x.slice(0, 6), 16)
        if (Number.isNaN(n)) return true
        const r = (n >> 16) & 255,
          g = (n >> 8) & 255,
          b = n & 255
        return r * 299 + g * 587 + b * 114 > 148000
      }
      const __TwkCheck = ({ light }) =>
        /*#__PURE__*/ React.createElement(
          'svg',
          {
            viewBox: '0 0 14 14',
            'aria-hidden': 'true',
          },
          /*#__PURE__*/ React.createElement('path', {
            d: 'M3 7.2 5.8 10 11 4.2',
            fill: 'none',
            strokeWidth: '2.2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            stroke: light ? 'rgba(0,0,0,.78)' : '#fff',
          }),
        )

      // TweakColor — curated color/palette picker. Each option is either a single
      // hex string or an array of 1-5 hex strings; the card adapts — a lone color
      // renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
      // rest stacked in a sharp column on the right. onChange emits the
      // option in the shape it was passed (string stays string, array stays array).
      // Without options it falls back to the native color input for back-compat.
      function TweakColor({ label, value, options, onChange }) {
        if (!options || !options.length) {
          return /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'twk-row twk-row-h',
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'twk-lbl',
              },
              /*#__PURE__*/ React.createElement('span', null, label),
            ),
            /*#__PURE__*/ React.createElement('input', {
              type: 'color',
              className: 'twk-swatch',
              value: value,
              onChange: (e) => onChange(e.target.value),
            }),
          )
        }
        // Native <input type=color> emits lowercase hex per the HTML spec, so
        // compare case-insensitively. String() guards JSON.stringify(undefined),
        // which returns the primitive undefined (no .toLowerCase).
        const key = (o) => String(JSON.stringify(o)).toLowerCase()
        const cur = key(value)
        return /*#__PURE__*/ React.createElement(
          TweakRow,
          {
            label: label,
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'twk-chips',
              role: 'radiogroup',
            },
            options.map((o, i) => {
              const colors = Array.isArray(o) ? o : [o]
              const [hero, ...rest] = colors
              const sup = rest.slice(0, 4)
              const on = key(o) === cur
              return /*#__PURE__*/ React.createElement(
                'button',
                {
                  key: i,
                  type: 'button',
                  className: 'twk-chip',
                  role: 'radio',
                  'aria-checked': on,
                  'data-on': on ? '1' : '0',
                  'aria-label': colors.join(', '),
                  title: colors.join(' · '),
                  style: {
                    background: hero,
                  },
                  onClick: () => onChange(o),
                },
                sup.length > 0 &&
                  /*#__PURE__*/ React.createElement(
                    'span',
                    null,
                    sup.map((c, j) =>
                      /*#__PURE__*/ React.createElement('i', {
                        key: j,
                        style: {
                          background: c,
                        },
                      }),
                    ),
                  ),
                on &&
                  /*#__PURE__*/ React.createElement(__TwkCheck, {
                    light: __twkIsLight(hero),
                  }),
              )
            }),
          ),
        )
      }
      function TweakButton({ label, onClick, secondary = false }) {
        return /*#__PURE__*/ React.createElement(
          'button',
          {
            type: 'button',
            className: secondary ? 'twk-btn secondary' : 'twk-btn',
            onClick: onClick,
          },
          label,
        )
      }
      Object.assign(window, {
        useTweaks,
        TweaksPanel,
        TweakSection,
        TweakRow,
        TweakSlider,
        TweakToggle,
        TweakRadio,
        TweakSelect,
        TweakText,
        TweakNumber,
        TweakColor,
        TweakButton,
      })
    })()
  } catch (e) {
    __ds_ns.__errors.push({ path: 'app/tweaks-panel.jsx', error: String((e && e.message) || e) })
  }

  // components/core/Badge.jsx
  try {
    ;(() => {
      /**
       * Small status / metadata badge. `tone="now"` uses the ember accent for
       * the now-playing state; `solid` fills, otherwise it's a soft chip.
       */
      function Badge({ tone = 'neutral', solid = false, icon, children, style = {} }) {
        const tones = {
          neutral: {
            fg: 'var(--muted-foreground)',
            bg: 'var(--fill)',
          },
          now: {
            fg: 'var(--primary)',
            bg: 'color-mix(in oklab, var(--primary) 16%, transparent)',
          },
          done: {
            fg: 'var(--foreground)',
            bg: 'var(--fill)',
          },
        }
        const t = tones[tone] || tones.neutral
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1,
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              color: solid ? 'var(--primary-foreground)' : t.fg,
              background: solid ? 'var(--primary)' : t.bg,
              ...style,
            },
          },
          icon &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'ms',
                style: {
                  fontSize: 15,
                },
              },
              icon,
            ),
          children,
        )
      }
      Object.assign(__ds_scope, { Badge })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/core/Badge.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/core/Button.jsx
  try {
    ;(() => {
      /**
       * HearthShelf Button. Styled entirely off shadcn role tokens, so it
       * follows theme + dynamic-accent overrides automatically.
       */
      function Button({
        variant = 'primary',
        size = 'md',
        icon,
        iconRight,
        fullWidth = false,
        disabled = false,
        children,
        onClick,
        style = {},
      }) {
        const [hover, setHover] = React.useState(false)
        const pad = {
          sm: '8px 14px',
          md: '11px 20px',
          lg: '14px 26px',
        }
        const fs = {
          sm: 13,
          md: 15,
          lg: 15,
        }
        const isPill = variant === 'pill' || variant === 'ghost'
        const variants = {
          primary: {
            background: hover ? 'color-mix(in oklab, var(--primary) 88%, #fff)' : 'var(--primary)',
            color: 'var(--primary-foreground)',
            boxShadow: '0 8px 22px color-mix(in oklab, var(--primary) 32%, transparent)',
          },
          secondary: {
            background: hover
              ? 'color-mix(in oklab, var(--secondary) 80%, var(--foreground) 6%)'
              : 'var(--secondary)',
            color: 'var(--secondary-foreground)',
          },
          pill: {
            background: hover ? 'var(--fill-strong)' : 'var(--fill)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          ghost: {
            background: hover ? 'var(--fill)' : 'transparent',
            color: hover ? 'var(--foreground)' : 'var(--muted-foreground)',
          },
          destructive: {
            background: hover
              ? 'color-mix(in oklab, var(--destructive) 88%, #fff)'
              : 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          },
        }
        return /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: disabled ? undefined : onClick,
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            disabled: disabled,
            style: {
              display: fullWidth ? 'flex' : 'inline-flex',
              width: fullWidth ? '100%' : undefined,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: fs[size],
              padding: pad[size],
              borderRadius: isPill ? 'var(--radius-pill)' : 'var(--radius-md)',
              border: '1px solid transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.45 : 1,
              whiteSpace: 'nowrap',
              transition: 'background .18s, transform .1s, box-shadow .18s',
              ...variants[variant],
              ...style,
            },
          },
          icon &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'ms fill',
                style: {
                  fontSize: size === 'lg' ? 21 : 19,
                },
              },
              icon,
            ),
          children,
          iconRight &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'ms',
                style: {
                  fontSize: 19,
                },
              },
              iconRight,
            ),
        )
      }
      Object.assign(__ds_scope, { Button })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/core/Button.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/core/NavItem.jsx
  try {
    ;(() => {
      /**
       * Sidebar navigation item. `active` paints the ember tint + accent text.
       */
      function NavItem({ icon, label, active = false, onClick, style = {} }) {
        const [hover, setHover] = React.useState(false)
        return /*#__PURE__*/ React.createElement(
          'button',
          {
            onClick: onClick,
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            style: {
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              textAlign: 'left',
              padding: '11px 14px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              color: active
                ? 'var(--primary)'
                : hover
                  ? 'var(--foreground)'
                  : 'var(--muted-foreground)',
              background: active
                ? 'color-mix(in oklab, var(--primary) 15%, transparent)'
                : hover
                  ? 'var(--fill)'
                  : 'transparent',
              transition: 'background .18s, color .18s',
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'ms' + (active ? ' fill' : ''),
              style: {
                fontSize: 21,
              },
            },
            icon,
          ),
          label,
        )
      }
      Object.assign(__ds_scope, { NavItem })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/core/NavItem.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/core/ProgressBar.jsx
  try {
    ;(() => {
      /**
       * Thin progress / scrubber bar. The fill is the ember accent; pass
       * `scrubber` to show a draggable thumb (player UI).
       */
      function ProgressBar({ value = 0, height = 4, scrubber = false, style = {} }) {
        const pct = Math.max(0, Math.min(1, value)) * 100
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: {
              position: 'relative',
              height: scrubber ? Math.max(height, 6) : height,
              background: 'var(--elevated)',
              borderRadius: 999,
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement('div', {
            style: {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: pct + '%',
              background: 'var(--primary)',
              borderRadius: 999,
              transition: 'width .3s',
            },
          }),
          scrubber &&
            /*#__PURE__*/ React.createElement('div', {
              style: {
                position: 'absolute',
                top: '50%',
                left: pct + '%',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#fff',
                transform: 'translate(-50%,-50%)',
                boxShadow: '0 2px 6px rgba(0,0,0,.4)',
              },
            }),
        )
      }
      Object.assign(__ds_scope, { ProgressBar })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/core/ProgressBar.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/core/Stars.jsx
  try {
    ;(() => {
      /** Five-star rating. Half-stars supported. Gold, not the ember accent. */
      function Stars({ rating = 0, size = 16, style = {} }) {
        const full = Math.floor(rating)
        const half = rating - full >= 0.4
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            style: {
              display: 'inline-flex',
              gap: 1,
              color: '#e8b54a',
              ...style,
            },
          },
          [0, 1, 2, 3, 4].map((i) => {
            const filled = i < full
            const isHalf = i === full && half
            return /*#__PURE__*/ React.createElement(
              'span',
              {
                key: i,
                className: 'ms' + (filled || isHalf ? ' fill' : ''),
                style: {
                  fontSize: size,
                },
              },
              isHalf ? 'star_half' : 'star',
            )
          }),
        )
      }
      Object.assign(__ds_scope, { Stars })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/core/Stars.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/media/Cover.jsx
  try {
    ;(() => {
      /** Relative-luminance pick: ink vs cream label on a given hue. */
      function onColor(hex) {
        const h = (hex || '#888').replace('#', '')
        const r = parseInt(h.slice(0, 2), 16) / 255
        const g = parseInt(h.slice(2, 4), 16) / 255
        const b = parseInt(h.slice(4, 6), 16) / 255
        const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
        const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
        return L > 0.42 ? '#1a1509' : '#fff'
      }

      /**
       * Typeset audiobook cover — the signature HearthShelf object and the
       * source of the dynamic accent. When no artwork exists it composes a
       * tonal duotone from a single hue (`book.cv`): faint oversized initial,
       * kicker, title, author. `fs` scales every internal element together.
       */
      function Cover({
        book,
        fs = 14,
        radius = 'var(--radius-sm)',
        badge,
        overlay,
        onClick,
        style = {},
      }) {
        const initial = (book.title || '?').trim()[0]
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            onClick: onClick,
            style: {
              position: 'relative',
              borderRadius: radius,
              overflow: 'hidden',
              aspectRatio: '1 / 1',
              isolation: 'isolate',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              fontSize: fs + 'px',
              cursor: onClick ? 'pointer' : 'default',
              background: book.cv,
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement('div', {
            style: {
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: `radial-gradient(130% 100% at 18% 8%, color-mix(in oklab, ${book.cv} 78%, #fff 6%) 0%, transparent 55%), linear-gradient(155deg, color-mix(in oklab, ${book.cv} 92%, #000 4%), color-mix(in oklab, ${book.cv} 50%, #07060a) 100%)`,
            },
          }),
          /*#__PURE__*/ React.createElement(
            'span',
            {
              'aria-hidden': true,
              style: {
                position: 'absolute',
                right: '-6%',
                bottom: '-16%',
                zIndex: 1,
                fontSize: '9em',
                fontWeight: 800,
                lineHeight: 1,
                color: 'rgba(255,255,255,0.10)',
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-sans)',
              },
            },
            initial,
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                position: 'relative',
                zIndex: 2,
                padding: '13% 12% 14%',
              },
            },
            /*#__PURE__*/ React.createElement('div', {
              style: {
                width: '26%',
                height: 2,
                background: 'rgba(255,255,255,0.4)',
                marginBottom: '0.9em',
                borderRadius: 2,
              },
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontSize: '0.62em',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.62)',
                  marginBottom: '0.5em',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                },
              },
              book.kicker,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontSize: '1.18em',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.08,
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                },
              },
              book.title,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontSize: '0.66em',
                  color: 'rgba(255,255,255,0.72)',
                  marginTop: '0.7em',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                },
              },
              book.author,
            ),
          ),
          /*#__PURE__*/ React.createElement('span', {
            style: {
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              background: 'linear-gradient(125deg, rgba(255,255,255,0.10), transparent 38%)',
              pointerEvents: 'none',
            },
          }),
          badge,
          overlay,
        )
      }
      Object.assign(__ds_scope, { onColor, Cover })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/media/Cover.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/media/BookTile.jsx
  try {
    ;(() => {
      /** Hover overlay of quick actions, scoped to the cover. */
      function HoverActions({ onPlay, onAdd, onFinish, onMore, visible }) {
        const Btn = ({ on, icon, primary, title }) =>
          /*#__PURE__*/ React.createElement(
            'button',
            {
              title: title,
              onClick: (e) => {
                e.stopPropagation()
                on && on()
              },
              style: {
                width: primary ? 46 : 38,
                height: primary ? 46 : 38,
                borderRadius: '50%',
                flex: 'none',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                border: primary ? 'none' : '1px solid rgba(255,255,255,0.22)',
                background: primary ? 'var(--primary)' : 'rgba(255,255,255,0.16)',
                color: primary ? 'var(--primary-foreground)' : '#fff',
                backdropFilter: primary ? undefined : 'blur(6px)',
                boxShadow: primary ? '0 6px 16px rgba(0,0,0,0.45)' : undefined,
              },
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'ms' + (primary ? ' fill' : ''),
                style: {
                  fontSize: primary ? 26 : 19,
                },
              },
              icon,
            ),
          )
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            onClick: (e) => e.stopPropagation(),
            style: {
              position: 'absolute',
              inset: 0,
              zIndex: 6,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 10,
              padding: 16,
              opacity: visible ? 1 : 0,
              transition: 'opacity .2s',
              background:
                'linear-gradient(to top, rgba(8,6,4,0.8), rgba(8,6,4,0.12) 56%, transparent 82%)',
            },
          },
          /*#__PURE__*/ React.createElement(Btn, {
            on: onPlay,
            icon: 'play_arrow',
            primary: true,
            title: 'Play',
          }),
          onAdd &&
            /*#__PURE__*/ React.createElement(Btn, {
              on: onAdd,
              icon: 'playlist_add',
              title: 'Add to list',
            }),
          onFinish &&
            /*#__PURE__*/ React.createElement(Btn, {
              on: onFinish,
              icon: 'check',
              title: 'Mark finished',
            }),
          onMore &&
            /*#__PURE__*/ React.createElement(Btn, {
              on: onMore,
              icon: 'more_horiz',
              title: 'More',
            }),
        )
      }

      /**
       * Library book tile — cover + caption, with hover actions on the cover.
       * `card` wraps it in a surface with the cover bleeding to the top edge.
       */
      function BookTile({ book, card = true, onOpen, onPlay, onAdd, fs = 15, style = {} }) {
        const [hover, setHover] = React.useState(false)
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            onClick: () => onOpen && onOpen(book),
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            style: {
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transform: hover ? 'translateY(-4px)' : 'none',
              transition: 'transform .22s cubic-bezier(.2,.7,.3,1)',
              background: card ? 'var(--card)' : 'transparent',
              borderRadius: card ? 'var(--radius)' : 0,
              overflow: card ? 'hidden' : 'visible',
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement(__ds_scope.Cover, {
            book: book,
            fs: fs,
            radius: card ? 'var(--radius) var(--radius) 0 0' : 'var(--radius-sm)',
            style: {
              boxShadow: card
                ? 'none'
                : hover
                  ? 'var(--shadow-lift)'
                  : '0 10px 28px rgba(0,0,0,0.4)',
            },
            badge: book.finished
              ? /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    style: {
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 4,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      background: '#2f9d6b',
                      border: '2px solid color-mix(in oklab, #2f9d6b 60%, #fff)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      color: '#fff',
                    },
                  },
                  /*#__PURE__*/ React.createElement(
                    'span',
                    {
                      className: 'ms fill',
                      style: {
                        fontSize: 16,
                      },
                    },
                    'check',
                  ),
                )
              : null,
            overlay: /*#__PURE__*/ React.createElement(HoverActions, {
              visible: hover,
              onPlay: () => (onPlay || onOpen)(book),
              onAdd: onAdd ? () => onAdd(book) : undefined,
              onMore: () => onOpen && onOpen(book),
            }),
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                padding: card ? '12px 14px 15px' : '12px 2px 0',
              },
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--card-foreground)',
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                },
              },
              book.title,
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12.5,
                  color: 'var(--muted-foreground)',
                  marginTop: 3,
                },
              },
              book.author,
            ),
            book.progress > 0 &&
              !book.finished &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    height: 3,
                    background: 'var(--elevated)',
                    borderRadius: 2,
                    marginTop: 9,
                    overflow: 'hidden',
                  },
                },
                /*#__PURE__*/ React.createElement('div', {
                  style: {
                    height: '100%',
                    width: book.progress * 100 + '%',
                    background: 'var(--primary)',
                    borderRadius: 2,
                  },
                }),
              ),
          ),
        )
      }
      Object.assign(__ds_scope, { HoverActions, BookTile })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/media/BookTile.jsx',
      error: String((e && e.message) || e),
    })
  }

  // components/media/PlayBar.jsx
  try {
    ;(() => {
      function fmt(mins) {
        const h = Math.floor(mins / 60)
        const m = Math.floor(mins % 60)
        const s = Math.floor((mins * 60) % 60)
        if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
        return m + ':' + String(s).padStart(2, '0')
      }

      /**
       * Persistent bottom play bar. Cover + meta on the left, transport in the
       * middle, secondary controls on the right. Scrubber + speed use the accent.
       */
      function PlayBar({ book, playing = false, speed = 1.4, onToggle, onOpen, style = {} }) {
        if (!book) return null
        const total = (book.hours || 12) * 60
        const elapsed = total * (book.progress || 0)
        const pct = (book.progress || 0) * 100
        const Skip = ({ icon, label }) =>
          /*#__PURE__*/ React.createElement(
            'button',
            {
              onClick: (e) => e.stopPropagation(),
              style: {
                background: 'none',
                border: 'none',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                padding: 6,
              },
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'ms',
                style: {
                  fontSize: 26,
                },
              },
              icon,
            ),
            label &&
              /*#__PURE__*/ React.createElement(
                'small',
                {
                  style: {
                    position: 'absolute',
                    bottom: 1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 8,
                    fontWeight: 700,
                  },
                },
                label,
              ),
          )
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: '320px 1fr 320px',
              alignItems: 'center',
              gap: 20,
              height: 84,
              padding: '0 24px',
              background: 'color-mix(in oklab, var(--popover) 86%, transparent)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              ...style,
            },
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              onClick: () => onOpen && onOpen(book),
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                minWidth: 0,
                cursor: 'pointer',
              },
            },
            /*#__PURE__*/ React.createElement(__ds_scope.Cover, {
              book: book,
              fs: 5,
              radius: '8px',
              style: {
                width: 56,
                height: 56,
                flex: 'none',
              },
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  minWidth: 0,
                },
              },
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                },
                book.title,
              ),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    fontSize: 12,
                    color: 'var(--muted-foreground)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                },
                book.author,
              ),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              },
            },
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                },
              },
              /*#__PURE__*/ React.createElement(Skip, {
                icon: 'skip_previous',
              }),
              /*#__PURE__*/ React.createElement(Skip, {
                icon: 'replay_30',
                label: '30',
              }),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  onClick: onToggle,
                  style: {
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    border: 'none',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'ms fill',
                    style: {
                      fontSize: 26,
                    },
                  },
                  playing ? 'pause' : 'play_arrow',
                ),
              ),
              /*#__PURE__*/ React.createElement(Skip, {
                icon: 'forward_30',
                label: '30',
              }),
              /*#__PURE__*/ React.createElement(Skip, {
                icon: 'skip_next',
              }),
            ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  maxWidth: 520,
                  fontSize: 11.5,
                  color: 'var(--muted-foreground)',
                  fontVariantNumeric: 'tabular-nums',
                },
              },
              /*#__PURE__*/ React.createElement('span', null, fmt(elapsed)),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    flex: 1,
                    height: 6,
                    background: 'var(--elevated)',
                    borderRadius: 999,
                    position: 'relative',
                  },
                },
                /*#__PURE__*/ React.createElement('div', {
                  style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: pct + '%',
                    background: 'var(--primary)',
                    borderRadius: 999,
                  },
                }),
                /*#__PURE__*/ React.createElement('div', {
                  style: {
                    position: 'absolute',
                    top: '50%',
                    left: pct + '%',
                    width: 13,
                    height: 13,
                    borderRadius: '50%',
                    background: '#fff',
                    transform: 'translate(-50%,-50%)',
                    boxShadow: '0 2px 6px rgba(0,0,0,.4)',
                  },
                }),
              ),
              /*#__PURE__*/ React.createElement('span', null, '-', fmt(total - elapsed)),
            ),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 14,
              },
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                style: {
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--primary)',
                  border: '1px solid color-mix(in oklab, var(--primary) 45%, transparent)',
                  padding: '6px 12px',
                  borderRadius: 999,
                },
              },
              speed,
              '\xD7',
            ),
            ['bedtime', 'queue_music', 'volume_up'].map((i) =>
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  key: i,
                  style: {
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'var(--fill)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  },
                },
                /*#__PURE__*/ React.createElement(
                  'span',
                  {
                    className: 'ms',
                    style: {
                      fontSize: 20,
                    },
                  },
                  i,
                ),
              ),
            ),
          ),
        )
      }
      Object.assign(__ds_scope, { PlayBar })
    })()
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/media/PlayBar.jsx',
      error: String((e && e.message) || e),
    })
  }

  __ds_ns.Badge = __ds_scope.Badge

  __ds_ns.Button = __ds_scope.Button

  __ds_ns.NavItem = __ds_scope.NavItem

  __ds_ns.ProgressBar = __ds_scope.ProgressBar

  __ds_ns.Stars = __ds_scope.Stars

  __ds_ns.HoverActions = __ds_scope.HoverActions

  __ds_ns.BookTile = __ds_scope.BookTile

  __ds_ns.Cover = __ds_scope.Cover

  __ds_ns.PlayBar = __ds_scope.PlayBar
})()
