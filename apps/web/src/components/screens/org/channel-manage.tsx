import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang } from 'i18n/react'
import { type AppStringsKeys, type LangKeys, getString } from 'i18n/strings'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nameToSlug, slugSchema } from 'shared-utils/helpers'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { SettingsActionBar, SettingsInputItem, SettingsRow, SettingsSection, SettingsToggleRow } from '~/components/scaffolding/settings'
import { Button } from '~/components/ui/button'
import { IconButton } from '~/components/ui/custom/icon-button'
import { SegmentedControl, type SegmentedOption } from '~/components/ui/custom/segmented-control'
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
import { useChannelSlug, useOrgSlug } from '~/hooks'

type Channel = NonNullable<RouterOutputs['channels']['getForManage']>
type Organization = NonNullable<RouterOutputs['organizations']['get']>

type TriKey =
    | 'defaultAllowCreateNew'
    | 'defaultAllowViewAll'
    | 'defaultAllowCommentOnAll'
    | 'defaultAllowCommentCreatedSelf'
    | 'defaultAllowCommentAssignedSelf'
    | 'defaultAllowManageAll'
    | 'defaultAllowManageCreatedSelf'
    | 'defaultAllowManageAssignedSelf'

type OrgDefaultKey = Extract<keyof Organization, `defaultChannel${string}`>

const permissionOptions: { key: TriKey; orgKey: OrgDefaultKey; titleKey: AppStringsKeys; descriptionKey: AppStringsKeys }[] = [
    {
        key: 'defaultAllowCreateNew',
        orgKey: 'defaultChannelAllowCreateNew',
        titleKey: 'permCreateNew',
        descriptionKey: 'permCreateNewDescription',
    },
    {
        key: 'defaultAllowViewAll',
        orgKey: 'defaultChannelAllowViewAll',
        titleKey: 'permViewAll',
        descriptionKey: 'channelViewAllDescription',
    },
    {
        key: 'defaultAllowCommentOnAll',
        orgKey: 'defaultChannelAllowCommentOnAll',
        titleKey: 'permCommentAll',
        descriptionKey: 'channelCommentAllDescription',
    },
    {
        key: 'defaultAllowCommentCreatedSelf',
        orgKey: 'defaultChannelAllowCommentCreatedSelf',
        titleKey: 'permCommentOwn',
        descriptionKey: 'permCommentOwnDescription',
    },
    {
        key: 'defaultAllowCommentAssignedSelf',
        orgKey: 'defaultChannelAllowCommentAssignedSelf',
        titleKey: 'permCommentAssigned',
        descriptionKey: 'permCommentAssignedDescription',
    },
    {
        key: 'defaultAllowManageAll',
        orgKey: 'defaultChannelAllowManageAll',
        titleKey: 'permManageAll',
        descriptionKey: 'permManageAllDescription',
    },
    {
        key: 'defaultAllowManageCreatedSelf',
        orgKey: 'defaultChannelAllowManageCreatedSelf',
        titleKey: 'permManageOwn',
        descriptionKey: 'permManageOwnDescription',
    },
    {
        key: 'defaultAllowManageAssignedSelf',
        orgKey: 'defaultChannelAllowManageAssignedSelf',
        titleKey: 'permManageAssigned',
        descriptionKey: 'permManageAssignedDescription',
    },
]

function triStateOptions(lang: LangKeys): SegmentedOption<boolean | null>[] {
    return [
        { label: getString('inherit', lang), value: null },
        { label: getString('allow', lang), value: true },
        { label: getString('deny', lang), value: false },
    ]
}

function booleanOptions(lang: LangKeys): SegmentedOption<boolean | null>[] {
    return [
        { label: getString('allow', lang), value: true },
        { label: getString('deny', lang), value: false },
    ]
}

function permsFromChannel(channel: Channel) {
    return {
        public: channel.public,
        defaultAllowCreateNew: channel.defaultAllowCreateNew,
        defaultAllowViewAll: channel.defaultAllowViewAll,
        defaultAllowCommentOnAll: channel.defaultAllowCommentOnAll,
        defaultAllowCommentCreatedSelf: channel.defaultAllowCommentCreatedSelf,
        defaultAllowCommentAssignedSelf: channel.defaultAllowCommentAssignedSelf,
        defaultAllowManageAll: channel.defaultAllowManageAll,
        defaultAllowManageCreatedSelf: channel.defaultAllowManageCreatedSelf,
        defaultAllowManageAssignedSelf: channel.defaultAllowManageAssignedSelf,
        defaultAllowFullAdmin: channel.defaultAllowFullAdmin,
    }
}

export function ChannelManageScreen() {
    const orgSlug = useOrgSlug()!
    const channelSlug = useChannelSlug()!
    const lang = useLang()

    const channelQuery = api.channels.getForManage.useQuery({ organizationSlug: orgSlug, channelSlug })
    const { data: org } = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    if (channelQuery.error?.data?.code === 'FORBIDDEN') {
        return (
            <Center>
                <p className='opacity-secondary'>{getString('channelAdminAccessRequired', lang)}</p>
            </Center>
        )
    }

    if (channelQuery.isPending || !org) {
        return null
    }

    if (!channelQuery.data) {
        return (
            <Center>
                <p className='opacity-secondary'>{getString('channelNotFound', lang)}</p>
            </Center>
        )
    }

    return <ManageForm key={channelQuery.data.id} channel={channelQuery.data} org={org} orgSlug={orgSlug} />
}

function ManageForm({ channel, org, orgSlug }: { channel: Channel; org: Organization; orgSlug: string }) {
    const navigate = useNavigate()
    const utils = api.useUtils()
    const lang = useLang()

    const [name, setName] = useState(channel.name)
    const [slug, setSlug] = useState(channel.slug)
    const [perms, setPerms] = useState(() => permsFromChannel(channel))
    const [error, setError] = useState<string>()

    const isDirty =
        name !== channel.name ||
        slug !== channel.slug ||
        perms.public !== channel.public ||
        permissionOptions.some(({ key }) => perms[key] !== channel[key]) ||
        perms.defaultAllowFullAdmin !== channel.defaultAllowFullAdmin

    const { mutateAsync: update, isPending: isSaving } = api.channels.update.useMutation()

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
            const updated = await update({ organizationSlug: orgSlug, channelSlug: channel.slug, name, slug, ...perms })
            await utils.channels.getForManage.invalidate()
            await utils.channels.list.invalidate()
            await utils.channels.get.invalidate()

            if (updated.slug !== channel.slug) {
                navigate(`/orgs/${orgSlug}/c/${updated.slug}/manage`)
            }
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    function handleDiscard() {
        setName(channel.name)
        setSlug(channel.slug)
        setPerms(permsFromChannel(channel))
        setError(undefined)
    }

    return (
        <>
            <PageLayout centered className='pb-6'>
                <header className='flex flex-col gap-1 px-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>{getString('manageChannelTitle', lang)}</h1>
                    <p className='text-sm opacity-secondary'>{getString('manageChannelSubtitle', lang, { name: channel.name })}</p>
                </header>

                <SettingsSection title={getString('detailsTitle', lang)} description={getString('channelDetailsDescription', lang)}>
                    <SettingsInputItem
                        htmlFor='channel-name'
                        title={getString('nameLabel', lang)}
                        description={getString('nameFieldDescription', lang)}
                        isFirst
                    >
                        <Input
                            id='channel-name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={getString('channelNamePlaceholder', lang)}
                        />
                    </SettingsInputItem>
                    <SettingsInputItem
                        htmlFor='channel-slug'
                        title={getString('identifierLabel', lang)}
                        description={getString('channelIdentifierDescription', lang)}
                        isLast
                    >
                        <Input
                            id='channel-slug'
                            value={slug}
                            onChange={(e) => setSlug(nameToSlug(e.target.value))}
                            placeholder='my-channel'
                        />
                    </SettingsInputItem>
                </SettingsSection>

                <SettingsSection title={getString('visibilityTitle', lang)} description={getString('visibilityDescription', lang)}>
                    <SettingsToggleRow
                        title={getString('publicChannelTitle', lang)}
                        description={getString('publicChannelDescription', lang)}
                        checked={perms.public}
                        onCheckedChange={(checked) => setPerms((prev) => ({ ...prev, public: checked }))}
                        isFirst
                        isLast
                    />
                </SettingsSection>

                <SettingsSection
                    title={getString('memberPermissionsTitle', lang)}
                    description={getString('memberPermissionsDescription', lang)}
                >
                    {permissionOptions.map(({ key, orgKey, titleKey, descriptionKey }, index) => {
                        const title = getString(titleKey, lang)
                        return (
                            <SettingsRow
                                key={key}
                                title={title}
                                description={getString(descriptionKey, lang)}
                                isFirst={index === 0}
                                isLast={false}
                                hint={
                                    perms[key] === null ? (
                                        <span>
                                            {getString('inheritedValue', lang, {
                                                value: org[orgKey] ? getString('allow', lang) : getString('deny', lang),
                                            })}
                                        </span>
                                    ) : undefined
                                }
                                control={
                                    <SegmentedControl
                                        aria-label={title}
                                        value={perms[key]}
                                        options={triStateOptions(lang)}
                                        onValueChange={(value) => setPerms((prev) => ({ ...prev, [key]: value }))}
                                    />
                                }
                            />
                        )
                    })}
                    <SettingsRow
                        title={getString('permFullAdmin', lang)}
                        description={getString('channelFullAdminDescription', lang)}
                        isLast
                        control={
                            <SegmentedControl
                                aria-label={getString('permFullAdmin', lang)}
                                value={perms.defaultAllowFullAdmin}
                                options={booleanOptions(lang)}
                                onValueChange={(value) => setPerms((prev) => ({ ...prev, defaultAllowFullAdmin: value ?? false }))}
                            />
                        }
                    />
                </SettingsSection>

                <SettingsSection title={getString('dangerZone', lang)} description={getString('dangerZoneDescription', lang)}>
                    <div className='flex flex-col gap-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex flex-col gap-0.5'>
                            <p className='text-sm font-medium'>{getString('deleteChannelTitle', lang)}</p>
                            <p className='text-xs leading-snug opacity-secondary'>{getString('deleteChannelDescription', lang)}</p>
                        </div>
                        <DeleteChannelDialog channel={channel} orgSlug={orgSlug} />
                    </div>
                </SettingsSection>
            </PageLayout>

            <SettingsActionBar isDirty={isDirty} isSaving={isSaving} error={error} onSave={handleSave} onDiscard={handleDiscard} />
        </>
    )
}

function DeleteChannelDialog({ channel, orgSlug }: { channel: Channel; orgSlug: string }) {
    const navigate = useNavigate()
    const utils = api.useUtils()
    const lang = useLang()

    const [open, setOpen] = useState(false)
    const [confirmation, setConfirmation] = useState('')
    const [error, setError] = useState<string>()

    const { mutateAsync: deleteChannel, isPending } = api.channels.delete.useMutation()

    async function handleDelete() {
        setError(undefined)
        try {
            await deleteChannel({ organizationSlug: orgSlug, channelSlug: channel.slug })

            await utils.channels.list.invalidate()
            setOpen(false)
            navigate(`/orgs/${orgSlug}`)
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
                    <DialogTitle>{getString('deleteChannelDialogTitle', lang)}</DialogTitle>
                    <DialogDescription>
                        {getString('confirmDeletePrefix', lang)} <span className='font-medium text-foreground'>{channel.slug}</span>{' '}
                        {getString('confirmDeleteSuffix', lang)}
                    </DialogDescription>
                </DialogHeader>

                <Input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder={channel.slug} autoFocus />

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
                        <Button variant='destructive' disabled={confirmation !== channel.slug} onClick={handleDelete}>
                            {getString('delete', lang)}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
