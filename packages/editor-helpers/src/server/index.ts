import { createHeadlessEditor } from '@lexical/headless'
import { $isMarkNode, $unwrapMarkNode } from '@lexical/mark'
import { $getRoot, $isElementNode, type LexicalNode, type SerializedEditorState } from 'lexical'
import { nodes } from '../services'

export function createEditor() {
    return createHeadlessEditor({
        namespace: 'validation',
        nodes: [...nodes],
        onError: (error) => {
            console.error(error)
        },
    })
}

function $sanitizeNode(node: LexicalNode) {
    try {
        if ($isMarkNode(node)) {
            $unwrapMarkNode(node)
            return
        }
        if ($isElementNode(node)) {
            const children = node.getChildren()
            for (const child of children) {
                $sanitizeNode(child)
            }
        }
    } catch (error) {
        return false
    }
    return true
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function sanitizeEditorContent(content: any): Promise<{ json: SerializedEditorState; text: string }> {
    return new Promise((resolve, reject) => {
        const editor = createEditor()
        try {
            editor.setEditorState(editor.parseEditorState(content))
        } catch (error) {
            reject(error)
        }

        editor.update(() => {
            if (!$sanitizeNode($getRoot())) {
                return reject(new Error('Failed to sanitize editor content.'))
            }

            resolve({
                json: editor.toJSON().editorState,
                text: $getRoot().getTextContent(),
            })
        })
    })
}

export async function safeSanitizeEditorContent(content: unknown) {
    try {
        return await sanitizeEditorContent(content)
    } catch (error) {
        return null
    }
}
