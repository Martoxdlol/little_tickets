import { expect, test } from 'bun:test'
import type { SerializedEditorState, SerializedLexicalNode, SerializedParagraphNode } from 'lexical'
import { createEditor, sanitizeEditorContent } from '../server'

test('editor fails on invalid state', async () => {
    const editor = createEditor()

    try {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        editor.parseEditorState('this will fail' as any)
        throw new Error('should not reach here')
    } catch (error) {
        expect(error).toBeDefined()
    }
})

test('editor fails on invalid update', async () => {
    const editor = createEditor()
    editor.update(() => {
        try {
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            editor.parseEditorState('this will fail' as any)
            throw new Error('should not reach here')
        } catch (error) {
            expect(error).toBeDefined()
        }
    })
})

test('sanitize editor content', async () => {
    const content: SerializedEditorState<SerializedLexicalNode | SerializedParagraphNode> = {
        root: {
            children: [
                { children: [], direction: null, format: '', indent: 0, type: 'paragraph', version: 1, textFormat: 0, textStyle: '' },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    }

    const serialized1 = JSON.stringify(content)

    const state = await sanitizeEditorContent(content)

    const serialized2 = JSON.stringify(state)

    expect(serialized1).toBe(serialized2)
})

test('sanitize editor content with extra invalid key', async () => {
    const content: SerializedEditorState<SerializedLexicalNode | SerializedParagraphNode> = {
        root: {
            children: [
                { children: [], direction: null, format: '', indent: 0, type: 'paragraph', version: 1, textFormat: 0, textStyle: '' },
            ],
            direction: null,
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    }

    const serialized1 = JSON.stringify(content)

    const state = await sanitizeEditorContent({
        thisIsInvalid: true,
        root: {
            ...content.root,
            thisIsInvalidToo: true,
        },
    })

    const serialized2 = JSON.stringify(state)

    expect(serialized1).toBe(serialized2)
})
