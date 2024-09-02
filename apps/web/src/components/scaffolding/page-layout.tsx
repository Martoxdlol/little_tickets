import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export default function PageLayout({
    twoColumn = false,
    centered = false,
    ...props
}: ComponentProps<'div'> & { twoColumn?: boolean; centered?: boolean }) {
    return (
        <div
            {...props}
            className={cn(
                'gap-4 p-3 sm:p-4',
                {
                    'flex flex-col': !twoColumn,
                    'grid grid-cols-1 md:grid-cols-2': twoColumn,
                    'sm:mx-auto sm:w-full sm:max-w-[90%] lg:max-w-[80%] xl:max-w-[75%]':
                        centered,
                },
                props.className,
            )}
        />
    )
}
