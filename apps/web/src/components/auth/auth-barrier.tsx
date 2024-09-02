import { useAuthContext } from 'auth-components'
import { LoginScreen } from '../screens/login'
import { AuthLoadingScreen } from './auth-loading-screen'

export type AuthBarrierProps = {
    children: React.ReactNode
}

export function AuthBarrier(props: AuthBarrierProps) {
    const context = useAuthContext()

    if (context.isPending) {
        return <AuthLoadingScreen />
    }

    if (!context.session) {
        return <LoginScreen />
    }

    return <>{props.children}</>
}
