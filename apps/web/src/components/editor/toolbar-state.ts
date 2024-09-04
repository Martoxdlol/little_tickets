import { $createCodeNode } from '@lexical/code'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode } from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import { $isAtNodeEnd, $isParentElementRTL, $setBlocksType } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    type ElementNode,
    FORMAT_TEXT_COMMAND,
    type NodeKey,
    REDO_COMMAND,
    type RangeSelection,
    SELECTION_CHANGE_COMMAND,
    type TextNode,
    UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'

const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
}

export function useToolbarState() {
    const [editor] = useLexicalComposerContext()
    const [activeEditor, setActiveEditor] = useState(editor)
    const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
    const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null)
    const [isLink, setIsLink] = useState(false)
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isUnderline, setIsUnderline] = useState(false)
    const [isStrikethrough, setIsStrikethrough] = useState(false)
    const [isSubscript, setIsSubscript] = useState(false)
    const [isSuperscript, setIsSuperscript] = useState(false)
    const [isCode, setIsCode] = useState(false)
    const [isRTL, setIsRTL] = useState(false)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)

    const isParagraph = blockType === 'paragraph'
    const isH1 = blockType === 'h1'
    const isH2 = blockType === 'h2'
    const isH3 = blockType === 'h3'
    const isBullet = blockType === 'bullet'
    const isCheck = blockType === 'check'
    const isNumber = blockType === 'number'
    const isQuote = blockType === 'quote'
    const isCodeBlock = blockType === 'code'

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode()
            const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
            const elementKey = element.getKey()
            const elementDOM = activeEditor.getElementByKey(elementKey)

            // Update text format
            setIsBold(selection.hasFormat('bold'))
            setIsItalic(selection.hasFormat('italic'))
            setIsUnderline(selection.hasFormat('underline'))
            setIsStrikethrough(selection.hasFormat('strikethrough'))
            setIsSubscript(selection.hasFormat('subscript'))
            setIsSuperscript(selection.hasFormat('superscript'))
            setIsCode(selection.hasFormat('code'))
            setIsRTL($isParentElementRTL(selection))

            // Update links
            const node = getSelectedNode(selection)
            const parent = node.getParent()
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true)
            } else {
                setIsLink(false)
            }

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey)
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
                    const type = parentList ? parentList.getListType() : element.getListType()
                    setBlockType(type)
                } else {
                    const type = $isHeadingNode(element) ? element.getTag() : element.getType()
                    if (type in blockTypeToBlockName) {
                        setBlockType(type as keyof typeof blockTypeToBlockName)
                    }
                }
            }
        }
    }, [activeEditor])

    function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
        const anchor = selection.anchor
        const focus = selection.focus
        const anchorNode = selection.anchor.getNode()
        const focusNode = selection.focus.getNode()
        if (anchorNode === focusNode) {
            return anchorNode
        }
        const isBackward = selection.isBackward()
        if (isBackward) {
            return $isAtNodeEnd(focus) ? anchorNode : focusNode
        }
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode
    }

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                setActiveEditor(newEditor)
                $updateToolbar()
                return false
            },
            COMMAND_PRIORITY_CRITICAL,
        )
    }, [editor, $updateToolbar])

    useEffect(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar()
        })
    }, [activeEditor, $updateToolbar])

    useEffect(() => {
        return mergeRegister(
            activeEditor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar()
                })
            }),
            activeEditor.registerCommand<boolean>(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload)
                    return false
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            activeEditor.registerCommand<boolean>(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload)
                    return false
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        )
    }, [activeEditor, $updateToolbar])

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode())
            }
        })
    }

    const formatBold = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
    }

    const formatItalic = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
    }

    const formatUnderline = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
    }

    const formatStrikethrough = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
    }

    const formatSubscript = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
    }

    const formatSuperscript = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
    }

    const formatHighlight = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
    }

    const formatCode = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
    }

    const insertLineBreak = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                selection.insertLineBreak()
            }
        })
    }

    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection()
                $setBlocksType(selection, () => $createHeadingNode(headingSize))
            })
        } else {
            formatParagraph()
        }
    }

    function formatH1() {
        formatHeading('h1')
    }

    function formatH2() {
        formatHeading('h2')
    }

    function formatH3() {
        formatHeading('h3')
    }

    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
            formatParagraph()
        }
    }

    const formatCheckList = () => {
        if (blockType !== 'check') {
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        } else {
            formatParagraph()
        }
    }

    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
            formatParagraph()
        }
    }

    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = $getSelection()
                $setBlocksType(selection, () => $createQuoteNode())
            })
        } else {
            formatParagraph()
        }
    }

    const formatCodeBlock = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                let selection = $getSelection()

                if (selection !== null) {
                    if (selection.isCollapsed()) {
                        $setBlocksType(selection, () => $createCodeNode())
                    } else {
                        const textContent = selection.getTextContent()
                        const codeNode = $createCodeNode()
                        selection.insertNodes([codeNode])
                        selection = $getSelection()
                        if ($isRangeSelection(selection)) {
                            selection.insertRawText(textContent)
                        }
                    }
                }
            })
        } else {
            formatParagraph()
        }
    }

    function undo() {
        activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
    }

    function redo() {
        activeEditor.dispatchCommand(REDO_COMMAND, undefined)
    }

    return {
        activeEditor,
        blockType,
        isParagraph,
        isH1,
        isH2,
        isH3,
        isBullet,
        isCheck,
        isNumber,
        isQuote,
        isCodeBlock,
        selectedElementKey,
        isLink,
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        isSubscript,
        isSuperscript,
        isCode,
        isRTL,
        canUndo,
        canRedo,

        formatBold,
        formatItalic,
        formatUnderline,
        formatStrikethrough,
        formatSubscript,
        formatSuperscript,
        formatHighlight,
        formatCode,

        insertLineBreak,
        formatParagraph,
        formatH1,
        formatH2,
        formatH3,
        formatBulletList,
        formatCheckList,
        formatNumberedList,
        formatQuote,
        formatCodeBlock,

        undo,
        redo,
    }
}
