import { TRPCError, organizationProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { slugSchema } from 'shared-utils/helpers'
import { z } from 'zod'
import { getUserChannels } from '../services'

export const channels = router({
    create: organizationProcedure
        .input(
            z.object({
                name: z.string().min(1).max(255),
                slug: slugSchema,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.transaction(async (tx) => {
                if (ctx.organization.role === 'member') {
                    throw new TRPCError({
                        code: 'FORBIDDEN',
                        message: 'Forbidden',
                        cause: 'ADMIN_REQUIRED',
                    })
                }

                const [channel] = await tx
                    .insert(schema.channels)
                    .values({
                        name: input.name,
                        slug: input.slug,
                        organizationId: ctx.organization.id,
                    })
                    .returning()
                await tx.insert(schema.channelMembers).values({
                    channelId: channel.id,
                    userId: ctx.session.userId,
                    allowFullAdmin: true,
                })
                return channel!
            })
        }),

    list: organizationProcedure.query(async ({ ctx }) => {
        const channels = await getUserChannels(ctx.db, ctx.organization.id)

        return channels.map(({ channels, channel_member: { id, organizationId, ...member } }) => ({
            ...channels,
            ...member,
        }))
    }),
})
