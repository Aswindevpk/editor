import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { PageControls } from './PageControls';
import { DocumentPersistence } from './DocumentPersistence';
import { useDocumentStore } from '../store/useDocumentStore';
import { FileText, ChevronLeft, Globe, Clock, Loader2 } from 'lucide-react';

export const DocumentEditor: React.FC = () => {
    const {
        metadata,
        updateMetadata,
        activeEditor,
        isSaving,
        lastSaved
    } = useDocumentStore();

    const formatLastSaved = (dateStr: string | null) => {
        if (!dateStr) return 'Not saved yet';
        const date = new Date(dateStr);
        return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
            <DocumentPersistence />
            {/* Top Navigation Bar */}
            <header className="h-14 bg-white border-b flex items-center px-4 shrink-0 justify-between">
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronLeft size={20} className="text-gray-500" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <FileText size={20} className="text-white" />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={metadata.title}
                                onChange={(e) => updateMetadata({ title: e.target.value })}
                                className="font-medium text-gray-900 focus:bg-gray-100 px-1 py-0.5 rounded border-none outline-none transition-colors"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                    {isSaving ? (
                                        <Loader2 size={10} className="animate-spin text-blue-500" />
                                    ) : (
                                        <Clock size={10} />
                                    )}
                                    {isSaving ? 'Saving...' : formatLastSaved(lastSaved)}
                                </span>
                                <span className="w-px h-2 bg-gray-200" />
                                <span className="flex items-center gap-1"><Globe size={10} /> Public on the web</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                        AS
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

                    <aside className="shrink-0 border-l">
                        <PageControls />
                    </aside>
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
