import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang } from 'i18n/react'
import { type AppStringsKeys, getString } from 'i18n/strings'
import { EllipsisVerticalIcon, Loader2Icon, TriangleAlertIcon, UserMinusIcon } from 'lucide-react'
import { useState } from 'react'
import { UserAvatar } from '~/components/auth/user-avatar'
import { InvitationsAdminSection } from '~/components/organizations/invitations-admin'
import Center from '~/components/scaffolding/center'
import PageLayout from '~/components/scaffolding/page-layout'
import { SettingsSection, settingsCardCorners } from '~/components/scaffolding/settings'
import { Button } from '~/components/ui/button'
import { IconButton } from '~/components/ui/custom/icon-button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { useOrgSlug } from '~/hooks'
import { cn } from '~/lib/utils'

type Organization = NonNullable<RouterOutputs['organizations']['get']>
type Member = NonNullable<RouterOutputs['organizations']['members']>[number]
type Role = Member['role']

const roleLabelKey: Record<Role, AppStringsKeys> = { owner: 'roleOwner', admin: 'roleAdmin', member: 'roleMember' }

export function OrgMembersPage() {
    const orgSlug = useOrgSlug()!
    const lang = useLang()

    const { data: org } = api.organizations.get.useQuery({ organizationSlug: orgSlug })

    if (!org) {
        return (
            <Center>
                <p className='opacity-secondary'>{getString('organizationNotFound', lang)}</p>
            </Center>
        )
    }

    return <MembersList key={org.id} org={org} />
}

function MembersList({ org }: { org: Organization }) {
    const utils = api.useUtils()
    const lang = useLang()

    const { data: members, isPending } = api.organizations.members.useQuery({ organizationSlug: org.slug })
    const { data: currentUser } = api.auth.currentUser.useQuery()

    const [error, setError] = useState<string>()
    const [pendingId, setPendingId] = useState<string>()
    const [memberToRemove, setMemberToRemove] = useState<Member>()

    const { mutateAsync: updateRole } = api.organizations.updateMemberRole.useMutation()
    const { mutateAsync: removeMember } = api.organizations.removeMember.useMutation()

    const canManage = org.role === 'owner' || org.role === 'admin'

    async function handleRoleChange(member: Member, role: Role) {
        if (role === member.role) return
        setError(undefined)
        setPendingId(member.id)
        try {
            await updateRole({ organizationSlug: org.slug, memberId: member.id, role })
            await utils.organizations.members.invalidate()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
        setPendingId(undefined)
    }

    async function handleRemove(member: Member) {
        setError(undefined)
        setPendingId(member.id)
        try {
            await removeMember({ organizationSlug: org.slug, memberId: member.id })
            await utils.organizations.members.invalidate()
            setMemberToRemove(undefined)
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
        setPendingId(undefined)
    }

    const count = members?.length ?? 0

    return (
        <PageLayout centered className='pb-6'>
            <header className='flex flex-col gap-1 px-1'>
                <h1 className='text-2xl font-semibold tracking-tight'>{getString('membersTitle', lang)}</h1>
                <p className='text-sm opacity-secondary'>{getString('membersSubtitle', lang, { name: org.name })}</p>
            </header>

            {error && (
                <div className='flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
                    <TriangleAlertIcon className='size-4 shrink-0' />
                    <span>{error}</span>
                </div>
            )}

            <SettingsSection
                title={getString('membersTitle', lang)}
                description={count === 1 ? getString('onePersonHasAccess', lang) : getString('nPeopleHaveAccess', lang, { count })}
            >
                {isPending && (
                    <>
                        <MemberRowSkeleton isFirst />
                        <MemberRowSkeleton />
                        <MemberRowSkeleton isLast />
                    </>
                )}
                {members?.map((member, index) => (
                    <MemberRow
                        key={member.id}
                        member={member}
                        isSelf={member.userId === currentUser?.id}
                        callerRole={org.role}
                        canManage={canManage}
                        busy={pendingId === member.id}
                        onRoleChange={(role) => handleRoleChange(member, role)}
                        onRemove={() => setMemberToRemove(member)}
                        isFirst={index === 0}
                        isLast={index === members.length - 1}
                    />
                ))}
            </SettingsSection>

            <InvitationsAdminSection org={org} />

            <RemoveMemberDialog
                member={memberToRemove}
                orgName={org.name}
                busy={!!memberToRemove && pendingId === memberToRemove.id}
                onConfirm={() => memberToRemove && handleRemove(memberToRemove)}
                onClose={() => setMemberToRemove(undefined)}
            />
        </PageLayout>
    )
}

function MemberRow({
    member,
    isSelf,
    callerRole,
    canManage,
    busy,
    onRoleChange,
    onRemove,
    isFirst,
    isLast,
}: {
    member: Member
    isSelf: boolean
    callerRole: Role
    canManage: boolean
    busy: boolean
    onRoleChange: (role: Role) => void
    onRemove: () => void
    isFirst?: boolean
    isLast?: boolean
}) {
    const lang = useLang()

    // Admins can't act on owners; nobody manages themselves from here.
    const actionable = canManage && !isSelf && !(callerRole === 'admin' && member.role === 'owner')
    const availableRoles: Role[] = callerRole === 'owner' ? ['owner', 'admin', 'member'] : ['admin', 'member']

    return (
        <div className={cn('flex items-center gap-3 border bg-card px-4 py-3 transition-colors', settingsCardCorners(isFirst, isLast))}>
            <UserAvatar name={member.name} picture={member.picture} className='size-9' />
            <div className='flex min-w-0 flex-col gap-0.5'>
                <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-medium leading-none'>{member.name}</p>
                    {isSelf && (
                        <span className='rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium leading-none text-secondary-foreground'>
                            {getString('you', lang)}
                        </span>
                    )}
                </div>
                {member.email && <p className='truncate text-xs opacity-secondary'>{member.email}</p>}
            </div>

            <div className='ml-auto flex shrink-0 items-center gap-2'>
                <RoleBadge role={member.role} />
                {actionable &&
                    (busy ? (
                        <Loader2Icon className='size-4 animate-spin opacity-secondary' />
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='icon' className='size-8'>
                                    <EllipsisVerticalIcon className='size-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-52'>
                                <DropdownMenuLabel>{getString('role', lang)}</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={member.role} onValueChange={(value) => onRoleChange(value as Role)}>
                                    {availableRoles.map((role) => (
                                        <DropdownMenuRadioItem key={role} value={role}>
                                            {getString(roleLabelKey[role], lang)}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={onRemove}>
                                    <UserMinusIcon className='mr-2 size-4' />
                                    {getString('removeFromOrganization', lang)}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ))}
            </div>
        </div>
    )
}

function RoleBadge({ role }: { role: Role }) {
    const lang = useLang()

    return (
        <span
            className={cn(
                'rounded-full border px-2 py-0.5 text-xs font-medium',
                role === 'owner' && 'border-primary/20 bg-primary/10 text-primary',
                role === 'admin' && 'border-transparent bg-secondary text-secondary-foreground',
                role === 'member' && 'border-transparent text-muted-foreground',
            )}
        >
            {getString(roleLabelKey[role], lang)}
        </span>
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

function RemoveMemberDialog({
    member,
    orgName,
    busy,
    onConfirm,
    onClose,
}: {
    member?: Member
    orgName: string
    busy: boolean
    onConfirm: () => void
    onClose: () => void
}) {
    const lang = useLang()

    return (
        <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getString('removeMemberTitle', lang)}</DialogTitle>
                    <DialogDescription>
                        {getString('removeMemberConfirmPrefix', lang)} <span className='font-medium text-foreground'>{member?.name}</span>{' '}
                        {getString('removeMemberConfirmSuffix', lang, { orgName })}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>{getString('cancel', lang)}</Button>
                    </DialogClose>
                    {busy ? (
                        <IconButton variant='destructive' icon={<Loader2Icon className='animate-spin' />} disabled>
                            {getString('removing', lang)}
                        </IconButton>
                    ) : (
                        <Button variant='destructive' onClick={onConfirm}>
                            {getString('remove', lang)}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
