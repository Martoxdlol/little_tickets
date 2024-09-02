import { relations } from 'drizzle-orm'
import { index, integer, text, varchar } from 'drizzle-orm/pg-core'
import { createId } from '../utils'
import { columnId, createTable, createdAt, date, updatedAt } from './lib'

export const users = createTable('user', {
    id: columnId,
    githubUsername: varchar('github_username', { length: 256 }),
    name: varchar('name', { length: 256 }).notNull(),
    picture: varchar('picture', { length: 256 }),
    email: varchar('email', { length: 256 }),
    emailVerifiedAt: date('email_verified_at'),
    githubId: integer('github_id').unique(undefined, {
        nulls: 'distinct',
    }),
    googleId: varchar('google_id', { length: 256 }).unique(undefined, {
        nulls: 'distinct',
    }),
    microsoftId: varchar('microsoft_id', { length: 256 }).unique(undefined, {
        nulls: 'distinct',
    }),
    onboardingCompletedAt: date('onboarding_completed_at'),
    locale: varchar('locale', { length: 5 }).default('en').notNull(),
    createdAt,
    updatedAt,
})

export const sessions = createTable(
    'session',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => createId(64)),
        userId: varchar('user_id', { length: 22 })
            .notNull()
            .references(() => users.id),
        expiresAt: date('expires_at').notNull(),
    },
    (t) => ({
        userIdIndex: index().on(t.userId),
    }),
)

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))
