import { type Database, schema } from 'database'
import { eq } from 'drizzle-orm'
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from 'lucia'

export class LuciaAuthAdapter implements Adapter {
    database: Database

    constructor(database: Database) {
        this.database = database
    }

    async getSessionAndUser(sessionId: string): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const session = await this.database.query.sessions.findFirst({
            where: eq(schema.sessions.id, sessionId),
            with: {
                user: true,
            },
        })

        if (!session) {
            return [null, null]
        }

        const s: DatabaseSession = {
            attributes: {},
            expiresAt: session.expiresAt,
            id: session.id,
            userId: session.userId,
        }

        const u: DatabaseUser = {
            attributes: {
                name: session.user.name,
                githubId: session.user.githubId,
                locale: session.user.locale,
                onboardingCompleted: !!session.user.onboardingCompletedAt,
                picture: session.user.picture,
                email: session.user.email,
                emailVerified: !!session.user.emailVerifiedAt,
            },
            id: session.user.id,
        }

        return [s, u]
    }

    async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
        const sessions = await this.database.query.sessions.findMany({
            where: eq(schema.sessions.userId, userId),
        })

        return sessions.map((session) => ({
            expiresAt: session.expiresAt,
            id: session.id,
            userId: session.userId,
            attributes: {},
        }))
    }

    async setSession(session: DatabaseSession): Promise<void> {
        await this.database
            .insert(schema.sessions)
            .values({
                expiresAt: session.expiresAt,
                userId: session.userId,
                id: session.id,
            })
            .onConflictDoUpdate({
                target: [schema.sessions.id],
                set: {
                    expiresAt: session.expiresAt,
                },
            })
    }

    async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
        await this.database
            .update(schema.sessions)
            .set({
                expiresAt,
            })
            .where(eq(schema.sessions.id, sessionId))
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.database.delete(schema.sessions).where(eq(schema.sessions.id, sessionId))
    }

    async deleteUserSessions(userId: UserId): Promise<void> {
        await this.database.delete(schema.sessions).where(eq(schema.sessions.userId, userId))
    }

    async deleteExpiredSessions(): Promise<void> {
        await this.database.delete(schema.sessions).where(eq(schema.sessions.expiresAt, new Date()))
    }
}
