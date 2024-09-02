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
