import React, { useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentStore } from '../store/useDocumentStore';
import { usePagination } from '../hooks/usePagination';
import { useEditorStore } from '../store/useEditorStore';

const EditorLayer: React.FC = () => {
  const { settings, pageBreaks } = useDocumentStore();
  const { setEditor } = useEditorStore();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `
      <h1>Paginated Document Editor</h1>
      <p>Start typing to see the magic happen...</p>
      ${'<p>Line of text</p>'.repeat(50)}
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  // Sync editor instance to store
  useEffect(() => {
    if (editor) {
      console.log('Setting editor instance in store:', editor);
      setEditor(editor);
    }
    return () => {
      console.log('Clearing editor instance from store');
      setEditor(null);
    };
  }, [editor, setEditor]);

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
    <div className="relative z-10 min-h-screen pt-10 pb-40">
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
