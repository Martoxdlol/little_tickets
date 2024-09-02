import { protectedProcedure, router } from 'api-helpers'
import { auth } from 'auth-helpers/routers'

export const appRouter = router({
    auth,
})

export type AppRouter = typeof appRouter
