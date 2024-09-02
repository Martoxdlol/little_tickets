import { relations } from 'drizzle-orm'
import { varchar } from 'drizzle-orm/pg-core'
import { channels } from './channels'
import { columnId, createTable } from './lib'

export const organizations = createTable('organization', {
    id: columnId,

    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 56 }).notNull().unique(),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
    channels: many(channels),
    // channelMembers: many(channelMembers),
    // members: many(organizationMembers),
}))
