import Appbar from '../scaffolding/appbar'
import PageContainer from '../scaffolding/page-container'
import { Scaffold } from '../scaffolding/scaffold'
import { DesktopMenu } from '../ui/custom/desktop-menu'

export function FullPageSkeleton() {
    return (
        <Scaffold appbar={<Appbar className='border-b' />} leftSide={<DesktopMenu />} appbarFit='above-children'>
            <PageContainer className='bg-content' />
        </Scaffold>
    )
}
