import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '~/lib/utils'

export function Menu(props: ComponentProps<'ul'>) {
    return (
        <ul className={cn('p-1 flex flex-col [&>*]:shrink-0 gap-1', props.className)} {...props}>
            {props.children}
        </ul>
    )
}

const iconClasses = 'absolute left-3 [&>svg]:size-4'
const buttonClasses = 'rounded-lg relative flex items-center justify-start pl-9 h-8 text-sm'
const colorClasses = 'hover:bg-secondary'

export function MenuButton({ icon, className, ...props }: ComponentProps<'button'> & { icon?: React.ReactNode }) {
    return (
        <button {...props} className={cn(buttonClasses, colorClasses, className)}>
            {icon && <div className={iconClasses}>{icon}</div>}
            {props.children}
        </button>
    )
}

export function MenuLink({ icon, className, ...props }: ComponentProps<typeof Link> & { icon?: React.ReactNode }) {
    return (
        <Link {...props} className={cn(buttonClasses, colorClasses, className)}>
            {icon && <div className={iconClasses}>{icon}</div>}
            {props.children}
        </Link>
    )
}

export function MenuItem(props: ComponentProps<typeof MenuButton>) {
    return (
        <li>
            <MenuButton {...props} className={cn('w-full')}>
                {props.children}
            </MenuButton>
        </li>
    )
}

export function LinkMenuItem(props: ComponentProps<typeof MenuLink>) {
    return (
        <li>
            <MenuLink {...props} className={cn('w-full')}>
                {props.children}
            </MenuLink>
        </li>
    )
}
