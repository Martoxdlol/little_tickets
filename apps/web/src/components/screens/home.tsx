import { HomeIcon } from 'lucide-react'
import Appbar from '../scaffolding/appbar'
import { Scaffold } from '../scaffolding/scaffold'
import { DesktopMenu } from '../ui/custom/desktop-menu'
import { LinkMenuItem } from '../ui/custom/menu'

export function HomeScreen() {
    return (
        <Scaffold
            appbar={<Appbar>Welcome</Appbar>}
            leftSide={
                <DesktopMenu>
                    <LinkMenuItem icon={<HomeIcon />} to='/'>
                        Home
                    </LinkMenuItem>
                </DesktopMenu>
            }
            appbarFit='above-children'
        >
            home
        </Scaffold>
    )
}
