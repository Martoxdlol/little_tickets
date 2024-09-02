import { ApiProvider } from 'api/react'
import { AuthProvider } from 'auth-components'
import { LangProvider } from 'i18n/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Screen } from '~/components/scaffolding/screen'
import { AuthBarrier } from './components/auth/auth-barrier'
import { router } from './components/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApiProvider>
            <Screen>
                <AuthProvider>
                    <LangProvider>
                        <AuthBarrier>
                            <RouterProvider router={router} />
                        </AuthBarrier>
                    </LangProvider>
                </AuthProvider>
            </Screen>
        </ApiProvider>
    </StrictMode>,
)
