import { api } from 'api/react'
import { useString } from 'i18n/react'
import { CircleDashedIcon, CircleDotDashedIcon, HomeIcon, PlusIcon, SquarePenIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useOrgSlug } from '~/hooks'
import { NewChannelDialog } from '../channels/new-channel-dialog'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { SmallIconButton } from '../ui/custom/icon-button'
import { LinkMenuItem, Menu, MenuItem, MenuItemSkeleton } from '../ui/custom/menu'
import { OrganizationSwitcher } from './switcher'

export function OrganizationMenu() {
    const orgSlug = useOrgSlug()!

    const channels = api.channels.list.useQuery({ organizationSlug: orgSlug })

    const channelSlug = useParams().channel

    const homeStr = useString('home')

    const { data: org } = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    const newChannel = useString('newChannel')

    return (
        <Menu>
            <div className='sticky top-0 z-10 mb-2 flex items-center gap-2 bg-background'>
                <div className='flex-grow'>
                    <OrganizationSwitcher />
                </div>
                <NewTicketModal>
                    <SmallIconButton icon={<SquarePenIcon />} variant='outline' size='icon' />
                </NewTicketModal>
            </div>
            <LinkMenuItem icon={channelSlug === undefined ? <CircleDotDashedIcon /> : <HomeIcon />} to={`/orgs/${orgSlug}`}>
                {homeStr}
            </LinkMenuItem>
            {channels.data?.map((channel) => (
                <LinkMenuItem
                    key={channel.id}
                    to={`/orgs/${orgSlug}/c/${channel.slug}`}
                    icon={channel.slug === channelSlug ? <CircleDotDashedIcon /> : <CircleDashedIcon />}
                >
                    {channel.name}
                </LinkMenuItem>
            ))}
            {channels.isPending && (
                <>
                    <MenuItemSkeleton />
                    <MenuItemSkeleton />
                    <MenuItemSkeleton />
                </>
            )}
            {org?.role !== 'admin' && (
                <NewChannelDialog>
                    <MenuItem icon={<PlusIcon />}>{newChannel}</MenuItem>
                </NewChannelDialog>
            )}
        </Menu>
    )
}
