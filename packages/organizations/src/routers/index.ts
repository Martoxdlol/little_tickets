import { optionalOrganizationProcedure, protectedProcedure, router } from 'api-helpers'
import { schema } from 'database'
import { slugSchema } from 'shared-utils/helpers'
import { z } from 'zod'
import { getUserOrganizations } from '../services'

export const organizations = router({
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

    list: protectedProcedure.query(async ({ ctx }) => {
        const orgs = await getUserOrganizations(ctx.db, ctx.session.userId)

        return orgs.map((org) => ({
            id: org.organization.id,
            name: org.organization.name,
            slug: org.organization.slug,
            role: org.organization_member.role,
        }))
    }),
})
