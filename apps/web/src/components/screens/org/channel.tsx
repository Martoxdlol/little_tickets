import { useString } from 'i18n/react'
import Center from '~/components/scaffolding/center'

export function ChannelScreen() {
    const nothingHere = useString('nothingHere')

    return (
        <Center>
            <p className='opacity-secondary'>{nothingHere}</p>
        </Center>
    )
}
