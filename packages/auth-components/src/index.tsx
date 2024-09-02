import { api } from 'api/react'
import type { Session } from 'auth-helpers/models'
import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from 'shared-utils/hooks'

export type AuthContext = {
    session: Session | null
    isPending: boolean
    isError: boolean
    isUpdating: boolean
}

export type AuthProviderProps = {
    children: React.ReactNode
}

const authContext = createContext<AuthContext>({
    session: null,
    isError: false,
    isPending: false,
    isUpdating: false,
})

export function AuthProvider(props: AuthProviderProps) {
    const [savedSession, setSavedSession] = useLocalStorage<Session | null>('session', null)

    const query = api.auth.currentUser.useQuery(undefined, {
        refetchInterval: 1000 * 60 * 5,
    })

    const showLoading = !savedSession && query.isPending

    useEffect(() => {
        if (query.isFetched && query.data) {
            setSavedSession({
                user: query.data,
            })
        } else if (query.isFetched && !query.data) {
            setSavedSession(null)
        }
    }, [query.data, query.isFetched, setSavedSession])

    return (
        <authContext.Provider
            value={{
                session: savedSession,
                isPending: showLoading,
                isUpdating: query.isLoading,
                isError: query.isPending && query.isError,
            }}
        >
            {props.children}
        </authContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(authContext)
}

export function useSession() {
    return useAuthContext().session
}

export function useUser() {
    return useSession()?.user
}
