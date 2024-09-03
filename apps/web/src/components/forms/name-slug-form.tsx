'use client'

import { useForm } from '@tanstack/react-form'
import { TRPCClientError } from '@trpc/client'
import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { type ZodSchema, z } from 'zod'
import { IconButton } from '~/components/ui/custom/icon-button'

import { useString } from 'i18n/react'
import { nameToSlug, slugSchema } from 'shared-utils/helpers'
import { TextFormField } from '../form-fields/text'
import { Button } from '../ui/button'

export function NameSlugForm(props: {
    namePlaceholder?: string
    shortSlugSuffix?: string
    onSubmit: (values: {
        name: string
        slug: string
    }) => Promise<string | undefined>
    isLoading?: boolean
    defaultName?: string
    defaultSlug?: string
    slugSchema?: ZodSchema
}) {
    const [error, setError] = useState<string | undefined>(undefined)

    const genericErrorString = useString('slugErrorMessage')

    const [loading, setLoading] = useState(false)

    let isLoading = props.isLoading
    if (isLoading === undefined) {
        isLoading = loading
    }

    const form = useForm({
        defaultValues: {
            name: props.defaultName ?? '',
            slug: props.defaultSlug ?? '',
        },
        onSubmit: async ({ value }) => {
            setLoading(true)
            try {
                let slug = value.slug
                if (!slug) {
                    slug = nameToSlug(value.name)
                }

                if (slug.length < 4) {
                    slug += props.shortSlugSuffix ?? ''
                }

                const error = await props.onSubmit({
                    name: value.name,
                    slug,
                })

                if (error) {
                    setError(error)
                } else {
                    setError(undefined)
                }
            } catch (error) {
                if (error instanceof TRPCClientError) {
                    setError(error.message)
                } else {
                    setError(genericErrorString)
                }
            }
            setLoading(false)
        },
    })

    const slugField = form.useField({ name: 'name' })
    let defaultSlug = nameToSlug(slugField.state.value)

    if (defaultSlug.length < 4 && slugField.state.value.trim().length > 0) {
        defaultSlug += props.shortSlugSuffix ?? ''
    }

    const slugErrorString = useString('slugErrorMessage')
    const nameErrorString = useString('nameErrorMessage')

    let optionalSlugSchema: ZodSchema = props.slugSchema ?? slugSchema
    if (defaultSlug.length > 0) {
        optionalSlugSchema = slugSchema.or(z.literal(''))
    }

    return (
        <form
            className='flex flex-col gap-2'
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
            }}
        >
            {error && <p className='text-red-500'>{error}</p>}
            <TextFormField
                form={form}
                validator={z.string().min(1).max(56)}
                placeholder={props.namePlaceholder}
                name='name'
                label='Name'
                errorMessage={nameErrorString}
            />
            <TextFormField
                form={form}
                name='slug'
                label='Identifier'
                validator={optionalSlugSchema}
                placeholder={defaultSlug || nameToSlug(props.namePlaceholder ?? '')}
                transform={(v) => nameToSlug(v)}
                errorMessage={slugErrorString}
                validateOnChange
            />
            {!isLoading && <Button type='submit'>Continue</Button>}
            {isLoading && (
                <IconButton icon={<Loader2Icon className='animate-spin' />} disabled>
                    Continue
                </IconButton>
            )}
        </form>
    )
}
