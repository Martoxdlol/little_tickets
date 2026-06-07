import { TRPCError, organizationProcedure, protectedProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { and, desc, eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { z } from 'zod'

const emailInput = z.string().trim().toLowerCase().email().max(256)

export const invitations = router({
    list: organizationProcedure.query(async ({ ctx }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        return ctx.db
            .select({
                id: schema.organizationInvitations.id,
                email: schema.organizationInvitations.email,
                role: schema.organizationInvitations.role,
                createdAt: schema.organizationInvitations.createdAt,
            })
            .from(schema.organizationInvitations)
            .where(eq(schema.organizationInvitations.organizationId, ctx.organization.id))
            .orderBy(desc(schema.organizationInvitations.createdAt))
    }),

    create: organizationProcedure
        .input(z.object({ email: emailInput, role: z.enum(['admin', 'member']) }))
        .mutation(async ({ ctx, input }) => {
            if (ctx.organization.role === 'member') {
                throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
            }

            // If the email already belongs to a member of this organization, there is nothing to invite.
            const [existingUser] = await ctx.db
                .select({ id: schema.users.id })
                .from(schema.users)
                .where(eq(schema.users.email, input.email))
                .limit(1)

            if (existingUser) {
                const [member] = await ctx.db
                    .select({ id: schema.organizationMembers.id })
                    .from(schema.organizationMembers)
                    .where(
                        and(
                            eq(schema.organizationMembers.userId, existingUser.id),
                            eq(schema.organizationMembers.organizationId, ctx.organization.id),
                        ),
                    )
                    .limit(1)

                if (member) {
                    throw new TRPCError({ code: 'CONFLICT', message: 'That person is already a member of this organization' })
                }
            }

            try {
                const [invite] = await ctx.db
                    .insert(schema.organizationInvitations)
                    .values({
                        email: input.email,
                        role: input.role,
                        organizationId: ctx.organization.id,
                        invitedByUserId: ctx.session.userId,
                    })
                    .returning()

                return invite!
            } catch {
                // Unique (organizationId, email) violation — an invitation already exists.
                throw new TRPCError({ code: 'CONFLICT', message: 'That email has already been invited' })
            }
        }),

    revoke: organizationProcedure.input(z.object({ invitationId: z.string() })).mutation(async ({ ctx, input }) => {
        if (ctx.organization.role === 'member') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Forbidden', cause: 'ADMIN_REQUIRED' })
        }

        await ctx.db
            .delete(schema.organizationInvitations)
            .where(
                and(
                    eq(schema.organizationInvitations.id, input.invitationId),
                    eq(schema.organizationInvitations.organizationId, ctx.organization.id),
                ),
            )

        return { id: input.invitationId }
    }),

    listMine: protectedProcedure.query(async ({ ctx }) => {
        const email = ctx.session.user.email
        if (!email) {
            return []
        }

        const inviter = alias(schema.users, 'inviter')

        return ctx.db
            .select({
                id: schema.organizationInvitations.id,
                role: schema.organizationInvitations.role,
                createdAt: schema.organizationInvitations.createdAt,
                organizationName: schema.organizations.name,
                organizationSlug: schema.organizations.slug,
                invitedByName: inviter.name,
            })
            .from(schema.organizationInvitations)
            .innerJoin(schema.organizations, eq(schema.organizations.id, schema.organizationInvitations.organizationId))
            .leftJoin(inviter, eq(inviter.id, schema.organizationInvitations.invitedByUserId))
            .where(eq(schema.organizationInvitations.email, email.toLowerCase()))
            .orderBy(desc(schema.organizationInvitations.createdAt))
    }),

    accept: protectedProcedure.input(z.object({ invitationId: z.string() })).mutation(async ({ ctx, input }) => {
        const email = ctx.session.user.email
        if (!email) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Your account has no email address' })
        }

        const [invite] = await ctx.db
            .select({
                id: schema.organizationInvitations.id,
                role: schema.organizationInvitations.role,
                organizationId: schema.organizationInvitations.organizationId,
                organizationSlug: schema.organizations.slug,
            })
            .from(schema.organizationInvitations)
            .innerJoin(schema.organizations, eq(schema.organizations.id, schema.organizationInvitations.organizationId))
            .where(
                and(
                    eq(schema.organizationInvitations.id, input.invitationId),
                    eq(schema.organizationInvitations.email, email.toLowerCase()),
                ),
            )
            .limit(1)

        if (!invite) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Invitation not found' })
        }

        await ctx.db.transaction(async (tx) => {
            const [member] = await tx
                .select({ id: schema.organizationMembers.id })
                .from(schema.organizationMembers)
                .where(
                    and(
                        eq(schema.organizationMembers.userId, ctx.session.userId),
                        eq(schema.organizationMembers.organizationId, invite.organizationId),
                    ),
                )
                .limit(1)

            if (!member) {
                await tx.insert(schema.organizationMembers).values({
                    userId: ctx.session.userId,
                    organizationId: invite.organizationId,
                    role: invite.role,
                })
            }

            await tx.delete(schema.organizationInvitations).where(eq(schema.organizationInvitations.id, invite.id))
        })

        return { organizationSlug: invite.organizationSlug }
    }),

    decline: protectedProcedure.input(z.object({ invitationId: z.string() })).mutation(async ({ ctx, input }) => {
        const email = ctx.session.user.email
        if (!email) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Your account has no email address' })
        }

        await ctx.db
            .delete(schema.organizationInvitations)
            .where(
                and(
                    eq(schema.organizationInvitations.id, input.invitationId),
                    eq(schema.organizationInvitations.email, email.toLowerCase()),
                ),
            )

        return { id: input.invitationId }
    }),
})
