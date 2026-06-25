import type { ReactNode } from 'react'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import './home.css'

const accent = '#e0654a'

/**
 * Wraps a page in the site chrome (header + footer) and the .hs-home shell so it
 * inherits the landing's design tokens and theme. Used by routes other than the
 * home page, which renders its own shell inline.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="hs-home dark"
      style={{ '--primary': accent, '--ring': accent, '--glow-accent': accent } as React.CSSProperties}
    >
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}

export default SiteLayout
