import { useString } from 'i18n/react'
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'
import { IconButton } from '../ui/custom/icon-button'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'

// Matches PageLayout's `centered` max-widths so a sticky action bar aligns with the form column.
export const settingsCenteredWidth = 'sm:mx-auto sm:w-full sm:max-w-[90%] lg:max-w-[80%] xl:max-w-[75%]'

// Grouped-card corners: minimal rounding between items, large rounding on the group's outer edges.
export function settingsCardCorners(isFirst?: boolean, isLast?: boolean) {
    return cn('rounded-md', isFirst && 'rounded-t-2xl', isLast && 'rounded-b-2xl')
}

export function SettingsSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
    return (
        <section className='flex flex-col gap-3'>
            <div className='flex flex-col gap-0.5 px-1'>
                <h2 className='text-base font-semibold'>{title}</h2>
                {description && <p className='text-sm opacity-secondary'>{description}</p>}
            </div>
            <div className='flex flex-col gap-0.5'>{children}</div>
        </section>
    )
}

export function SettingsInputItem({
    htmlFor,
    title,
    description,
    children,
    isFirst,
    isLast,
}: {
    htmlFor: string
    title: string
    description: string
    children: ReactNode
    isFirst?: boolean
    isLast?: boolean
}) {
    return (
        <div className={cn('flex flex-col gap-2 border bg-card px-4 py-3.5', settingsCardCorners(isFirst, isLast))}>
            <div className='flex flex-col gap-0.5'>
                <Label htmlFor={htmlFor} className='text-sm font-medium'>
                    {title}
                </Label>
                <p className='text-xs leading-snug opacity-secondary'>{description}</p>
            </div>
            {children}
        </div>
    )
}

export function SettingsRow({
    title,
    description,
    hint,
    control,
    disabled,
    isFirst,
    isLast,
}: {
    title: string
    description: string
    hint?: ReactNode
    control: ReactNode
    disabled?: boolean
    isFirst?: boolean
    isLast?: boolean
}) {
    return (
        <div
            className={cn(
                'flex items-center justify-between gap-4 border bg-card px-4 py-3 transition-colors',
                !disabled && 'hover:bg-accent/40',
                settingsCardCorners(isFirst, isLast),
            )}
        >
            <div className='flex min-w-0 flex-col gap-0.5 pr-2'>
                <p className='text-sm font-medium leading-none'>{title}</p>
                <p className='text-xs leading-snug opacity-secondary'>{description}</p>
                {hint && <p className='text-xs leading-snug opacity-secondary'>{hint}</p>}
            </div>
            <div className='shrink-0'>{control}</div>
        </div>
    )
}

export function SettingsToggleRow({
    title,
    description,
    checked,
    disabled,
    onCheckedChange,
    isFirst,
    isLast,
}: {
    title: string
    description: string
    checked: boolean
    disabled?: boolean
    onCheckedChange: (checked: boolean) => void
    isFirst?: boolean
    isLast?: boolean
}) {
    return (
        <SettingsRow
            title={title}
            description={description}
            disabled={disabled}
            isFirst={isFirst}
            isLast={isLast}
            control={<Switch aria-label={title} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />}
        />
    )
}

export function SettingsActionBar({
    isDirty,
    isSaving,
    error,
    onSave,
    onDiscard,
    saveLabel,
}: {
    isDirty: boolean
    isSaving: boolean
    error?: string
    onSave: () => void
    onDiscard: () => void
    saveLabel?: string
}) {
    const saveChangesStr = useString('saveChanges')
    const unsavedChangesStr = useString('unsavedChanges')
    const allChangesSavedStr = useString('allChangesSaved')
    const discardStr = useString('discard')
    const savingStr = useString('saving')

    return (
        <div className='sticky bottom-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
            <div className={cn('flex items-center justify-between gap-3 px-3 py-3 sm:px-4', settingsCenteredWidth)}>
                <div className='min-w-0 flex-1 text-sm'>
                    {error ? (
                        <span className='flex items-center gap-2 text-destructive'>
                            <TriangleAlertIcon className='size-4 shrink-0' />
                            <span className='truncate'>{error}</span>
                        </span>
                    ) : isDirty ? (
                        <span className='opacity-secondary'>{unsavedChangesStr}</span>
                    ) : (
                        <span className='opacity-secondary'>{allChangesSavedStr}</span>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {isDirty && !isSaving && (
                        <Button variant='ghost' onClick={onDiscard}>
                            {discardStr}
                        </Button>
                    )}
                    {isSaving ? (
                        <IconButton icon={<Loader2Icon className='animate-spin' />} disabled>
                            {savingStr}
                        </IconButton>
                    ) : (
                        <Button onClick={onSave} disabled={!isDirty}>
                            {saveLabel ?? saveChangesStr}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
