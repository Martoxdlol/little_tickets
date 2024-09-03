import { createContext, useContext, useLayoutEffect } from 'react'
import { useLocalStorage } from 'shared-utils/hooks'

export type Theme = 'light' | 'dark' | 'system'

const themeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({ theme: 'system', setTheme: () => {} })

function getUseDarkClass(theme: Theme) {
    if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    return theme === 'dark'
}

export function ThemeProvider(props: { children: React.ReactNode }) {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

    useLayoutEffect(() => {
        if (getUseDarkClass(theme)) {
            document.querySelector('html')!.classList.add('dark')
        } else {
            document.querySelector('html')!.classList.remove('dark')
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
