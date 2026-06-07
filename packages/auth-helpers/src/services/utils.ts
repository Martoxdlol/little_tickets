import { OAuth2RequestError } from 'arctic'
import { type DBTX, eq, schema } from 'database'
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

/** Thrown when a provider does not give us a verified email address we can sign the user in with. */
export class VerifiedEmailRequiredError extends Error {
    constructor() {
        super('A verified email address is required to sign in')
        this.name = 'VerifiedEmailRequiredError'
    }
}

export function handleCallbackError(c: Context, e: unknown) {
    if (e instanceof OAuth2RequestError) {
        // invalid code
        return c.json({ error: 'Invalid code', message: e.message }, 400)
    }

    if (e instanceof VerifiedEmailRequiredError) {
        return c.json({ error: 'Email required', message: e.message }, 400)
    }

    console.error(e)

    return c.json({ error: 'An error occurred' }, 500)
}

/**
 * A provider identity. `providerId` is the immutable per-provider id (GitHub numeric id, or the
 * OIDC `sub` for Google/Microsoft) — never the email, which can be shared across providers.
 */
type OAuthIdentity =
    | { provider: 'github'; providerId: number; githubUsername: string }
    | { provider: 'google'; providerId: string }
    | { provider: 'microsoft'; providerId: string }

/**
 * Resolve an OAuth login to a single user row, in priority order:
 *   1. an account already linked to this exact provider identity, or
 *   2. an account with the same (verified) email — link this provider onto it, or
 *   3. a brand-new account.
 *
 * Step 2 is what prevents duplicate accounts when a provider id changes or was stored
 * incorrectly: the verified email keeps everyone on one account instead of forking a new one.
 * The whole resolution runs in a transaction so concurrent logins can't race a duplicate in.
 */
async function linkOrCreateUser(
    db: DBTX,
    identity: OAuthIdentity,
    profile: { email: string; name: string; picture: string | null; locale: string },
) {
    const emailVerifiedAt = new Date()

    const providerWhere =
        identity.provider === 'github'
            ? eq(schema.users.githubId, identity.providerId)
            : identity.provider === 'google'
              ? eq(schema.users.googleId, identity.providerId)
              : eq(schema.users.microsoftId, identity.providerId)

    // Columns written on every login — including the provider id, so step 2 also links it.
    const providerData =
        identity.provider === 'github'
            ? { githubId: identity.providerId, githubUsername: identity.githubUsername }
            : identity.provider === 'google'
              ? { googleId: identity.providerId }
              : { microsoftId: identity.providerId }

    return db.transaction(async (tx) => {
        const [byProvider] = await tx.select({ id: schema.users.id }).from(schema.users).where(providerWhere).limit(1)
        const [byEmail] = byProvider
            ? [byProvider]
            : await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, profile.email)).limit(1)

        const existing = byProvider ?? byEmail

        if (existing) {
            const [updated] = await tx
                .update(schema.users)
                .set({ email: profile.email, emailVerifiedAt, picture: profile.picture, ...providerData })
                .where(eq(schema.users.id, existing.id))
                .returning()

            if (!updated) {
                throw new Error('Failed to update user')
            }

            return updated
        }

        const [created] = await tx
            .insert(schema.users)
            .values({
                name: profile.name,
                locale: profile.locale,
                email: profile.email,
                emailVerifiedAt,
                picture: profile.picture,
                ...providerData,
            })
            .returning()

        if (!created) {
            throw new Error('Failed to create user')
        }

        return created
    })
}

export async function upsertGithubUser(db: DBTX, githubUser: GitHubUser, locale: string) {
    // The callback only resolves verified GitHub emails, so a value here is already verified.
    // Invitations are matched on a lowercased email, so normalize before storing.
    const email = githubUser.email?.toLowerCase()
    if (!email) {
        throw new VerifiedEmailRequiredError()
    }

    return linkOrCreateUser(
        db,
        { provider: 'github', providerId: githubUser.id, githubUsername: githubUser.login },
        { email, name: githubUser.login, picture: githubUser.avatar_url, locale },
    )
}

export async function upsertGoogleUser(db: DBTX, googleUser: GoogleUser, locale: string) {
    const email = googleUser.email?.toLowerCase()
    if (!email || !googleUser.email_verified) {
        throw new VerifiedEmailRequiredError()
    }

    return linkOrCreateUser(
        db,
        { provider: 'google', providerId: googleUser.sub },
        { email, name: googleUser.name, picture: googleUser.picture, locale },
    )
}

export async function upsertMicrosoftUser(db: DBTX, microsoftUser: MicrosoftUser, locale: string) {
    // Microsoft Entra only returns organization-managed addresses, which are verified by the tenant.
    const email = microsoftUser.email?.toLowerCase()
    if (!email) {
        throw new VerifiedEmailRequiredError()
    }

    return linkOrCreateUser(
        db,
        { provider: 'microsoft', providerId: microsoftUser.sub },
        { email, name: microsoftUser.name, picture: microsoftUser.picture ?? null, locale },
    )
}
