import { api } from 'api/react'
import { useString } from 'i18n/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NewOrgForm } from '../forms/new-org-form'
import PageContainer from '../scaffolding/page-container'
import PageLayout from '../scaffolding/page-layout'
import { Scaffold } from '../scaffolding/scaffold'
import { Section } from '../scaffolding/section'
import { FullPageSkeleton } from '../skeletons/full-page'
import { Topnav } from '../topnav/home'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Title } from '../ui/custom/title'

export function HomeScreen() {
    const createOrganizationString = useString('createOrganization')
    const joinOrganizationString = useString('joinExistingOrganization')
    const noPendingInvitationsString = useString('noPendingInvitations')

    const { data: orgs, isPending } = api.organizations.list.useQuery()

    const navigate = useNavigate()

    useEffect(() => {
        if (orgs) {
            const lastOrg = localStorage.getItem('last-org')
            const org = orgs.find((org) => org.slug === lastOrg) ?? orgs[0]
            navigate(`/orgs/${org!.slug}`)
        }
    }, [orgs, navigate])

    if (isPending) {
        return <FullPageSkeleton />
    }

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
