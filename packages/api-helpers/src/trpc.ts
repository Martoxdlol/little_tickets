import { TRPCError, initTRPC } from '@trpc/server'
import { lucia } from 'auth-helpers/services'
import { schema } from 'database'
import { and, eq } from 'drizzle-orm'
import SuperJSON from 'superjson'
import { z } from 'zod'
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

export const organizationProcedure = protectedProcedure
    .input(z.object({ organizationSlug: z.string() }))
    .use(async ({ input, ctx, next }) => {
        const [result] = await ctx.db
            .select({
                id: schema.organizations.id,
                name: schema.organizations.name,
                slug: schema.organizations.slug,
                role: schema.organizationMembers.role,
            })
            .from(schema.organizations)
            .innerJoin(
                schema.organizationMembers,
                and(
                    eq(schema.organizations.slug, input.organizationSlug),
                    eq(schema.organizationMembers.organizationId, schema.organizations.id),
                    eq(schema.organizationMembers.userId, ctx.session.userId),
                ),
            )
            .limit(1)

        if (!result) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Organization not found',
            })
        }

        return next({
            ctx: {
                ...ctx,
                organization: result,
            },
        })
    })
