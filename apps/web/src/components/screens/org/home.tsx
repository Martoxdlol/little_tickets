import { api } from 'api/react'
import { ChannelPreviewSection } from '~/components/organizations/channel-preview'
import Center from '~/components/scaffolding/center'
import { useOrgSlug } from '~/hooks'

export function OrgHome() {
    const organization = useOrgSlug()!

    const { data: channels } = api.channels.list.useQuery({
        organizationSlug: organization,
    })

    return (
        <>
            {channels?.map((channel) => (
                <ChannelPreviewSection key={channel.id} channel={channel} orgSlug={organization} />
            ))}

            {channels?.length === 0 && (
                <Center className='h-32'>
                    <div className='text-center'>
                        <p>No channels</p>
                        <p>Use the side bar to create a new channel</p>
                    </div>
                </Center>
            )}
        </>
    )
}
