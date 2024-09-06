import { TRPCError, channelProcedure, organizationProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { slugSchema, useFirstBoolean } from 'shared-utils/helpers'
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

                if (!channel) {
                    tx.rollback()
                    return
                }

                await tx.insert(schema.channelMembers).values({
                    channelId: channel.id,
                    userId: ctx.session.userId,
                    allowFullAdmin: true,
                    organizationId: ctx.organization.id,
                })
                return channel
            })
        }),

    list: organizationProcedure
        .input(
            z.object({
                canCreateNew: z.boolean().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            let channels = await getUserChannels(ctx.db, ctx.organization.id, ctx.session.userId)

            if (input.canCreateNew) {
                channels = channels.filter((channel) => {
                    if (ctx.organization.role !== 'member' || channel.channel_member.allowFullAdmin) {
                        return true
                    }

                    return useFirstBoolean(
                        channel.channel_member.allowCreateNew,
                        channel.channels.defaultAllowCreateNew,
                        ctx.organization.defaultChannelAllowCreateNew,
                    )
                })
            }

            return channels.map(({ channels, channel_member: { id, organizationId, ...member } }) => ({
                ...channels,
                ...member,
            }))
        }),

    get: channelProcedure.query(async ({ ctx }) => {
        return ctx.channel
    }),
})
