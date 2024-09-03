import { api } from 'api/react'
import { useState } from 'react'
import { Editor } from '~/components/editor'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { Section } from '~/components/scaffolding/section'
import { ChipButton } from '~/components/ui/custom/chip-button'
import { Title } from '~/components/ui/custom/title'
import { useChannelSlug, useOrgSlug, useTicketCode } from '~/hooks'

export function TicketScreen() {
    const orgId = useOrgSlug()!
    const channelSlug = useChannelSlug()!
    const ticketCode = useTicketCode()!

    const query = api.tickets.get.useQuery({
        organizationSlug: orgId,
        channelSlug: channelSlug,
        code: Number.parseInt(ticketCode),
    })

    if (query.isPending) {
        return null
    }

    if (!query.isSuccess && query.data === null) {
        return (
            <Center>
                <p className='opacity-secondary'>Ticket not found</p>
            </Center>
        )
    }

    if (query.isError) {
        return (
            <Center>
                <p className='opacity-secondary'>{query.error.message}</p>
            </Center>
        )
    }

    if (!query.data) {
        return null
    }

    const { title, description } = query.data

    return <TicketScreenContent title={title} description={description} />
}

function TicketScreenContent(props: { title: string; description: unknown }) {
    const [editMode, setEditMode] = useState(false)

    const [title, setTitle] = useState(props.title)
    const [value, setValue] = useState(props.description)

    function handleEnableEditMode() {
        setEditMode(true)
        setTitle(props.title)
        setValue(props.description)
    }

    function handleDisableEditMode() {
        setEditMode(false)
    }

    return (
        <PageLayout>
            <Section
                className='lg:mx-[10%] 2xl:mx-[15%]'
                actions={
                    editMode && (
                        <>
                            <ChipButton onClick={handleDisableEditMode}>Cancel</ChipButton>
                            <ChipButton className='bg-primary text-primary-foreground'>Save</ChipButton>
                        </>
                    )
                }
            >
                {!editMode && <Title>{props.title}</Title>}
                {editMode && <input className='text-lg bg-transparent text-primary outline-none focus:ring rounded-md' value={title} />}
                <Editor
                    toolbarClassName='border border rounded-lg mt-2'
                    disabled={!editMode}
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    initialValue={(editMode ? value : props.description) as any}
                    onChange={() => {}}
                    toolbarHidden={!editMode}
                />
                <div>
                    {!editMode && (
                        <ChipButton className='mt-4' onClick={handleEnableEditMode}>
                            Edit
                        </ChipButton>
                    )}
                </div>
            </Section>
        </PageLayout>
    )
}
