import React from 'react';
import {
  Bold, Italic, List, ListOrdered, Type,
  AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Layout, Download
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { useEditorStore } from '../store/useEditorStore';
import { exportToPdf } from '../utils/pdfExport';

const EditorToolbar: React.FC = () => {
  const { settings, headerHTML, footerHTML, pageBreaks } = useDocumentStore();
  const { editor } = useEditorStore();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (!editor) {
      alert('Editor not ready');
      return;
    }

    try {
      setIsExporting(true);
      console.log('Starting PDF export...');
      await exportToPdf({
        editor,
        settings,
        headerHTML,
        footerHTML,
        pageBreaks
      });
      console.log('PDF export requested successfully');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center gap-2 shadow-sm">
      <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Heading 1">
          <Heading1 size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Heading 2">
          <Heading2 size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Normal Text">
          <Type size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Bold size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Italic size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <List size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <ListOrdered size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <AlignLeft size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <AlignCenter size={18} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <AlignRight size={18} />
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors font-medium text-sm">
          <Layout size={16} />
          <span>Margins</span>
        </button>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors font-medium text-sm shadow-sm ${isExporting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
          <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
