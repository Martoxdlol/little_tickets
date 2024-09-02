import { customAlphabet } from 'nanoid'

const customNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 20)

export function createId(size?: number) {
    return customNanoId(size)
}
