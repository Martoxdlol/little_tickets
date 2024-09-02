import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

        BASE_URL: z.string().url(),

        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),

        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),

        MICROSOFT_TENANT_ID: z.string(),
        MICROSOFT_CLIENT_ID: z.string(),
        MICROSOFT_CLIENT_SECRET: z.string(),

        DATABASE_TABLES_PREFIX: z.string().default('app'),
    },
    runtimeEnv: {
        BASE_URL: process.env.BASE_URL ?? 'http://localhost:5173',
        ...process.env,
    },
    emptyStringAsUndefined: true,
})
