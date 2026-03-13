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
    List,
    ListOrdered,
    Highlighter,
    Baseline,
    Loader2,
    ListChevronsUpDown,
    ChevronDown,
    Save,
    Layout,
    Maximize,
    StickyNote,
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { PAGE_SIZES, type PageSizeType } from '../utils/pageSizes';

export const EditorToolbar: React.FC = () => {
    const [showLineSpacing, setShowLineSpacing] = React.useState(false);
    const [showHeading, setShowHeading] = React.useState(false);
    const [showFont, setShowFont] = React.useState(false);
    const [showFontSize, setShowFontSize] = React.useState(false);
    const [showOrientation, setShowOrientation] = React.useState(false);
    const [showPageSize, setShowPageSize] = React.useState(false);
    const [showMargins, setShowMargins] = React.useState(false);

    const lineSpacingRef = React.useRef<HTMLDivElement>(null);
    const headingRef = React.useRef<HTMLDivElement>(null);
    const fontRef = React.useRef<HTMLDivElement>(null);
    const fontSizeRef = React.useRef<HTMLDivElement>(null);
    const orientationRef = React.useRef<HTMLDivElement>(null);
    const pageSizeRef = React.useRef<HTMLDivElement>(null);
    const marginsRef = React.useRef<HTMLDivElement>(null);
    const {
        activeEditor: editor,
        settings,
        saveDocument,
        isSaving,
        updateSettings
    } = useDocumentStore();

    // Close dropdowns on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (lineSpacingRef.current && !lineSpacingRef.current.contains(target)) setShowLineSpacing(false);
            if (headingRef.current && !headingRef.current.contains(target)) setShowHeading(false);
            if (fontRef.current && !fontRef.current.contains(target)) setShowFont(false);
            if (fontSizeRef.current && !fontSizeRef.current.contains(target)) setShowFontSize(false);
            if (orientationRef.current && !orientationRef.current.contains(target)) setShowOrientation(false);
            if (pageSizeRef.current && !pageSizeRef.current.contains(target)) setShowPageSize(false);
            if (marginsRef.current && !marginsRef.current.contains(target)) setShowMargins(false);
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
        <div className="editor-toolbar sticky top-0 z-50 flex items-center gap-1 px-4 py-1.5 shadow-sm bg-white">
            <div className="relative flex items-center gap-2 flex-wrap flex-1 bg-blue-50/50 py-2 px-4 rounded-lg">
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
                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${getHeadingValue() === h.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
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
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${editor?.getAttributes('textStyle').fontFamily === f.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
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
                                        className={`w-full text-center px-3 py-1 text-xs hover:bg-gray-100 transition-colors ${editor?.getAttributes('textStyle').fontSize === `${size}px` ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
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
                                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${(editor?.getAttributes('paragraph').lineHeight === spacing.toString() ||
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

                {/* Page Setup Section */}
                <div className="flex items-center gap-1 pl-2 border-l ml-2">
                    {/* Page Size */}
                    <div className="relative" ref={pageSizeRef}>
                        <button
                            onClick={() => setShowPageSize(!showPageSize)}
                            className={`flex items-center gap-1.5 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showPageSize ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Page Size"
                        >
                            <StickyNote size={14} />
                            <span className="truncate max-w-[60px]">{PAGE_SIZES[settings.size as PageSizeType]?.label || settings.size}</span>
                            <ChevronDown size={12} className={`transition-transform ${showPageSize ? 'rotate-180' : ''}`} />
                        </button>

                        {showPageSize && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[200px] max-h-[300px] overflow-y-auto custom-scrollbar">
                                {(Object.keys(PAGE_SIZES) as PageSizeType[]).map((size) => (
                                    <button
                                        key={size}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${settings.size === size ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                            }`}
                                        onClick={() => {
                                            updateSettings({ size });
                                            setShowPageSize(false);
                                        }}
                                    >
                                        <div className="font-medium">{PAGE_SIZES[size].label}</div>
                                        <div className="text-[10px] text-gray-500">{PAGE_SIZES[size].widthMm} x {PAGE_SIZES[size].heightMm} mm</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Orientation */}
                    <div className="relative" ref={orientationRef}>
                        <button
                            onClick={() => setShowOrientation(!showOrientation)}
                            className={`flex items-center gap-1.5 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showOrientation ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Page Orientation"
                        >
                            <Layout size={14} />
                            <span className="capitalize">{settings.orientation}</span>
                            <ChevronDown size={12} className={`transition-transform ${showOrientation ? 'rotate-180' : ''}`} />
                        </button>

                        {showOrientation && (
                            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg py-1 z-[60] min-w-[120px]">
                                {[
                                    { label: 'Portrait', value: 'portrait' },
                                    { label: 'Landscape', value: 'landscape' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${settings.orientation === opt.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                                            }`}
                                        onClick={() => {
                                            updateSettings({ orientation: opt.value as any });
                                            setShowOrientation(false);
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Margins */}
                    <div className="relative" ref={marginsRef}>
                        <button
                            onClick={() => setShowMargins(!showMargins)}
                            className={`flex items-center gap-1.5 px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors ${showMargins ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700'}`}
                            title="Margins"
                        >
                            <Maximize size={14} />
                            <span>Margins</span>
                            <ChevronDown size={12} className={`transition-transform ${showMargins ? 'rotate-180' : ''}`} />
                        </button>

                        {showMargins && (
                            <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg p-3 z-[60] min-w-[180px]">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Margins (mm)</div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                    {(['top', 'bottom', 'left', 'right'] as const).map(side => (
                                        <div key={side}>
                                            <label className="block text-[10px] text-gray-500 mb-1 capitalize">{side}</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full px-2 py-1 text-xs border rounded outline-none focus:ring-1 focus:ring-blue-500"
                                                value={settings.margins[side]}
                                                onChange={(e) => updateSettings({
                                                    margins: { ...settings.margins, [side]: parseFloat(e.target.value) || 0 }
                                                })}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
