import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'
import type { AppEnv } from './_shared/types'
import changelogs from './_routes/changelogs'
import stats from './_routes/stats'

const app = new Hono<AppEnv>().basePath('/api')
const v1 = new Hono<AppEnv>()

v1.use('*', cors())

v1.route('/changelogs', changelogs)
v1.route('/stats', stats)

app.route('/v1', v1)

app.all('*', (c) => c.json({ error: 'API moved to /api/v1', hint: 'Use the /api/v1/ prefix' }, 404))

export const onRequest = handle(app)
