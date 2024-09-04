/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    type ElementTransformer,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
    type Transformer,
} from '@lexical/markdown'
import { $createHorizontalRuleNode, $isHorizontalRuleNode, HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import type { LexicalNode } from 'lexical'

export const HR: ElementTransformer = {
    dependencies: [HorizontalRuleNode],
    export: (node: LexicalNode) => {
        return $isHorizontalRuleNode(node) ? '***' : null
    },
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
        const line = $createHorizontalRuleNode()

        // TODO: Get rid of isImport flag
        if (isImport || parentNode.getNextSibling() != null) {
            parentNode.replace(line)
        } else {
            parentNode.insertBefore(line)
        }

        line.selectNext()
    },
    type: 'element',
}

export const EDITOR_TRANSFORMERS: Array<Transformer> = [
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
]
