import { type DBTX, schema } from 'database'
import { eq } from 'drizzle-orm'

export async function getUserOrganizations(db: DBTX) {
    return await db
        .select()
        .from(schema.organizations)
        .innerJoin(schema.organizationMembers, eq(schema.organizations.id, schema.organizationMembers.organizationId))
}
