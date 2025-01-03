import { TRPCError, initTRPC } from '@trpc/server'
import { lucia } from 'auth-helpers/services'
import { schema } from 'database'
import { and, eq } from 'drizzle-orm'
import { allAppStrings, getLang } from 'i18n/strings'
import { useFirstBoolean } from 'shared-utils/helpers'
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

    const strings = allAppStrings[getLang(user.locale)]

    return next({
        ctx: {
            ...ctx,
            session: {
                ...session,
                user,
            },
            strings,
        },
    })
})

export const optionalOrganizationProcedure = protectedProcedure
    .input(z.object({ organizationSlug: z.string() }))
    .use(async ({ input, ctx, next }) => {
        const [result] = await ctx.db
            .select({
                id: schema.organizations.id,
                name: schema.organizations.name,
                slug: schema.organizations.slug,
                role: schema.organizationMembers.role,

                defaultChannelAllowCreateNew: schema.organizations.defaultChannelAllowCreateNew,
                defaultChannelAllowViewAll: schema.organizations.defaultChannelAllowViewAll,
                defaultChannelAllowCommentOnAll: schema.organizations.defaultChannelAllowCommentOnAll,
                defaultChannelAllowCommentCreatedSelf: schema.organizations.defaultChannelAllowCommentCreatedSelf,
                defaultChannelAllowCommentAssignedSelf: schema.organizations.defaultChannelAllowCommentAssignedSelf,
                defaultChannelAllowManageAll: schema.organizations.defaultChannelAllowManageAll,
                defaultChannelAllowManageAssignedSelf: schema.organizations.defaultChannelAllowManageAssignedSelf,
                defaultChannelAllowManageCreatedSelf: schema.organizations.defaultChannelAllowManageCreatedSelf,
                defaultChannelAllowFullAdmin: schema.organizations.defaultChannelAllowFullAdmin,
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

        return next({
            ctx: {
                ...ctx,
                organization: result ?? null,
            },
        })
    })

export const organizationProcedure = optionalOrganizationProcedure.use(async ({ ctx, next }) => {
    if (!ctx.organization) {
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Organization not found',
        })
    }

    return next({
        ctx: {
            ...ctx,
            organization: ctx.organization,
        },
    })
})

export const channelProcedure = organizationProcedure.input(z.object({ channelSlug: z.string() })).use(async ({ input, ctx, next }) => {
    const [result] = await ctx.db
        .select({
            id: schema.channels.id,
            name: schema.channels.name,
            slug: schema.channels.slug,
            allowCreateNew: schema.channelMembers.allowCreateNew,
            allowViewAll: schema.channelMembers.allowViewAll,
            allowCommentOnAll: schema.channelMembers.allowCommentOnAll,
            allowCommentCreatedSelf: schema.channelMembers.allowCommentCreatedSelf,
            allowCommentAssignedSelf: schema.channelMembers.allowCommentAssignedSelf,
            allowManageAll: schema.channelMembers.allowManageAll,
            allowManageCreatedSelf: schema.channelMembers.allowManageCreatedSelf,
            allowManageAssignedSelf: schema.channelMembers.allowManageAssignedSelf,
            allowFullAdmin: schema.channelMembers.allowFullAdmin,
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
        .innerJoin(
            schema.channelMembers,
            and(
                eq(schema.channels.slug, input.channelSlug),
                eq(schema.channelMembers.channelId, schema.channels.id),
                eq(schema.channelMembers.userId, ctx.session.userId),
                eq(schema.channelMembers.organizationId, ctx.organization.id),
                eq(schema.channels.organizationId, ctx.organization.id),
            ),
        )
        .limit(1)

    let canCreateNew = useFirstBoolean(result?.allowCreateNew, result?.defaultAllowCreateNew, ctx.organization.defaultChannelAllowCreateNew)
    let canViewAll = useFirstBoolean(result?.allowViewAll, result?.defaultAllowViewAll, ctx.organization.defaultChannelAllowViewAll)
    let canCommentOnAll = useFirstBoolean(
        result?.allowCommentOnAll,
        result?.defaultAllowCommentOnAll,
        ctx.organization.defaultChannelAllowCommentOnAll,
    )
    let canCommentOnCreatedSelf = useFirstBoolean(
        result?.allowCommentCreatedSelf,
        result?.defaultAllowCommentCreatedSelf,
        ctx.organization.defaultChannelAllowCommentCreatedSelf,
    )
    let canCommentOnAssignedSelf = useFirstBoolean(
        result?.allowCommentAssignedSelf,
        result?.defaultAllowCommentAssignedSelf,
        ctx.organization.defaultChannelAllowCommentAssignedSelf,
    )
    let canManageAll = useFirstBoolean(result?.allowManageAll, result?.defaultAllowManageAll, ctx.organization.defaultChannelAllowManageAll)
    let canManageCreatedSelf = useFirstBoolean(
        result?.allowManageCreatedSelf,
        result?.defaultAllowManageCreatedSelf,
        ctx.organization.defaultChannelAllowManageCreatedSelf,
    )
    let canManageAssignedSelf = useFirstBoolean(
        result?.allowManageAssignedSelf,
        result?.defaultAllowManageAssignedSelf,
        ctx.organization.defaultChannelAllowManageAssignedSelf,
    )
    const canFullAdmin = useFirstBoolean(
        result?.allowFullAdmin,
        result?.defaultAllowFullAdmin,
        ctx.organization.defaultChannelAllowFullAdmin,
    )
    if (canFullAdmin || ctx.organization.role !== 'member') {
        canCreateNew = true
        canViewAll = true
        canCommentOnAll = true
        canCommentOnCreatedSelf = true
        canCommentOnAssignedSelf = true
        canManageAll = true
        canManageCreatedSelf = true
        canManageAssignedSelf = true
        canManageAssignedSelf = true
    }

    return next({
        ctx: {
            ...ctx,
            channel: result
                ? { ...result, canCreateNew, canViewAll, canCommentOnAll, canManageAll, canManageAssignedSelf, canFullAdmin }
                : null,
        },
    })
})
