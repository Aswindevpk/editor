import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useDocumentStore } from '../store/useDocumentStore';
import { HEADER_FOOTER_EXTENSIONS } from '../config/editorExtensions';
import { mmToPx } from '../utils/pageSizes';

interface HeaderFooterEditorProps {
  type: 'header' | 'footer';
  onClose: () => void;
}

const HeaderFooterEditor: React.FC<HeaderFooterEditorProps> = ({ type, onClose }) => {
  const { headerJSON, setHeaderJSON, footerJSON, setFooterJSON, settings, setActiveEditor } = useDocumentStore();

  const content = type === 'header' ? headerJSON : footerJSON;
  const setContent = type === 'header' ? setHeaderJSON : setFooterJSON;

  const editor = useEditor({
    extensions: HEADER_FOOTER_EXTENSIONS,
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
    onFocus: ({ editor }) => {
      setActiveEditor(editor);
    },
    autofocus: 'start',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[1em] w-full',
      },
      handleKeyDown: (_view, event) => {
        if (event.key === 'Escape') {
          onClose();
          return true;
        }
        return false;
      },
    },
  });

  // Sync active editor to store
  React.useEffect(() => {
    if (editor) {
      setActiveEditor(editor);
    }
    // We don't clear on unmount here because main editor should claim it
  }, [editor, setActiveEditor]);

  // Handle clicking outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.header-footer-editor-container') && 
          !target.closest('.editor-toolbar') && 
          !target.closest('.page-controls')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="header-footer-editor-container w-full h-full flex items-center bg-blue-50/30 ring-1 ring-blue-400 ring-inset "
      style={{
        paddingLeft: `${mmToPx(settings.margins.left)}px`,
        paddingRight: `${mmToPx(settings.margins.right)}px`,
      }}
    >
      <EditorContent editor={editor} className="w-full" />

    </div>
  );
};

export default HeaderFooterEditor;
