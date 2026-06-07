import { api } from 'api/react'
import { useString } from 'i18n/react'
import { ChannelPreviewSection } from '~/components/organizations/channel-preview'
import Center from '~/components/scaffolding/center'
import { useOrgSlug } from '~/hooks'

export function OrgHome() {
    const organization = useOrgSlug()!
    const noChannelsStr = useString('noChannels')
    const useSidebarStr = useString('useSidebarToCreateChannel')

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
                        <p>{noChannelsStr}</p>
                        <p>{useSidebarStr}</p>
                    </div>
                </Center>
            )}
        </>
    )
}
