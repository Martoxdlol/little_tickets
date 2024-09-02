import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    BoldIcon,
    CodeIcon,
    CornerDownLeftIcon,
    FileCode2Icon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    QuoteIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    StrikethroughIcon,
    UnderlineIcon,
    Undo2Icon,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { IconButton } from '../ui/custom/icon-button'
import { useToolbarState } from './toolbar-state'

export function Toolbar(props: { className?: string }) {
    const [editor] = useLexicalComposerContext()

    const focusEditor = () => {
        editor.focus()
    }

    const toolbar = useToolbarState()

    return (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            onClick={() => focusEditor()}
            className={cn('editor-toolbar flex flex-nowrap overflow-x-auto [&>*]:shrink-0', props.className)}
        >
            <IconButton
                variant={toolbar.isBold ? 'secondary' : 'ghost'}
                size='icon'
                icon={<BoldIcon />}
                onClick={() => toolbar.formatBold()}
            />

            <IconButton
                variant={toolbar.isItalic ? 'secondary' : 'ghost'}
                size='icon'
                icon={<ItalicIcon />}
                onClick={() => toolbar.formatItalic()}
            />

            <IconButton
                variant={toolbar.isUnderline ? 'secondary' : 'ghost'}
                size='icon'
                icon={<UnderlineIcon />}
                onClick={() => toolbar.formatUnderline()}
            />

            <IconButton
                variant={toolbar.isStrikethrough ? 'secondary' : 'ghost'}
                size='icon'
                icon={<StrikethroughIcon />}
                onClick={() => toolbar.formatStrikethrough()}
            />

            <IconButton
                variant={toolbar.isCode ? 'secondary' : 'ghost'}
                size='icon'
                icon={<CodeIcon />}
                onClick={() => toolbar.formatCode()}
            />

            <IconButton
                variant={toolbar.isCodeBlock ? 'secondary' : 'ghost'}
                size='icon'
                icon={<FileCode2Icon />}
                onClick={() => toolbar.formatCodeBlock()}
            />

            <IconButton variant='ghost' size='icon' icon={<QuoteIcon />} onClick={() => toolbar.formatQuote()} />

            <IconButton size='icon' variant='ghost' icon={<CornerDownLeftIcon />} onClick={() => toolbar.insertLineBreak()} />

            <IconButton
                variant={toolbar.isBullet ? 'secondary' : 'ghost'}
                size='icon'
                icon={<ListIcon />}
                onClick={() => toolbar.formatBulletList()}
            />

            <IconButton
                variant={toolbar.isCheck ? 'secondary' : 'ghost'}
                size='icon'
                icon={<ListTodoIcon />}
                onClick={() => toolbar.formatCheckList()}
            />

            <IconButton
                variant={toolbar.isNumber ? 'secondary' : 'ghost'}
                size='icon'
                icon={<ListOrderedIcon />}
                onClick={() => toolbar.formatNumberedList()}
            />

            <IconButton
                size='icon'
                // variant={toolbar.isParagraph ? 'secondary' : 'ghost'}
                variant='ghost'
                icon={<RemoveFormattingIcon />}
                onClick={() => toolbar.formatParagraph()}
            />

            <IconButton
                size='icon'
                variant={toolbar.isH1 ? 'secondary' : 'ghost'}
                icon={<Heading1Icon />}
                onClick={() => toolbar.formatH1()}
            />

            <IconButton
                size='icon'
                variant={toolbar.isH2 ? 'secondary' : 'ghost'}
                icon={<Heading2Icon />}
                onClick={() => toolbar.formatH2()}
            />

            <IconButton
                size='icon'
                variant={toolbar.isH3 ? 'secondary' : 'ghost'}
                icon={<Heading3Icon />}
                onClick={() => toolbar.formatH3()}
            />

            <IconButton size='icon' variant='ghost' disabled={!toolbar.canUndo} icon={<Undo2Icon />} onClick={() => toolbar.undo()} />

            <IconButton size='icon' variant='ghost' disabled={!toolbar.canRedo} icon={<Redo2Icon />} onClick={() => toolbar.redo()} />
        </div>
    )
}
