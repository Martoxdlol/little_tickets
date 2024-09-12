import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

export const nodes = [
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
]
