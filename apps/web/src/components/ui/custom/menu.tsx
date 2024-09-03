import { type ComponentProps, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '~/lib/utils'
import { Skeleton } from '../skeleton'

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

export const MenuItem = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { icon?: React.ReactNode }>(
    ({ icon, className, ...props }, ref) => (
        <button {...props} className={cn(buttonClasses, colorClasses, className)} ref={ref}>
            {icon && <div className={iconClasses}>{icon}</div>}
            {props.children}
        </button>
    ),
)

export function MenuLink({ icon, className, ...props }: ComponentProps<typeof Link> & { icon?: React.ReactNode }) {
    return (
        <Link {...props} className={cn(buttonClasses, colorClasses, className)}>
            {icon && <div className={iconClasses}>{icon}</div>}
            {props.children}
        </Link>
    )
}

export const ChipButton = forwardRef<HTMLButtonElement, ComponentProps<typeof MenuItem>>((props, ref) => (
    <li>
        <MenuItem {...props} className={cn('w-full')} ref={ref}>
            {props.children}
        </MenuItem>
    </li>
))

export function LinkMenuItem(props: ComponentProps<typeof MenuLink>) {
    return (
        <li>
            <MenuLink {...props} className={cn('w-full')}>
                {props.children}
            </MenuLink>
        </li>
    )
}

export function MenuItemSkeleton() {
    return (
        <div className='h-7 flex items-center pl-3'>
            <Skeleton className='w-40 h-4 rounded-full' />
        </div>
    )
}
