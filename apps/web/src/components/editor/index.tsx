import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'

import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import type { SerializedEditorState } from 'lexical'
import { PencilRulerIcon } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import { Button } from '../ui/button'
import { EDITOR_TRANSFORMERS } from './markdow-transformers'
import { Placeholder } from './placeholder'
import theme from './theme'
import { Toolbar } from './toolbar'

const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const MATCHERS = [
    (text: string) => {
        const match = URL_MATCHER.exec(text)
        if (match === null) {
            return null
        }
        const fullMatch = match[0]
        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
            // attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
        }
    },
]

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
    console.error(error)
}

export function Editor(props: {
    contentClassName?: string
    onChange?: (editorState: SerializedEditorState) => void
    initialValue?: SerializedEditorState
    value?: SerializedEditorState
    toolbarClassName?: string
    placeholderClassName?: string
    disabled?: boolean
    toolbarHidden?: boolean
    placeholder?: ReactNode
}) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
    }

    const [toolsVisible, setToolsVisible] = useState(false)

    return (
        <LexicalComposer
            initialConfig={{
                ...initialConfig,
                nodes: [
                    ListNode,
                    ListItemNode,
                    HeadingNode,
                    QuoteNode,
                    AutoLinkNode,
                    LinkNode,
                    HorizontalRuleNode,
                    TableCellNode,
                    TableRowNode,
                    TableNode,
                    HashtagNode,
                    CodeHighlightNode,
                    CodeNode,
                ],
            }}
        >
            <div className='relative'>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className={cn('EditorContentEditableDiv outline-none', props.contentClassName)}
                            contentEditable={false}
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                    placeholder={<Placeholder className={props.placeholderClassName}>{props.placeholder}</Placeholder>}
                />
                {props.toolbarHidden && !props.disabled && (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 size-6'
                        onClick={() => setToolsVisible((prev) => !prev)}
                    >
                        <PencilRulerIcon size={16} />
                    </Button>
                )}
            </div>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <AutoLinkPlugin matchers={MATCHERS} />
            <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
            {!props.toolbarHidden && <Toolbar className={props.toolbarClassName} />}
            {toolsVisible && !props.disabled && (
                <Toolbar className={cn('absolute right-0 left-0 bottom-[-60px] bg-background border rounded-md', props.toolbarClassName)} />
            )}
            <EditorValue onChange={props.onChange} initialValue={props.initialValue} />
            <EditablePlugin enabled={!props.disabled} initialValue={props.initialValue} />
            <ValueUpdaterPlugin value={props.disabled ? props.value ?? props.initialValue : props.value} />
        </LexicalComposer>
    )
}

function EditorValue(props: {
    initialValue?: SerializedEditorState
    onChange?: (editorState: SerializedEditorState) => void
}) {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        const unregister = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                props.onChange?.(editor.toJSON().editorState)
            })
        })

        return () => {
            unregister()
        }
    }, [editor, props])

    const initialValueSetRef = useRef(false)

    useEffect(() => {
        if (!props.initialValue) {
            return
        }

        // set initial data
        editor.update(() => {
            if (!props.initialValue || initialValueSetRef.current) {
                return
            }

            const editorState = editor.parseEditorState(props.initialValue)
            editor.setEditorState(editorState)
            initialValueSetRef.current = true
        })
    }, [editor, props])

    return null
}

function ValueUpdaterPlugin(props: { value?: SerializedEditorState }) {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.update(() => {
            if (!props.value) {
                return
            }

            const editorState = editor.parseEditorState(props.value)
            editor.setEditorState(editorState)
        })
    }, [editor, props.value])

    return null
}

function EditablePlugin(props: { enabled: boolean; initialValue?: SerializedEditorState }) {
    const [editor] = useLexicalComposerContext()

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        editor.update(() => {
            editor.setEditable(props.enabled)

            if (!props.initialValue) {
                return
            }

            const editorState = editor.parseEditorState(props.initialValue)
            editor.setEditorState(editorState)
        })
    }, [editor, props.enabled])

    return null
}
