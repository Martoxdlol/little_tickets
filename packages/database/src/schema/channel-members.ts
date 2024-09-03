import { relations } from 'drizzle-orm'
import { boolean, index, text, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { channels } from './channels'
import { columnId, createTable } from './lib'
import { organizations } from './organizations'

export const channelMembers = createTable(
    'channel_member',
    {
        id: columnId,
        userId: text('user_id')
            .notNull()
            .references(() => users.id),

        allowCreateNew: boolean('allow_create_new'),
        allowViewAll: boolean('allow_view_all'),
        allowCommentOnAll: boolean('allow_comment_on_all'),
        allowManageAll: boolean('allow_manage_all'),
        allowManageAssignedSelf: boolean('allow_manage_assigned_self'),
        allowFullAdmin: boolean('allow_full_admin').default(false).notNull(),

        channelId: varchar('allow_channel_id', { length: 22 })
            .notNull()
            .references(() => channels.id),

        organizationId: text('organization_id')
            .notNull()
            .references(() => organizations.id),
    },
    (t) => ({
        userIdIndex: index().on(t.userId),
        organizationIdIndex: index().on(t.organizationId),
    }),
)

export const channelMembersRelations = relations(channelMembers, ({ one }) => ({
    user: one(users, { fields: [channelMembers.userId], references: [users.id] }),
    channel: one(channels, { fields: [channelMembers.channelId], references: [channels.id] }),
    organization: one(organizations, { fields: [channelMembers.organizationId], references: [organizations.id] }),
}))
