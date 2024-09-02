import { SquarePenIcon } from 'lucide-react'
import Appbar from '../scaffolding/appbar'
import { NewTicketModal } from '../tickets/new-ticket-dialog'
import { SmallIconButton } from '../ui/custom/icon-button'
import { UserAvatar } from './user-dropdown'

export function Topnav() {
    return (
        <Appbar>
            <NewTicketModal>
                <SmallIconButton
                    className="sm:hidden"
                    icon={<SquarePenIcon />}
                    variant="outline"
                    size="icon"
                />
            </NewTicketModal>
            <div className="flex-grow" />
            <UserAvatar />
        </Appbar>
    )
}
