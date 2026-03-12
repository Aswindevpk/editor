import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '../extensions/fontSize';
import { LineHeight } from '../extensions/lineHeight';
import CharacterCount from '@tiptap/extension-character-count';
import Focus from '@tiptap/extension-focus';
import Placeholder from '@tiptap/extension-placeholder';

const sharedUnderline = Underline;
const sharedLink = Link.configure({
    openOnClick: false,
    HTMLAttributes: {
        class: 'text-blue-600 underline cursor-pointer hover:text-blue-800 transition-colors',
    },
});

export const EDITOR_EXTENSIONS = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    sharedUnderline,
    sharedLink,
    Image.configure({
        allowBase64: true,
        HTMLAttributes: {
            class: 'rounded-lg shadow-md max-w-full h-auto my-4',
        },
    }),
    Table.configure({
        resizable: true,
        HTMLAttributes: {
            class: 'border-collapse table-auto w-full my-4',
        },
    }),
    TableRow,
    TableHeader,
    TableCell,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Typography,
    Highlight.configure({ multicolor: true }),
    Subscript,
    Superscript,
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    LineHeight,
    CharacterCount.configure({
        limit: 50000,
    }),
    Focus.configure({
        className: 'has-focus',
        mode: 'all',
    }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
                return `Heading ${node.attrs.level}`;
            }
            return 'Start typing your document...';
        },
        includeChildren: true,
    }),
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
];

/**
 * Specialized extensions for headers/footers - now unrestricted to allow full creative freedom
 */
export const HEADER_FOOTER_EXTENSIONS = [
    StarterKit.configure({
        heading: { levels: [1, 2, 3] },
    }),
    sharedUnderline,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    LineHeight,
    Highlight.configure({ multicolor: true }),
    sharedLink,
    Typography,
    CharacterCount,
];

/**
 * Editor configuration for "Perfect Paste"
 */
export const EDITOR_PROPS = {
    attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none',
    },
    handlePaste: (_view: any, _event: ClipboardEvent) => {

        return false; // Let default handle it with the extensive extension set
    },
};
