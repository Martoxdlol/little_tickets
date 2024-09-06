import { api } from 'api/react'
import { useString } from 'i18n/react'
import Center from '~/components/scaffolding/center'
import { TicketRow } from '~/components/tickets/ticket-row'
import { useChannelSlug, useOrgSlug } from '~/hooks'

export function ChannelScreen() {
    const nothingHere = useString('nothingHere')

    const orgSlug = useOrgSlug()!
    const channelSlug = useChannelSlug()!

    const query = api.tickets.list.useQuery({
        channelSlug,
        organizationSlug: orgSlug,
    })

    if (query.error?.data?.code === 'NOT_FOUND') {
        return (
            <Center>
                <p className='opacity-secondary'>Channel not found</p>
            </Center>
        )
    }

    if (query.data?.length === 0) {
        return (
            <Center>
                <p className='opacity-secondary'>{nothingHere}</p>
            </Center>
        )
    }

    return (
        <>
            {query.data?.map((ticket) => (
                <TicketRow key={ticket.id} channelSlug={channelSlug} orgSlug={orgSlug} ticket={ticket} />
            ))}
        </>
    )
}
