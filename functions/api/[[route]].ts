import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'
import type { AppEnv } from './_shared/types'
import changelogs from './_routes/changelogs'

const app = new Hono<AppEnv>().basePath('/api')
const v1 = new Hono<AppEnv>()

v1.use('*', cors())

v1.route('/changelogs', changelogs)

app.route('/v1', v1)

app.all('*', (c) => c.json({ error: 'API moved to /api/v1', hint: 'Use the /api/v1/ prefix' }, 404))

export const onRequest = handle(app)
