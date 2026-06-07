import { api } from 'api/react'
import { useString } from 'i18n/react'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrgSlug } from '~/hooks'
import { Button } from '../ui/button'
import { Combobox } from '../ui/custom/combobox'
import { NewOrgDialog } from './new-org-dialog'

export function OrganizationSwitcher() {
    const { data: orgs } = api.organizations.list.useQuery()

    const orgSlug = useOrgSlug()

    const navigate = useNavigate()

    const createOrganization = useString('createOrganization')

    const [createOpen, setCreateOpen] = useState(false)

    return (
        <>
            <Combobox
                className='text-xs h-7 w-full'
                allowEmpty={false}
                options={orgs?.map((org) => ({
                    label: org.name,
                    value: org.slug,
                }))}
                value={orgSlug}
                onValueChange={(value) => {
                    if (value) {
                        localStorage.setItem('last-org', value)
                    }
                    navigate(`/orgs/${value}`)
                }}
                footer={(close) => (
                    <Button
                        variant='ghost'
                        className='h-8 w-full justify-start gap-2 px-2 font-normal'
                        onClick={() => {
                            close()
                            setCreateOpen(true)
                        }}
                    >
                        <PlusIcon className='size-4 opacity-50' />
                        {createOrganization}
                    </Button>
                )}
            />
            <NewOrgDialog open={createOpen} onOpenChange={setCreateOpen} />
        </>
    )
}
