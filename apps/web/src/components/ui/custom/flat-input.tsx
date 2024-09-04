import { type ComponentProps, forwardRef } from 'react'
import { cn } from '~/lib/utils'

export const FlatInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>((props, ref) => {
    return (
        <input
            {...props}
            className={cn('bg-transparent p-0 outline-none placeholder:text-primary/30 w-full focus:ring rounded-md', props.className)}
        />
    )
})
