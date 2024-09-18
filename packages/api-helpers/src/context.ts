import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { type Database, db } from 'database'

export type Context = {
    sessionId: string | null
    db: Database
}

export type CreateContextOptions = {
    sessionId: string | null
}

export async function createContext(opts: CreateContextOptions, _: FetchCreateContextFnOptions): Promise<Context> {
    return {
        sessionId: opts.sessionId,
        db,
    }
}
