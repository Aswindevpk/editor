import { Extension } from '@tiptap/core';

export const LineHeight = Extension.create({
    name: 'lineHeight',

    addGlobalAttributes() {
        return [
            {
                types: ['paragraph', 'heading'],
                attributes: {
                    lineHeight: {
                        default: null,
                        parseHTML: element => element.style.lineHeight,
                        renderHTML: attributes => {
                            if (!attributes.lineHeight) {
                                return {};
                            }
                            return {
                                style: `line-height: ${attributes.lineHeight}`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setLineHeight: (lineHeight: string) => ({ commands }: any) => {
                return ['paragraph', 'heading'].every(type => commands.updateAttributes(type, { lineHeight }));
            },
            unsetLineHeight: () => ({ commands }: any) => {
                return ['paragraph', 'heading'].every(type => commands.updateAttributes(type, { lineHeight: null }));
            },
        } as any;
    },
});
