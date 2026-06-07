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

export type StringParams = Record<string, string | number>

export function getString(key: AppStringsKeys, locale: string, params?: StringParams) {
    const lang = getLang(locale)

    const template = allAppStrings[lang][key] ?? allAppStrings.en[key]!

    if (!params) {
        return template
    }

    return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}

export function langIsSupported(lang: string): lang is LangKeys {
    return supportedLangs.includes(lang)
}
