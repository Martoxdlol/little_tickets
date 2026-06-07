import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang } from 'i18n/react'
import { type AppStringsKeys, getString } from 'i18n/strings'
import { Loader2Icon, MailPlusIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { settingsCardCorners } from '~/components/scaffolding/settings'
import { Button } from '~/components/ui/button'
import { IconButton } from '~/components/ui/custom/icon-button'
import { SegmentedControl, type SegmentedOption } from '~/components/ui/custom/segmented-control'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

type Organization = NonNullable<RouterOutputs['organizations']['get']>
type Invitation = RouterOutputs['organizations']['invitations']['list'][number]
type InviteRole = 'admin' | 'member'

const roleLabelKey: Record<InviteRole, AppStringsKeys> = { admin: 'roleAdmin', member: 'roleMember' }

export function InvitationsAdminSection({ org }: { org: Organization }) {
    const lang = useLang()
    const utils = api.useUtils()

    const canManage = org.role === 'owner' || org.role === 'admin'

    const { data: invitations } = api.organizations.invitations.list.useQuery({ organizationSlug: org.slug }, { enabled: canManage })

    const { mutateAsync: revoke } = api.organizations.invitations.revoke.useMutation()
    const [pendingId, setPendingId] = useState<string>()

    if (!canManage) return null

    const count = invitations?.length ?? 0

    async function handleRevoke(invitation: Invitation) {
        setPendingId(invitation.id)
        try {
            await revoke({ organizationSlug: org.slug, invitationId: invitation.id })
            await utils.organizations.invitations.list.invalidate()
        } catch {
            // The list refetch below will reflect the true state regardless.
        }
        setPendingId(undefined)
    }

    return (
        <section className='flex flex-col gap-3'>
            <div className='flex items-end justify-between gap-3 px-1'>
                <div className='flex flex-col gap-0.5'>
                    <h2 className='text-base font-semibold'>{getString('pendingInvitationsTitle', lang)}</h2>
                    <p className='text-sm opacity-secondary'>
                        {count === 0
                            ? getString('noPendingOrgInvitations', lang)
                            : count === 1
                              ? getString('onePendingInvitation', lang)
                              : getString('nPendingInvitations', lang, { count })}
                    </p>
                </div>
                <InviteMemberDialog orgSlug={org.slug} orgName={org.name}>
                    <IconButton variant='outline' icon={<UserPlusIcon />} className='shrink-0'>
                        {getString('inviteAction', lang)}
                    </IconButton>
                </InviteMemberDialog>
            </div>

            {count > 0 && (
                <div className='flex flex-col gap-0.5'>
                    {invitations?.map((invitation, index) => (
                        <div
                            key={invitation.id}
                            className={cn(
                                'flex items-center gap-3 border bg-card px-4 py-3',
                                settingsCardCorners(index === 0, index === invitations.length - 1),
                            )}
                        >
                            <MailPlusIcon className='size-4 shrink-0 opacity-secondary' />
                            <div className='flex min-w-0 flex-col gap-0.5'>
                                <p className='truncate text-sm font-medium leading-none'>{invitation.email}</p>
                                <p className='text-xs opacity-secondary'>
                                    {getString('invitedAs', lang, { role: getString(roleLabelKey[invitation.role], lang) })}
                                </p>
                            </div>
                            <div className='ml-auto shrink-0'>
                                {pendingId === invitation.id ? (
                                    <Loader2Icon className='size-4 animate-spin opacity-secondary' />
                                ) : (
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='text-muted-foreground hover:text-destructive'
                                        onClick={() => handleRevoke(invitation)}
                                    >
                                        <XIcon className='mr-1 size-3.5' />
                                        {getString('revoke', lang)}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

function InviteMemberDialog({ orgSlug, orgName, children }: { orgSlug: string; orgName: string; children: React.ReactNode }) {
    const lang = useLang()
    const utils = api.useUtils()

    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<InviteRole>('member')
    const [error, setError] = useState<string>()

    const { mutateAsync: createInvite, isPending } = api.organizations.invitations.create.useMutation()

    const roleOptions: SegmentedOption<InviteRole>[] = [
        { label: getString('roleMember', lang), value: 'member' },
        { label: getString('roleAdmin', lang), value: 'admin' },
    ]

    function reset() {
        setEmail('')
        setRole('member')
        setError(undefined)
    }

    async function handleInvite() {
        setError(undefined)
        try {
            await createInvite({ organizationSlug: orgSlug, email, role })
            await utils.organizations.invitations.list.invalidate()
            setOpen(false)
            reset()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value)
                if (!value) reset()
            }}
        >
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{getString('invitePeopleTitle', lang)}</DialogTitle>
                    <DialogDescription>{getString('invitePeopleDescription', lang, { name: orgName })}</DialogDescription>
                </DialogHeader>

                <div className='flex flex-col gap-1.5'>
                    <Label htmlFor='invite-email'>{getString('emailLabel', lang)}</Label>
                    <Input
                        id='invite-email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={getString('emailPlaceholder', lang)}
                        autoFocus
                    />
                </div>

                <div className='flex items-center justify-between gap-3'>
                    <Label>{getString('role', lang)}</Label>
                    <SegmentedControl aria-label={getString('role', lang)} value={role} options={roleOptions} onValueChange={setRole} />
                </div>

                {error && <p className='text-sm text-red-500'>{error}</p>}

                <DialogFooter>
                    {isPending ? (
                        <IconButton icon={<Loader2Icon className='animate-spin' />} disabled>
                            {getString('sending', lang)}
                        </IconButton>
                    ) : (
                        <Button onClick={handleInvite} disabled={!email.trim()}>
                            {getString('sendInvite', lang)}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
