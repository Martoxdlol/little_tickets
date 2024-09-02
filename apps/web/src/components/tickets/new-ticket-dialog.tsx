'use client'

import { type SerializedEditorState } from 'lexical'
import { useState } from 'react'
import { useString } from '~/i18n/react'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { Editor } from '../editor'
import { useOrganization } from '../organizations/organization-provider'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'

const toolbarClassName = cn(
    'absolute bottom-0 left-0 right-0 z-20 flex h-[44px] flex-nowrap items-start overflow-x-auto bg-background',
    'sm:static sm:h-auto sm:border-none sm:bg-transparent [&>*]:shrink-0 [&_svg]:size-5 sm:[&_svg]:size-4',
)

export function NewTicketModal(props: { children: React.ReactNode }) {
    const newTicketString = useString('newTicket')

    const [title, setTitle] = useState('')
    const [value, setValue] = useState<SerializedEditorState>()

    const { mutateAsync: createTicket } = api.tickets.create.useMutation()

    const org = useOrganization()

    function handleCreateTicket() {
        if (!value) return

        void createTicket({
            channelId: '1',
            organizationSlug: org.slug,
            title: title,
            description: value,
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="block h-full w-full max-w-[650px] gap-0 border-0 p-0 sm:h-auto sm:border">
                <div className="flex flex-col gap-2 p-4 pb-2">
                    <DialogHeader className="hidden">
                        <DialogTitle>{newTicketString}</DialogTitle>
                        <DialogDescription>{newTicketString}</DialogDescription>
                    </DialogHeader>
                    <input
                        className="bg-transparent p-0 text-lg outline-0 placeholder:text-primary/30"
                        placeholder="Title here..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Editor
                        initialValue={value}
                        onChange={(value) => setValue(value)}
                        contentClassName="h-[calc(var(--screen-height)_-_145px)] sm:h-auto sm:max-h-[calc(var(--screen-height)_-_180px)] overflow-auto"
                        toolbarClassName={toolbarClassName}
                    />
                </div>

                <div className="absolute bottom-[36px] left-0 right-0 flex justify-between rounded-b-md border-t bg-background px-4 pb-3 pt-2 sm:static sm:pb-2">
                    <div></div>
                    <Button disabled={!title} onClick={handleCreateTicket}>
                        Create ticket
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
