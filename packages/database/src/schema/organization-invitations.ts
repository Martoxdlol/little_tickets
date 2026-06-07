import { relations } from 'drizzle-orm'
import { index, text, unique, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { columnId, createTable, createdAt } from './lib'
import { organizations } from './organizations'

const invitationRoles = ['admin', 'member'] as const

export const organizationInvitations = createTable(
    'organization_invitation',
    {
        id: columnId,

        email: varchar('email', { length: 256 }).notNull(),

        role: text('role', { enum: invitationRoles }).notNull().default('member'),

        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id),

        invitedByUserId: varchar('invited_by_user_id', { length: 22 })
            .notNull()
            .references(() => users.id),

        createdAt,
    },
    (t) => ({
        // One pending invitation per email per organization.
        uniqueEmail: unique().on(t.organizationId, t.email),
        organizationIdIndex: index().on(t.organizationId),
        emailIndex: index().on(t.email),
    }),
)

export const organizationInvitationsRelations = relations(organizationInvitations, ({ one }) => ({
    organization: one(organizations, {
        fields: [organizationInvitations.organizationId],
        references: [organizations.id],
    }),
    invitedByUser: one(users, {
        fields: [organizationInvitations.invitedByUserId],
        references: [users.id],
    }),
}))
