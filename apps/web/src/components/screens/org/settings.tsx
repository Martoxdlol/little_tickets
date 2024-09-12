import PageLayout from '~/components/scaffolding/page-layout'
import { Section } from '~/components/scaffolding/section'
import { Title } from '~/components/ui/custom/title'

export function OrgSettingsPage() {
    return (
        <PageLayout>
            <Section>
                <Title>Details</Title>
                <p>Name</p>
                <p>Identifier</p>
            </Section>
            <Section>
                <Title>Default Channel Options</Title>
                <p>This options can be configure by each channel</p>
                <p>Allow members to create new channels</p>
                <p>Allow members to list all </p>
                <p>Allow members to comment on all tickets</p>
                <p>Allow members to comment on tickets created by themselves</p>
                <p>Allow members to comment on tickets assigned to them</p>
                <p>Allow members to manage all tickets</p>
                <p>Allow members to manage tickets created by themselves</p>
                <p>Allow members to have full admin</p>
            </Section>
            <Section>
                <Title>Danger Zone</Title>
            </Section>
        </PageLayout>
    )
}
