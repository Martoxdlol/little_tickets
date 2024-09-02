import { type ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Section(props: ComponentProps<'section'>) {
    return (
        <section
            {...props}
            className={cn(
                'mb-4 last:mb-0 flex flex-col gap-2',
                props.className,
            )}
        />
    )
}
