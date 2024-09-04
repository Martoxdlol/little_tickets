import { type ComponentProps, forwardRef } from 'react'
import { cn } from '~/lib/utils'
import { Button } from '../button'

export const IconButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button> & { icon: JSX.Element }>((props, ref) => {
    return (
        <Button {...props} className={cn('gap-2 [&>svg]:size-4', props.className)} ref={ref}>
            {props.icon}
            {props.children}
        </Button>
    )
})

export const SmallIconButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button> & { icon: JSX.Element }>((props, ref) => {
    return (
        <Button {...props} className={cn('gap-2 text-xs h-7 pl-2 pr-3.5 [&>svg]:size-3.5 rounded-sm', props.className)} ref={ref}>
            {props.icon}
            {props.children}
        </Button>
    )
})
