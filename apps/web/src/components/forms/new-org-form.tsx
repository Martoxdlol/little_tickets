import { api } from 'api/react'
import { useNavigate } from 'react-router-dom'
import { NameSlugForm } from './name-slug-form'

export function NewOrgForm(props: { onCreated?: () => void }) {
    const { mutateAsync: createOrg } = api.organizations.create.useMutation()

    const navigate = useNavigate()

    return (
        <NameSlugForm
            namePlaceholder='My Company'
            shortSlugSuffix='-org'
            onSubmit={async ({ name, slug }) => {
                await createOrg({ name, slug })

                navigate(`/orgs/${slug}`)
                props.onCreated?.()
                return undefined
            }}
        />
    )
}
