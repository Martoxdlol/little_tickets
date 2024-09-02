import { relations } from 'drizzle-orm'
import { index, text, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { columnId, createTable } from './lib'
import { organizations } from './organizations'

const organizationMembersRoles = ['owner', 'admin', 'member'] as const

export const organizationMembers = createTable(
    'organization_member',
    {
        id: columnId,
        userId: varchar('user_id', { length: 22 })
            .notNull()
            .references(() => users.id),

        role: text('role', { enum: organizationMembersRoles }).notNull(),

        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id),
    },
    (t) => ({
        userIdIndex: index().on(t.userId),
        organizationIdIndex: index().on(t.organizationId),
    }),
)

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
    organization: one(organizations, {
        fields: [organizationMembers.organizationId],
        references: [organizations.id],
    }),
}))
