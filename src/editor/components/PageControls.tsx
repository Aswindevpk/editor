import React from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import { PAGE_SIZES } from '../utils/pageSizes';
import type { PageSizeType } from '../utils/pageSizes';
import { Settings, Maximize, Layout } from 'lucide-react';

export const PageControls: React.FC = () => {
    const { settings, updateSettings } = useDocumentStore();

    const handleSizeChange = (size: PageSizeType) => {
        updateSettings({ size });
    };

    const handleMarginChange = (side: 'top' | 'bottom' | 'left' | 'right', value: number) => {
        updateSettings({
            margins: { ...settings.margins, [side]: value }
        });
    };

    return (
        <div className="w-72 bg-white border-l h-full overflow-y-auto p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8 text-gray-900 font-semibold border-b pb-4">
                <Settings size={20} className="text-blue-600" />
                <h2>Document Settings</h2>
            </div>

            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Maximize size={14} />
                    <span>Page Setup</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                        <select
                            value={settings.size}
                            onChange={(e) => handleSizeChange(e.target.value as PageSizeType)}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {(Object.keys(PAGE_SIZES) as PageSizeType[]).map((size) => (
                                <option key={size} value={size}>
                                    {PAGE_SIZES[size].label} ({PAGE_SIZES[size].widthMm} x {PAGE_SIZES[size].heightMm})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => updateSettings({ orientation: 'portrait' })}
                                className={`flex-1 px-3 py-2 text-sm border rounded-md transition-colors ${settings.orientation === 'portrait' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'
                                    }`}
                            >
                                Portrait
                            </button>
                            <button
                                onClick={() => updateSettings({ orientation: 'landscape' })}
                                className={`flex-1 px-3 py-2 text-sm border rounded-md transition-colors ${settings.orientation === 'landscape' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'
                                    }`}
                            >
                                Landscape
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Layout size={14} />
                    <span>Margins (mm)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Top</label>
                        <input
                            type="number"
                            step="0.1"
                            value={settings.margins.top}
                            onChange={(e) => handleMarginChange('top', parseFloat(e.target.value) )}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Bottom</label>
                        <input
                            type="number"
                            step="0.1"
                            value={settings.margins.bottom}
                            onChange={(e) => handleMarginChange('bottom', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Left</label>
                        <input
                            type="number"
                            step="0.1"
                            value={settings.margins.left}
                            onChange={(e) => handleMarginChange('left', parseFloat(e.target.value) )}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Right</label>
                        <input
                            type="number"
                            step="0.1"
                            value={settings.margins.right}
                            onChange={(e) => handleMarginChange('right', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* <section>
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <FileText size={14} />
                    <span>Elements</span>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show Header</span>
                        <input
                            type="checkbox"
                            checked={settings.showHeader}
                            onChange={(e) => updateSettings({ showHeader: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Show Footer</span>
                        <input
                            type="checkbox"
                            checked={settings.showFooter}
                            onChange={(e) => updateSettings({ showFooter: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </div>
                </div>
            </section> */}
        </div>
    );
};
