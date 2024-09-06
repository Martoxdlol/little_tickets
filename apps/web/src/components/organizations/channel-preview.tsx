import { type RouterOutputs, api } from 'api/react'
import { useString } from 'i18n/react'
import { Link } from 'react-router-dom'
import Center from '~/components/scaffolding/center'
import { Section } from '~/components/scaffolding/section'
import { Title } from '~/components/ui/custom/title'
import { TicketRowSkeleton } from '../skeletons/ticket-row-skeleton'
import { TicketRow } from '../tickets/ticket-row'

export function ChannelPreviewSection(props: { channel: RouterOutputs['channels']['list'][number]; orgSlug: string }) {
    const noTickets = useString('noTickets')

    const { data: tickets, isPending } = api.tickets.listPreview.useQuery({
        channelSlug: props.channel.slug,
        organizationSlug: props.orgSlug,
    })

    return (
        <Section key={props.channel.id}>
            <Link to={`/orgs/${props.orgSlug}/c/${props.channel.slug}`} className='block hover:underline'>
                <Title>{props.channel.name}</Title>
            </Link>

            {tickets?.length !== 0 && (
                <div className='relative rounded-md border overflow-hidden last:[&>*]:border-none'>
                    {isPending && (
                        <>
                            <TicketRowSkeleton />
                            <TicketRowSkeleton />
                            <TicketRowSkeleton />
                            <TicketRowSkeleton />
                            <TicketRowSkeleton />
                            <TicketRowSkeleton />
                        </>
                    )}
                    {tickets?.map((ticket) => (
                        <TicketRow key={ticket.id} ticket={ticket} orgSlug={props.orgSlug} channelSlug={props.channel.slug} />
                    ))}
                </div>
            )}

            {tickets?.length === 0 && (
                <div className='relative h-24 rounded-md border border-dashed border-black/25 dark:border-white/25'>
                    <Center className='text-xs opacity-secondary'>{noTickets}</Center>
                </div>
            )}
        </Section>
    )
}
