import { createContext, useContext, useLayoutEffect } from 'react'
import { useLocalStorage } from 'shared-utils/hooks'

export type Theme = 'light' | 'dark' | 'system'

const themeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'system', setTheme: () => {} })

export function ThemeProvider(props: { children: React.ReactNode }) {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

    useLayoutEffect(() => {
        if (theme === 'system') {
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
            document.querySelector('html')!.classList.toggle('dark', dark)
        } else {
            document.querySelector('html')!.classList.toggle('dark', theme === 'dark')
        }
    }, [theme])

    return (
        <themeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {props.children}
        </themeContext.Provider>
    )
}

export function useTheme() {
    return useContext(themeContext)
}
