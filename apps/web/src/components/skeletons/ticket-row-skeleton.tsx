import { Skeleton } from '../ui/skeleton'

export function TicketRowSkeleton() {
    return (
        <div className='flex items-center h-10 pl-6 border-b hover:bg-primary/5 text-sm'>
            <Skeleton className='h-4 w-20' />
        </div>
    )
}
