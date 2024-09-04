import { TRPCError, channelProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { and, eq } from 'drizzle-orm'
import { wait } from 'shared-utils/helpers'
import { z } from 'zod'
import { insertTicket } from '../services'

export const tickets = router({
    create: channelProcedure
        .input(
            z.object({
                title: z.string().min(1).max(255),
                description: z.unknown(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.channel) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Channel not found',
                })
            }

            if (!ctx.channel.canCreateNew) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to create a new organization',
                })
            }

            // for in range 5
            for (let i = 0; i < 5; i++) {
                try {
                    return (
                        await insertTicket(ctx.db, {
                            channelId: ctx.channel.id,
                            description: input.description,
                            status: 'pending',
                            title: input.title,
                            createdByUserId: ctx.session.userId,
                            organizationId: ctx.organization.id,
                        })
                    )[0]!
                } catch (error) {
                    console.error(error)
                    // rand between 500 and 2500
                    const rand = Math.floor(Math.random() * 2000) + 500 + i * 100
                    await wait(rand)
                }
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create ticket',
            })
        }),

    get: channelProcedure.input(z.object({ code: z.number() })).query(async ({ ctx, input }) => {
        if (!ctx.channel) {
            return null
        }

        return (
            ctx.db.query.tickets.findFirst({
                where: and(eq(schema.tickets.channelId, ctx.channel.id), eq(schema.tickets.code, input.code)),
            }) ?? null
        )
    }),

    update: channelProcedure
        .input(z.object({ code: z.number(), title: z.string().min(1).max(255), description: z.unknown() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.channel) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Channel not found',
                })
            }

            const ticket = await ctx.db.query.tickets.findFirst({
                where: and(eq(schema.tickets.channelId, ctx.channel.id), eq(schema.tickets.code, input.code)),
            })

            if (!ticket) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Ticket not found',
                })
            }

            const isSelf = ticket.createdByUserId === ctx.session.userId
            const canEdit = isSelf || ctx.channel.canManageAll

            if (!canEdit) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this ticket',
                })
            }

            await ctx.db
                .update(schema.tickets)
                .set({
                    title: input.title,
                    description: input.description,
                    version: ticket.version + 1,
                })
                .where(and(eq(schema.tickets.id, ticket.id), eq(schema.tickets.version, ticket.version)))
        }),

    list: channelProcedure.query(async ({ ctx }) => {
        if (!ctx.channel) {
            return null
        }

        return ctx.db.query.tickets.findMany({
            where: and(eq(schema.tickets.channelId, ctx.channel.id)),
        })
    }),
})
