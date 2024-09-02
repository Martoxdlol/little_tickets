export function MobileNavBar(props: { children: React.ReactNode }) {
    return (
        <nav className="flex h-[60px] items-center justify-around sm:hidden">
            {props.children}
        </nav>
    )
}
