import { router } from 'api-helpers'
import { auth } from 'auth-helpers/routers'
import { organizations } from 'organizations/routers'

export const appRouter = router({
    auth,
    organizations,
})

export type AppRouter = typeof appRouter
