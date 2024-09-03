import Appbar from '../scaffolding/appbar'
import { UserAvatar } from './user-dropdown'

export function Topnav() {
    return (
        <Appbar>
            <div className='flex-grow' />
            <UserAvatar />
        </Appbar>
    )
}
