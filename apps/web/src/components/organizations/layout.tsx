import { api } from 'api/react'
import { useString } from 'i18n/react'
import { PlusIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useOrgSlug } from '~/hooks'
import Center from '../scaffolding/center'
import { DesktopSideNav } from '../scaffolding/desktop-sidenav'
import PageContainer from '../scaffolding/page-container'
import { Scaffold } from '../scaffolding/scaffold'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { IconButton } from '../ui/custom/icon-button'
import { OrganizationMenu } from './menu'
import { OrganizationTopnav } from './topnav'

export function OrganizationLayout(props: { children?: ReactNode }) {
    const newTicket = useString('newTicket')

    const orgSlug = useOrgSlug()!

    const org = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    return (
        <Scaffold
            appbar={<OrganizationTopnav />}
            leftSide={<DesktopSideNav>{org.data !== null && <OrganizationMenu />}</DesktopSideNav>}
            appbarFit='above-children'
            floatingActionButton={
                <NewTicketModal>
                    <IconButton size='lg' className='pl-4 pr-4 sm:hidden' icon={<PlusIcon />}>
                        {newTicket}
                    </IconButton>
                </NewTicketModal>
            }
        >
            <PageContainer className='border-t bg-content md:rounded-tl-md md:border-l'>
                {org.data === null && <Center>Organization not found</Center>}
                {org.data !== null && props.children}
            </PageContainer>
        </Scaffold>
    )
}
