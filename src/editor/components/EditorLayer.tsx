import React, { useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useDocumentStore } from '../store/useDocumentStore';
import { usePagination } from '../hooks/usePagination';
import { EDITOR_EXTENSIONS, EDITOR_PROPS } from '../config/editorExtensions';

const EditorLayer: React.FC = () => {
    const { settings, pageBreaks, setActiveEditor } = useDocumentStore();

    const editor = useEditor({
        extensions: EDITOR_EXTENSIONS,
        content: '',
        editorProps: EDITOR_PROPS,
    });

    // Sync editor instance to store
    useEffect(() => {
        if (editor) {
            console.log('Setting editor instance in store:', editor);
            setActiveEditor(editor);
        }
        return () => {
            console.log('Clearing editor instance from store');
            setActiveEditor(null);
        };
    }, [editor, setActiveEditor]);

    const { calculatePagination } = usePagination((editor?.options.element as HTMLElement) || null);

    // We inject the gap jump logic via dynamic CSS
    const gapJumpStyles = useMemo(() => {
        if (!pageBreaks.length) return '';

        // Gap = mb-10 (40px)
        const jumpHeight = settings.marginBottom + 40 + settings.marginTop;

        return pageBreaks.map((breakIndex) => {
            // Tiptap children are direct descendants of .tiptap
            return `
        .tiptap > *:nth-child(${breakIndex + 1}) {
          margin-top: ${jumpHeight}px !important;
        }
      `;
        }).join('\n');
    }, [pageBreaks, settings]);

    return (
        <div className="relative z-10 transition-all duration-300">
            <style>{gapJumpStyles}</style>
            <EditorContent
                editor={editor}
                className="editor-container mx-auto"
                style={{
                    width: `${settings.width}px`,
                    paddingTop: `${settings.marginTop}px`,
                    paddingBottom: `${settings.marginBottom}px`,
                    paddingLeft: `${settings.marginLeft}px`,
                    paddingRight: `${settings.marginRight}px`,
                }}
                onInput={calculatePagination}
            />
        </div>
    );
};

export default EditorLayer;
