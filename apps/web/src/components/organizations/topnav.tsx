import Appbar from '../scaffolding/appbar'
import { MobileSidenav } from '../scaffolding/mobile-sidenav'
import { UserAvatar } from '../topnav/user-dropdown'
import { OrganizationMenu } from './menu'

export function OrganizationTopnav() {
    return (
        <Appbar className='pl-1'>
            <MobileSidenav>
                <OrganizationMenu />
            </MobileSidenav>
            <div className='flex-grow' />
            <UserAvatar />
        </Appbar>
    )
}
