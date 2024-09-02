import { generateCodeVerifier, generateState } from 'arctic'
import { db } from 'database'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { GoogleUser, MicrosoftUser } from '../models'
import { github, google, lucia, microsoft } from '../services/lucia'
import {
    consumeAuthLocaleCookie,
    consumeRedirectPathCookie,
    handleCallbackError,
    setAuthLocaleCookie,
    setRedirectPathCookie,
    setTempCookie,
    upsertGithubUser,
    upsertGoogleUser,
    upsertMicrosoftUser,
} from '../services/utils'

export const auth = new Hono()

    .get('/login/google', async (c) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()

        const url = await google.createAuthorizationURL(state, codeVerifier, {
            scopes: ['profile', 'email'],
        })

        setTempCookie(c, 'google_oauth_state', state)
        setTempCookie(c, 'google_oauth_code_verifier', codeVerifier)

        setRedirectPathCookie(c, c.req.query('redirect_path'))
        setAuthLocaleCookie(c)

        return c.redirect(url.href)
    })

    .get('/login/github', async (c) => {
        const state = generateState()
        const url = await github.createAuthorizationURL(state)

        setTempCookie(c, 'github_oauth_state', state)

        setRedirectPathCookie(c, c.req.query('redirect_path'))
        setAuthLocaleCookie(c)

        return c.redirect(url.href)
    })

    .get('/login/microsoft', async (c) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()

        const url = await microsoft.createAuthorizationURL(state, codeVerifier, {
            scopes: ['profile', 'email'],
        })

        setTempCookie(c, 'microsoft_oauth_state', state)
        setTempCookie(c, 'microsoft_oauth_code_verifier', codeVerifier)

        setRedirectPathCookie(c, c.req.query('redirect_path'))
        setAuthLocaleCookie(c)

        return c.redirect(url.href)
    })

    .get('/login/github/callback', async (c) => {
        const code = c.req.query('code')
        const state = c.req.query('state')
        const storedState = getCookie(c, 'github_oauth_state')

        if (!code || !state || state !== storedState) {
            return c.json({ error: 'Invalid state' }, 400)
        }

        try {
            const tokens = await github.validateAuthorizationCode(code)
            const githubUserResponse = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            })

            const user = await upsertGithubUser(db, await githubUserResponse.json(), consumeAuthLocaleCookie(c))

            const session = await lucia.createSession(user.id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            deleteCookie(c, 'github_oauth_state')

            const redirectPath = consumeRedirectPathCookie(c)

            return c.redirect(redirectPath || '/')
        } catch (error) {
            return handleCallbackError(c, error)
        }
    })

    .get('/login/google/callback', async (c) => {
        const code = c.req.query('code')
        const state = c.req.query('state')
        const storedState = getCookie(c, 'google_oauth_state')
        const storedCodeVerifier = getCookie(c, 'google_oauth_code_verifier')

        if (!code || !state || !storedCodeVerifier || state !== storedState) {
            return c.json({ error: 'Invalid state' }, 400)
        }

        try {
            const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)

            const googleUserResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            })

            const googleUser: GoogleUser = await googleUserResponse.json()

            const user = await upsertGoogleUser(db, googleUser, consumeAuthLocaleCookie(c))

            const session = await lucia.createSession(user.id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            deleteCookie(c, 'google_oauth_state')

            const redirectPath = consumeRedirectPathCookie(c)

            return c.redirect(redirectPath || '/')
        } catch (error) {
            return handleCallbackError(c, error)
        }
    })

    .get('/login/microsoft/callback', async (c) => {
        const code = c.req.query('code')
        const state = c.req.query('state')
        const storedState = getCookie(c, 'microsoft_oauth_state')
        const storedCodeVerifier = getCookie(c, 'microsoft_oauth_code_verifier')

        if (!code || !state || !storedCodeVerifier || state !== storedState) {
            return c.json({ error: 'Invalid state' }, 400)
        }

        try {
            const tokens = await microsoft.validateAuthorizationCode(code, storedCodeVerifier)

            const microsoftUserResponse = await fetch('https://graph.microsoft.com/oidc/userinfo', {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
            })

            const microsoftUser: MicrosoftUser = await microsoftUserResponse.json()

            const user = await upsertMicrosoftUser(db, microsoftUser, consumeAuthLocaleCookie(c))

            const session = await lucia.createSession(user.id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            setCookie(c, sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
            deleteCookie(c, 'microsoft_oauth_state')

            const redirectPath = consumeRedirectPathCookie(c)

            return c.redirect(redirectPath || '/')
        } catch (error) {
            return handleCallbackError(c, error)
        }
    })

    .get('/me', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName)

        if (!sessionId) {
            return c.redirect('/')
        }

        const result = await lucia.validateSession(sessionId)

        if (!result) {
            return c.redirect('/')
        }

        return c.json(result)
    })

    .get('/logout', async (c) => {
        const sessionId = getCookie(c, lucia.sessionCookieName)

        if (!sessionId) {
            return c.redirect('/')
        }

        const result = await lucia.validateSession(sessionId)

        if (!result) {
            return c.redirect('/')
        }

        await lucia.invalidateSession(sessionId)

        return c.redirect('/')
    })
