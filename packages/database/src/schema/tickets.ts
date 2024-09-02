import { relations } from 'drizzle-orm'
import { index, json, text, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { channels } from './channels'
import { columnId, createTable, createdAt, updatedAt, version } from './lib'
import { organizations } from './organizations'

export const updateTypes = ['comment', 'change_description', 'assignee', 'delete_comment', 'change_comment', 'status', 'priority'] as const

export const statusTypes = ['backlog', 'pending', 'accepted', 'in_progress', 'paused', 'done', 'cancelled'] as const

export const priorityTypes = ['urgent', 'high', 'medium', 'low'] as const

export const tickets = createTable(
    'ticket',
    {
        id: columnId,

        title: varchar('title', { length: 512 }).notNull(),
        description: json('description').notNull(),

        version,

        status: varchar('status', { length: 32, enum: statusTypes }).notNull(),

        priority: varchar('priority', {
            length: 32,
            enum: priorityTypes,
        }),

        channelId: varchar('channel_id', { length: 22 })
            .notNull()
            .references(() => channels.id),

        createdByUserId: varchar('created_by_user_id', {
            length: 22,
        }).references(() => users.id),

        assignedToUserId: varchar('assigned_to_user_id', {
            length: 22,
        }).references(() => users.id),

        reviewerUserId: varchar('reviewer_user_id', {
            length: 22,
        }).references(() => users.id),

        organizationId: text('organization_id').references(() => organizations.id),

        createdAt,
        updatedAt,
    },
    (t) => ({
        organizationIdIndex: index().on(t.organizationId),
    }),
)

export const ticketsRelations = relations(tickets, ({ one }) => ({
    organization: one(organizations, {
        fields: [tickets.organizationId],
        references: [organizations.id],
    }),
    channel: one(channels, {
        fields: [tickets.channelId],
        references: [channels.id],
    }),
    createdByUser: one(users, {
        fields: [tickets.createdByUserId],
        references: [users.id],
    }),
    assignedToUser: one(users, {
        fields: [tickets.assignedToUserId],
        references: [users.id],
    }),
    reviewerUser: one(users, {
        fields: [tickets.reviewerUserId],
        references: [users.id],
    }),
}))
