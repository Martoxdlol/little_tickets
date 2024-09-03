import { type DBTX, schema } from 'database'
import { sql } from 'drizzle-orm'

export async function insertTicket(db: DBTX, input: Omit<typeof schema.tickets.$inferInsert, 'code'>) {
    return await db
        .insert(schema.tickets)
        .values({
            ...input,
            code: sql`COALESCE(
                (SELECT code + 1 FROM ${schema.tickets} WHERE ${schema.tickets.channelId} = ${input.channelId} ORDER BY ${schema.tickets.code} DESC LIMIT 1), 
                1
            )`,
            // code: ctx.db
            //     .select({ code: schema.tickets.code })
            //     .from(schema.tickets)
            //     .orderBy(desc(schema.tickets.code))
            //     .limit(1)
            //     .getSQL(),
        })
        .returning()
}
