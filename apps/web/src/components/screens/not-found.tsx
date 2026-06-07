import { useString } from 'i18n/react'
import { Link } from 'react-router-dom'
import Center from '../scaffolding/center'
import { Button } from '../ui/button'
import { Title } from '../ui/custom/title'

export function NotFoundScreen() {
    const pageNotFoundString = useString('pageNotFound')
    const pageNotFoundDescriptionString = useString('pageNotFoundDescription')
    const goHomeString = useString('goHome')

    return (
        <Center>
            <div className='flex max-w-sm flex-col items-center gap-4 px-6 text-center'>
                <span className='font-semibold text-7xl text-primary tracking-tight tabular-nums'>404</span>
                <Title className='font-semibold'>{pageNotFoundString}</Title>
                <p className='text-sm opacity-secondary'>{pageNotFoundDescriptionString}</p>
                <Button asChild className='mt-2'>
                    <Link to='/home'>{goHomeString}</Link>
                </Button>
            </div>
        </Center>
    )
}
