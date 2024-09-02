import { GitHub, Google, MicrosoftEntraId } from 'arctic'
import { db } from 'database'
import { env } from 'env-helpers'
import { Lucia, TimeSpan } from 'lucia'
import { LuciaAuthAdapter } from './adapter'

const adapter = new LuciaAuthAdapter(db)

export const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(52, 'w'),
    sessionCookie: {
        expires: true,
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },
    getUserAttributes: (attributes) => {
        return {
            githubId: attributes.githubId,
            googleId: attributes.googleId,
            microsoftId: attributes.microsoftId,
            name: attributes.name,
            locale: attributes.locale,
            onboardingCompleted: attributes.onboardingCompleted,
            picture: attributes.picture,
            email: attributes.email,
            emailVerified: attributes.emailVerified,
        }
    },
})

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}

interface DatabaseUserAttributes {
    githubId: number | null
    googleId: string | null
    microsoftId: string | null
    name: string
    locale: string
    picture: string | null
    onboardingCompleted: boolean
    email: string | null
    emailVerified: boolean
}

export const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
    redirectURI: new URL('/api/auth/login/github/callback', env.BASE_URL).href,
})

export const google = new Google(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    new URL('/api/auth/login/google/callback', env.BASE_URL).href,
)

export const microsoft = new MicrosoftEntraId(
    env.MICROSOFT_TENANT_ID,
    env.MICROSOFT_CLIENT_ID,
    env.MICROSOFT_CLIENT_SECRET,
    new URL('/api/auth/login/microsoft/callback', env.BASE_URL).href,
)
