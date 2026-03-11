import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDocumentStore } from '../store/useDocumentStore';

interface HeaderFooterEditorProps {
  type: 'header' | 'footer';
  onClose: () => void;
}

const HeaderFooterEditor: React.FC<HeaderFooterEditorProps> = ({ type, onClose }) => {
  const { headerHTML, setHeaderHTML, footerHTML, setFooterHTML, settings } = useDocumentStore();
  
  const content = type === 'header' ? headerHTML : footerHTML;
  const setContent = type === 'header' ? setHeaderHTML : setFooterHTML;

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[1em] w-full',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Escape') {
          onClose();
          return true;
        }
        return false;
      },
    },
  });

  // Handle clicking outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.header-footer-editor-container')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      className="header-footer-editor-container w-full h-full flex items-center bg-blue-50/30 ring-2 ring-blue-400 ring-inset rounded-sm"
      style={{
        paddingLeft: `${settings.marginLeft}px`,
        paddingRight: `${settings.marginRight}px`,
      }}
    >
      <EditorContent editor={editor} className="w-full" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] font-medium text-blue-500 uppercase tracking-wider bg-white px-1.5 py-0.5 rounded shadow-sm border border-blue-200">
          Editing {type}
        </span>
        <span className="text-[10px] text-blue-400 bg-white px-1 py-0.5 rounded shadow-sm border border-blue-100">
          Esc to save
        </span>
      </div>
    </div>
  );
};

export default HeaderFooterEditor;
