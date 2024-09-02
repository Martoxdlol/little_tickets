import type { Config } from 'drizzle-kit'
import { env } from 'env-helpers'

export default {
    schema: './src/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    tablesFilter: ['lt_*'],
} satisfies Config
