import { type RouterOutputs, api } from 'api/react'
import { useString } from 'i18n/react'
import type { SerializedEditorState } from 'lexical'
import { CheckIcon, EllipsisVerticalIcon, Loader2Icon, SaveIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Editor } from '~/components/editor'
import { SmallIconButton } from '~/components/ui/custom/icon-button'
import { UserAvatar } from '../auth/user-avatar'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

export function LeaveCommentCard(props: {
    orgSlug: string
    channelSlug: string
    ticketCode: number
}) {
    const [key, setKey] = useState(0)

    const leaveCommentStr = useString('leaveComment')
    const saveCommentStr = useString('saveComment')

    const [value, setValue] = useState<SerializedEditorState>()
    const [text, setText] = useState('')

    const createComment = api.comments.create.useMutation()

    const utils = api.useUtils()

    function handleCreateComment() {
        createComment
            .mutateAsync({
                content: value,
                channelSlug: props.channelSlug,
                organizationSlug: props.orgSlug,
                ticketCode: props.ticketCode,
            })
            .then(() => {
                utils.comments.list.refetch({
                    channelSlug: props.channelSlug,
                    organizationSlug: props.orgSlug,
                    ticketCode: props.ticketCode,
                })
                setValue(undefined)
                setKey((key) => key + 1)
            })
    }

    return (
        <div className='flex flex-col gap-2 bg-background dark:bg-secondary border border-primary/10 dark:border-primary/5 rounded-lg p-4 relative'>
            <Editor
                key={key}
                toolbarHidden
                placeholder={leaveCommentStr}
                toolbarClassName='bottom-[-35px]'
                onChange={(value, text) => {
                    setValue(value)
                    setText(text)
                }}
                initialValue={value}
            />
            <div className='flex items-center justify-end gap-2'>
                <SmallIconButton
                    icon={createComment.isPending ? <Loader2Icon className='animate-spin' /> : <CheckIcon />}
                    disabled={createComment.isPending || !text.trim()}
                    onClick={handleCreateComment}
                >
                    {saveCommentStr}
                </SmallIconButton>
            </div>
        </div>
    )
}

export function CommentCard(props: {
    comment: NonNullable<RouterOutputs['comments']['list']>[number]
    organizationSlug: string
    channelSlug: string
}) {
    const deleteComment = api.comments.delete.useMutation()

    const utils = api.useUtils()

    function handleDeleteComment() {
        deleteComment
            .mutateAsync({
                organizationSlug: props.organizationSlug,
                channelSlug: props.channelSlug,
                commentId: props.comment.id,
            })
            .then(() => {
                utils.comments.list.refetch()
            })
    }

    const [edit, setEdit] = useState(false)

    return (
        <div
            key={props.comment.id}
            className='relative bg-background dark:bg-secondary border border-primary/10 dark:border-primary/5 rounded-lg p-4'
        >
            <div className='flex items-center mb-2 gap-2'>
                <UserAvatar name={props.comment.user.name} picture={props.comment.user.picture} className='size-6 text-xs' />
                <span className='text-sm flex-grow'>{props.comment.user.name}</span>
                {edit && (
                    <>
                        <SmallIconButton className='-mt-2' icon={<XIcon />} disabled={false} onClick={() => setEdit(false)} variant='ghost'>
                            Cancel
                        </SmallIconButton>
                        <SmallIconButton
                            className='-mt-2'
                            icon={false ? <Loader2Icon className='animate-spin' /> : <SaveIcon />}
                            disabled={false}
                            onClick={() => {}}
                        >
                            Save
                        </SmallIconButton>
                    </>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='-mt-2 -mr-2'>
                            <EllipsisVerticalIcon size={16} />
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleDeleteComment}>Delete</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setEdit(true)}>Edit</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            <Editor initialValue={props.comment.content as any} disabled={!edit} toolbarHidden toolbarClassName='-bottom-12 z-20' />
        </div>
    )
}
