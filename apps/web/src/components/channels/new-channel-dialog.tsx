'use client'

import { useString } from 'i18n/react'
import { NewChannelForm } from '../forms/new-channel-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

export function NewChannelDialog(props: { children: React.ReactNode }) {
    const newChannel = useString('newChannel')

    return (
        <Dialog>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{newChannel}</DialogTitle>
                    <DialogDescription className='hidden'>{newChannel}</DialogDescription>
                </DialogHeader>
                <NewChannelForm />
            </DialogContent>
        </Dialog>
    )
}
