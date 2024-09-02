import { router } from 'api-helpers'
import { auth } from 'auth-helpers/routers'
import { channels } from 'channels/routers'
import { organizations } from 'organizations/routers'

export const appRouter = router({
    auth,
    organizations,
    channels,
})

export type AppRouter = typeof appRouter
