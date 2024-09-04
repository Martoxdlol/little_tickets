import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export default function PageContainer({ ...props }: ComponentProps<'div'> & { twoColumn?: boolean; centered?: boolean }) {
    return <main {...props} className={cn('absolute bottom-0 left-0 right-0 top-0 overflow-y-auto', props.className)} />
}
