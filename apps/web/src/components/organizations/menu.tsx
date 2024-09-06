import { api } from 'api/react'
import { useString } from 'i18n/react'
import {
    CircleDashedIcon,
    CircleDotDashedIcon,
    HomeIcon,
    PlusIcon,
    Settings2Icon,
    SettingsIcon,
    SquarePenIcon,
    Users2Icon,
} from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useOrgSlug } from '~/hooks'
import { NewChannelDialog } from '../channels/new-channel-dialog'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { Button } from '../ui/button'
import { LinkMenuItem, Menu, MenuItem, MenuItemSkeleton, MenuSectionTitle } from '../ui/custom/menu'
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
                    <Button variant='outline' size='icon' className='size-7'>
                        <SquarePenIcon size={16} />
                    </Button>
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
            {(org?.role === 'admin' || org?.role === 'owner') && (
                <NewChannelDialog>
                    <MenuItem icon={<PlusIcon />}>{newChannel}</MenuItem>
                </NewChannelDialog>
            )}

            {(org?.role === 'admin' || org?.role === 'owner') && channelSlug && (
                <>
                    <MenuSectionTitle>Channel</MenuSectionTitle>
                    <LinkMenuItem to={`/orgs/${orgSlug}/c/${channelSlug}/manage`} icon={<SettingsIcon />}>
                        Manage
                    </LinkMenuItem>
                </>
            )}

            {(org?.role === 'admin' || org?.role === 'owner') && (
                <>
                    <MenuSectionTitle>Organization</MenuSectionTitle>
                    <LinkMenuItem to={`/orgs/${orgSlug}/members`} icon={<Users2Icon />}>
                        Members
                    </LinkMenuItem>
                    <LinkMenuItem to={`/orgs/${orgSlug}/settings`} icon={<Settings2Icon />}>
                        Settings
                    </LinkMenuItem>
                </>
            )}
        </Menu>
    )
}
