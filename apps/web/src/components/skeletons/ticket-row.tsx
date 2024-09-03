import type { RouterOutputs } from 'api/react'
import { Link } from 'react-router-dom'

export function TicketRow(props: {
    orgSlug: string
    channelSlug: string
    ticket: NonNullable<RouterOutputs['tickets']['list']>[number]
}) {
    return (
        <Link
            to={`/orgs/${props.orgSlug}/c/${props.channelSlug}/t/${props.ticket.code}`}
            key={props.ticket.id}
            className='flex items-center h-10 pl-6 border-b hover:bg-primary/5 text-sm'
        >
            <span className='w-12'>{props.ticket.code}</span> {props.ticket.title}
        </Link>
    )
}
