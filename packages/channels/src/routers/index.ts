import { TRPCError, channelProcedure, organizationProcedure, router } from 'api-helpers'
import { type DBTX, schema } from 'database'
import { and, eq, inArray } from 'drizzle-orm'
import { slugSchema, useFirstBoolean } from 'shared-utils/helpers'
import { z } from 'zod'
import { getAccessibleChannels } from '../services'

// null = inherit the organization default, true = allow, false = deny.
const triState = z.boolean().nullable()

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
            const isOrgAdmin = ctx.organization.role !== 'member'
            let channels = await getAccessibleChannels(ctx.db, ctx.organization.id, ctx.session.userId, isOrgAdmin)

            if (input.canCreateNew) {
                channels = channels.filter(({ channels: channel, channel_member: member }) => {
                    if (isOrgAdmin || member?.allowFullAdmin) {
                        return true
                    }

                    return useFirstBoolean(
                        member?.allowCreateNew,
                        channel.defaultAllowCreateNew,
                        ctx.organization.defaultChannelAllowCreateNew,
                    )
                })
            }

            return channels.map(({ channels: channel, channel_member: member }) => ({
                ...channel,
                isMember: !!member,
            }))
        }),

    get: channelProcedure.query(async ({ ctx }) => {
        return ctx.channel
    }),

    getForManage: organizationProcedure.input(z.object({ channelSlug: z.string() })).query(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        const [channel] = await ctx.db
            .select({
                id: schema.channels.id,
                name: schema.channels.name,
                slug: schema.channels.slug,
                public: schema.channels.public,
                defaultAllowCreateNew: schema.channels.defaultAllowCreateNew,
                defaultAllowViewAll: schema.channels.defaultAllowViewAll,
                defaultAllowCommentOnAll: schema.channels.defaultAllowCommentOnAll,
                defaultAllowCommentCreatedSelf: schema.channels.defaultAllowCommentCreatedSelf,
                defaultAllowCommentAssignedSelf: schema.channels.defaultAllowCommentAssignedSelf,
                defaultAllowManageAll: schema.channels.defaultAllowManageAll,
                defaultAllowManageCreatedSelf: schema.channels.defaultAllowManageCreatedSelf,
                defaultAllowManageAssignedSelf: schema.channels.defaultAllowManageAssignedSelf,
                defaultAllowFullAdmin: schema.channels.defaultAllowFullAdmin,
            })
            .from(schema.channels)
            .where(and(eq(schema.channels.slug, input.channelSlug), eq(schema.channels.organizationId, ctx.organization.id)))
            .limit(1)

        return channel ?? null
    }),

    update: organizationProcedure
        .input(
            z.object({
                channelSlug: z.string(),
                name: z.string().min(1).max(255),
                slug: slugSchema,
                public: z.boolean(),
                defaultAllowCreateNew: triState,
                defaultAllowViewAll: triState,
                defaultAllowCommentOnAll: triState,
                defaultAllowCommentCreatedSelf: triState,
                defaultAllowCommentAssignedSelf: triState,
                defaultAllowManageAll: triState,
                defaultAllowManageCreatedSelf: triState,
                defaultAllowManageAssignedSelf: triState,
                defaultAllowFullAdmin: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
            }

            const [channel] = await ctx.db
                .update(schema.channels)
                .set({
                    name: input.name,
                    slug: input.slug,
                    public: input.public,
                    defaultAllowCreateNew: input.defaultAllowCreateNew,
                    defaultAllowViewAll: input.defaultAllowViewAll,
                    defaultAllowCommentOnAll: input.defaultAllowCommentOnAll,
                    defaultAllowCommentCreatedSelf: input.defaultAllowCommentCreatedSelf,
                    defaultAllowCommentAssignedSelf: input.defaultAllowCommentAssignedSelf,
                    defaultAllowManageAll: input.defaultAllowManageAll,
                    defaultAllowManageCreatedSelf: input.defaultAllowManageCreatedSelf,
                    defaultAllowManageAssignedSelf: input.defaultAllowManageAssignedSelf,
                    defaultAllowFullAdmin: input.defaultAllowFullAdmin,
                })
                .where(and(eq(schema.channels.slug, input.channelSlug), eq(schema.channels.organizationId, ctx.organization.id)))
                .returning()

            if (!channel) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' })
            }

            return channel
        }),

    delete: organizationProcedure.input(z.object({ channelSlug: z.string() })).mutation(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        const [channel] = await ctx.db
            .select({ id: schema.channels.id })
            .from(schema.channels)
            .where(and(eq(schema.channels.slug, input.channelSlug), eq(schema.channels.organizationId, ctx.organization.id)))
            .limit(1)

        if (!channel) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' })
        }

        const channelId = channel.id

        await ctx.db.transaction(async (tx) => {
            // Delete in foreign-key dependency order (children first).
            await tx
                .delete(schema.comments)
                .where(
                    inArray(
                        schema.comments.ticketId,
                        tx.select({ id: schema.tickets.id }).from(schema.tickets).where(eq(schema.tickets.channelId, channelId)),
                    ),
                )
            await tx.delete(schema.tickets).where(eq(schema.tickets.channelId, channelId))
            await tx.delete(schema.channelMembers).where(eq(schema.channelMembers.channelId, channelId))
            await tx.delete(schema.channels).where(eq(schema.channels.id, channelId))
        })

        return { id: channelId }
    }),

    // --- Channel members (org admin / owner only, matching the manage page) ---

    members: organizationProcedure.input(z.object({ channelSlug: z.string() })).query(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        const channelId = await resolveChannelId(ctx.db, input.channelSlug, ctx.organization.id)

        return ctx.db
            .select({
                id: schema.channelMembers.id,
                userId: schema.channelMembers.userId,
                name: schema.users.name,
                email: schema.users.email,
                picture: schema.users.picture,
                allowCreateNew: schema.channelMembers.allowCreateNew,
                allowViewAll: schema.channelMembers.allowViewAll,
                allowCommentOnAll: schema.channelMembers.allowCommentOnAll,
                allowCommentCreatedSelf: schema.channelMembers.allowCommentCreatedSelf,
                allowCommentAssignedSelf: schema.channelMembers.allowCommentAssignedSelf,
                allowManageAll: schema.channelMembers.allowManageAll,
                allowManageCreatedSelf: schema.channelMembers.allowManageCreatedSelf,
                allowManageAssignedSelf: schema.channelMembers.allowManageAssignedSelf,
                allowFullAdmin: schema.channelMembers.allowFullAdmin,
            })
            .from(schema.channelMembers)
            .innerJoin(schema.users, eq(schema.users.id, schema.channelMembers.userId))
            .where(and(eq(schema.channelMembers.channelId, channelId), eq(schema.channelMembers.organizationId, ctx.organization.id)))
    }),

    addMember: organizationProcedure.input(z.object({ channelSlug: z.string(), userId: z.string() })).mutation(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        const channelId = await resolveChannelId(ctx.db, input.channelSlug, ctx.organization.id)

        // The target must belong to the organization.
        const [orgMember] = await ctx.db
            .select({ id: schema.organizationMembers.id })
            .from(schema.organizationMembers)
            .where(
                and(
                    eq(schema.organizationMembers.userId, input.userId),
                    eq(schema.organizationMembers.organizationId, ctx.organization.id),
                ),
            )
            .limit(1)

        if (!orgMember) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'That person is not a member of this organization' })
        }

        const [existing] = await ctx.db
            .select({ id: schema.channelMembers.id })
            .from(schema.channelMembers)
            .where(and(eq(schema.channelMembers.channelId, channelId), eq(schema.channelMembers.userId, input.userId)))
            .limit(1)

        if (existing) {
            throw new TRPCError({ code: 'CONFLICT', message: 'That person is already a member of this channel' })
        }

        const [created] = await ctx.db
            .insert(schema.channelMembers)
            .values({
                channelId,
                userId: input.userId,
                organizationId: ctx.organization.id,
                allowFullAdmin: false,
            })
            .returning()

        return created!
    }),

    removeMember: organizationProcedure
        .input(z.object({ channelSlug: z.string(), memberId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
            }

            const channelId = await resolveChannelId(ctx.db, input.channelSlug, ctx.organization.id)

            await ctx.db
                .delete(schema.channelMembers)
                .where(
                    and(
                        eq(schema.channelMembers.id, input.memberId),
                        eq(schema.channelMembers.channelId, channelId),
                        eq(schema.channelMembers.organizationId, ctx.organization.id),
                    ),
                )

            return { id: input.memberId }
        }),

    updateMemberPermissions: organizationProcedure
        .input(
            z.object({
                channelSlug: z.string(),
                memberId: z.string(),
                allowCreateNew: triState,
                allowViewAll: triState,
                allowCommentOnAll: triState,
                allowCommentCreatedSelf: triState,
                allowCommentAssignedSelf: triState,
                allowManageAll: triState,
                allowManageCreatedSelf: triState,
                allowManageAssignedSelf: triState,
                allowFullAdmin: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
            }

            const channelId = await resolveChannelId(ctx.db, input.channelSlug, ctx.organization.id)

            const [updated] = await ctx.db
                .update(schema.channelMembers)
                .set({
                    allowCreateNew: input.allowCreateNew,
                    allowViewAll: input.allowViewAll,
                    allowCommentOnAll: input.allowCommentOnAll,
                    allowCommentCreatedSelf: input.allowCommentCreatedSelf,
                    allowCommentAssignedSelf: input.allowCommentAssignedSelf,
                    allowManageAll: input.allowManageAll,
                    allowManageCreatedSelf: input.allowManageCreatedSelf,
                    allowManageAssignedSelf: input.allowManageAssignedSelf,
                    allowFullAdmin: input.allowFullAdmin,
                })
                .where(
                    and(
                        eq(schema.channelMembers.id, input.memberId),
                        eq(schema.channelMembers.channelId, channelId),
                        eq(schema.channelMembers.organizationId, ctx.organization.id),
                    ),
                )
                .returning()

            if (!updated) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel member not found' })
            }

            return updated
        }),
})

async function resolveChannelId(db: DBTX, channelSlug: string, organizationId: string) {
    const [channel] = await db
        .select({ id: schema.channels.id })
        .from(schema.channels)
        .where(and(eq(schema.channels.slug, channelSlug), eq(schema.channels.organizationId, organizationId)))
        .limit(1)

    if (!channel) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' })
    }

    return channel.id
}
