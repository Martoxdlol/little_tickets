import { useString } from 'i18n/react'
import { HomeIcon, PlusIcon, SquarePenIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useOrgSlug } from '~/hooks'
import { OrganizationSwitcher } from '../organizations/switcher'
import PageContainer from '../scaffolding/page-container'
import { Scaffold } from '../scaffolding/scaffold'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { Topnav } from '../topnav/home'
import { DesktopSideNav } from '../ui/custom/desktop-menu'
import { IconButton, SmallIconButton } from '../ui/custom/icon-button'
import { LinkMenuItem, Menu } from '../ui/custom/menu'

export function OrganizationLayout(props: { children?: ReactNode }) {
    const orgSlug = useOrgSlug()!
    const newTicket = useString('newTicket')
    return (
        <Scaffold
            appbar={<Topnav />}
            leftSide={
                <DesktopSideNav>
                    <Menu>
                        <div className='sticky top-0 z-10 mb-2 flex items-center gap-2 bg-background'>
                            <div className='flex-grow'>
                                <OrganizationSwitcher />
                            </div>
                            <NewTicketModal>
                                <SmallIconButton icon={<SquarePenIcon />} variant='outline' size='icon' />
                            </NewTicketModal>
                        </div>
                        <LinkMenuItem icon={<HomeIcon />} to={`/orgs/${orgSlug}`}>
                            Home
                        </LinkMenuItem>
                    </Menu>
                </DesktopSideNav>
            }
            appbarFit='above-children'
            floatingActionButton={
                <NewTicketModal>
                    <IconButton size='lg' className='pl-4 pr-4 sm:hidden' icon={<PlusIcon />}>
                        {newTicket}
                    </IconButton>
                </NewTicketModal>
            }
        >
            <PageContainer className='border-t bg-content md:rounded-tl-md md:border-l'>{props.children}</PageContainer>
        </Scaffold>
    )
}
