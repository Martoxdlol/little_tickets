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

        defaultAllowCreateNew: boolean('default_allow_create_new'),
        defaultAllowViewAll: boolean('default_allow_view_all'),
        defaultAllowCommentOnAll: boolean('default_allow_comment_on_all'),
        defaultAllowManageAll: boolean('default_allow_manage_all'),
        defaultAllowManageAssignedSelf: boolean('default_allow_manage_assigned_self'),
        defaultAllowFullAdmin: boolean('default_allow_full_admin').default(false).notNull(),

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
