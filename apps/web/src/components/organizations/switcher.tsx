import { api } from 'api/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Combobox } from '../ui/custom/combobox'

export function OrganizationSwitcher() {
    const { data: orgs } = api.organizations.list.useQuery()

    const orgSlug = useParams().org

    const navigate = useNavigate()

    return (
        <Combobox
            className='text-xs h-7 w-full'
            allowEmpty={false}
            options={orgs?.map((org) => ({
                label: org.name,
                value: org.slug,
            }))}
            value={orgSlug}
            onValueChange={(value) => {
                navigate(`/orgs/${value}`)
            }}
        />
    )
}
