import { TRPCError, optionalOrganizationProcedure, organizationProcedure, protectedProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { and, eq } from 'drizzle-orm'
import { slugSchema } from 'shared-utils/helpers'
import { z } from 'zod'
import { countOrganizationOwners, getOrganizationMembers, getUserOrganizations } from '../services'
import { invitations } from './invitations'

const rolePriority = { owner: 0, admin: 1, member: 2 } as const

export const organizations = router({
    invitations,

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(255),
                slug: slugSchema,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.transaction(async (tx) => {
                const [org] = await tx
                    .insert(schema.organizations)
                    .values({
                        name: input.name,
                        slug: input.slug,
                    })
                    .returning()
                await tx.insert(schema.organizationMembers).values({
                    organizationId: org!.id,
                    role: 'owner',
                    userId: ctx.session.userId,
                })
                return org!
            })
        }),

    get: optionalOrganizationProcedure.query(async ({ ctx, input }) => {
        return ctx.organization
    }),

    update: organizationProcedure
        .input(
            z.object({
                name: z.string().min(1).max(256),
                slug: slugSchema,

                defaultChannelAllowCreateNew: z.boolean(),
                defaultChannelAllowViewAll: z.boolean(),
                defaultChannelAllowCommentOnAll: z.boolean(),
                defaultChannelAllowCommentCreatedSelf: z.boolean(),
                defaultChannelAllowCommentAssignedSelf: z.boolean(),
                defaultChannelAllowManageAll: z.boolean(),
                defaultChannelAllowManageCreatedSelf: z.boolean(),
                defaultChannelAllowManageAssignedSelf: z.boolean(),
                defaultChannelAllowFullAdmin: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Forbidden',
                    cause: 'ADMIN_REQUIRED',
                })
            }

            const [org] = await ctx.db
                .update(schema.organizations)
                .set({
                    name: input.name,
                    slug: input.slug,
                    defaultChannelAllowCreateNew: input.defaultChannelAllowCreateNew,
                    defaultChannelAllowViewAll: input.defaultChannelAllowViewAll,
                    defaultChannelAllowCommentOnAll: input.defaultChannelAllowCommentOnAll,
                    defaultChannelAllowCommentCreatedSelf: input.defaultChannelAllowCommentCreatedSelf,
                    defaultChannelAllowCommentAssignedSelf: input.defaultChannelAllowCommentAssignedSelf,
                    defaultChannelAllowManageAll: input.defaultChannelAllowManageAll,
                    defaultChannelAllowManageCreatedSelf: input.defaultChannelAllowManageCreatedSelf,
                    defaultChannelAllowManageAssignedSelf: input.defaultChannelAllowManageAssignedSelf,
                    defaultChannelAllowFullAdmin: input.defaultChannelAllowFullAdmin,
                })
                .where(eq(schema.organizations.id, ctx.organization.id))
                .returning()

            return org!
        }),

    delete: organizationProcedure.mutation(async ({ ctx }) => {
        if (ctx.organization.role !== 'owner') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Forbidden',
                cause: 'OWNER_REQUIRED',
            })
        }

        const organizationId = ctx.organization.id

        await ctx.db.transaction(async (tx) => {
            // Delete in foreign-key dependency order (children first).
            await tx.delete(schema.comments).where(eq(schema.comments.organizationId, organizationId))
            await tx.delete(schema.tickets).where(eq(schema.tickets.organizationId, organizationId))
            await tx.delete(schema.channelMembers).where(eq(schema.channelMembers.organizationId, organizationId))
            await tx.delete(schema.channels).where(eq(schema.channels.organizationId, organizationId))
            await tx.delete(schema.organizationMembers).where(eq(schema.organizationMembers.organizationId, organizationId))
            await tx.delete(schema.organizations).where(eq(schema.organizations.id, organizationId))
        })

        return { id: organizationId }
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
        const orgs = await getUserOrganizations(ctx.db, ctx.session.userId)

        return orgs.map((org) => ({
            id: org.organization.id,
            name: org.organization.name,
            slug: org.organization.slug,
            role: org.organization_member.role,
        }))
    }),

    members: organizationProcedure.query(async ({ ctx }) => {
        const members = await getOrganizationMembers(ctx.db, ctx.organization.id)

        return members.sort((a, b) => {
            if (a.role !== b.role) return rolePriority[a.role] - rolePriority[b.role]
            return (a.name ?? '').localeCompare(b.name ?? '')
        })
    }),

    updateMemberRole: organizationProcedure
        .input(
            z.object({
                memberId: z.string(),
                role: z.enum(['owner', 'admin', 'member']),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
            }

            const [target] = await ctx.db
                .select({ id: schema.organizationMembers.id, role: schema.organizationMembers.role })
                .from(schema.organizationMembers)
                .where(
                    and(
                        eq(schema.organizationMembers.id, input.memberId),
                        eq(schema.organizationMembers.organizationId, ctx.organization.id),
                    ),
                )
                .limit(1)

            if (!target) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' })
            }

            // Only owners may promote to or demote from the owner role.
            if (ctx.organization.role === 'admin' && (target.role === 'owner' || input.role === 'owner')) {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the owner can manage owners', cause: 'OWNER_REQUIRED' })
            }

            // Never leave the organization without an owner.
            if (target.role === 'owner' && input.role !== 'owner') {
                const ownerCount = await countOrganizationOwners(ctx.db, ctx.organization.id)
                if (ownerCount <= 1) {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: 'The organization must have at least one owner' })
                }
            }

            const [updated] = await ctx.db
                .update(schema.organizationMembers)
                .set({ role: input.role })
                .where(eq(schema.organizationMembers.id, target.id))
                .returning()

            return updated!
        }),

    removeMember: organizationProcedure.input(z.object({ memberId: z.string() })).mutation(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        const [target] = await ctx.db
            .select({
                id: schema.organizationMembers.id,
                userId: schema.organizationMembers.userId,
                role: schema.organizationMembers.role,
            })
            .from(schema.organizationMembers)
            .where(
                and(eq(schema.organizationMembers.id, input.memberId), eq(schema.organizationMembers.organizationId, ctx.organization.id)),
            )
            .limit(1)

        if (!target) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found' })
        }

        if (ctx.organization.role === 'admin' && target.role === 'owner') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the owner can remove owners', cause: 'OWNER_REQUIRED' })
        }

        if (target.role === 'owner') {
            const ownerCount = await countOrganizationOwners(ctx.db, ctx.organization.id)
            if (ownerCount <= 1) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'The organization must have at least one owner' })
            }
        }

        await ctx.db.transaction(async (tx) => {
            // Revoke the member's channel access within this organization.
            await tx
                .delete(schema.channelMembers)
                .where(and(eq(schema.channelMembers.organizationId, ctx.organization.id), eq(schema.channelMembers.userId, target.userId)))
            await tx.delete(schema.organizationMembers).where(eq(schema.organizationMembers.id, target.id))
        })

        return { id: target.id }
    }),

    leave: organizationProcedure.mutation(async ({ ctx }) => {
        // The sole owner can't leave — they must transfer ownership or delete the organization.
        if (ctx.organization.role === 'owner') {
            const ownerCount = await countOrganizationOwners(ctx.db, ctx.organization.id)
            if (ownerCount <= 1) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Transfer ownership to someone else or delete the organization before leaving',
                })
            }
        }

        await ctx.db.transaction(async (tx) => {
            await tx
                .delete(schema.channelMembers)
                .where(
                    and(
                        eq(schema.channelMembers.organizationId, ctx.organization.id),
                        eq(schema.channelMembers.userId, ctx.session.userId),
                    ),
                )
            await tx
                .delete(schema.organizationMembers)
                .where(
                    and(
                        eq(schema.organizationMembers.organizationId, ctx.organization.id),
                        eq(schema.organizationMembers.userId, ctx.session.userId),
                    ),
                )
        })

        return { id: ctx.organization.id }
    }),
})
