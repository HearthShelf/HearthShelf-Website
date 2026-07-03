import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, BookCheck, ScrollText, Sparkles, Users, Server } from 'lucide-react'

// Public community stats. Powered by anonymous, opt-in telemetry (Home Assistant
// style) aggregated by the control plane - no single server is ever identifiable.
// See functions/api/_routes/stats.ts for the edge-cached proxy.

interface PublicStats {
  active_installs: number
  version_distribution: Record<string, number>
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

interface Metric {
  icon: typeof BookCheck
  value: number
  label: string
  hint: string
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

  const metrics: Metric[] = [
    {
      icon: BookCheck,
      value: stats.totals.books_finished,
      label: 'Books finished',
      hint: 'Last pages turned across every shelf',
    },
    {
      icon: ScrollText,
      value: stats.totals.quests_given,
      label: 'Quests given',
      hint: 'Reading quests the Quest Giver has handed out',
    },
    {
      icon: Sparkles,
      value: stats.totals.quests_accepted,
      label: 'Quests accepted',
      hint: 'Quests a listener took up',
    },
    {
      icon: Users,
      value: stats.totals.club_books_finished,
      label: 'Book Club reads finished',
      hint: 'Books clubs read together, cover to cover',
    },
  ]

  const dist = Object.entries(stats.version_distribution).sort((a, b) => b[1] - a[1])
  const distTotal = dist.reduce((sum, [, n]) => sum + n, 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-3 text-center">
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
          The HearthShelf community, by the numbers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Totals from the {fmt(stats.active_installs)} active{' '}
          {stats.active_installs === 1 ? 'server' : 'servers'} that chose to share anonymous stats.
          No names, no titles, no tracking - just the good stuff, added up.
        </p>
      </div>

      <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Server className="h-3.5 w-3.5 text-primary" />
        <span>
          <span className="font-mono tabular-nums text-foreground">
            {fmt(stats.active_installs)}
          </span>{' '}
          servers sharing
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((m) => (
          <Card key={m.label} className="p-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: 'var(--primary)22', border: '1px solid var(--primary)44' }}
              >
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-brand text-2xl font-bold tabular-nums">{fmt(m.value)}</div>
                <div className="text-sm font-semibold">{m.label}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{m.hint}</p>
          </Card>
        ))}
      </div>

      {dist.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-brand text-xl font-bold">Which version are servers running?</h2>
          <Card className="p-6">
            <div className="space-y-3">
              {dist.map(([version, count]) => {
                const pct = distTotal > 0 ? Math.round((count / distTotal) * 100) : 0
                return (
                  <div key={version}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-mono tabular-nums text-foreground">v{version}</span>
                      <span className="text-xs text-muted-foreground">
                        {fmt(count)} {count === 1 ? 'server' : 'servers'} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
        These numbers come from HearthShelf servers whose admins opted in to anonymous usage stats.
        Sharing is off by default and can be turned on or off any time under Config &gt; Community.
      </p>
    </div>
  )
}

export default StatsPage
