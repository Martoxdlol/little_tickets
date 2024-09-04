import { useString } from 'i18n/react'
import { CheckIcon, XIcon } from 'lucide-react'
import { Editor } from '~/components/editor'
import { SmallIconButton } from '~/components/ui/custom/icon-button'

export function LeaveCommentCard() {
    const leaveCommentStr = useString('leaveComment')
    const cancelStr = useString('cancel')
    const saveCommentStr = useString('saveComment')

    return (
        <div className='flex flex-col gap-2 bg-background dark:bg-secondary border border-primary/10 dark:border-primary/5 rounded-lg p-2 relative'>
            <Editor toolbarHidden placeholder={leaveCommentStr} toolbarClassName='bottom-[-35px]' />
            <div className='flex items-center justify-end gap-2'>
                <SmallIconButton icon={<XIcon />} variant='outline'>
                    {cancelStr}
                </SmallIconButton>
                <SmallIconButton icon={<CheckIcon />}>{saveCommentStr}</SmallIconButton>
            </div>
        </div>
    )
}
