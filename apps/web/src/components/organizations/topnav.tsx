import { api } from 'api/react'
import { ChevronRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChannelSlug, useOrgSlug, useTicketCode } from '~/hooks'
import Appbar from '../scaffolding/appbar'
import { MobileSidenav } from '../scaffolding/mobile-sidenav'
import { UserAvatar } from '../topnav/user-dropdown'
import { ChipButton } from '../ui/custom/chip-button'
import { OrganizationMenu } from './menu'

export function OrganizationTopnav() {
    const orgSlug = useOrgSlug()!
    const channelSlug = useChannelSlug()
    const ticketCode = useTicketCode()

    const channel = api.channels.get.useQuery(
        {
            organizationSlug: orgSlug,
            channelSlug: channelSlug!,
        },
        { enabled: !!channelSlug },
    )

    return (
        <Appbar className='pl-1'>
            <MobileSidenav>
                <OrganizationMenu />
            </MobileSidenav>
            <div className='flex-grow flex items-center gap-2'>
                {channel.data && (
                    <Link to={`/orgs/${orgSlug}/c/${channelSlug}`} className='block m-0 p-0'>
                        <ChipButton>{channel.data.name}</ChipButton>
                    </Link>
                )}
                {channel.data && ticketCode && <ChevronRightIcon size={14} />}
                {ticketCode && (
                    <Link to={`/orgs/${orgSlug}/c/${channelSlug}/t/${ticketCode}`} className='block m-0 p-0'>
                        <ChipButton>{ticketCode}</ChipButton>
                    </Link>
                )}
            </div>
            <UserAvatar />
        </Appbar>
    )
}
