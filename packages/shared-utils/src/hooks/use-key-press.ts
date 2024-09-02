import { useCallback, useEffect, useState } from 'react'
import useWindowFocus from 'use-window-focus'

export function useKeyPress(keyCode: KeyboardEvent['code']): boolean {
    const windowFocused = useWindowFocus()
    const [keyPressed, setKeyPressed] = useState(false)

    const downHandler = useCallback(
        ({ code }: { code: KeyboardEvent['code'] }) => {
            if (code === keyCode) {
                setKeyPressed(true)
            }
        },
        [keyCode],
    )

    const upHandler = useCallback(
        ({ code }: { code: KeyboardEvent['code'] }) => {
            if (code === keyCode) {
                setKeyPressed(false)
            }
        },
        [keyCode],
    )

    useEffect(() => {
        window.addEventListener('keydown', downHandler)
        window.addEventListener('keyup', upHandler)

        return () => {
            window.removeEventListener('keydown', downHandler)
            window.removeEventListener('keyup', upHandler)
        }
    }, [downHandler, upHandler])

    useEffect(() => {
        if (!windowFocused) {
            setKeyPressed(false)
        }
    }, [windowFocused])
    return keyPressed
}
