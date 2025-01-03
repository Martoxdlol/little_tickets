import { TRPCError, channelProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { and, desc, eq, ne } from 'drizzle-orm'
import { safeSanitizeEditorContent } from 'editor-helpers/server'
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

            const result = await safeSanitizeEditorContent(input.description)

            if (!result) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                })
            }

            // for in range 5
            for (let i = 0; i < 5; i++) {
                try {
                    return (
                        await insertTicket(ctx.db, {
                            channelId: ctx.channel.id,
                            description: result.json,
                            descriptionText: result.text,
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

    listPreview: channelProcedure.query(async ({ ctx }) => {
        if (!ctx.channel) {
            return null
        }

        return ctx.db.query.tickets.findMany({
            where: and(
                eq(schema.tickets.channelId, ctx.channel.id),
                ne(schema.tickets.status, 'done'),
                ne(schema.tickets.status, 'cancelled'),
            ),
            orderBy: desc(schema.tickets.updatedAt),
            limit: 10,
        })
    }),
})

export const comments = router({
    create: channelProcedure.input(z.object({ ticketCode: z.number(), content: z.unknown() })).mutation(async ({ ctx, input }) => {
        if (!ctx.channel) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Channel not found',
            })
        }

        const ticket = await ctx.db.query.tickets.findFirst({
            where: and(eq(schema.tickets.channelId, ctx.channel.id), eq(schema.tickets.code, input.ticketCode)),
            columns: {
                id: true,
                createdByUserId: true,
                assignedToUserId: true,
            },
        })

        if (!ticket) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Ticket not found',
            })
        }
        const canComment =
            ctx.channel.canCommentOnAll ||
            ctx.channel.canManageAll ||
            ticket.createdByUserId === ctx.session.userId ||
            ticket.assignedToUserId === ctx.session.userId

        if (!canComment) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to comment on this ticket',
            })
        }

        const result = await safeSanitizeEditorContent(input.content)

        if (!result || result.text.trim().length === 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
            })
        }

        return await ctx.db.insert(schema.comments).values({
            content: result.json,
            contentText: result.text,
            createdByUserId: ctx.session.userId,
            ticketId: ticket.id,
            organizationId: ctx.organization.id,
        })
    }),

    list: channelProcedure.input(z.object({ ticketCode: z.number() })).query(async ({ ctx, input }) => {
        if (!ctx.channel) {
            return null
        }

        const ticket = await ctx.db.query.tickets.findFirst({
            where: and(eq(schema.tickets.channelId, ctx.channel.id), eq(schema.tickets.code, input.ticketCode)),
        })

        if (!ticket) {
            return null
        }

        return ctx.db.query.comments.findMany({
            where: and(eq(schema.comments.ticketId, ticket.id), eq(schema.comments.organizationId, ctx.organization.id)),
            with: {
                user: {
                    columns: {
                        name: true,
                        picture: true,
                    },
                },
            },
        })
    }),

    delete: channelProcedure.input(z.object({ commentId: z.string() })).mutation(async ({ ctx, input }) => {
        if (!ctx.channel) {
            return
        }

        await ctx.db
            .delete(schema.comments)
            .where(and(eq(schema.comments.id, input.commentId), eq(schema.comments.organizationId, ctx.organization.id)))
    }),
})
