'use client'

import { api } from 'api/react'
import { useString } from 'i18n/react'
import type { SerializedEditorState } from 'lexical'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChannelSlug, useOrgSlug } from '~/hooks'
import { cn } from '~/lib/utils'
import { ChipChannelPicker } from '../channels/channel-picker'
import { Editor } from '../editor'
import { ChipButton } from '../ui/custom/chip-button'
import { SmallIconButton } from '../ui/custom/icon-button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

const toolbarClassName = cn(
    'absolute bottom-0 left-0 right-0 z-20 flex h-[44px] flex-nowrap items-start overflow-x-auto bg-background',
    'sm:static sm:h-auto sm:border-none sm:bg-transparent [&>*]:shrink-0 [&_svg]:size-5 sm:[&_svg]:size-4',
)

export function NewTicketModal(props: { children: React.ReactNode }) {
    const newTicketString = useString('newTicket')

    const [title, setTitle] = useState('')
    const [value, setValue] = useState<SerializedEditorState>()
    const [channelSlug, setChannelSlug] = useState<string>()

    const { mutateAsync: createTicket } = api.tickets.create.useMutation()

    const urlChannelSlug = useChannelSlug()!
    const orgSlug = useOrgSlug()!

    const navigate = useNavigate()

    function handleCreateTicket() {
        if (!value) return

        // for in range 100
        void createTicket({
            channelSlug: channelSlug || urlChannelSlug,
            organizationSlug: orgSlug,
            title: title,
            description: value,
        }).then((r) => {
            navigate(`/orgs/${orgSlug}/t/${r.code}`)
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className='block h-full w-full max-w-[650px] gap-0 border-0 p-0 sm:h-auto sm:border'>
                <div className='flex flex-col p-4 pb-2'>
                    <DialogHeader className='hidden'>
                        <DialogTitle>{newTicketString}</DialogTitle>
                        <DialogDescription>{newTicketString}</DialogDescription>
                    </DialogHeader>
                    <div className='pb-2 flex items-center gap-1'>
                        <ChipChannelPicker
                            canCreateNew={true}
                            onValueChange={(value) => {
                                if (value) setChannelSlug(value.toString())
                            }}
                            value={channelSlug}
                        />
                        <ChevronRightIcon size={12} />
                        <ChipButton className='border-primary/20 text-primary/60 border-dashed bg-transparent'>category</ChipButton>
                        <ChevronRightIcon size={12} />
                        <ChipButton className='border-primary/20 text-primary/60 border-dashed bg-transparent'>subcategory</ChipButton>
                    </div>
                    <input
                        className='bg-transparent p-0 text-xl outline-0 placeholder:text-primary/30 placeholder:font-bold'
                        placeholder='Title here...'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Editor
                        initialValue={value}
                        onChange={(value) => setValue(value)}
                        contentClassName='h-[calc(var(--screen-height)_-_161px)] min-h-[110px] sm:h-auto sm:max-h-[calc(var(--screen-height)_-_180px)] overflow-auto'
                        toolbarClassName={toolbarClassName}
                    />
                </div>

                <div className='sm:bg-content absolute bottom-[36px] left-0 right-0 flex justify-between rounded-b-md border-t bg-background px-4 pb-3 pt-2 sm:static sm:pb-2'>
                    <div />
                    <SmallIconButton disabled={!title} onClick={handleCreateTicket} icon={<CheckIcon />}>
                        Create ticket
                    </SmallIconButton>
                </div>
            </DialogContent>
        </Dialog>
    )
}
