import { expect, test } from 'bun:test'
import { and, eq } from 'drizzle-orm'
import { conn, db, schema } from '..'

test('test batch', async () => {
    await db.transaction(async (tx) => {
        const q = [
            tx.insert(schema.organizations).values({ name: '1', slug: 'zzzz' }),
            tx
                .update(schema.organizations)
                .set({ name: '2', slug: 'zzzz' })
                .where(and(eq(schema.organizations.slug, 'zzzz'), eq(schema.organizations.name, '1'))),
            tx
                .update(schema.organizations)
                .set({ name: '3', slug: 'zzzz' })
                .where(and(eq(schema.organizations.slug, 'zzzz'), eq(schema.organizations.name, '2'))),
            tx
                .update(schema.organizations)
                .set({ name: '4', slug: 'zzzz' })
                .where(and(eq(schema.organizations.slug, 'zzzz'), eq(schema.organizations.name, '3'))),
            tx
                .update(schema.organizations)
                .set({ name: '5', slug: 'zzzz' })
                .where(and(eq(schema.organizations.slug, 'zzzz'), eq(schema.organizations.name, '4'))),
        ]

        await Promise.all(q)

        const z = await tx.query.organizations.findFirst({ where: eq(schema.organizations.slug, 'zzzz') })

        expect(z?.name).toBe('5')

        await tx.delete(schema.organizations).where(eq(schema.organizations.slug, 'zzzz'))
    })

    conn.end()
})
