import { useString } from 'i18n/react'
import { PlusIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { DesktopSideNav } from '../scaffolding/desktop-sidenav'
import PageContainer from '../scaffolding/page-container'
import { Scaffold } from '../scaffolding/scaffold'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { IconButton } from '../ui/custom/icon-button'
import { OrganizationMenu } from './menu'
import { OrganizationTopnav } from './topnav'

export function OrganizationLayout(props: { children?: ReactNode }) {
    const newTicket = useString('newTicket')
    return (
        <Scaffold
            appbar={<OrganizationTopnav />}
            leftSide={
                <DesktopSideNav>
                    <OrganizationMenu />
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
