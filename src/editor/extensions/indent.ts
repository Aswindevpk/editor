import { Extension } from '@tiptap/core';

export interface IndentOptions {
    types: string[];
    indentStep: number;
    maxLevel: number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            /**
             * Set the indent attribute
             */
            indent: () => ReturnType;
            /**
             * Outdent the indent attribute
             */
            outdent: () => ReturnType;
        };
    }
}

export const Indent = Extension.create<IndentOptions>({
    name: 'indent',

    addOptions() {
        return {
            types: ['paragraph', 'heading', 'listItem', 'bulletList', 'orderedList'],
            indentStep: 40,
            maxLevel: 10,
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: element => {
                            const margin = element.style.marginLeft || '0';
                            return parseInt(margin, 10) / this.options.indentStep || 0;
                        },
                        renderHTML: attributes => {
                            if (!attributes.indent) {
                                return {};
                            }

                            return {
                                style: `margin-left: ${attributes.indent * this.options.indentStep}px`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            indent: () => ({ tr, state, dispatch }) => {
                const { selection } = state;
                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const indent = (node.attrs.indent || 0) + 1;
                        if (indent <= this.options.maxLevel) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                indent,
                            });
                        }
                        return false;
                    }
                });

                if (dispatch) dispatch(tr);
                return true;
            },
            outdent: () => ({ tr, state, dispatch }) => {
                const { selection } = state;
                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        const indent = (node.attrs.indent || 0) - 1;
                        if (indent >= 0) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                indent,
                            });
                        }
                        return false;
                    }
                });

                if (dispatch) dispatch(tr);
                return true;
            },
        };
    },
});
