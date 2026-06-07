'use client'

import { useSession } from 'auth-components'
import { useLang, useSetLang, useString } from 'i18n/react'
import type { LangKeys } from 'i18n/strings'
import { LanguagesIcon, LogOut, MailIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { UserAvatar } from '../auth/user-avatar'
import { type Theme, useTheme } from '../themes/theme-provider'

export function CurrentUserAvatar() {
    const session = useSession()

    return (
        <UserDropDown>
            <UserAvatar name={session?.user.name} picture={session?.user.picture} />
        </UserDropDown>
    )
}

export function UserDropDown(props: { children: React.ReactNode }) {
    const myAccountString = useString('myAccount')
    const logoutString = useString('logout')
    const { setTheme, theme } = useTheme()

    const themeStr = useString('theme')
    const lightStr = useString('themeLight')
    const darkStr = useString('themeDark')
    const systemStr = useString('themeSystem')
    const languageStr = useString('language')
    const invitationsStr = useString('invitationsTitle')
    const lang = useLang()
    const setLang = useSetLang()
    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{props.children}</DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>{myAccountString}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <MoonIcon className='dark:block hidden mr-2 h-4 w-4' />
                        <SunIcon className='dark:hidden mr-2 h-4 w-4' />
                        <span>{themeStr}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={theme} onValueChange={(theme) => setTheme(theme as Theme)}>
                                <DropdownMenuRadioItem value='light' className='flex items-center gap-2'>
                                    {lightStr}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='dark' className='flex items-center gap-2'>
                                    {darkStr}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='system' className='flex items-center gap-2'>
                                    {systemStr}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <LanguagesIcon className='mr-2 size-4' />
                        <span>{languageStr}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={lang} onValueChange={(value) => setLang(value as LangKeys)}>
                                <DropdownMenuRadioItem value='en' className='flex items-center gap-2'>
                                    English
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='es' className='flex items-center gap-2'>
                                    Español
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/invitations')}>
                    <MailIcon className='mr-2 h-4 w-4' />
                    <span>{invitationsStr}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        window.location.href = '/api/auth/logout'
                    }}
                >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>{logoutString}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
