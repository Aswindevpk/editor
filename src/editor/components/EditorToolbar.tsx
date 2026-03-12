import React from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
    Download,
    List,
    ListOrdered,
    CheckSquare,
    IndentIncrease,
    IndentDecrease,
    Baseline,
    Highlighter,
    Eraser,
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { exportToPdf } from '../utils/pdfExport';

export const EditorToolbar: React.FC = () => {
    const {
        metadata,
        activeEditor: editor,
        settings,
        headerHTML,
        footerHTML,
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
        if (!editor) return;
        try {
            console.log('Exporting PDF for:', metadata.title);
            await exportToPdf({
                editor,
                settings,
                headerHTML,
                footerHTML,
                pageBreaks
            });
        } catch (error) {
            console.error('Failed to export PDF:', error);
        }
    };

    const run = (fn: (editor: any) => any) => {
        if (editor) {
            fn(editor.chain().focus()).run();
        }
    };

    const families = [
        { label: 'Default', value: 'Inter' },
        { label: 'Serif', value: 'serif' },
        { label: 'Monospace', value: 'monospace' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Sora', value: 'Sora' },
    ];

    const styles = [
        { label: 'Normal text', value: 'paragraph' },
        { label: 'Heading 1', value: 'heading', level: 1 },
        { label: 'Heading 2', value: 'heading', level: 2 },
        { label: 'Heading 3', value: 'heading', level: 3 },
        { label: 'Heading 4', value: 'heading', level: 4 },
        { label: 'Heading 5', value: 'heading', level: 5 },
        { label: 'Heading 6', value: 'heading', level: 6 },
    ];

    const getCurrentStyle = () => {
        if (!editor) return 'paragraph';
        const activeHeading = styles.find(s => s.value === 'heading' && editor.isActive('heading', { level: s.level }));
        return activeHeading ? `${activeHeading.value}-${activeHeading.level}` : 'paragraph';
    };

    return (
        <div className="sticky top-0 z-50 flex items-center gap-1 bg-white border-b px-4 py-1.5 shadow-sm min-w-max overflow-x-auto custom-scrollbar shrink-0">
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
                        className="text-xs border rounded px-1.5 py-1 outline-none hover:bg-gray-50 cursor-pointer text-gray-700 w-32"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'paragraph') {
                                run(ed => ed.setParagraph());
                            } else {
                                const level = parseInt(val.split('-')[1]);
                                run(ed => ed.toggleHeading({ level: level as any }));
                            }
                        }}
                        value={getCurrentStyle()}
                        disabled={!editor}
                    >
                        {styles.map(s => (
                            <option
                                key={s.level ? `${s.value}-${s.level}` : s.value}
                                value={s.level ? `${s.value}-${s.level}` : s.value}
                            >
                                {s.label}
                            </option>
                        ))}
                    </select>

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
                    <Button
                        onClick={() => run(e => e.toggleTaskList())}
                        active={editor?.isActive('taskList')}
                        disabled={!editor}
                        title="Task List"
                    >
                        <CheckSquare size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.sinkListItem('listItem'))}
                        disabled={!editor}
                        title="Indent"
                    >
                        <IndentIncrease size={16} />
                    </Button>
                    <Button
                        onClick={() => run(e => e.liftListItem('listItem'))}
                        disabled={!editor}
                        title="Outdent"
                    >
                        <IndentDecrease size={16} />
                    </Button>
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
                    <Button onClick={() => run(e => e.unsetAllMarks().clearNodes())} disabled={!editor} title="Clear Formatting">
                        <Eraser size={16} />
                    </Button>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium"
                    onClick={handleExport}
                >
                    <Download size={14} />
                    Export PDF
                </button>
            </div>
        </div>
    );
};
