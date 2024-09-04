import { relations } from 'drizzle-orm'
import { json, text, varchar } from 'drizzle-orm/pg-core'
import { organizations, tickets, users } from '.'
import { columnId, createTable, createdAt, updatedAt } from './lib'

export const comments = createTable('comment', {
    id: columnId,

    content: json('content').notNull(),

    ticketId: text('ticket_id')
        .notNull()
        .references(() => tickets.id),

    createdByUserId: varchar('created_by_user_id', {
        length: 22,
    })
        .notNull()
        .references(() => users.id),

    organizationId: text('organization_id')
        .notNull()
        .references(() => organizations.id),

    createdAt,
    updatedAt,
})

export const commentsRelations = relations(comments, ({ one }) => ({
    ticket: one(tickets, { fields: [comments.ticketId], references: [tickets.id] }),
    user: one(users, { fields: [comments.createdByUserId], references: [users.id] }),
}))
