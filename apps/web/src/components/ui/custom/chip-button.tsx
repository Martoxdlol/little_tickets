import { type ComponentProps, forwardRef } from 'react'
import { cn } from '~/lib/utils'
import type { Button } from '../button'

export const ChipButton = forwardRef<HTMLButtonElement, ComponentProps<typeof Button> & { icon?: JSX.Element }>((props, ref) => {
    return (
        <button
            {...props}
            className={cn(
                'gap-2 text-xs h-6 px-2 [&>svg]:size-3.5 rounded-md shadow-sm bg-secondary border border-primary/5',
                props.className,
            )}
            ref={ref}
        >
            {props.icon}
            {props.children}
        </button>
    )
})
