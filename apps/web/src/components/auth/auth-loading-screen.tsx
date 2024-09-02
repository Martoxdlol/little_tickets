import { Loader2Icon } from 'lucide-react'
import Center from '../scaffolding/center'

export function AuthLoadingScreen() {
    return (
        <Center>
            <Loader2Icon className='animate-spin' size={64} />
        </Center>
    )
}
