import { type DBTX, schema } from 'database'
import { eq } from 'drizzle-orm'

export async function getUserChannels(db: DBTX, channelId: string) {
    return await db
        .select()
        .from(schema.channels)
        .where(eq(schema.channels.organizationId, channelId))
        .innerJoin(schema.channelMembers, eq(schema.channels.id, schema.channelMembers.channelId))
}
