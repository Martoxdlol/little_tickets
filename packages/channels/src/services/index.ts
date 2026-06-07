import { type DBTX, schema } from 'database'
import { and, eq, isNotNull, or } from 'drizzle-orm'

/**
 * Channels the user can access within an organization: channels they're an explicit member of,
 * public channels, and — for org admins/owners — every channel in the organization.
 * The membership row is left-joined, so `channel_member` is null for public/admin-only access.
 */
export async function getAccessibleChannels(db: DBTX, organizationId: string, userId: string, isOrgAdmin: boolean) {
    const accessFilter = isOrgAdmin ? undefined : or(eq(schema.channels.public, true), isNotNull(schema.channelMembers.id))

    return await db
        .select()
        .from(schema.channels)
        .leftJoin(
            schema.channelMembers,
            and(eq(schema.channels.id, schema.channelMembers.channelId), eq(schema.channelMembers.userId, userId)),
        )
        .where(and(eq(schema.channels.organizationId, organizationId), accessFilter))
}
