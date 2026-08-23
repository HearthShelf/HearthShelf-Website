import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  Loader2,
  BookCheck,
  ScrollText,
  Sparkles,
  Users,
  Server,
  Smartphone,
  TrendingUp,
} from 'lucide-react'

// Public community stats. Powered by anonymous, opt-in telemetry (Home Assistant
// style) aggregated by the control plane - no single install is ever identifiable.
// Covers both self-hosted servers and the mobile app; see functions/api/_routes/stats.ts
// for the edge-cached proxy. Shape mirrors HSPublicStats in @hearthshelf/core.

interface TrendPoint {
  day: number
  count: number
}

interface PublicStats {
  active_installs: number
  installs_by_platform: Record<string, number>
  /** Servers and apps pooled. Older control planes send only this. */
  version_distribution: Record<string, number>
  /** HearthShelf versions across self-hosted servers only. */
  server_version_distribution?: Record<string, number>
  /** App versions across the mobile apps only. */
  app_version_distribution?: Record<string, number>
  device_model_distribution: Record<string, number>
  /** Servers by install shape: 'slim' vs 'aio'. Absent on an older control plane. */
  server_mode_distribution?: Record<string, number>
  installs_over_time: TrendPoint[]
  latest_version: string | null
  latest_server_version?: string | null
  totals: {
    quests_given: number
    quests_accepted: number
    books_finished: number
    club_books_finished: number
  }
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n || 0))
}

const MOBILE_PLATFORMS = new Set(['ios', 'android'])
const SERVER_PLATFORMS = new Set(['docker', 'windows-service'])

const PLATFORM_LABEL: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  docker: 'Docker server',
  'windows-service': 'Windows service',
}

// How a server was installed: bring-your-own AudiobookShelf, or the image that
// bundles one. Said in plain words - 'slim' and 'aio' mean nothing to a visitor.
const MODE_LABEL: Record<string, string> = {
  slim: 'With their own AudiobookShelf',
  aio: 'All-in-one image',
}

function sumWhere(map: Record<string, number>, keys: Set<string>): number {
  return Object.entries(map).reduce((sum, [k, n]) => (keys.has(k) ? sum + n : sum), 0)
}

/** Inline SVG area+line chart of active installs over time. No chart library -
 *  theme-aware via currentColor and CSS vars, sized to its container. */
function TrendChart({ points }: { points: TrendPoint[] }) {
  const W = 720
  const H = 200
  const PAD = { top: 12, right: 12, bottom: 22, left: 34 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom

  const { line, area, ticks, firstLabel, lastLabel } = useMemo(() => {
    const max = Math.max(1, ...points.map((p) => p.count))
    const n = points.length
    const x = (i: number) => PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
    const y = (v: number) => PAD.top + plotH - (v / max) * plotH
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.count)}`).join(' ')
    const area =
      points.length > 0
        ? `${line} L${x(n - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z`
        : ''
    // Up to 4 y-axis ticks at rounded values.
    const ticks = [0, 0.5, 1].map((f) => ({ v: Math.round(max * f), y: y(max * f) }))
    const fmtDay = (ms: number) =>
      new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return {
      line,
      area,
      ticks,
      firstLabel: n > 0 ? fmtDay(points[0].day) : '',
      lastLabel: n > 0 ? fmtDay(points[n - 1].day) : '',
    }
  }, [points])

  if (points.length === 0) return null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full text-primary"
      preserveAspectRatio="none"
      role="img"
      aria-label="Active installs over time"
    >
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={t.y}
            y2={t.y}
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 6}
            y={t.y + 3}
            textAnchor="end"
            className="fill-muted-foreground"
            style={{ fontSize: 10 }}
          >
            {fmt(t.v)}
          </text>
        </g>
      ))}
      {area && <path d={area} fill="currentColor" fillOpacity={0.12} />}
      <path d={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <text x={PAD.left} y={H - 6} className="fill-muted-foreground" style={{ fontSize: 10 }}>
        {firstLabel}
      </text>
      <text
        x={W - PAD.right}
        y={H - 6}
        textAnchor="end"
        className="fill-muted-foreground"
        style={{ fontSize: 10 }}
      >
        {lastLabel}
      </text>
    </svg>
  )
}

/**
 * Display label for a reported version.
 *
 * Canary images report "<last-tag>+canary.<short-sha>" (see the dev-release
 * workflow), which is precise but unreadable on a chart - and every canary build
 * of the same release is a separate string, so they scatter into a row each. The
 * sha is meaningless to a reader deciding whether their box is current, so the
 * label keeps the release and just says it is a canary.
 */
function versionLabel(raw: string): string {
  const canary = /^(.+?)\+canary/.exec(raw)
  if (canary) return `v${canary[1]} Canary`
  // Any other build-metadata tail (+dev.x, +local) collapses the same way rather
  // than rendering a hash nobody can act on.
  const plus = raw.indexOf('+')
  return plus === -1 ? `v${raw}` : `v${raw.slice(0, plus)} Build`
}

/**
 * Turn a raw version distribution into display rows, merging every version that
 * shares a label. Without the merge, three canary builds of 0.4.0 would render
 * as three identical "v0.4.0 Canary" bars (and React would warn on the repeated
 * key, since the label is the key).
 */
function versionRowsFor(dist: Record<string, number>): Array<[string, number]> {
  const merged = new Map<string, number>()
  for (const [raw, n] of Object.entries(dist)) {
    const label = versionLabel(raw)
    merged.set(label, (merged.get(label) ?? 0) + n)
  }
  return [...merged.entries()].sort((a, b) => b[1] - a[1])
}

/** A labelled distribution as horizontal bars (version, platform, or device). */
function DistBars({
  title,
  rows,
  unit,
}: {
  title: string
  rows: Array<[string, number]>
  unit: string
}) {
  const total = rows.reduce((sum, [, n]) => sum + n, 0)
  if (rows.length === 0) return null
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-3">
        {rows.map(([label, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-mono tabular-nums text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {fmt(count)} {count === 1 ? unit : `${unit}s`} · {pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatsPage() {
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/stats')
      .then((res) => {
        if (!res.ok) throw new Error('unavailable')
        return res.json() as Promise<PublicStats>
      })
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="mt-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="mx-auto mt-24 max-w-md px-4 text-center text-muted-foreground">
        <p className="text-sm">Community stats are taking a nap. Check back soon.</p>
      </div>
    )
  }

  const byPlatform = stats.installs_by_platform ?? {}
  const mobileInstalls = sumWhere(byPlatform, MOBILE_PLATFORMS)
  const serverInstalls = sumWhere(byPlatform, SERVER_PLATFORMS)

  const platformRows = Object.entries(byPlatform)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])

  // Versions split by what they mean: a server admin asking "is my box behind"
  // is a different question from "what app build are phones on". The control
  // plane sends both lists; fall back to the pooled one when it has not been
  // deployed yet, so the page never goes blank mid-rollout.
  const sortRows = (d: Record<string, number>) => Object.entries(d).sort((a, b) => b[1] - a[1])

  const modeRows = sortRows(stats.server_mode_distribution ?? {})
  const serverVersionRows = versionRowsFor(stats.server_version_distribution ?? {})
  const appVersionRows = versionRowsFor(stats.app_version_distribution ?? {})
  const hasSplitVersions = serverVersionRows.length > 0 || appVersionRows.length > 0
  const versionRows = versionRowsFor(stats.version_distribution ?? {})
  const deviceRows = Object.entries(stats.device_model_distribution ?? {}).sort(
    (a, b) => b[1] - a[1],
  )

  const usage = [
    { icon: BookCheck, value: stats.totals.books_finished, label: 'Books finished' },
    { icon: ScrollText, value: stats.totals.quests_given, label: 'Quests given' },
    { icon: Sparkles, value: stats.totals.quests_accepted, label: 'Quests accepted' },
    { icon: Users, value: stats.totals.club_books_finished, label: 'Book Club reads' },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
          The HearthShelf community, by the numbers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Anonymous stats from the apps and servers that chose to share. No names, no titles, no
          tracking - just the good stuff, added up.
        </p>
      </div>

      {/* Hero tiles: total installs, split, latest version */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <div className="text-xs font-medium text-muted-foreground">Active installs</div>
          <div className="mt-1 font-brand text-3xl font-bold tabular-nums">
            {fmt(stats.active_installs)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Smartphone className="h-3.5 w-3.5" /> Apps
          </div>
          <div className="mt-1 font-brand text-3xl font-bold tabular-nums">
            {fmt(mobileInstalls)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Server className="h-3.5 w-3.5" /> Servers
          </div>
          <div className="mt-1 font-brand text-3xl font-bold tabular-nums">
            {fmt(serverInstalls)}
          </div>
        </Card>
        <Card className="p-5">
          {/* The newest SERVER version - what a self-hoster checks their box
              against. Falls back to the pooled newest on an older control plane. */}
          <div className="text-xs font-medium text-muted-foreground">
            {stats.latest_server_version ? 'Latest server' : 'Latest version'}
          </div>
          <div className="mt-1 truncate font-mono text-2xl font-bold tabular-nums">
            {stats.latest_server_version
              ? `v${stats.latest_server_version}`
              : stats.latest_version
                ? `v${stats.latest_version}`
                : '-'}
          </div>
        </Card>
      </div>

      {/* Installs over time */}
      {stats.installs_over_time && stats.installs_over_time.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 font-brand text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Installs over time
          </h2>
          <Card className="p-6">
            <TrendChart points={stats.installs_over_time} />
          </Card>
        </div>
      )}

      {/* Distributions */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {platformRows.length > 0 && (
          <Card className="p-6">
            <DistBars
              title="By platform"
              unit="install"
              rows={platformRows.map(([k, n]) => [PLATFORM_LABEL[k] ?? k, n])}
            />
          </Card>
        )}
        {modeRows.length > 0 && (
          <Card className="p-6">
            <DistBars
              title="How servers are set up"
              unit="server"
              rows={modeRows.map(([k, n]) => [MODE_LABEL[k] ?? k, n])}
            />
          </Card>
        )}
        {hasSplitVersions ? (
          <>
            {serverVersionRows.length > 0 && (
              <Card className="p-6">
                <DistBars title="Server versions" unit="server" rows={serverVersionRows} />
              </Card>
            )}
            {appVersionRows.length > 0 && (
              <Card className="p-6">
                <DistBars title="App versions" unit="install" rows={appVersionRows} />
              </Card>
            )}
          </>
        ) : (
          versionRows.length > 0 && (
            <Card className="p-6">
              <DistBars title="By version" unit="install" rows={versionRows} />
            </Card>
          )
        )}
        {deviceRows.length > 0 && (
          <Card className="p-6 md:col-span-2">
            <DistBars title="By device" unit="phone" rows={deviceRows} />
          </Card>
        )}
      </div>

      {/* Lifetime usage totals (servers) */}
      <div className="mt-8">
        <h2 className="mb-4 font-brand text-xl font-bold">What the shelves have done</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {usage.map((m) => (
            <Card key={m.label} className="p-5">
              <m.icon className="h-5 w-5 text-primary" />
              <div className="mt-2 font-brand text-2xl font-bold tabular-nums">{fmt(m.value)}</div>
              <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
            </Card>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
        These numbers come from HearthShelf apps and servers that share anonymous stats. Sharing is
        on by default and can be turned off any time - in the app under Settings &gt; Community, and
        on a server under Config &gt; Community. A new server asks during setup before it sends
        anything. Simulators and development builds are not counted.
      </p>
    </div>
  )
}

export default StatsPage
