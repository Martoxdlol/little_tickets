import { z } from 'zod'
const init: Record<string, string> = { cache: 'no-cache', mode: 'no-cors' }

export const fetcher = <T>(url: string): Promise<T> => fetch(url, init).then((res) => res.json() as T)

export const slugSchema = z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .min(4)
    .max(56)

export const smallSlugSchema = z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    .min(1)
    .max(56)

export function nameToSlug(name: string) {
    // 1. lowercase
    // 2. Replace spaces with hyphens (-)
    // 3. Remove any non-alphanumeric characters
    // 4. Remove any double hyphens
    // 5. Remove any leading or trailing hyphens
    return name
        .toLowerCase()
        .substring(0, 56)
        .trim()
        .replaceAll(' ', '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '')
}
