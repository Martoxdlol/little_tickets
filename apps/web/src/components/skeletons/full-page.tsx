import { DesktopSideNav } from '../scaffolding/desktop-sidenav'
import PageContainer from '../scaffolding/page-container'
import { Scaffold } from '../scaffolding/scaffold'
import { Topnav } from '../topnav/home'

export function FullPageSkeleton() {
    return (
        <Scaffold appbar={<Topnav />} leftSide={<DesktopSideNav />} appbarFit='above-children'>
            <PageContainer className='border-t bg-content md:rounded-tl-md md:border-l' />
        </Scaffold>
    )
}
