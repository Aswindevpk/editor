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
    Undo2,
    Redo2,
    Download,
    List,
    ListOrdered,
    Highlighter,
    Baseline,
    Loader2,
    ListChevronsUpDown,
    ChevronDown,
    Save,
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { exportToPdf } from '../utils/pdfExport';

export const EditorToolbar: React.FC = () => {
    const [isExporting, setIsExporting] = React.useState(false);
    const [showLineSpacing, setShowLineSpacing] = React.useState(false);
    const [showHeading, setShowHeading] = React.useState(false);
    const [showFont, setShowFont] = React.useState(false);
    const [showFontSize, setShowFontSize] = React.useState(false);

    const lineSpacingRef = React.useRef<HTMLDivElement>(null);
    const headingRef = React.useRef<HTMLDivElement>(null);
    const fontRef = React.useRef<HTMLDivElement>(null);
    const fontSizeRef = React.useRef<HTMLDivElement>(null);
    const {
        metadata,
        activeEditor: editor,
        settings,
        pageBreaks,
        saveDocument,
        isSaving
    } = useDocumentStore();

    // Close dropdowns on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (lineSpacingRef.current && !lineSpacingRef.current.contains(target)) setShowLineSpacing(false);
            if (headingRef.current && !headingRef.current.contains(target)) setShowHeading(false);
            if (fontRef.current && !fontRef.current.contains(target)) setShowFont(false);
            if (fontSizeRef.current && !fontSizeRef.current.contains(target)) setShowFontSize(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const getHeadingValue = () => {
        if (editor?.isActive('heading', { level: 1 })) return 'h1';
        if (editor?.isActive('heading', { level: 2 })) return 'h2';
        if (editor?.isActive('heading', { level: 3 })) return 'h3';
        if (editor?.isActive('heading', { level: 4 })) return 'h4';
        if (editor?.isActive('heading', { level: 5 })) return 'h5';
        if (editor?.isActive('heading', { level: 6 })) return 'h6';
        return 'p';
    };

    return (
        <div className="editor-toolbar sticky top-0 z-50 flex items-center gap-1 bg-white border-b px-4 py-1.5 shadow-sm min-w-max shrink-0">
            <div className="relative flex items-center gap-0.5">
                {!editor && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center text-[10px] text-gray-400 font-medium border rounded">
                        Click page to edit
                    </div>
                )}

                {/* History */}
                <div className="flex items-center gap-0.5 pr-2 border-r mr-2">
                    <Button onClick={() => run(e => e.undo())} disabled={!editor} title="Undo">
                        <Undo2 size={16} />
                    </Button>
                    <Button onClick={() => run(e => e.redo())} disabled={!editor} title="Redo">
                        <Redo2 size={16} />
                    </Button>
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <Button 
                        onClick={() => saveDocument()} 
                        disabled={!editor || isSaving} 
                        title="Save Changes"
                        active={isSaving}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin text-blue-500" /> : <Save size={16} />}
                    </Button>
                </div>

                {/* Typography & Styles */}
                <div className="flex items-center gap-1 pr-2 border-r mr-2">
                    {/* Heading Dropdown */}
                    <div className="relative" ref={headingRef}>
                        <button
                            onClick={() => setShowHeading(!showHeading)}
                            disabled={!editor}
                            className={`flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showHeading ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Text Style"
                        >
                            <span className="w-20 text-left truncate">
                                {getHeadingValue() === 'p' ? 'Normal Text' : `Heading ${getHeadingValue().replace('h', '')}`}
                            </span>
                            <ChevronDown size={12} className={`transition-transform ${showHeading ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showHeading && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[140px]">
                                {[
                                    { label: 'Normal Text', value: 'p' },
                                    { label: 'Heading 1', value: 'h1' },
                                    { label: 'Heading 2', value: 'h2' },
                                    { label: 'Heading 3', value: 'h3' },
                                    { label: 'Heading 4', value: 'h4' },
                                    { label: 'Heading 5', value: 'h5' },
                                    { label: 'Heading 6', value: 'h6' },
                                ].map(h => (
                                    <button
                                        key={h.value}
                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                                            getHeadingValue() === h.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                        }`}
                                        onClick={() => {
                                            if (h.value === 'p') run(ed => ed.setParagraph());
                                            else run(ed => ed.toggleHeading({ level: parseInt(h.value.replace('h', '')) as any }));
                                            setShowHeading(false);
                                        }}
                                    >
                                        {h.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Font Family Dropdown */}
                    <div className="relative" ref={fontRef}>
                        <button
                            onClick={() => setShowFont(!showFont)}
                            disabled={!editor}
                            className={`flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showFont ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Font Family"
                        >
                            <span className="w-24 text-left truncate">
                                {editor?.getAttributes('textStyle').fontFamily || families[0].label}
                            </span>
                            <ChevronDown size={12} className={`transition-transform ${showFont ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showFont && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[160px] max-h-[300px] overflow-y-auto custom-scrollbar">
                                {families.map(f => (
                                    <button
                                        key={f.value}
                                        style={{ fontFamily: f.value }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                            editor?.getAttributes('textStyle').fontFamily === f.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                        }`}
                                        onClick={() => {
                                            run(ed => ed.setFontFamily(f.value));
                                            setShowFont(false);
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Font Size Dropdown */}
                    <div className="relative" ref={fontSizeRef}>
                        <button
                            onClick={() => setShowFontSize(!showFontSize)}
                            disabled={!editor}
                            className={`flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showFontSize ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Font Size"
                        >
                            <span className="w-8 text-center">
                                {(editor?.getAttributes('textStyle').fontSize || '16px').replace('px', '')}
                            </span>
                            <ChevronDown size={12} className={`transition-transform ${showFontSize ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showFontSize && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[70px] max-h-[250px] overflow-y-auto custom-scrollbar">
                                {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96].map(size => (
                                    <button
                                        key={size}
                                        className={`w-full text-center px-3 py-1 text-xs hover:bg-gray-100 transition-colors ${
                                            editor?.getAttributes('textStyle').fontSize === `${size}px` ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                        }`}
                                        onClick={() => {
                                            run(ed => ed.setFontSize(`${size}px`));
                                            setShowFontSize(false);
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
                                            <div className="relative" ref={lineSpacingRef}>
                        <Button
                            onClick={() => setShowLineSpacing(!showLineSpacing)}
                            disabled={!editor}
                            active={showLineSpacing}
                            title="Line Spacing"
                        >
                            <ListChevronsUpDown size={16} />
                        </Button>
                        
                        {showLineSpacing && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[100px]">
                                {[1, 1.15, 1.5, 2, 2.5, 3].map(spacing => (
                                    <button
                                        key={spacing}
                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${
                                            (editor?.getAttributes('paragraph').lineHeight === spacing.toString() || 
                                             editor?.getAttributes('heading').lineHeight === spacing.toString()) ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                        }`}
                                        onClick={() => {
                                            run(ed => ed.setLineHeight(spacing.toString()));
                                            setShowLineSpacing(false);
                                        }}
                                    >
                                        {spacing}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
