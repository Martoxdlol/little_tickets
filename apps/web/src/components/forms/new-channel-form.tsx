import { api } from 'api/react'
import { useNavigate } from 'react-router-dom'
import { useOrgSlug } from '~/hooks'
import { NameSlugForm } from './name-slug-form'

export function NewChannelForm(props: { onClose?: () => void }) {
    const { mutateAsync: createOrg } = api.channels.create.useMutation()

    const navigate = useNavigate()

    const orgSlug = useOrgSlug()!

    const utils = api.useUtils()

    return (
        <NameSlugForm
            namePlaceholder='My Channel'
            shortSlugSuffix='-cnl'
            onSubmit={async ({ name, slug }) => {
                await createOrg({
                    organizationSlug: orgSlug,
                    name,
                    slug,
                })

                utils.channels.list.refetch()

                props.onClose?.()
                navigate(`/orgs/${orgSlug}/c/${slug}`)
                return undefined
            }}
        />
    )
}
