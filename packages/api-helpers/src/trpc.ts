import { TRPCError, initTRPC } from '@trpc/server'
import { lucia } from 'auth-helpers/services'
import SuperJSON from 'superjson'
import type { Context } from './context'

export const t = initTRPC.context<Context>().create({
    transformer: SuperJSON,
})

export const router = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.sessionId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
        })
    }

    const { session, user } = await lucia.validateSession(ctx.sessionId)

    if (!session) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
        })
    }

    return next({
        ctx: {
            ...ctx,
            session: {
                ...session,
                user,
            },
        },
    })
})
