import { cn } from '~/lib/utils'

export function Placeholder(props: { children: React.ReactNode; className?: string }) {
    return <p className={cn('pointer-events-none absolute left-0 top-0 opacity-30', props.className)}>{props.children}</p>
}
