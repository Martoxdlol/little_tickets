import { publicProcedure, router } from 'api-helpers'
import { lucia } from '../services'

export const auth = router({
    currentUser: publicProcedure.query(async ({ ctx }) => {
        if (!ctx.sessionId) {
            return null
        }

        const { user } = await lucia.validateSession(ctx.sessionId)

        if (!user) {
            return null
        }

        return {
            name: user.name,
            id: user.id,
            picture: user.picture,
            locale: user.locale,
        }
    }),
})
