import { relations } from 'drizzle-orm'
import { index, integer, json, text, unique, varchar } from 'drizzle-orm/pg-core'
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

        code: integer('code').notNull(),

        title: varchar('title', { length: 512 }).notNull(),
        description: json('description').notNull(),
        descriptionText: text('description_text').notNull(),

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
        })
            .notNull()
            .references(() => users.id),

        assignedToUserId: varchar('assigned_to_user_id', {
            length: 22,
        }).references(() => users.id),

        reviewerUserId: varchar('reviewer_user_id', {
            length: 22,
        }).references(() => users.id),

        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id),

        createdAt,
        updatedAt,
    },
    (t) => ({
        uniqueCode: unique().on(t.code, t.channelId),
        organizationIdIndex: index().on(t.organizationId),
        channelIdIndex: index().on(t.channelId),
        createdAtIndex: index().on(t.createdAt),
        updatedAtIndex: index().on(t.updatedAt),
        statusIndex: index().on(t.status),
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
