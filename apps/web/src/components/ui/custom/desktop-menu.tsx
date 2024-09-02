import { Menu } from './menu'

export function DesktopMenu(props: { children: React.ReactNode }) {
    return (
        <nav className='w-64 hidden sm:block'>
            <Menu>{props.children}</Menu>
        </nav>
    )
}
