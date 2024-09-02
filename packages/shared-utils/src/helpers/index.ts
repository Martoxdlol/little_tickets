const init: Record<string, string> = { cache: 'no-cache', mode: 'no-cors' }

export const fetcher = <T>(url: string): Promise<T> => fetch(url, init).then((res) => res.json() as T)
