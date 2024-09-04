'use client'

import { useSession } from 'auth-components'
import { useString } from 'i18n/react'
import { LanguagesIcon, LogOut, MoonIcon, SunIcon } from 'lucide-react'
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
                                    Light
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='dark' className='flex items-center gap-2'>
                                    Dark
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='system' className='flex items-center gap-2'>
                                    System
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <LanguagesIcon className='mr-2 size-4' />
                        <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup>
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
