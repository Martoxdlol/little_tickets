import { router } from 'api-helpers'
import { auth } from 'auth-helpers/routers'
import { channels } from 'channels/routers'
import { organizations } from 'organizations/routers'
import { comments, tickets } from 'tickets/routers'

export const appRouter = router({
    auth,
    organizations,
    channels,
    tickets,
    comments,
})

export type AppRouter = typeof appRouter
