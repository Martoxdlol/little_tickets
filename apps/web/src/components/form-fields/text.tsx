/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type { FieldApi, useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import type { ReactNode } from 'react'
import type { ZodType } from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function TextFormField(props: {
    name: string
    label: ReactNode
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    form: ReturnType<typeof useForm<any, any>>
    placeholder?: string
    validator?: ZodType
    transform?: (value: string) => string
    errorMessage?: string
    validateOnChange?: boolean
}) {
    return (
        <props.form.Field
            name={props.name}
            validatorAdapter={zodValidator()}
            validators={{
                onSubmit: props.validator,
                onBlur: props.validator,
                onChange: props.validateOnChange ? props.validator : undefined,
            }}
        >
            {(field) => {
                return (
                    <div className='flex flex-col gap-1'>
                        <Label htmlFor={props.name}>{props.label}</Label>
                        <Input
                            id={props.name}
                            name={props.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(props.transform ? props.transform(e.target.value) : e.target.value)}
                            placeholder={props.placeholder}
                        />
                        <FieldInfo field={field} errorMessage={props.errorMessage} />
                    </div>
                )
            }}
        </props.form.Field>
    )
}

function FieldInfo({
    field,
    errorMessage,
}: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    field: FieldApi<any, any, any, any>
    errorMessage?: string
}) {
    return (
        <p className='text-red-500 text-sm'>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <>{errorMessage ?? field.state.meta.errors.join(', ')}</>
            ) : null}
            {field.state.meta.isValidating ? '...' : null}
        </p>
    )
}
