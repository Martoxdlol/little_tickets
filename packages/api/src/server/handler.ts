import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type CreateContextOptions, createContext } from 'api-helpers'
import { env } from 'env-helpers'
import { appRouter } from './root'

export function handler(request: Request, opts: CreateContextOptions): Promise<Response> {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: request,
        router: appRouter,
        createContext: (x) => createContext(opts, x),
        onError:
            env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
                  }
                : undefined,
    })
}
