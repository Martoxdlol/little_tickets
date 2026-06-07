import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang, useString } from 'i18n/react'
import type { AppStringsKeys } from 'i18n/strings'
import { getString } from 'i18n/strings'
import { InfoIcon, Loader2Icon, LogOutIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nameToSlug, slugSchema } from 'shared-utils/helpers'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { SettingsActionBar, SettingsInputItem, SettingsSection, SettingsToggleRow } from '~/components/scaffolding/settings'
import { Button } from '~/components/ui/button'
import { IconButton } from '~/components/ui/custom/icon-button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useOrgSlug } from '~/hooks'

type Organization = NonNullable<RouterOutputs['organizations']['get']>

type OptionKey = {
    [K in keyof Organization]: Organization[K] extends boolean ? K : never
}[keyof Organization]

const channelOptions: { key: OptionKey; titleKey: AppStringsKeys; descriptionKey: AppStringsKeys }[] = [
    {
        key: 'defaultChannelAllowCreateNew',
        titleKey: 'permCreateNew',
        descriptionKey: 'permCreateNewDescription',
    },
    {
        key: 'defaultChannelAllowViewAll',
        titleKey: 'permViewAll',
        descriptionKey: 'orgViewAllDescription',
    },
    {
        key: 'defaultChannelAllowCommentOnAll',
        titleKey: 'permCommentAll',
        descriptionKey: 'orgCommentAllDescription',
    },
    {
        key: 'defaultChannelAllowCommentCreatedSelf',
        titleKey: 'permCommentOwn',
        descriptionKey: 'permCommentOwnDescription',
    },
    {
        key: 'defaultChannelAllowCommentAssignedSelf',
        titleKey: 'permCommentAssigned',
        descriptionKey: 'permCommentAssignedDescription',
    },
    {
        key: 'defaultChannelAllowManageAll',
        titleKey: 'permManageAll',
        descriptionKey: 'permManageAllDescription',
    },
    {
        key: 'defaultChannelAllowManageCreatedSelf',
        titleKey: 'permManageOwn',
        descriptionKey: 'permManageOwnDescription',
    },
    {
        key: 'defaultChannelAllowManageAssignedSelf',
        titleKey: 'permManageAssigned',
        descriptionKey: 'permManageAssignedDescription',
    },
    {
        key: 'defaultChannelAllowFullAdmin',
        titleKey: 'permFullAdmin',
        descriptionKey: 'orgFullAdminDescription',
    },
]

function optionsFromOrg(org: Organization) {
    return {
        defaultChannelAllowCreateNew: org.defaultChannelAllowCreateNew,
        defaultChannelAllowViewAll: org.defaultChannelAllowViewAll,
        defaultChannelAllowCommentOnAll: org.defaultChannelAllowCommentOnAll,
        defaultChannelAllowCommentCreatedSelf: org.defaultChannelAllowCommentCreatedSelf,
        defaultChannelAllowCommentAssignedSelf: org.defaultChannelAllowCommentAssignedSelf,
        defaultChannelAllowManageAll: org.defaultChannelAllowManageAll,
        defaultChannelAllowManageCreatedSelf: org.defaultChannelAllowManageCreatedSelf,
        defaultChannelAllowManageAssignedSelf: org.defaultChannelAllowManageAssignedSelf,
        defaultChannelAllowFullAdmin: org.defaultChannelAllowFullAdmin,
    }
}

export function OrgSettingsPage() {
    const orgSlug = useOrgSlug()!
    const orgNotFoundStr = useString('organizationNotFound')

    const { data: org } = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    if (!org) {
        return (
            <Center>
                <p className='opacity-secondary'>{orgNotFoundStr}</p>
            </Center>
        )
    }

    return <SettingsForm key={org.id} org={org} />
}

function SettingsForm({ org }: { org: Organization }) {
    const navigate = useNavigate()
    const utils = api.useUtils()
    const lang = useLang()

    const [name, setName] = useState(org.name)
    const [slug, setSlug] = useState(org.slug)
    const [options, setOptions] = useState(() => optionsFromOrg(org))
    const [error, setError] = useState<string>()

    const canEdit = org.role !== 'member'
    const canDelete = org.role === 'owner'

    // The sole owner can't leave (server enforces it too) — only query the roster when we're an owner.
    const { data: members } = api.organizations.members.useQuery({ organizationSlug: org.slug }, { enabled: org.role === 'owner' })
    const isSoleOwner = org.role === 'owner' && members?.filter((m) => m.role === 'owner').length === 1

    const isDirty = name !== org.name || slug !== org.slug || channelOptions.some(({ key }) => options[key] !== org[key])

    const { mutateAsync: update, isPending: isSaving } = api.organizations.update.useMutation()

    async function handleSave() {
        setError(undefined)

        if (!slugSchema.safeParse(slug).success) {
            setError(getString('identifierLengthError', lang))
            return
        }
        if (!name.trim()) {
            setError(getString('nameLengthError', lang))
            return
        }

        try {
            const updated = await update({ organizationSlug: org.slug, name, slug, ...options })
            await utils.organizations.get.invalidate()
            await utils.organizations.list.invalidate()
            await utils.channels.list.invalidate()

            if (updated.slug !== org.slug) {
                localStorage.setItem('last-org', updated.slug)
                navigate(`/orgs/${updated.slug}/settings`)
            }
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    function handleDiscard() {
        setName(org.name)
        setSlug(org.slug)
        setOptions(optionsFromOrg(org))
        setError(undefined)
    }

    return (
        <>
            <PageLayout centered className='pb-6'>
                <header className='flex flex-col gap-1 px-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>{getString('settingsTitle', lang)}</h1>
                    <p className='text-sm opacity-secondary'>{getString('settingsSubtitle', lang, { name: org.name })}</p>
                </header>

                {!canEdit && (
                    <div className='flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm'>
                        <InfoIcon className='size-4 shrink-0 opacity-secondary' />
                        <span className='opacity-secondary'>{getString('orgAdminAccessRequired', lang)}</span>
                    </div>
                )}

                <SettingsSection title={getString('detailsTitle', lang)} description={getString('orgDetailsDescription', lang)}>
                    <SettingsInputItem
                        htmlFor='org-name'
                        title={getString('nameLabel', lang)}
                        description={getString('nameFieldDescription', lang)}
                        isFirst
                    >
                        <Input
                            id='org-name'
                            value={name}
                            disabled={!canEdit}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={getString('orgNamePlaceholder', lang)}
                        />
                    </SettingsInputItem>
                    <SettingsInputItem
                        htmlFor='org-slug'
                        title={getString('identifierLabel', lang)}
                        description={getString('orgIdentifierDescription', lang)}
                        isLast
                    >
                        <Input
                            id='org-slug'
                            value={slug}
                            disabled={!canEdit}
                            onChange={(e) => setSlug(nameToSlug(e.target.value))}
                            placeholder='my-company'
                        />
                    </SettingsInputItem>
                </SettingsSection>

                <SettingsSection
                    title={getString('defaultChannelOptionsTitle', lang)}
                    description={getString('defaultChannelOptionsDescription', lang)}
                >
                    {channelOptions.map(({ key, titleKey, descriptionKey }, index) => (
                        <SettingsToggleRow
                            key={key}
                            title={getString(titleKey, lang)}
                            description={getString(descriptionKey, lang)}
                            checked={options[key]}
                            disabled={!canEdit}
                            onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, [key]: checked }))}
                            isFirst={index === 0}
                            isLast={index === channelOptions.length - 1}
                        />
                    ))}
                </SettingsSection>

                <SettingsSection title={getString('dangerZone', lang)} description={getString('dangerZoneDescription', lang)}>
                    <div className='flex flex-col gap-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex flex-col gap-0.5'>
                            <p className='text-sm font-medium'>{getString('leaveOrgTitle', lang)}</p>
                            <p className='text-xs leading-snug opacity-secondary'>
                                {isSoleOwner ? getString('leaveOrgSoleOwnerHint', lang) : getString('leaveOrgDescription', lang)}
                            </p>
                        </div>
                        {isSoleOwner ? (
                            <IconButton variant='destructive' icon={<LogOutIcon />} disabled className='shrink-0'>
                                {getString('leaveOrgAction', lang)}
                            </IconButton>
                        ) : (
                            <LeaveOrgDialog org={org} />
                        )}
                    </div>

                    {canDelete && (
                        <div className='flex flex-col gap-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
                            <div className='flex flex-col gap-0.5'>
                                <p className='text-sm font-medium'>{getString('deleteOrgTitle', lang)}</p>
                                <p className='text-xs leading-snug opacity-secondary'>{getString('deleteOrgDescription', lang)}</p>
                            </div>
                            <DeleteOrgDialog org={org} />
                        </div>
                    )}
                </SettingsSection>
            </PageLayout>

            {canEdit && (
                <SettingsActionBar isDirty={isDirty} isSaving={isSaving} error={error} onSave={handleSave} onDiscard={handleDiscard} />
            )}
        </>
    )
}

function DeleteOrgDialog({ org }: { org: Organization }) {
    const navigate = useNavigate()
    const utils = api.useUtils()
    const lang = useLang()

    const [open, setOpen] = useState(false)
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState<string>()

    const { mutateAsync: deleteOrg, isPending } = api.organizations.delete.useMutation()

    async function handleDelete() {
        setError(undefined)
        try {
            await deleteOrg({ organizationSlug: org.slug })

            if (localStorage.getItem('last-org') === org.slug) {
                localStorage.removeItem('last-org')
            }

            await utils.organizations.list.invalidate()
            setOpen(false)
            navigate('/home')
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                setConfirmation('')
                setError(undefined)
            }}
        >
            <DialogTrigger asChild>
                <IconButton variant='destructive' icon={<TrashIcon />} className='shrink-0'>
                    {getString('delete', lang)}
                </IconButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getString('deleteOrgDialogTitle', lang)}</DialogTitle>
                    <DialogDescription>
                        {getString('confirmDeletePrefix', lang)} <span className='font-medium text-foreground'>{org.slug}</span>{' '}
                        {getString('confirmDeleteSuffix', lang)}
                    </DialogDescription>
                </DialogHeader>

                <Input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder={org.slug} autoFocus />

                {error && <p className='text-sm text-red-500'>{error}</p>}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>{getString('cancel', lang)}</Button>
                    </DialogClose>
                    {isPending ? (
                        <IconButton variant='destructive' icon={<Loader2Icon className='animate-spin' />} disabled>
                            {getString('deleting', lang)}
                        </IconButton>
                    ) : (
                        <Button variant='destructive' disabled={confirmation !== org.slug} onClick={handleDelete}>
                            {getString('delete', lang)}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function LeaveOrgDialog({ org }: { org: Organization }) {
    const navigate = useNavigate()
    const utils = api.useUtils()
    const lang = useLang()

    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string>()

    const { mutateAsync: leaveOrg, isPending } = api.organizations.leave.useMutation()

    async function handleLeave() {
        setError(undefined)
        try {
            await leaveOrg({ organizationSlug: org.slug })

            if (localStorage.getItem('last-org') === org.slug) {
                localStorage.removeItem('last-org')
            }

            await utils.organizations.list.invalidate()
            setOpen(false)
            navigate('/home')
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                setError(undefined)
            }}
        >
            <DialogTrigger asChild>
                <IconButton variant='destructive' icon={<LogOutIcon />} className='shrink-0'>
                    {getString('leaveOrgAction', lang)}
                </IconButton>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getString('leaveOrgAction', lang)}</DialogTitle>
                    <DialogDescription>{getString('leaveOrgConfirm', lang, { name: org.name })}</DialogDescription>
                </DialogHeader>

                {error && <p className='text-sm text-red-500'>{error}</p>}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>{getString('cancel', lang)}</Button>
                    </DialogClose>
                    {isPending ? (
                        <IconButton variant='destructive' icon={<Loader2Icon className='animate-spin' />} disabled>
                            {getString('leaving', lang)}
                        </IconButton>
                    ) : (
                        <Button variant='destructive' onClick={handleLeave}>
                            {getString('leave', lang)}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
