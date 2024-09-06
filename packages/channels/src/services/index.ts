import { type DBTX, schema } from 'database'
import { and, eq } from 'drizzle-orm'

export async function getUserChannels(db: DBTX, channelId: string, userId: string) {
    return await db
        .select()
        .from(schema.channels)
        .where(eq(schema.channels.organizationId, channelId))
        .innerJoin(
            schema.channelMembers,
            and(eq(schema.channels.id, schema.channelMembers.channelId), eq(schema.channelMembers.userId, userId)),
        )
}
