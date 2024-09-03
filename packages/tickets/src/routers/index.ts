import { TRPCError, channelProcedure, router } from 'api-helpers'
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
})
