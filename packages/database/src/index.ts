import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { type PostgresJsQueryResultHKT, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export { schema }

export const conn = postgres(process.env.DATABASE_URL!)

export const db = drizzle(conn, { schema })

export type Database = typeof db

export type DatabaseTransaction = PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>

export type DBTX = Database | DatabaseTransaction
