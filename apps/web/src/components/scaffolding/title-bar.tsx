export function TitleBar(props: {
    leading?: React.ReactNode
    children: React.ReactNode
    trailing?: React.ReactNode
}) {
    return (
        <div className="flex items-center gap-4">
            {props.leading && <div className="shrink-0">{props.leading}</div>}
            <div className="shrink flex-grow text-lg">{props.children}</div>
            <div className="shrink-0">{props.trailing}</div>
        </div>
    )
}
