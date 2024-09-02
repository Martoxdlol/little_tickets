import { cn } from '~/lib/utils'

export default function Appbar(props: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <nav
            className={cn(
                'flex h-[46px] w-full items-center gap-2 px-2',
                props.className,
            )}
        >
            {props.children}
        </nav>
    )
}
