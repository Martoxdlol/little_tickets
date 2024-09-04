import { api } from 'api/react'
import { useString } from 'i18n/react'
import { CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { Editor } from '~/components/editor'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { Section } from '~/components/scaffolding/section'
import { ChipButton } from '~/components/ui/custom/chip-button'
import { FlatInput } from '~/components/ui/custom/flat-input'
import { SmallIconButton } from '~/components/ui/custom/icon-button'
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

    const { title, description, code } = query.data

    return (
        <TicketScreenContent
            title={title}
            description={description}
            code={code}
            channelSlug={channelSlug}
            organizationSlug={orgId}
            refetch={query.refetch}
        />
    )
}

function TicketScreenContent(props: {
    title: string
    description: unknown
    code: number
    channelSlug: string
    organizationSlug: string
    refetch: () => void
}) {
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

    const updateTicket = api.tickets.update.useMutation()

    const editStr = useString('edit')
    const saveStr = useString('save')
    const cancelStr = useString('cancel')
    const leaveCommentStr = useString('leaveComment')
    const addDescriptionStr = useString('addDescription')
    const ticketTitle = useString('ticketTitle')

    function handleSave() {
        updateTicket
            .mutateAsync({
                organizationSlug: props.organizationSlug,
                channelSlug: props.channelSlug,
                code: props.code,
                title: title,
                description: value,
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setEditMode(false)
                props.refetch()
            })
    }

    return (
        <PageLayout>
            <Section
                className='lg:mx-[10%] 2xl:mx-[15%]'
                actions={
                    editMode ? (
                        <>
                            <ChipButton onClick={handleDisableEditMode}>{cancelStr}</ChipButton>
                            <ChipButton className='bg-primary text-primary-foreground' onClick={handleSave}>
                                {saveStr}
                            </ChipButton>
                        </>
                    ) : (
                        <ChipButton className='w-16' onClick={handleEnableEditMode}>
                            {editStr}
                        </ChipButton>
                    )
                }
            >
                {!editMode && <Title>{props.title}</Title>}
                {editMode && (
                    <FlatInput className='text-lg' placeholder={ticketTitle} value={title} onChange={(e) => setTitle(e.target.value)} />
                )}
                <Editor
                    toolbarClassName='border border rounded-lg mt-2 sticky bottom-2'
                    disabled={!editMode}
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    initialValue={(editMode ? value : props.description) as any}
                    onChange={(value) => setValue(value)}
                    toolbarHidden={!editMode}
                    placeholder={`${addDescriptionStr}...`}
                />
            </Section>
            <Section className='lg:mx-[10%] 2xl:mx-[15%]'>
                <Title className='text-md opacity-secondary'>Activity</Title>
                <div className='flex flex-col gap-2 bg-secondary border border-primary/5 rounded-lg p-2 relative'>
                    <Editor toolbarHidden placeholder={leaveCommentStr} toolbarClassName='bottom-[-35px]' />
                    <div className='flex items-center justify-end'>
                        <SmallIconButton icon={<CheckIcon />}>Comment</SmallIconButton>
                    </div>
                </div>
            </Section>
        </PageLayout>
    )
}
