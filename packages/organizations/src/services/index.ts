import { type DBTX, schema } from 'database'
import { and, eq } from 'drizzle-orm'

export async function getUserOrganizations(db: DBTX, userId: string) {
    return await db
        .select()
        .from(schema.organizations)
        .innerJoin(
            schema.organizationMembers,
            and(eq(schema.organizations.id, schema.organizationMembers.organizationId), eq(schema.organizationMembers.userId, userId)),
        )
}
