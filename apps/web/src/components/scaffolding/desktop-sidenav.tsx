export function DesktopSideNav(props: { children?: React.ReactNode }) {
    return (
        <div className="hidden md:flex flex-col w-64 h-full bg-background min-h-0 overflow-y-auto p-2">
            {props.children}
        </div>
    )
}
