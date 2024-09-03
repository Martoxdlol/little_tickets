import { api } from 'api/react'
import { useString } from 'i18n/react'
import { Link } from 'react-router-dom'
import Center from '~/components/scaffolding/center'
import { Section } from '~/components/scaffolding/section'
import { Title } from '~/components/ui/custom/title'
import { useOrgSlug } from '~/hooks'

export function OrgHome() {
    const organization = useOrgSlug()!

    const { data: channels } = api.channels.list.useQuery({
        organizationSlug: organization,
    })

    const noTickets = useString('noTickets')

    return (
        <>
            {channels?.map((channel) => (
                <Section key={channel.id}>
                    <Link to={`/orgs/${organization}/c/${channel.slug}`} className='block hover:underline'>
                        <Title>{channel.name}</Title>
                    </Link>
                    <div className='relative h-24 rounded-md border border-dashed border-black/25 dark:border-white/25'>
                        <Center className='text-xs opacity-secondary'>{noTickets}</Center>
                    </div>
                </Section>
            ))}
        </>
    )
}
