import { useString } from 'i18n/react'
import { useState } from 'react'
import { NewOrgForm } from '../forms/new-org-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

export function NewOrgDialog(props: {
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const createOrganization = useString('createOrganization')
    const [internalOpen, setInternalOpen] = useState(false)

    const open = props.open ?? internalOpen
    const setOpen = props.onOpenChange ?? setInternalOpen

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{createOrganization}</DialogTitle>
                    <DialogDescription className='hidden'>{createOrganization}</DialogDescription>
                </DialogHeader>
                <NewOrgForm onCreated={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
