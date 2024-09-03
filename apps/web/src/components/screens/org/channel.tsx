import { api } from 'api/react'
import { useString } from 'i18n/react'
import { Link } from 'react-router-dom'
import Center from '~/components/scaffolding/center'
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
                <Link
                    to={`/orgs/${orgSlug}/c/${channelSlug}/t/${ticket.code}`}
                    key={ticket.id}
                    className='flex items-center h-10 pl-6 border-b hover:bg-primary/5 text-sm'
                >
                    <span className='w-12'>{ticket.code}</span> {ticket.title}
                </Link>
            ))}
        </>
    )
}
