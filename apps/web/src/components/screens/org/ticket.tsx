import { api } from 'api/react'
import { Loader2Icon } from 'lucide-react'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { Section } from '~/components/scaffolding/section'
import { Title } from '~/components/ui/custom/title'
import { useChannelSlug, useOrgSlug, useTicketCode } from '~/hooks'

export function TicketScreen() {
    const orgId = useOrgSlug()!
    const channelSlug = useChannelSlug()!
    const ticketCode = useTicketCode()!

    const query = api.tickets.get.useQuery({
        organizationSlug: orgId,
        channelSlug: channelSlug,
        code: Number.parseInt(ticketCode),
    })

    if (query.isPending) {
        return (
            <Center>
                <Loader2Icon size={32} className='animate-spin' />
            </Center>
        )
    }

    if (!query.isSuccess && query.data === null) {
        return (
            <Center>
                <p className='opacity-secondary'>Ticket not found</p>
            </Center>
        )
    }

    if (query.isError) {
        return (
            <Center>
                <p className='opacity-secondary'>{query.error.message}</p>
            </Center>
        )
    }

    return (
        <PageLayout>
            <Section>
                <Title>Ticket</Title>
            </Section>
        </PageLayout>
    )
}
