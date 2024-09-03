import { api } from 'api/react'
import type { ComponentProps } from 'react'
import { useChannelSlug, useOrgSlug } from '~/hooks'
import { ChipButton } from '../ui/custom/chip-button'
import { Combobox, useComboboxOption } from '../ui/custom/combobox'

export function ChannelPicker(
    props: Omit<ComponentProps<typeof Combobox>, 'options'> & {
        canCreateNew?: boolean
    },
) {
    const orgSlug = useOrgSlug()!
    const channels = api.channels.list.useQuery({
        organizationSlug: orgSlug,
        canCreateNew: props.canCreateNew,
    })

    return (
        <Combobox
            options={channels.data?.map((channel) => ({
                label: channel.name,
                value: channel.slug,
            }))}
            allowEmpty={false}
            {...props}
        >
            {props.children}
        </Combobox>
    )
}

export function ChipChannelPicker(props: ComponentProps<typeof ChannelPicker>) {
    const slug = useChannelSlug()

    const value = props.value || slug

    return (
        <ChannelPicker {...props} value={value}>
            <ChipButton>
                <ChipChannelPickerLabel />
            </ChipButton>
        </ChannelPicker>
    )
}

function ChipChannelPickerLabel() {
    const option = useComboboxOption()

    return <>{option.label || option.value}</>
}
