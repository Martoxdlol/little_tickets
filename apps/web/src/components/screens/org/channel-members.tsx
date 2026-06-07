import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang } from 'i18n/react'
import { type AppStringsKeys, getString } from 'i18n/strings'
import { EllipsisVerticalIcon, Loader2Icon, TriangleAlertIcon, UserMinusIcon, UserPlusIcon } from 'lucide-react'
import { useState } from 'react'
import { UserAvatar } from '~/components/auth/user-avatar'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { SettingsRow, SettingsSection, settingsCardCorners } from '~/components/scaffolding/settings'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { useChannelSlug, useOrgSlug } from '~/hooks'
import { cn } from '~/lib/utils'

type Channel = NonNullable<RouterOutputs['channels']['getForManage']>
type Organization = NonNullable<RouterOutputs['organizations']['get']>
type ChannelMember = RouterOutputs['channels']['members'][number]
type OrgMember = NonNullable<RouterOutputs['organizations']['members']>[number]

const memberPermissions: {
    key: Exclude<Extract<keyof ChannelMember, `allow${string}`>, 'allowFullAdmin'>
    channelKey: Extract<keyof Channel, `defaultAllow${string}`>
    orgKey: Extract<keyof Organization, `defaultChannel${string}`>
    titleKey: AppStringsKeys
    descKey: AppStringsKeys
}[] = [
    {
        key: 'allowCreateNew',
        channelKey: 'defaultAllowCreateNew',
        orgKey: 'defaultChannelAllowCreateNew',
        titleKey: 'permCreateNew',
        descKey: 'permCreateNewDescription',
    },
    {
        key: 'allowViewAll',
        channelKey: 'defaultAllowViewAll',
        orgKey: 'defaultChannelAllowViewAll',
        titleKey: 'permViewAll',
        descKey: 'channelViewAllDescription',
    },
    {
        key: 'allowCommentOnAll',
        channelKey: 'defaultAllowCommentOnAll',
        orgKey: 'defaultChannelAllowCommentOnAll',
        titleKey: 'permCommentAll',
        descKey: 'channelCommentAllDescription',
    },
    {
        key: 'allowCommentCreatedSelf',
        channelKey: 'defaultAllowCommentCreatedSelf',
        orgKey: 'defaultChannelAllowCommentCreatedSelf',
        titleKey: 'permCommentOwn',
        descKey: 'permCommentOwnDescription',
    },
    {
        key: 'allowCommentAssignedSelf',
        channelKey: 'defaultAllowCommentAssignedSelf',
        orgKey: 'defaultChannelAllowCommentAssignedSelf',
        titleKey: 'permCommentAssigned',
        descKey: 'permCommentAssignedDescription',
    },
    {
        key: 'allowManageAll',
        channelKey: 'defaultAllowManageAll',
        orgKey: 'defaultChannelAllowManageAll',
        titleKey: 'permManageAll',
        descKey: 'permManageAllDescription',
    },
    {
        key: 'allowManageCreatedSelf',
        channelKey: 'defaultAllowManageCreatedSelf',
        orgKey: 'defaultChannelAllowManageCreatedSelf',
        titleKey: 'permManageOwn',
        descKey: 'permManageOwnDescription',
    },
    {
        key: 'allowManageAssignedSelf',
        channelKey: 'defaultAllowManageAssignedSelf',
        orgKey: 'defaultChannelAllowManageAssignedSelf',
        titleKey: 'permManageAssigned',
        descKey: 'permManageAssignedDescription',
    },
]

function firstBoolean(...values: (boolean | null | undefined)[]): boolean {
    for (const value of values) {
        if (typeof value === 'boolean') return value
    }
    return false
}

export function ChannelMembersPage() {
    const orgSlug = useOrgSlug()!
    const channelSlug = useChannelSlug()!
    const lang = useLang()

    const membersQuery = api.channels.members.useQuery({ organizationSlug: orgSlug, channelSlug })
    const { data: channel } = api.channels.getForManage.useQuery({ organizationSlug: orgSlug, channelSlug })
    const { data: org } = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    if (membersQuery.error?.data?.code === 'FORBIDDEN') {
        return (
            <Center>
                <p className='opacity-secondary'>{getString('channelAdminAccessRequired', lang)}</p>
            </Center>
        )
    }

    if (membersQuery.error?.data?.code === 'NOT_FOUND' || (channel === null && !membersQuery.isPending)) {
        return (
            <Center>
                <p className='opacity-secondary'>{getString('channelNotFound', lang)}</p>
            </Center>
        )
    }

    if (!channel || !org) return null

    return <ChannelMembersList key={channel.id} channel={channel} org={org} orgSlug={orgSlug} />
}

function ChannelMembersList({ channel, org, orgSlug }: { channel: Channel; org: Organization; orgSlug: string }) {
    const lang = useLang()
    const utils = api.useUtils()

    const { data: members, isPending } = api.channels.members.useQuery({ organizationSlug: orgSlug, channelSlug: channel.slug })
    const { data: orgMembers } = api.organizations.members.useQuery({ organizationSlug: orgSlug })

    const { mutateAsync: removeMember } = api.channels.removeMember.useMutation()

    const [error, setError] = useState<string>()
    const [pendingId, setPendingId] = useState<string>()
    const [memberToEdit, setMemberToEdit] = useState<ChannelMember>()

    async function refresh() {
        await utils.channels.members.invalidate()
        await utils.channels.list.invalidate()
    }

    async function handleRemove(member: ChannelMember) {
        setError(undefined)
        setPendingId(member.id)
        try {
            await removeMember({ organizationSlug: orgSlug, channelSlug: channel.slug, memberId: member.id })
            await refresh()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
        setPendingId(undefined)
    }

    const channelMemberUserIds = new Set(members?.map((m) => m.userId))
    const addableMembers = orgMembers?.filter((m) => !channelMemberUserIds.has(m.userId)) ?? []
    const count = members?.length ?? 0

    return (
        <PageLayout centered className='pb-6'>
            <header className='flex items-end justify-between gap-3 px-1'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-2xl font-semibold tracking-tight'>{getString('channelMembersTitle', lang)}</h1>
                    <p className='text-sm opacity-secondary'>{getString('channelMembersSubtitle', lang, { name: channel.name })}</p>
                </div>
                <AddMemberDialog orgSlug={orgSlug} channelSlug={channel.slug} addableMembers={addableMembers} onAdded={refresh}>
                    <IconButton variant='outline' icon={<UserPlusIcon />} className='shrink-0'>
                        {getString('addMember', lang)}
                    </IconButton>
                </AddMemberDialog>
            </header>

            {error && (
                <div className='flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
                    <TriangleAlertIcon className='size-4 shrink-0' />
                    <span>{error}</span>
                </div>
            )}

            {channel.public && (
                <div className='flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm'>
                    <span className='opacity-secondary'>{getString('channelPublicMembersHint', lang)}</span>
                </div>
            )}

            <SettingsSection title={getString('channelMembersTitle', lang)}>
                {isPending && (
                    <>
                        <MemberRowSkeleton isFirst />
                        <MemberRowSkeleton isLast />
                    </>
                )}
                {!isPending && count === 0 && (
                    <div className='rounded-2xl border bg-card px-4 py-6 text-center text-sm opacity-secondary'>
                        {getString('channelMembersEmpty', lang)}
                    </div>
                )}
                {members?.map((member, index) => (
                    <div
                        key={member.id}
                        className={cn(
                            'flex items-center gap-3 border bg-card px-4 py-3',
                            settingsCardCorners(index === 0, index === members.length - 1),
                        )}
                    >
                        <UserAvatar name={member.name} picture={member.picture} className='size-9' />
                        <div className='flex min-w-0 flex-col gap-0.5'>
                            <p className='truncate text-sm font-medium leading-none'>{member.name}</p>
                            {member.email && <p className='truncate text-xs opacity-secondary'>{member.email}</p>}
                        </div>
                        <div className='ml-auto flex shrink-0 items-center gap-2'>
                            {member.allowFullAdmin && (
                                <span className='rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary'>
                                    {getString('permFullAdmin', lang)}
                                </span>
                            )}
                            {pendingId === member.id ? (
                                <Loader2Icon className='size-4 animate-spin opacity-secondary' />
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='icon' className='size-8'>
                                            <EllipsisVerticalIcon className='size-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end' className='w-52'>
                                        <DropdownMenuItem onClick={() => setMemberToEdit(member)}>
                                            {getString('editPermissions', lang)}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='text-destructive focus:text-destructive'
                                            onClick={() => handleRemove(member)}
                                        >
                                            <UserMinusIcon className='mr-2 size-4' />
                                            {getString('removeFromChannel', lang)}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                ))}
            </SettingsSection>

            <EditPermissionsDialog
                key={memberToEdit?.id}
                member={memberToEdit}
                channel={channel}
                org={org}
                orgSlug={orgSlug}
                onClose={() => setMemberToEdit(undefined)}
                onSaved={refresh}
            />
        </PageLayout>
    )
}

function MemberRowSkeleton({ isFirst, isLast }: { isFirst?: boolean; isLast?: boolean }) {
    return (
        <div className={cn('flex items-center gap-3 border bg-card px-4 py-3', settingsCardCorners(isFirst, isLast))}>
            <Skeleton className='size-9 rounded-full' />
            <div className='flex flex-col gap-1.5'>
                <Skeleton className='h-3.5 w-32' />
                <Skeleton className='h-3 w-44' />
            </div>
        </div>
    )
}

function AddMemberDialog({
    orgSlug,
    channelSlug,
    addableMembers,
    onAdded,
    children,
}: {
    orgSlug: string
    channelSlug: string
    addableMembers: OrgMember[]
    onAdded: () => Promise<void> | void
    children: React.ReactNode
}) {
    const lang = useLang()

    const [open, setOpen] = useState(false)
    const [pendingUserId, setPendingUserId] = useState<string>()
    const [error, setError] = useState<string>()

    const { mutateAsync: addMember } = api.channels.addMember.useMutation()

    async function handleAdd(userId: string) {
        setError(undefined)
        setPendingUserId(userId)
        try {
            await addMember({ organizationSlug: orgSlug, channelSlug, userId })
            await onAdded()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
        setPendingUserId(undefined)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                setError(undefined)
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getString('addMember', lang)}</DialogTitle>
                    <DialogDescription>{getString('addMemberDescription', lang, { name: channelSlug })}</DialogDescription>
                </DialogHeader>

                {error && <p className='text-sm text-red-500'>{error}</p>}

                {addableMembers.length === 0 ? (
                    <p className='py-4 text-center text-sm opacity-secondary'>{getString('noOrgMembersToAdd', lang)}</p>
                ) : (
                    <div className='flex max-h-80 flex-col gap-0.5 overflow-y-auto'>
                        {addableMembers.map((member) => (
                            <button
                                key={member.id}
                                type='button'
                                disabled={!!pendingUserId}
                                onClick={() => handleAdd(member.userId)}
                                className='flex items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent disabled:opacity-50'
                            >
                                <UserAvatar name={member.name} picture={member.picture} className='size-8' />
                                <div className='flex min-w-0 flex-col gap-0.5'>
                                    <p className='truncate text-sm font-medium leading-none'>{member.name}</p>
                                    {member.email && <p className='truncate text-xs opacity-secondary'>{member.email}</p>}
                                </div>
                                {pendingUserId === member.userId ? (
                                    <Loader2Icon className='ml-auto size-4 shrink-0 animate-spin opacity-secondary' />
                                ) : (
                                    <UserPlusIcon className='ml-auto size-4 shrink-0 opacity-secondary' />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function EditPermissionsDialog({
    member,
    channel,
    org,
    orgSlug,
    onClose,
    onSaved,
}: {
    member?: ChannelMember
    channel: Channel
    org: Organization
    orgSlug: string
    onClose: () => void
    onSaved: () => Promise<void> | void
}) {
    const lang = useLang()

    const [perms, setPerms] = useState(() => initialPerms(member))
    const [error, setError] = useState<string>()

    const { mutateAsync: update, isPending } = api.channels.updateMemberPermissions.useMutation()

    const triStateOptions: SegmentedOption<boolean | null>[] = [
        { label: getString('inherit', lang), value: null },
        { label: getString('allow', lang), value: true },
        { label: getString('deny', lang), value: false },
    ]
    const booleanOptions: SegmentedOption<boolean | null>[] = [
        { label: getString('allow', lang), value: true },
        { label: getString('deny', lang), value: false },
    ]

    async function handleSave() {
        if (!member) return
        setError(undefined)
        try {
            await update({ organizationSlug: orgSlug, channelSlug: channel.slug, memberId: member.id, ...perms })
            await onSaved()
            onClose()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    return (
        <Dialog open={!!member} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className='max-h-[var(--screen-height)] gap-0 overflow-hidden p-0'>
                <DialogHeader className='border-b p-4'>
                    <DialogTitle>{member ? getString('editPermissionsFor', lang, { name: member.name }) : ''}</DialogTitle>
                    <DialogDescription>{getString('editPermissionsDescription', lang)}</DialogDescription>
                </DialogHeader>

                <div className='flex max-h-[60vh] flex-col gap-0.5 overflow-y-auto p-4'>
                    {memberPermissions.map(({ key, channelKey, orgKey, titleKey, descKey }, index) => {
                        const value = perms[key]
                        const inherited = firstBoolean(channel[channelKey], org[orgKey])
                        return (
                            <SettingsRow
                                key={key}
                                title={getString(titleKey, lang)}
                                description={getString(descKey, lang)}
                                isFirst={index === 0}
                                isLast={false}
                                hint={
                                    value === null
                                        ? getString('inheritedValue', lang, {
                                              value: inherited ? getString('allow', lang) : getString('deny', lang),
                                          })
                                        : undefined
                                }
                                control={
                                    <SegmentedControl
                                        aria-label={getString(titleKey, lang)}
                                        value={value}
                                        options={triStateOptions}
                                        onValueChange={(next) => setPerms((prev) => ({ ...prev, [key]: next }))}
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
                                value={perms.allowFullAdmin}
                                options={booleanOptions}
                                onValueChange={(next) => setPerms((prev) => ({ ...prev, allowFullAdmin: next ?? false }))}
                            />
                        }
                    />
                </div>

                <DialogFooter className='border-t p-4'>
                    {error && <p className='mr-auto self-center text-sm text-red-500'>{error}</p>}
                    <DialogClose asChild>
                        <Button variant='outline'>{getString('cancel', lang)}</Button>
                    </DialogClose>
                    {isPending ? (
                        <IconButton icon={<Loader2Icon className='animate-spin' />} disabled>
                            {getString('saving', lang)}
                        </IconButton>
                    ) : (
                        <Button onClick={handleSave}>{getString('saveChanges', lang)}</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function initialPerms(member?: ChannelMember) {
    return {
        allowCreateNew: member?.allowCreateNew ?? null,
        allowViewAll: member?.allowViewAll ?? null,
        allowCommentOnAll: member?.allowCommentOnAll ?? null,
        allowCommentCreatedSelf: member?.allowCommentCreatedSelf ?? null,
        allowCommentAssignedSelf: member?.allowCommentAssignedSelf ?? null,
        allowManageAll: member?.allowManageAll ?? null,
        allowManageCreatedSelf: member?.allowManageCreatedSelf ?? null,
        allowManageAssignedSelf: member?.allowManageAssignedSelf ?? null,
        allowFullAdmin: member?.allowFullAdmin ?? false,
    }
}
