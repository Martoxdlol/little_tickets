import { relations } from 'drizzle-orm'
import { boolean, index, text } from 'drizzle-orm/pg-core'
import { columnId, createTable } from './lib'
import { organizations } from './organizations'

export const channels = createTable(
    'channels',
    {
        id: columnId,

        slug: text('slug').notNull().unique(),
        name: text('name').notNull(),

        public: boolean('public').notNull().default(false),
        allowListAll: boolean('allow_list_all').notNull().default(false),

        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id),
    },
    (t) => ({
        organizationIdIndex: index().on(t.organizationId),
    }),
)

export const channelRelations = relations(channels, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [channels.organizationId],
        references: [organizations.id],
    }),
    // tickets: many(tickets),
    // members: many(channelMembers),
}))
