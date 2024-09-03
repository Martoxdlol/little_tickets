import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Title(props: ComponentProps<'h1'>) {
    return <h2 {...props} className={cn('text-lg', props.className)} />
}

export function TitleH1(props: ComponentProps<'h1'>) {
    return <h1 {...props} className={cn('text-lg', props.className)} />
}
