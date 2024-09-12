'use client'

import { useString } from 'i18n/react'
import { useState } from 'react'
import { NewChannelForm } from '../forms/new-channel-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

export function NewChannelDialog(props: { children: React.ReactNode }) {
    const newChannel = useString('newChannel')

    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{newChannel}</DialogTitle>
                    <DialogDescription className='hidden'>{newChannel}</DialogDescription>
                </DialogHeader>
                <NewChannelForm onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
