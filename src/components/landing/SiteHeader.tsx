import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { APP_URL, DOCS_URL, GITHUB_URL, clerkEnabled } from '@/lib/utils'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

/**
 * Shared site header. The landing's section links are in-page anchors, so off
 * the home page they need a leading "/" to route home first and then scroll.
 * `logoHref` does the same for the wordmark.
 */
export function SiteHeader() {
  const onHome = useLocation().pathname === '/'
  const anchor = (id: string) => (onHome ? `#${id}` : `/#${id}`)
  const logoHref = onHome ? '#top' : '/'

  return (
    <nav className="hs-nav">
      <a href={logoHref} className="hs-nav-logo">
        <img className="hs-logo-icon" src="/flame.png" alt="" />
        <span className="hs-wordmark">
          <span className="hs-hearth">Hearth</span>
          <span className="hs-shelf">Shelf</span>
        </span>
      </a>
      <div className="hs-nav-links">
        <a className="navlink" href={anchor('features')}>Features</a>
        <a className="navlink" href={anchor('compare')}>Compare</a>
        <a className="navlink" href={anchor('gallery')}>Screenshots</a>
        <Link className="navlink" to="/changelog">Changelog</Link>
        <a className="navlink" href={DOCS_URL}>Docs</a>
      </div>
      <div className="hs-nav-right">
        <a
          className="navlink hs-github-star"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener"
          aria-label="HearthShelf on GitHub"
        >
          <GitHubIcon />
          GitHub
        </a>
        {clerkEnabled ? (
          <>
            <SignedOut>
              <Link className="navlink hs-login-link" to="/sign-in">Log in</Link>
              <Link className="hs-btn hs-btn-primary hs-btn-sm" to="/sign-up">Sign up</Link>
            </SignedOut>
            <SignedIn>
              <a className="hs-btn hs-btn-primary hs-btn-sm" href={APP_URL}>
                <span className="ms fill">rocket_launch</span>Open HearthShelf
              </a>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </>
        ) : (
          <>
            <a className="navlink hs-login-link" href={`${APP_URL}/sign-in`}>Log in</a>
            <a className="hs-btn hs-btn-primary hs-btn-sm" href={`${APP_URL}/sign-up`}>Sign up</a>
          </>
        )}
      </div>
    </nav>
  )
}

export default SiteHeader
