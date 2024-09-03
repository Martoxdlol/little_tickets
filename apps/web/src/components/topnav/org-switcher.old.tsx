'use client'

import { ChevronsUpDownIcon, PlusIcon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { SmallIconButton } from '~/components/ui/custom/icon-button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useString } from '~/i18n/react'
import { api } from '~/trpc/react'
import { useOrganization } from '../organizations/organization-provider'

export function OrganizationSwitcher() {
    const org = useOrganization()

    const { data: memberships } = api.organizations.listMemberships.useQuery()

    const otherOrgs = useMemo(() => {
        return memberships?.filter((m) => m.organization.id !== org.id)
    }, [memberships, org.id])

    const addOrgString = useString('createOrganization')

    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SmallIconButton
                    className="w-full"
                    variant="outline"
                    icon={<ChevronsUpDownIcon />}
                >
                    <span className="flex-grow text-left">{org.name}</span>
                </SmallIconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    {otherOrgs?.map((membership) => (
                        <DropdownMenuItem
                            key={membership.organization.id}
                            onClick={() =>
                                router.push(`/${membership.organization.slug}`)
                            }
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>{membership.organization.name}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem>
                        <PlusIcon className="mr-2 size-4" />
                        <span>{addOrgString}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
