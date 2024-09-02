export type User = {
    id: string
    name: string
    picture: string | null
    locale: string | null
}

export type Session = {
    user: User
}

export interface GitHubUser {
    id: number
    login: string
    avatar_url: string
    email: string | null
}

export interface GoogleUser {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
}

export interface MicrosoftUser {
    sub: string
    name: string
    family_name: string
    given_name: string
    picture?: string | null
    email: string
}
