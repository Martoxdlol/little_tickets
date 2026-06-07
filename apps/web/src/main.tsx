import { ApiProvider } from 'api/react'
import { AuthProvider, useSession } from 'auth-components'
import { LangProvider } from 'i18n/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Screen } from '~/components/scaffolding/screen'
import { AuthBarrier } from './components/auth/auth-barrier'
import { router } from './components/router'
import { ThemeProvider } from './components/themes/theme-provider'
import './index.css'

function LocalizedLang(props: { children: React.ReactNode }) {
    const session = useSession()

    return <LangProvider locale={session?.user.locale}>{props.children}</LangProvider>
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <ApiProvider>
                <Screen>
                    <AuthProvider>
                        <LocalizedLang>
                            <AuthBarrier>
                                <RouterProvider router={router} />
                            </AuthBarrier>
                        </LocalizedLang>
                    </AuthProvider>
                </Screen>
            </ApiProvider>
        </ThemeProvider>
    </StrictMode>,
)
