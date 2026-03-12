import React from 'react';
import { Settings, Info, History, Layout, Type, Palette } from 'lucide-react';

export const PageControls: React.FC = () => {
    const controls = [
        { icon: Layout, label: 'Page Setup', active: true },
        { icon: Type, label: 'Typography' },
        { icon: Palette, label: 'Style' },
        { icon: History, label: 'Version History' },
        { icon: Info, label: 'Document Info' },
        { icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-16 flex flex-col items-center py-4 bg-white h-full border-l border-gray-100 gap-4">
            {controls.map((control, i) => (
                <button
                    key={i}
                    title={control.label}
                    className={`p-2.5 rounded-xl transition-all ${
                        control.active 
                        ? 'bg-blue-50 text-blue-600 shadow-sm' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                >
                    <control.icon size={22} strokeWidth={control.active ? 2.5 : 2} />
                </button>
            ))}
        </div>
    );
};
