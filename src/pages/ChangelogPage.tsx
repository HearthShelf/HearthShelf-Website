import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  ExternalLink,
  Loader2,
  Link2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  X,
  Filter,
  Search,
  Package,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChangelogEntry {
  id: string
  product: string
  version: string
  released_at: string
  changelog: string
  download_url: string | null
}

interface VersionInfo {
  version: string
  product: string
  id: string
}

interface MonthInfo {
  month: number
  count: number
  versions: VersionInfo[]
}

interface YearInfo {
  year: number
  count: number
  months: MonthInfo[]
}

interface EntriesResponse {
  entries: ChangelogEntry[]
  total: number
}

interface FiltersResponse {
  years: YearInfo[]
  total: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE_OPTIONS = [8, 16, 32, 64] as const
const DEFAULT_PAGE_SIZE = 8

const MONTH_NAMES = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** Friendly label for a product slug uploaded by CI. */
function displayProduct(name: string): string {
  if (/webapp/i.test(name)) return 'Web App'
  return name.replace(/^HearthShelf[-_]?/i, '') || 'HearthShelf'
}

/** Format version for display: "1.4.0-Beta3" -> "1.4.0 Beta 3" */
function formatVersion(version: string): string {
  return version.replace(
    /-([A-Za-z]+)(\d+)?$/,
    (_, tag, num) => ` ${tag}${num ? ' ' + num : ''}`,
  )
}

function isBeta(version: string): boolean {
  return /-(?:Beta|Alpha|RC)\d*$/i.test(version)
}

/** Classify a version string as MAJOR / MINOR / PATCH from its semver tail. */
function classifyVersion(version: string): 'major' | 'minor' | 'patch' {
  const m = version.match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!m) return 'patch'
  const [, , minor, patch] = m
  if (patch !== '0') return 'patch'
  if (minor !== '0') return 'minor'
  return 'major'
}

/** Count `- ` bullet lines in a markdown blob. */
function countChanges(markdown: string): number {
  if (!markdown) return 0
  return (markdown.match(/^- /gm) ?? []).length
}

/** Map a verb at the start of a bullet to a change kind + display color. */
function detectKind(
  text: string,
): { kind: string; color: string; rest: string } | null {
  const m = text.match(
    /^(new|added?|adds?|adding|implement(?:ed|s)?|integrate(?:d|s)?|fix(?:es|ed|ing)?|fixes?|bug|silenced?|protect(?:ed|s)?|ensure[sd]?|improved?|improves?|enhanced?|enhances?|update[sd]?|updates?|refactor(?:ed|s|ing)?|cleanup|moved?|moves?|removed?|removes?)(?::|\b)\s*(.+)$/i,
  )
  if (!m) return null
  const verb = m[1].toLowerCase()
  let kind = 'changed'
  let color = 'rgb(96,165,250)'
  if (
    /^(new|added?|adds?|adding|implement|integrate)/.test(verb) ||
    verb === 'implemented' ||
    verb === 'implements' ||
    verb === 'integrated' ||
    verb === 'integrates'
  ) {
    kind = 'added'
    color = 'rgb(74,222,128)'
  } else if (/^(fix|bug|silence|protect|ensure)/.test(verb)) {
    kind = 'fixed'
    color = 'rgb(251,191,36)'
  } else if (/^(remove|moves?|moved)/.test(verb)) {
    kind = 'removed'
    color = 'rgb(220,41,38)'
  }
  return { kind, color, rest: m[2] }
}

function renderMarkdown(text: string): string {
  const tagged = text.replace(/^- (.+)$/gm, (_, body) => {
    const k = detectKind(body)
    if (k) {
      return `<li class="changelog-item" data-kind="${k.kind}" data-color="${k.color}">${k.rest}</li>`
    }
    return `<li class="changelog-item-plain">${body}</li>`
  })
  return tagged
    .replace(/^### (.+)$/gm, '<h4 class="mt-4 mb-1 text-sm font-bold">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="mt-4 mb-1 text-base font-bold">$1</h3>')
    .replace(/^# (.+)$/gm, '<h3 class="mt-4 mb-2 text-lg font-bold">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /<li class="changelog-item" data-kind="([^"]+)" data-color="([^"]+)">(.+?)<\/li>/g,
      (_, kind, color, body) =>
        `<li class="flex items-start gap-3 text-sm leading-relaxed mb-1.5"><span class="shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md text-center" style="background:var(--muted);color:${color};min-width:62px">${kind}</span><span class="text-foreground">${body}</span></li>`,
    )
    .replace(
      /<li class="changelog-item-plain">(.+?)<\/li>/g,
      '<li class="ml-4 list-disc text-sm text-muted-foreground">$1</li>',
    )
    .replace(/^---$/gm, '<hr class="my-4 border-border/50" />')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>',
    )
    .replace(/\n{2,}/g, '<br />')
}

/** Build page number array with ellipsis gaps */
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ChangelogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [entries, setEntries] = useState<ChangelogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<FiltersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set())
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const filtersLoadedForKey = useRef<string | null>(null)
  const resolveAttempted = useRef<string | null>(null)

  const activeYear = searchParams.get('year')
    ? parseInt(searchParams.get('year')!, 10)
    : null
  const activeMonth = searchParams.get('month')
    ? parseInt(searchParams.get('month')!, 10)
    : null
  const targetVersion = searchParams.get('version')
  const targetProduct = searchParams.get('product')
  const channel =
    (searchParams.get('channel') as 'all' | 'release' | 'beta') ?? 'release'
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = PAGE_SIZE_OPTIONS.includes(
    parseInt(
      searchParams.get('pageSize') ?? '',
      10,
    ) as (typeof PAGE_SIZE_OPTIONS)[number],
  )
    ? (parseInt(
        searchParams.get('pageSize')!,
        10,
      ) as (typeof PAGE_SIZE_OPTIONS)[number])
    : DEFAULT_PAGE_SIZE

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Fetch sidebar filters whenever channel changes
  useEffect(() => {
    const filterKey = channel
    if (filtersLoadedForKey.current === filterKey) return
    filtersLoadedForKey.current = filterKey

    const params = new URLSearchParams()
    if (channel !== 'release') params.set('channel', channel)

    fetch(`/api/v1/changelogs/filters?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load filters')
        return res.json() as Promise<FiltersResponse>
      })
      .then((result) => {
        setFilters(result)
        if (result.years.length > 0) {
          setExpandedYears(new Set(result.years.slice(0, 2).map((y) => y.year)))
          const firstYear = result.years[0]
          if (firstYear?.months.length > 0) {
            setExpandedMonths(
              new Set([`${firstYear.year}-${firstYear.months[0].month}`]),
            )
          }
        }
      })
      .catch(() => {
        // Filters are supplementary, don't block the page
      })
  }, [channel])

  // Fetch entries (on any filter or page change)
  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams()
    if (activeYear) params.set('year', String(activeYear))
    if (activeMonth && activeYear) params.set('month', String(activeMonth))
    if (channel !== 'release') params.set('channel', channel)
    params.set('limit', String(pageSize))
    params.set('offset', String((page - 1) * pageSize))

    fetch(`/api/v1/changelogs?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load changelogs')
        return res.json() as Promise<EntriesResponse>
      })
      .then((result) => {
        setEntries(result.entries)
        setTotal(result.total)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to target version on load, resolving page if needed
  useEffect(() => {
    if (!targetVersion || entries.length === 0) return

    const entry = entries.find(
      (e) =>
        e.version === targetVersion &&
        (!targetProduct || e.product === targetProduct),
    )

    if (entry) {
      resolveAttempted.current = null
      setHighlightId(entry.id)
      setTimeout(() => {
        cardRefs.current[entry.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
      setTimeout(() => setHighlightId(null), 2500)
      return
    }

    if (!targetProduct) return
    const resolveKey = `${targetProduct}:${targetVersion}`
    if (resolveAttempted.current === resolveKey) return
    resolveAttempted.current = resolveKey

    const params = new URLSearchParams()
    params.set('product', targetProduct)
    params.set('version', targetVersion)
    params.set('pageSize', String(pageSize))
    if (channel !== 'all')
      params.set('channel', channel === 'release' ? 'release' : 'beta')

    fetch(`/api/v1/changelogs/resolve?${params.toString()}`)
      .then((res) => {
        if (!res.ok) return null
        return res.json() as Promise<{ entry: ChangelogEntry; page: number }>
      })
      .then((result) => {
        if (!result) return
        const next = new URLSearchParams(searchParams)
        next.delete('year')
        next.delete('month')
        if (result.page > 1) next.set('page', String(result.page))
        else next.delete('page')
        setSearchParams(next, { replace: true })
      })
      .catch(() => {
        // Silently fail - entry may not exist
      })
  }, [
    targetVersion,
    targetProduct,
    entries,
    channel,
    pageSize,
    searchParams,
    setSearchParams,
  ])

  // Show scroll-to-top button when scrolled past 400px
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const updateParams = useCallback(
    (updates: Record<string, string | null>, resetPage = true) => {
      const next = new URLSearchParams(searchParams)
      for (const [key, val] of Object.entries(updates)) {
        if (val === null) next.delete(key)
        else next.set(key, val)
      }
      if (resetPage) next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const setDateFilter = useCallback(
    (year: number | null, month: number | null) => {
      updateParams({
        year: year ? String(year) : null,
        month: month ? String(month) : null,
        version: null,
      })
    },
    [updateParams],
  )

  const scrollToVersion = useCallback(
    (entry: VersionInfo) => {
      resolveAttempted.current = null
      updateParams({
        version: entry.version,
        product: entry.product,
        year: null,
        month: null,
      })
    },
    [updateParams],
  )

  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const copyLink = useCallback((entry: ChangelogEntry) => {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('product', entry.product)
    url.searchParams.set('version', entry.version)
    navigator.clipboard.writeText(url.toString())
    setCopiedId(entry.id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) next.delete(year)
      else next.add(year)
      return next
    })
  }

  const toggleMonth = (key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const setChannel = useCallback(
    (ch: 'all' | 'release' | 'beta') => {
      filtersLoadedForKey.current = null
      updateParams({ channel: ch === 'release' ? null : ch, version: null })
    },
    [updateParams],
  )

  const goToPage = useCallback(
    (p: number) => {
      const clamped = Math.max(1, Math.min(p, totalPages))
      updateParams({ page: clamped === 1 ? null : String(clamped) }, false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [totalPages, updateParams],
  )

  const setPageSizeParam = useCallback(
    (size: number) => {
      updateParams({
        pageSize: size === DEFAULT_PAGE_SIZE ? null : String(size),
      })
    },
    [updateParams],
  )

  const setQuery = useCallback(
    (q: string) => {
      updateParams({ q: q.length > 0 ? q : null })
    },
    [updateParams],
  )

  const visibleEntries = query
    ? entries.filter((e) => {
        const q = query.toLowerCase()
        return (
          e.product.toLowerCase().includes(q) ||
          e.version.toLowerCase().includes(q) ||
          (e.changelog ?? '').toLowerCase().includes(q)
        )
      })
    : entries

  const hasFilters =
    activeYear !== null || channel !== 'release' || query.length > 0

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (loading && entries.length === 0 && !filters) {
    return (
      <div className="mt-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center text-muted-foreground">
        <p className="text-sm">Could not load the changelog.</p>
        <p className="mt-1 text-xs">{error}</p>
      </div>
    )
  }

  const sidebarYears = filters?.years ?? []

  const totalActiveCount =
    (channel !== 'release' ? 1 : 0) +
    (activeYear !== null ? (activeMonth !== null ? 2 : 1) : 0) +
    (query.length > 0 ? 1 : 0)

  const sidebarContent = (
    <div className="overflow-hidden rounded-[15px] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold">Filters</span>
          {totalActiveCount > 0 && (
            <span className="min-w-[18px] rounded-full bg-primary px-1.5 py-px text-center text-[10px] font-bold text-primary-foreground">
              {totalActiveCount}
            </span>
          )}
        </div>
        {totalActiveCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="cursor-pointer bg-transparent text-[11px] text-muted-foreground underline underline-offset-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Channel Filter */}
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Channel
          </span>
          {channel !== 'release' && (
            <span className="min-w-[18px] rounded-full bg-primary px-1.5 py-px text-center text-[10px] font-bold text-primary-foreground">
              1
            </span>
          )}
        </div>
        <div className="flex gap-1 rounded-lg border border-black/20 bg-background/50 p-1">
          {(['release', 'beta', 'all'] as const).map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={cn(
                'flex-1 cursor-pointer rounded-md bg-transparent px-2 py-1 text-xs font-medium capitalize transition-colors',
                channel === ch
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {ch === 'release' ? 'Releases' : ch === 'beta' ? 'Beta' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Date Tree */}
      <div className="px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Time range
          </span>
          {activeYear !== null && (
            <span className="min-w-[18px] rounded-full bg-primary px-1.5 py-px text-center text-[10px] font-bold text-primary-foreground">
              {activeMonth !== null ? 2 : 1}
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          {sidebarYears.map((yearInfo) => {
            const yearExpanded = expandedYears.has(yearInfo.year)
            const yearActive =
              activeYear === yearInfo.year && activeMonth === null

            return (
              <div key={yearInfo.year}>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleYear(yearInfo.year)}
                    className="mr-1 cursor-pointer bg-transparent p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    {yearExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setDateFilter(yearActive ? null : yearInfo.year, null)
                    }
                    className={cn(
                      'flex-1 cursor-pointer rounded bg-transparent px-1.5 py-1 text-left text-sm transition-colors',
                      yearActive
                        ? 'font-medium text-primary'
                        : 'text-foreground hover:text-primary',
                    )}
                  >
                    {yearInfo.year}{' '}
                    <span className="text-xs text-muted-foreground">
                      ({yearInfo.count})
                    </span>
                  </button>
                </div>

                {yearExpanded && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-dashed border-border pl-3">
                    {yearInfo.months.map((monthInfo) => {
                      const monthKey = `${yearInfo.year}-${monthInfo.month}`
                      const monthExpanded = expandedMonths.has(monthKey)
                      const monthActive =
                        activeYear === yearInfo.year &&
                        activeMonth === monthInfo.month

                      return (
                        <div key={monthKey}>
                          <div className="flex items-center">
                            <button
                              onClick={() => toggleMonth(monthKey)}
                              className="mr-1 cursor-pointer bg-transparent p-0.5 text-muted-foreground hover:text-foreground"
                            >
                              {monthExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setDateFilter(
                                  monthActive ? null : yearInfo.year,
                                  monthActive ? null : monthInfo.month,
                                )
                              }
                              className={cn(
                                'flex-1 cursor-pointer rounded bg-transparent px-1.5 py-0.5 text-left text-sm transition-colors',
                                monthActive
                                  ? 'font-medium text-primary'
                                  : 'text-foreground hover:text-primary',
                              )}
                            >
                              {MONTH_NAMES[monthInfo.month]}{' '}
                              <span className="text-xs text-muted-foreground">
                                ({monthInfo.count})
                              </span>
                            </button>
                          </div>

                          {monthExpanded && (
                            <div className="ml-5 space-y-0.5 border-l border-border/50 pl-2">
                              {monthInfo.versions.map((v) => (
                                <button
                                  key={v.id}
                                  onClick={() => {
                                    scrollToVersion(v)
                                    setMobileSidebarOpen(false)
                                  }}
                                  className="flex w-full cursor-pointer items-center gap-1 bg-transparent px-1 py-0.5 text-left text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                  <span>{formatVersion(v.version)}</span>
                                  {channel === 'all' &&
                                    (isBeta(v.version) ? (
                                      <span className="ml-auto rounded bg-red-500/15 px-1 py-px text-[9px] font-semibold uppercase leading-none text-red-500">
                                        Beta
                                      </span>
                                    ) : (
                                      <span className="ml-auto rounded bg-blue-500/15 px-1 py-px text-[9px] font-semibold uppercase leading-none text-blue-500">
                                        Release
                                      </span>
                                    ))}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, total)

  const paginationControls = total > pageSize && (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 backdrop-blur-sm sm:flex-row sm:justify-between"
    >
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          Showing{' '}
          <span className="font-mono tabular-nums text-foreground">
            {firstItem}
          </span>
          –
          <span className="font-mono tabular-nums text-foreground">
            {lastItem}
          </span>
          {' of '}
          <span className="font-mono tabular-nums text-foreground">{total}</span>{' '}
          {total === 1 ? 'release' : 'releases'}
        </span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          <span>·</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSizeParam(parseInt(e.target.value, 10))}
            className="rounded border border-border bg-card px-2 py-1 text-xs text-foreground"
            aria-label="Entries per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded border bg-transparent text-sm transition-colors',
            page <= 1
              ? 'cursor-not-allowed border-border/50 text-muted-foreground/40'
              : 'cursor-pointer border-border text-foreground hover:bg-muted',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-xs text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'flex h-8 min-w-8 items-center justify-center rounded border bg-transparent px-2 text-xs transition-colors',
                p === page
                  ? 'border-primary bg-primary/15 font-bold text-primary'
                  : 'cursor-pointer border-border text-foreground hover:bg-muted',
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded border bg-transparent text-sm transition-colors',
            page >= totalPages
              ? 'cursor-not-allowed border-border/50 text-muted-foreground/40'
              : 'cursor-pointer border-border text-foreground hover:bg-muted',
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">
          Changelog
        </h1>
      </div>

      {/* Mobile filter toggle */}
      <div className="mb-4 md:hidden">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border bg-transparent px-4 py-2.5 text-sm transition-colors',
            mobileSidebarOpen
              ? 'border-primary text-primary'
              : 'border-border text-foreground hover:border-primary/50',
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasFilters && (
            <Badge variant="default" className="ml-1 h-5 px-1.5 text-[10px]">
              {totalActiveCount}
            </Badge>
          )}
        </button>
        {mobileSidebarOpen && <div className="mt-2">{sidebarContent}</div>}
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            {sidebarContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Search */}
          <div className="relative mb-4 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search release notes…"
              className="w-full rounded-[11px] border border-border bg-input py-2.5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Filter chips + result count */}
          {(hasFilters || total > 0) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {channel !== 'release' && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1 pl-2.5 pr-1.5"
                  onClick={() => setChannel('release')}
                >
                  {channel === 'beta' ? 'Beta only' : 'All channels'}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {activeYear && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1 pl-2.5 pr-1.5"
                  onClick={() => setDateFilter(null, null)}
                >
                  {activeMonth
                    ? `${MONTH_NAMES[activeMonth]} ${activeYear}`
                    : activeYear}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {query && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1 pl-2.5 pr-1.5"
                  onClick={() => setQuery('')}
                >
                  &quot;{query}&quot;
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {hasFilters && (
                <button
                  onClick={clearAllFilters}
                  className="cursor-pointer bg-transparent text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Clear all
                </button>
              )}
              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                <span className="text-foreground">{visibleEntries.length}</span>{' '}
                of <span className="text-foreground">{total}</span>{' '}
                {total === 1 ? 'release' : 'releases'}
              </span>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="mb-4 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {/* Empty state */}
          {!loading && visibleEntries.length === 0 && (
            <div className="rounded-[15px] border border-dashed border-border bg-card py-20 text-center">
              <Search className="mx-auto h-7 w-7 text-muted-foreground" />
              <div className="mt-3 text-sm font-semibold">
                No releases match these filters.
              </div>
              {hasFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  Reset filters
                </button>
              )}
            </div>
          )}

          {/* Changelog cards */}
          <div className="space-y-5">
            {visibleEntries.map((entry, idx) => {
              const beta = isBeta(entry.version)
              const releaseKind = classifyVersion(entry.version)
              const releaseTypeLabel = beta ? 'BETA' : releaseKind.toUpperCase()
              const releaseTypeColor = beta
                ? 'rgb(220,41,38)'
                : releaseKind === 'major'
                  ? 'rgb(220,41,38)'
                  : releaseKind === 'minor'
                    ? 'rgb(96,165,250)'
                    : 'rgb(251,191,36)'
              const changeCount = countChanges(entry.changelog)
              const isLatest = idx === 0 && page === 1

              return (
                <Card
                  key={entry.id}
                  id={`changelog-${entry.id}`}
                  ref={(el) => {
                    cardRefs.current[entry.id] = el
                  }}
                  className={cn(
                    'overflow-hidden p-6 transition-shadow',
                    highlightId === entry.id && 'changelog-highlight',
                  )}
                >
                  {/* Card header */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                        style={{
                          background: 'var(--primary)22',
                          border: '1px solid var(--primary)44',
                        }}
                      >
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {displayProduct(entry.product)}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ·
                          </span>
                          <span className="font-brand text-lg font-bold tabular-nums">
                            {formatVersion(entry.version)}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{formatDate(entry.released_at)}</span>
                          <span>·</span>
                          <span
                            className="font-bold uppercase tracking-widest"
                            style={{ color: releaseTypeColor }}
                          >
                            {releaseTypeLabel}
                          </span>
                          {changeCount > 0 && (
                            <>
                              <span>·</span>
                              <span>
                                {changeCount}{' '}
                                {changeCount === 1 ? 'change' : 'changes'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLatest && (
                        <Badge
                          variant="default"
                          className="text-[10px] tracking-widest"
                        >
                          LATEST
                        </Badge>
                      )}
                      <button
                        onClick={() => copyLink(entry)}
                        className="cursor-pointer bg-transparent p-1 text-muted-foreground transition-colors hover:text-primary"
                        title={copiedId === entry.id ? 'Copied!' : 'Copy link'}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  {entry.changelog && (
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          renderMarkdown(entry.changelog),
                          { ADD_ATTR: ['target', 'rel'] },
                        ),
                      }}
                    />
                  )}

                  {/* Card footer - download link */}
                  {entry.download_url && (
                    <div className="mt-4 flex items-center gap-4 border-t border-border/50 pt-3">
                      <a
                        href={entry.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Download
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {paginationControls}
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-6 right-6 z-50 cursor-pointer rounded-full border border-border bg-card p-2.5 shadow-md transition-all hover:bg-primary hover:text-primary-foreground',
          showScrollTop ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ChangelogPage
