import { getNameTwoInitialsSafe } from 'shared-utils/helpers'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function UserAvatar(props: {
    name?: string | null
    picture?: string | null
    className?: string
}) {
    return (
        <Avatar className={cn('size-7', props.className)}>
            {props.picture && <AvatarImage src={props.picture} alt={props.name ?? 'User'} />}
            <AvatarFallback>{getNameTwoInitialsSafe(props.name ?? '')}</AvatarFallback>
        </Avatar>
    )
}
