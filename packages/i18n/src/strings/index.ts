import { appStringsEnglish } from './app-en'
import { appStringsSpanish } from './app-es'

export type AppStringsKeys = keyof typeof appStringsEnglish

export const allAppStrings = {
    en: appStringsEnglish,
    es: appStringsSpanish,
}

export type LangKeys = keyof typeof allAppStrings

export const supportedLangs = Object.keys(allAppStrings)

export function getLang(locale: string) {
    const lang = locale.trim().substring(0, 2).toLowerCase()

    if (!langIsSupported(lang)) {
        return 'en'
    }

    return lang
}

export function getString(key: AppStringsKeys, locale: string) {
    const lang = getLang(locale)

    return allAppStrings[lang][key] ?? allAppStrings.en[key]!
}

export function langIsSupported(lang: string): lang is LangKeys {
    return supportedLangs.includes(lang)
}
