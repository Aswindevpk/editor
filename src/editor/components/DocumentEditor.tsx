import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { DocumentPersistence } from './DocumentPersistence';
import { useDocumentStore } from '../store/useDocumentStore';
import { 
    FileText, 
    Cloud, 
    Download, 
    Loader2
} from 'lucide-react';
import { exportToPdf } from '../utils/pdfExport';

export const DocumentEditor: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);
    const {
        metadata,
        updateMetadata,
        activeEditor,
        isSaving,
        lastSaved,
        activeEditor: editor,
        settings,
        pageBreaks
    } = useDocumentStore();

    const handleExport = async () => {
        if (!editor || isExporting) return;
        setIsExporting(true);
        try {
            console.log('Exporting PDF for:', metadata.title);
            await exportToPdf({
                editor,
                settings,
                pageBreaks
            });
        } catch (error) {
            console.error('Failed to export PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const formatLastSaved = (dateStr: string | null) => {
        if (!dateStr) return 'Not saved yet';
        const date = new Date(dateStr);
        return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="flex flex-col h-screen bg-[#F9FBFF] text-gray-900 font-sans">
            <DocumentPersistence />
            {/* Top Navigation Bar */}
            <header className="bg-white shrink-0 py-3 px-4">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <FileText size={40} className="text-blue-600 fill-blue-600/10" />
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Title Row */}
                        <div className="flex items-center gap-1 group">
                            <input
                                type="text"
                                value={metadata.title}
                                onChange={(e) => updateMetadata({ title: e.target.value })}
                                className="text-sm text-gray-800 hover:outline hover:outline-1 hover:outline-gray-300 focus:outline focus:outline-2 focus:outline-blue-500 rounded px-2  -ml-2 bg-transparent transition-all max-w-[500px] truncate"
                            />
                           
                        </div>

                        {/* Save Status Row */}
                        <div className="flex items-center gap-1 -ml-1 mt-0.5 text-[11px] text-gray-500">
                            {isSaving ? (
                                <>
                                    <Loader2 size={13} className="animate-spin text-blue-500" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-0.5 hover:bg-gray-100 rounded text-gray-400" title="All changes saved to cloud">
                                        <Cloud size={12} />
                                    </div>
                                    <span className="text-[10px]">{formatLastSaved(lastSaved)}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-1.5">
                        <button
                            className="group flex items-center gap-2 bg-blue-600 hover:bg-[#0842a0] text-white px-5 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={handleExport}
                            disabled={isExporting}
                        >
                            {isExporting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} className="transition-transform group-hover:-translate-y-0.5" />
                            )}
                            <span className="whitespace-nowrap text-[12px]">
                                {isExporting ? 'Exporting...' : 'Export PDF'}
                            </span>
                        </button>

                    </div>
                </div>
            </header>

            {/* Editor Interface */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <EditorToolbar />

                <main className="flex flex-1 overflow-hidden">
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                        <EditorCanvas />
                    </div>
                </main>
            </div>

            {/* Status Footer */}
            <footer className="h-7 bg-white border-t px-4 flex items-center justify-between text-[11px] text-gray-400 select-none">
                <div className="flex items-center gap-4">
                    <span>Markdown Enabled</span>
                    <span>English (US)</span>
                    {activeEditor && (
                        <>
                            <span className="w-px h-3 bg-gray-200" />
                            <span>{activeEditor.storage?.characterCount?.words?.() || 0} words</span>
                            <span>{activeEditor.storage?.characterCount?.characters?.() || 0} characters</span>
                        </>

                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span>UTF-8</span>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Connected
                    </div>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Sora:wght@400;500;600&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                .prose {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
        </div>
    );
};

export default DocumentEditor;
