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

export async function getOrganizationMembers(db: DBTX, organizationId: string) {
    return await db
        .select({
            id: schema.organizationMembers.id,
            userId: schema.organizationMembers.userId,
            role: schema.organizationMembers.role,
            name: schema.users.name,
            email: schema.users.email,
            picture: schema.users.picture,
        })
        .from(schema.organizationMembers)
        .innerJoin(schema.users, eq(schema.users.id, schema.organizationMembers.userId))
        .where(eq(schema.organizationMembers.organizationId, organizationId))
}

export async function countOrganizationOwners(db: DBTX, organizationId: string) {
    const owners = await db
        .select({ id: schema.organizationMembers.id })
        .from(schema.organizationMembers)
        .where(and(eq(schema.organizationMembers.organizationId, organizationId), eq(schema.organizationMembers.role, 'owner')))

    return owners.length
}
