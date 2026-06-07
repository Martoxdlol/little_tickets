import { cn } from '~/lib/utils'

export interface SegmentedOption<T> {
    label: string
    value: T
}

export function SegmentedControl<T extends string | number | boolean | null>({
    value,
    options,
    disabled,
    onValueChange,
    'aria-label': ariaLabel,
}: {
    value: T
    options: SegmentedOption<T>[]
    disabled?: boolean
    onValueChange: (value: T) => void
    'aria-label'?: string
}) {
    return (
        <div role='radiogroup' aria-label={ariaLabel} className='inline-flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5'>
            {options.map((option) => {
                const selected = value === option.value
                return (
                    <button
                        key={String(option.value)}
                        type='button'
                        role='radio'
                        aria-checked={selected}
                        disabled={disabled}
                        onClick={() => onValueChange(option.value)}
                        className={cn(
                            'rounded-[5px] px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                            selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
