import type { ComponentProps, ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function Section(props: ComponentProps<'section'> & { actions?: ReactNode }) {
    return (
        <section {...props} className={cn('relative mb-4 last:mb-0 flex flex-col gap-2', props.className)}>
            {props.actions && (
                <div className='flex gap-2 items-center absolute top-0 right-0'>
                    {props.title && <h2 className='text-lg font-semibold'>{props.title}</h2>}
                    {props.actions}
                </div>
            )}
            {props.children}
        </section>
    )
}
