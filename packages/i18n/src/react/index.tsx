import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { type AppStringsKeys, type LangKeys, type StringParams, getLang, getString, langIsSupported } from '../strings'

// Persisted, explicit user choice. Takes precedence over the session/browser locale.
const STORAGE_KEY = 'lang'

function readStoredLang(): LangKeys | null {
    if (typeof localStorage === 'undefined') {
        return null
    }

    const stored = localStorage.getItem(STORAGE_KEY)

    return stored && langIsSupported(stored) ? stored : null
}

const langContext = createContext<LangKeys>(getLang(navigator.language))
const setLangContext = createContext<(lang: LangKeys) => void>(() => {})

export function LangProvider(props: { children: React.ReactNode; locale?: string | null }) {
    const [override, setOverride] = useState<LangKeys | null>(readStoredLang)

    // An explicit choice wins; otherwise fall back to the session/browser locale.
    const lang = override ?? getLang(props.locale || navigator.language)

    useLayoutEffect(() => {
        document.querySelector('html')?.setAttribute('lang', lang)
    }, [lang])

    const setLang = useCallback((next: LangKeys) => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, next)
        }
        setOverride(next)
    }, [])

    return (
        <setLangContext.Provider value={setLang}>
            <langContext.Provider value={lang}>{props.children}</langContext.Provider>
        </setLangContext.Provider>
    )
}

export function useString(key: AppStringsKeys, params?: StringParams) {
    const lang = useContext(langContext)

    return getString(key, lang, params)
}

export function useLang() {
    return useContext(langContext)
}

export function useSetLang() {
    return useContext(setLangContext)
}
