import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export default function Center(props: ComponentProps<'div'>) {
    return (
        <div {...props} className={cn('flex h-full w-full items-center justify-center', props.className)}>
            {props.children}
        </div>
    )
}
