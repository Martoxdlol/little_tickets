import { PanelLeftIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Button } from '../ui/button'

export function MobileSidenav(props: { children: React.ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' variant='ghost' className='sm:hidden'>
                    <PanelLeftIcon size={16} />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-1 w-64'>
                <SheetHeader className='hidden'>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                {props.children}
            </SheetContent>
        </Sheet>
    )
}
