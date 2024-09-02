// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from 'drizzle-orm'
import { integer, pgTableCreator, text, timestamp } from 'drizzle-orm/pg-core'
import { env } from 'env-helpers'
import { createId } from '../utils'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${env.DATABASE_TABLES_PREFIX}_${name}`)

export const updatedAt = timestamp('updated_at', {
    withTimezone: true,
}).$onUpdate(() => new Date())

export const createdAt = timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull()

export const columnId = text('id')
    .primaryKey()
    .$defaultFn(() => createId())

export const version = integer('version').notNull().default(1)

export function date(name: string) {
    return timestamp(name, {
        mode: 'date',
        withTimezone: true,
    })
}
