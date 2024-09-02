import { OAuth2RequestError } from 'arctic'
import { type DBTX, schema } from 'database'
import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { GitHubUser, GoogleUser, MicrosoftUser } from '../models'

export function setTempCookie(c: Context, key: string, value: string, maxAge?: number) {
    setCookie(c, key, value, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: maxAge ?? 60 * 10,
        sameSite: 'lax',
    })
}

export function resetRedirectPathCookie(c: Context) {
    deleteCookie(c, 'redirect_path')
}

export function setRedirectPathCookie(c: Context, path?: string | null) {
    if (!path) {
        return resetRedirectPathCookie(c)
    }

    setTempCookie(c, 'redirect_path', path)
}

export function getLocaleHeader(c: Context) {
    return /([a-z]){2}/.exec(c.header('accept-language') ?? '')?.[0] ?? 'en'
}

export function setAuthLocaleCookie(c: Context, locale?: string) {
    setTempCookie(c, 'login_locale', locale || getLocaleHeader(c))
}

export function consumeAuthLocaleCookie(c: Context) {
    const locale = getCookie(c, 'login_locale')
    deleteCookie(c, 'login_locale')
    return locale ?? 'en'
}

export function consumeRedirectPathCookie(c: Context) {
    const path = getCookie(c, 'redirect_path')
    resetRedirectPathCookie(c)
    return path
}

export function handleCallbackError(c: Context, e: unknown) {
    if (e instanceof OAuth2RequestError) {
        // invalid code
        return c.json({ error: 'Invalid code', message: e.message }, 400)
    }

    console.error(e)

    return c.json({ error: 'An error occurred' }, 500)
}

export async function upsertGithubUser(db: DBTX, githubUser: GitHubUser, locale: string) {
    const [user] = await db
        .insert(schema.users)
        .values({
            githubUsername: githubUser.login,
            name: githubUser.login,
            locale,
            email: githubUser.email,
            picture: githubUser.avatar_url,
            githubId: githubUser.id,
        })
        .onConflictDoUpdate({
            target: [schema.users.githubId],
            set: {
                githubUsername: githubUser.login,
                email: githubUser.email,
                picture: githubUser.avatar_url,
            },
        })
        .returning()

    if (!user) {
        throw new Error('Failed to create/update obtain user')
    }

    return user
}

export async function upsertGoogleUser(db: DBTX, googleUser: GoogleUser, locale: string) {
    const [user] = await db
        .insert(schema.users)
        .values({
            locale,
            name: googleUser.name,
            googleId: googleUser.sub,
            picture: googleUser.picture,
            email: googleUser.email,
            emailVerifiedAt: googleUser.email_verified ? new Date() : null,
        })
        .onConflictDoUpdate({
            target: [schema.users.googleId],
            set: {
                picture: googleUser.picture,
            },
        })
        .returning()

    if (!user) {
        throw new Error('Failed to create/update obtain user')
    }

    return user
}

export async function upsertMicrosoftUser(db: DBTX, microsoftUser: MicrosoftUser, locale: string) {
    const [user] = await db
        .insert(schema.users)
        .values({
            locale,
            name: microsoftUser.name,
            googleId: microsoftUser.sub,
            picture: microsoftUser.picture,
            email: microsoftUser.email,
            emailVerifiedAt: new Date(),
        })
        .onConflictDoUpdate({
            target: [schema.users.googleId],
            set: {
                picture: microsoftUser.picture,
            },
        })
        .returning()

    if (!user) {
        throw new Error('Failed to create/update obtain user')
    }

    return user
}
