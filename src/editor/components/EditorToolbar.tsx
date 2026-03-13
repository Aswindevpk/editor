import React from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Outdent,
    Indent,
    Undo,
    Redo,
    Download,
    List,
    ListOrdered,
    Highlighter,
    Baseline,
    Loader2,
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { exportToPdf } from '../utils/pdfExport';

export const EditorToolbar: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);
    const {
        metadata,
        activeEditor: editor,
        settings,
        pageBreaks
    } = useDocumentStore();

    const Button = ({ onClick, children, active, disabled, title }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

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

    const run = (fn: (editor: any) => any) => {
        if (editor) {
            fn(editor.chain().focus()).run();
        }
    };

    const families = [
        { label: 'Inter', value: 'Inter' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Arial', value: 'Arial' },
        { label: 'Helvetica', value: 'Helvetica' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Merriweather', value: 'Merriweather' },
        { label: 'JetBrains Mono', value: 'JetBrains Mono' },
        { label: 'Fira Code', value: 'Fira Code' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Montserrat', value: 'Montserrat' },
    ];


    return (
        <div className="editor-toolbar sticky top-0 z-50 flex items-center gap-1 bg-white border-b px-4 py-1.5 shadow-sm min-w-max overflow-x-auto custom-scrollbar shrink-0">
            <div className="relative flex items-center gap-0.5">
                {!editor && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center text-[10px] text-gray-400 font-medium border rounded">
                        Click page to edit
                    </div>
                )}

                {/* History */}
                <div className="flex items-center gap-0.5 pr-2 border-r mr-2">
                    <Button onClick={() => run(e => e.undo())} disabled={!editor} title="Undo">
                        <Undo size={16} />
                    </Button>
                    <Button onClick={() => run(e => e.redo())} disabled={!editor} title="Redo">
                        <Redo size={16} />
                    </Button>
                </div>

                {/* Typography & Styles */}
                <div className="flex items-center gap-1 pr-2 border-r mr-2">


                    <select
                        className="text-xs border rounded px-1.5 py-1 outline-none hover:bg-gray-50 cursor-pointer text-gray-700"
                        onChange={(e) => run(ed => ed.setFontFamily(e.target.value))}
                        value={editor?.getAttributes('textStyle').fontFamily || families[0].value}
                        disabled={!editor}
                    >
                        {families.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>

                    <select
                        className="text-xs border rounded px-1.5 py-1 outline-none hover:bg-gray-50 cursor-pointer text-gray-700 w-16"
                        onChange={(e) => run(ed => ed.setFontSize(e.target.value))}
                        value={editor?.getAttributes('textStyle').fontSize || '16px'}
                        disabled={!editor}
                    >
                        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96].map(size => (
                            <option key={size} value={`${size}px`}>{size}</option>
                        ))}
                    </select>
                </div>

                {/* Basic Formatting */}
                <div className="flex items-center gap-0.5 pr-2 border-r mr-2">
                    <Button
                        onClick={() => run(e => e.toggleBold())}
                        active={editor?.isActive('bold')}
                        disabled={!editor}
                        title="Bold"
                    >
                        <Bold size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.toggleItalic())}
                        active={editor?.isActive('italic')}
                        disabled={!editor}
                        title="Italic"
                    >
                        <Italic size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.toggleUnderline())}
                        active={editor?.isActive('underline')}
                        disabled={!editor}
                        title="Underline"
                    >
                        <Underline size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.toggleStrike())}
                        active={editor?.isActive('strike')}
                        disabled={!editor}
                        title="Strikethrough"
                    >
                        <Strikethrough size={16} />
                    </Button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-0.5 pr-2 border-r mr-2">
                    <Button
                        onClick={() => run(e => e.setTextAlign('left'))}
                        active={editor?.isActive({ textAlign: 'left' })}
                        disabled={!editor}
                        title="Align Left"
                    >
                        <AlignLeft size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.setTextAlign('center'))}
                        active={editor?.isActive({ textAlign: 'center' })}
                        disabled={!editor}
                        title="Align Center"
                    >
                        <AlignCenter size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.setTextAlign('right'))}
                        active={editor?.isActive({ textAlign: 'right' })}
                        disabled={!editor}
                        title="Align Right"
                    >
                        <AlignRight size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.setTextAlign('justify'))}
                        active={editor?.isActive({ textAlign: 'justify' })}
                        disabled={!editor}
                        title="Justify"
                    >
                        <AlignJustify size={16} />
                    </Button>
                </div>

                {/* Lists & Indent */}
                <div className="flex items-center gap-0.5 pr-2 border-r mr-2">
                    <Button
                        onClick={() => run(e => e.toggleBulletList())}
                        active={editor?.isActive('bulletList')}
                        disabled={!editor}
                        title="Bullet List"
                    >
                        <List size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.toggleOrderedList())}
                        active={editor?.isActive('orderedList')}
                        disabled={!editor}
                        title="Ordered List"
                    >
                        <ListOrdered size={16} />
                    </Button>
                    <div className="flex items-center gap-0.5 ml-2">
                        <Button
                            onClick={() => run(e => e.outdent())}
                            disabled={!editor}
                            title="Outdent"
                        >
                            <Outdent size={16} />
                        </Button>
                        <Button
                            onClick={() => run(e => e.indent())}
                            disabled={!editor}
                            title="Indent"
                        >
                            <Indent size={16} />
                        </Button>
                    </div>
                </div>

                {/* Colors & Utils */}
                <div className="flex items-center gap-0.5">
                    <div className="relative group">
                        <Button disabled={!editor} title="Text Color">
                            <Baseline size={16} />
                        </Button>
                        <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                            onChange={(e) => run(ed => ed.setColor(e.target.value))}
                            disabled={!editor}
                        />
                    </div>
                    <div className="relative group">
                        <Button disabled={!editor} title="Highlight Color">
                            <Highlighter size={16} />
                        </Button>
                        <input
                            type="color"
                            className="absolute inset-0 opacity-0 cursor-pointer pointer-events-auto"
                            onChange={(e) => run(ed => ed.setHighlight({ color: e.target.value }))}
                            disabled={!editor}
                        />
                    </div>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleExport}
                    disabled={isExporting}
                >
                    {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
            </div>
        </div>
    );
};
