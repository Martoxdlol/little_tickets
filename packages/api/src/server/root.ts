import { router } from 'api-helpers'
import { auth } from 'auth-helpers/routers'
import { channels } from 'channels/routers'
import { organizations } from 'organizations/routers'
import { tickets } from 'tickets/routers'

export const appRouter = router({
    auth,
    organizations,
    channels,
    tickets,
})

export type AppRouter = typeof appRouter
