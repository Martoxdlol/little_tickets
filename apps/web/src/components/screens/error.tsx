import { useString } from 'i18n/react'
import Center from '../scaffolding/center'

export function ErrorScreen() {
    const appCrashedStr = useString('appCrashed')

    return (
        <Center>
            <p>{appCrashedStr}</p>
        </Center>
    )
}
