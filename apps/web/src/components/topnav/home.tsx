import Appbar from '../scaffolding/appbar'
import { CurrentUserAvatar } from './user-dropdown'

export function Topnav() {
    return (
        <Appbar>
            <div className='flex-grow' />
            <CurrentUserAvatar />
        </Appbar>
    )
}
