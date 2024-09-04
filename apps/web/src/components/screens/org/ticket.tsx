import { type RouterOutputs, api } from 'api/react'
import { useString } from 'i18n/react'
import { useState } from 'react'
import { Editor } from '~/components/editor'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { Section } from '~/components/scaffolding/section'
import { ChipButton } from '~/components/ui/custom/chip-button'
import { FlatInput } from '~/components/ui/custom/flat-input'
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

    return <TicketScreenContent ticket={query.data} channelSlug={channelSlug} organizationSlug={orgId} refetch={query.refetch} />
}

function TicketScreenContent(props: {
    ticket: NonNullable<RouterOutputs['tickets']['get']>
    channelSlug: string
    organizationSlug: string
    refetch: () => Promise<unknown>
}) {
    const [editMode, setEditMode] = useState(false)

    const [title, setTitle] = useState(props.ticket.title)
    const [value, setValue] = useState(props.ticket.description)

    function handleEnableEditMode() {
        setEditMode(true)
        setTitle(props.ticket.title)
        setValue(props.ticket.description)
    }

    function handleDisableEditMode() {
        setEditMode(false)
    }

    const updateTicket = api.tickets.update.useMutation()

    const editStr = useString('edit')
    const saveStr = useString('save')
    const cancelStr = useString('cancel')
    const addDescriptionStr = useString('addDescription')
    const ticketTitle = useString('ticketTitle')

    function handleSave() {
        updateTicket
            .mutateAsync({
                organizationSlug: props.organizationSlug,
                channelSlug: props.channelSlug,
                code: props.ticket.code,
                title: title,
                description: value,
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(async () => {
                await props.refetch()
                setEditMode(false)
            })
    }

    return (
        <PageLayout>
            <Section
                className='lg:mx-[10%] 2xl:mx-[15%]'
                actions={
                    editMode ? (
                        <>
                            <ChipButton className='w-16 bg-background dark:bg-secondary' onClick={handleDisableEditMode}>
                                {cancelStr}
                            </ChipButton>
                            <ChipButton className='bg-primary text-primary-foreground' onClick={handleSave}>
                                {saveStr}
                            </ChipButton>
                        </>
                    ) : (
                        <ChipButton className='w-16 bg-background dark:bg-secondary' onClick={handleEnableEditMode}>
                            {editStr}
                        </ChipButton>
                    )
                }
            >
                {!editMode && <Title>{props.ticket.title}</Title>}
                {editMode && (
                    <FlatInput className='text-lg' placeholder={ticketTitle} value={title} onChange={(e) => setTitle(e.target.value)} />
                )}
                <Editor
                    toolbarClassName='border border rounded-lg mt-2 sticky bottom-2 bg-background'
                    disabled={!editMode}
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    initialValue={(editMode ? value : props.ticket.description) as any}
                    onChange={(value) => setValue(value)}
                    toolbarHidden={!editMode}
                    placeholder={`${addDescriptionStr}...`}
                />
            </Section>
            <Section className='lg:mx-[10%] 2xl:mx-[15%]'>
                <Title className='text-md opacity-secondary'>Activity</Title>
            </Section>
        </PageLayout>
    )
}
