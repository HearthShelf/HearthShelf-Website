import { Link, useLocation } from 'react-router-dom'
import { DOCS_URL, GITHUB_URL, DISCORD_URL } from '@/lib/utils'

/**
 * Shared site footer. Like the header, in-page anchors get a leading "/" when
 * rendered off the home page so they route home first, then scroll.
 */
export function SiteFooter() {
  const onHome = useLocation().pathname === '/'
  const anchor = (id: string) => (onHome ? `#${id}` : `/#${id}`)

  return (
    <footer className="hs-footer">
      <div className="hs-footer-inner">
        <div className="hs-footer-grid">
          <div className="hs-footer-brand">
            <a href={onHome ? '#top' : '/'} className="hs-nav-logo">
              <img className="hs-logo-icon" src="/flame.png" alt="" />
              <span className="hs-wordmark">
                <span className="hs-hearth">Hearth</span>
                <span className="hs-shelf">Shelf</span>
              </span>
            </a>
            <p className="hs-footer-tagline">
              A calmer, self-hosted web client for your audiobook and ebook library.
            </p>
            <div className="hs-footer-quote">"the only light the glow of the story itself."</div>
          </div>
          <div className="hs-footer-col">
            <div className="hs-footer-col-head">Product</div>
            <a className="navlink" href={anchor('features')}>
              Features
            </a>
            <a className="navlink" href={anchor('compare')}>
              Compare
            </a>
            <a className="navlink" href={anchor('gallery')}>
              Screenshots
            </a>
            <a className="navlink" href={anchor('quickstart')}>
              Self-host
            </a>
          </div>
          <div className="hs-footer-col">
            <div className="hs-footer-col-head">Resources</div>
            <a className="navlink" href={`${DOCS_URL}/guide/what-is-hearthshelf`}>
              Documentation
            </a>
            <a className="navlink" href={`${DOCS_URL}/setup/docker`}>
              Installation
            </a>
            <a className="navlink" href={GITHUB_URL} target="_blank">
              GitHub
            </a>
            <Link className="navlink" to="/changelog">
              Changelog
            </Link>
          </div>
          <div className="hs-footer-col">
            <div className="hs-footer-col-head">Community</div>
            <a className="navlink" href={DISCORD_URL} target="_blank">
              Discord
            </a>
          </div>
        </div>
        <div className="hs-footer-bottom">
          <span>© 2026 HearthShelf · AGPL v3 · Not affiliated with Audiobookshelf</span>
          <span className="hs-footer-ver">v0.9.2</span>
        </div>
        <div className="hs-footer-legal">
          HearthShelf is a user interface. It does not host, source, or distribute content. You are
          responsible for the legality of the content you add and the backends you connect.
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
