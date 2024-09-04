import { relations } from 'drizzle-orm'
import { boolean, varchar } from 'drizzle-orm/pg-core'
import { channelMembers } from './channel-members'
import { channels } from './channels'
import { columnId, createTable } from './lib'
import { organizationMembers } from './organization-members'

export const organizations = createTable('organization', {
    id: columnId,

    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 56 }).notNull().unique(),

    defaultChannelAllowCreateNew: boolean('default_channel_allow_create_new').default(true).notNull(),
    defaultChannelAllowViewAll: boolean('default_channel_allow_view_all').default(false).notNull(),
    defaultChannelAllowCommentOnAll: boolean('default_channel_allow_comment_on_all').default(false).notNull(),
    defaultChannelAllowCommentCreatedSelf: boolean('default_channel_allow_comment_created_self').default(false).notNull(),
    defaultChannelAllowCommentAssignedSelf: boolean('default_channel_allow_comment_assigned_self').default(false).notNull(),
    defaultChannelAllowManageAll: boolean('default_channel_allow_manage_all').default(false).notNull(),
    defaultChannelAllowManageAssignedSelf: boolean('default_channel_allow_manage_assigned_self').default(false).notNull(),
    defaultChannelAllowManageCreatedSelf: boolean('default_channel_allow_manage_created_self').default(false).notNull(),
    defaultChannelAllowFullAdmin: boolean('default_channel_allow_full_admin').default(false).notNull(),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
    channels: many(channels),
    channelMembers: many(channelMembers),
    members: many(organizationMembers),
}))
