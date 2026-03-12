import React from 'react';
import PageOverlay from './PageOverlay';
import EditorLayer from './EditorLayer';

export const EditorCanvas: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto relative bg-gray-100/50 flex justify-center">
            <div id="print-container" className="relative min-h-full py-12">
                <PageOverlay />
                <EditorLayer />
            </div>
        </div>
    );
};
