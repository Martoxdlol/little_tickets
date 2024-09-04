import { join, resolve } from 'node:path'
import { serveStatic } from '@hono/node-server/serve-static'
import { handler } from 'api/server'
import { auth } from 'auth-helpers/hono-apps'
import { lucia } from 'auth-helpers/services'
import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'

const app = new Hono()
    .use('/api/trpc/*', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName) ?? null
        return handler(c.req.raw, { sessionId })
    })

    .route('/api/auth', auth)

Bun.serve({
    fetch: app.fetch,
    port: 3000,
    hostname: '0.0.0.0',
})

console.log('Server running at http://localhost:3000', '🚀')
console.log('Environment:', process.env.NODE_ENV)

if (process.env.APP_PUBLIC_PATH || process.env.NODE_ENV === 'production') {
    const publicPath = process.env.APP_PUBLIC_PATH || './public'
    console.log('Public path:', resolve(publicPath))

    const serveStaticMiddleware = serveStatic({
        root: publicPath,
    })

    app.use('/*', serveStaticMiddleware)

    app.use('/*', async (c) => {
        const file = await Bun.file(join(publicPath, 'index.html')).text()
        return c.html(file)
    })
}
