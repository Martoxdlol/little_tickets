import { TRPCClientError } from '@trpc/client'
import { type RouterOutputs, api } from 'api/react'
import { useLang } from 'i18n/react'
import { type AppStringsKeys, getString } from 'i18n/strings'
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { IconButton } from '~/components/ui/custom/icon-button'

type Invitation = RouterOutputs['organizations']['invitations']['listMine'][number]

const roleLabelKey: Record<Invitation['role'], AppStringsKeys> = { admin: 'roleAdmin', member: 'roleMember' }

export function PendingInvitations() {
    const lang = useLang()
    const navigate = useNavigate()
    const utils = api.useUtils()

    const { data: invitations, isPending } = api.organizations.invitations.listMine.useQuery()

    const { mutateAsync: accept } = api.organizations.invitations.accept.useMutation()
    const { mutateAsync: decline } = api.organizations.invitations.decline.useMutation()

    const [busy, setBusy] = useState<{ id: string; action: 'accept' | 'decline' }>()
    const [error, setError] = useState<string>()

    if (isPending) return null

    if (!invitations || invitations.length === 0) {
        return <p className='text-sm opacity-secondary'>{getString('noPendingInvitations', lang)}</p>
    }

    async function handleAccept(invitation: Invitation) {
        setError(undefined)
        setBusy({ id: invitation.id, action: 'accept' })
        try {
            const { organizationSlug } = await accept({ invitationId: invitation.id })
            await utils.organizations.invitations.listMine.invalidate()
            await utils.organizations.list.invalidate()
            localStorage.setItem('last-org', organizationSlug)
            navigate(`/orgs/${organizationSlug}`)
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
            setBusy(undefined)
        }
    }

    async function handleDecline(invitation: Invitation) {
        setError(undefined)
        setBusy({ id: invitation.id, action: 'decline' })
        try {
            await decline({ invitationId: invitation.id })
            await utils.organizations.invitations.listMine.invalidate()
        } catch (e) {
            setError(e instanceof TRPCClientError ? e.message : getString('somethingWentWrong', lang))
        }
        setBusy(undefined)
    }

    return (
        <div className='flex flex-col gap-3'>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            {invitations.map((invitation) => {
                const isBusy = busy?.id === invitation.id
                return (
                    <div key={invitation.id} className='flex flex-col gap-3 rounded-2xl border bg-card px-4 py-4'>
                        <div className='flex flex-col gap-0.5'>
                            <p className='text-sm font-semibold'>{invitation.organizationName}</p>
                            <p className='text-sm opacity-secondary'>
                                {getString('invitedToJoinAs', lang, { role: getString(roleLabelKey[invitation.role], lang) })}
                            </p>
                            {invitation.invitedByName && (
                                <p className='text-xs opacity-secondary'>
                                    {getString('invitedByLine', lang, { name: invitation.invitedByName })}
                                </p>
                            )}
                        </div>
                        <div className='flex items-center gap-2'>
                            {busy?.id === invitation.id && busy.action === 'accept' ? (
                                <IconButton icon={<Loader2Icon className='animate-spin' />} disabled>
                                    {getString('accepting', lang)}
                                </IconButton>
                            ) : (
                                <IconButton icon={<CheckIcon />} disabled={isBusy} onClick={() => handleAccept(invitation)}>
                                    {getString('accept', lang)}
                                </IconButton>
                            )}
                            {busy?.id === invitation.id && busy.action === 'decline' ? (
                                <IconButton variant='outline' icon={<Loader2Icon className='animate-spin' />} disabled>
                                    {getString('declining', lang)}
                                </IconButton>
                            ) : (
                                <Button variant='outline' disabled={isBusy} onClick={() => handleDecline(invitation)}>
                                    <XIcon className='mr-1.5 size-4' />
                                    {getString('decline', lang)}
                                </Button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
