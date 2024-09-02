/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorThemeClasses } from 'lexical'

import './theme.css'

const theme: EditorThemeClasses = {
    autocomplete: 'LexicalEditorLink__autocomplete',
    blockCursor: 'LexicalEditorLink__blockCursor',
    characterLimit: 'LexicalEditorLink__characterLimit',
    code: 'LexicalEditorLink__code',
    codeHighlight: {
        atrule: 'LexicalEditorLink__tokenAttr',
        attr: 'LexicalEditorLink__tokenAttr',
        boolean: 'LexicalEditorLink__tokenProperty',
        builtin: 'LexicalEditorLink__tokenSelector',
        cdata: 'LexicalEditorLink__tokenComment',
        char: 'LexicalEditorLink__tokenSelector',
        class: 'LexicalEditorLink__tokenFunction',
        'class-name': 'LexicalEditorLink__tokenFunction',
        comment: 'LexicalEditorLink__tokenComment',
        constant: 'LexicalEditorLink__tokenProperty',
        deleted: 'LexicalEditorLink__tokenProperty',
        doctype: 'LexicalEditorLink__tokenComment',
        entity: 'LexicalEditorLink__tokenOperator',
        function: 'LexicalEditorLink__tokenFunction',
        important: 'LexicalEditorLink__tokenVariable',
        inserted: 'LexicalEditorLink__tokenSelector',
        keyword: 'LexicalEditorLink__tokenAttr',
        namespace: 'LexicalEditorLink__tokenVariable',
        number: 'LexicalEditorLink__tokenProperty',
        operator: 'LexicalEditorLink__tokenOperator',
        prolog: 'LexicalEditorLink__tokenComment',
        property: 'LexicalEditorLink__tokenProperty',
        punctuation: 'LexicalEditorLink__tokenPunctuation',
        regex: 'LexicalEditorLink__tokenVariable',
        selector: 'LexicalEditorLink__tokenSelector',
        string: 'LexicalEditorLink__tokenSelector',
        symbol: 'LexicalEditorLink__tokenProperty',
        tag: 'LexicalEditorLink__tokenProperty',
        url: 'LexicalEditorLink__tokenOperator',
        variable: 'LexicalEditorLink__tokenVariable',
    },
    embedBlock: {
        base: 'LexicalEditorLink__embedBlock',
        focus: 'LexicalEditorLink__embedBlockFocus',
    },
    hashtag: 'LexicalEditorLink__hashtag',
    heading: {
        h1: 'LexicalEditorLink__h1',
        h2: 'LexicalEditorLink__h2',
        h3: 'LexicalEditorLink__h3',
        h4: 'LexicalEditorLink__h4',
        h5: 'LexicalEditorLink__h5',
        h6: 'LexicalEditorLink__h6',
    },
    hr: 'LexicalEditorLink__hr',
    image: 'editor-image',
    indent: 'LexicalEditorLink__indent',
    inlineImage: 'inline-editor-image',
    layoutContainer: 'LexicalEditorLink__layoutContainer',
    layoutItem: 'LexicalEditorLink__layoutItem',
    link: 'LexicalEditorLink__link',
    list: {
        checklist: 'LexicalEditorLink__checklist',
        listitem: 'LexicalEditorLink__listItem',
        listitemChecked: 'LexicalEditorLink__listItemChecked',
        listitemUnchecked: 'LexicalEditorLink__listItemUnchecked',
        nested: {
            listitem: 'LexicalEditorLink__nestedListItem',
        },
        olDepth: [
            'LexicalEditorLink__ol1',
            'LexicalEditorLink__ol2',
            'LexicalEditorLink__ol3',
            'LexicalEditorLink__ol4',
            'LexicalEditorLink__ol5',
        ],
        ul: 'LexicalEditorLink__ul',
    },
    ltr: 'LexicalEditorLink__ltr',
    mark: 'LexicalEditorLink__mark',
    markOverlap: 'LexicalEditorLink__markOverlap',
    paragraph: 'LexicalEditorLink__paragraph',
    quote: 'LexicalEditorLink__quote',
    rtl: 'LexicalEditorLink__rtl',
    table: 'LexicalEditorLink__table',
    tableCell: 'LexicalEditorLink__tableCell',
    tableCellActionButton: 'LexicalEditorLink__tableCellActionButton',
    tableCellActionButtonContainer:
        'LexicalEditorLink__tableCellActionButtonContainer',
    tableCellEditing: 'LexicalEditorLink__tableCellEditing',
    tableCellHeader: 'LexicalEditorLink__tableCellHeader',
    tableCellPrimarySelected: 'LexicalEditorLink__tableCellPrimarySelected',
    tableCellResizer: 'LexicalEditorLink__tableCellResizer',
    tableCellSelected: 'LexicalEditorLink__tableCellSelected',
    tableCellSortedIndicator: 'LexicalEditorLink__tableCellSortedIndicator',
    tableResizeRuler: 'LexicalEditorLink__tableCellResizeRuler',
    tableSelected: 'LexicalEditorLink__tableSelected',
    tableSelection: 'LexicalEditorLink__tableSelection',
    text: {
        bold: 'LexicalEditorLink__textBold',
        code: 'LexicalEditorLink__textCode',
        italic: 'LexicalEditorLink__textItalic',
        strikethrough: 'LexicalEditorLink__textStrikethrough',
        subscript: 'LexicalEditorLink__textSubscript',
        superscript: 'LexicalEditorLink__textSuperscript',
        underline: 'LexicalEditorLink__textUnderline',
        underlineStrikethrough: 'LexicalEditorLink__textUnderlineStrikethrough',
    },
}

export default theme
