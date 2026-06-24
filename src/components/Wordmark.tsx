import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * The HearthShelf wordmark: Libre Baskerville, "Hearth" in gold + "Shelf" in
 * cream. Mirrors HS-WebApp's Wordmark so the auth pages read identically.
 */
export function Wordmark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span className={cn('hs-wordmark-brand select-none', className)} style={style}>
      <span className="hs-wm-lt">Hearth</span>
      <span className="hs-wm-bd">Shelf</span>
    </span>
  )
}
