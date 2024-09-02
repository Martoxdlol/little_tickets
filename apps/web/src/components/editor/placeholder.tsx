export function Placeholder(props: { children: React.ReactNode }) {
    return (
        <p className="pointer-events-none absolute left-0 top-[10px] opacity-30">
            {props.children}
        </p>
    )
}
