import { useString } from 'i18n/react'
import { NewOrgForm } from '../forms/new-org-form'
import PageContainer from '../scaffolding/page-container'
import PageLayout from '../scaffolding/page-layout'
import { Scaffold } from '../scaffolding/scaffold'
import { Section } from '../scaffolding/section'
import { Topnav } from '../topnav/home'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Title } from '../ui/custom/title'

export function HomeScreen() {
    const createOrganizationString = useString('createOrganization')
    const joinOrganizationString = useString('joinExistingOrganization')
    const noPendingInvitationsString = useString('noPendingInvitations')

    return (
        <Scaffold appbar={<Topnav />}>
            <PageContainer>
                <PageLayout twoColumn centered>
                    <Section>
                        <Card className='overflow-hidden shadow-none'>
                            <CardHeader className='mb-4 border-b bg-secondary'>
                                <CardTitle>{createOrganizationString}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <NewOrgForm />
                            </CardContent>
                        </Card>
                    </Section>
                    <Section>
                        <Title>{joinOrganizationString}</Title>
                        <p className='text-sm opacity-secondary'>{noPendingInvitationsString}</p>
                    </Section>
                </PageLayout>
            </PageContainer>
        </Scaffold>
    )
}
