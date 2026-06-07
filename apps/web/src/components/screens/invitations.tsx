import { useLang } from 'i18n/react'
import { getString } from 'i18n/strings'
import { PendingInvitations } from '~/components/organizations/pending-invitations'
import PageContainer from '~/components/scaffolding/page-container'
import PageLayout from '~/components/scaffolding/page-layout'
import { Scaffold } from '~/components/scaffolding/scaffold'
import { Topnav } from '~/components/topnav/home'

export function InvitationsScreen() {
    const lang = useLang()

    return (
        <Scaffold appbar={<Topnav />}>
            <PageContainer>
                <PageLayout centered>
                    <header className='flex flex-col gap-1 px-1'>
                        <h1 className='text-2xl font-semibold tracking-tight'>{getString('invitationsTitle', lang)}</h1>
                        <p className='text-sm opacity-secondary'>{getString('invitationsSubtitle', lang)}</p>
                    </header>

                    <PendingInvitations />
                </PageLayout>
            </PageContainer>
        </Scaffold>
    )
}
