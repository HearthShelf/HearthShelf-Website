import { Hono } from 'hono'
import type { AppEnv } from '../_shared/types'

// Public community stats for the /stats page. This proxies the control plane's
// aggregate-only rollup (api.hearthshelf.com/stats/public) so the marketing site
// reads it same-origin and we can cache it at the edge. The upstream is already
// aggregate-only - no single install's data is ever exposed.
const app = new Hono<AppEnv>()

const CP_STATS_URL = 'https://api.hearthshelf.com/stats/public'

app.get('/', async (c) => {
  try {
    const res = await fetch(CP_STATS_URL, {
      // Cache the aggregate at the edge for an hour; it changes slowly and this
      // shields the control plane from marketing-page traffic spikes.
      cf: { cacheTtl: 3600, cacheEverything: true },
    })
    if (!res.ok) return c.json({ error: 'stats_unavailable' }, 502)
    const data = await res.json()
    c.header('Cache-Control', 'public, max-age=3600')
    return c.json(data)
  } catch {
    return c.json({ error: 'stats_unavailable' }, 502)
  }
})

export default app
