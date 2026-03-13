import React, { useRef, useEffect } from 'react';
import PageOverlay from './PageOverlay';
import EditorLayer from './EditorLayer';
import PageIndicator from './PageIndicator';
import { useDocumentStore } from '../store/useDocumentStore';

export const EditorCanvas: React.FC = () => {
    const { settings, setCurrentPage } = useDocumentStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            // Page height includes margins. Gap between pages is 40px (mb-10)
            const pageHeightWithGap = settings.height + 40;
            
            // We add a small offset (half viewport or 1/3 page) to make it feel more natural
            // So when the next page is 1/3 way in, it updates the count
            const current = Math.floor((scrollTop + 200) / pageHeightWithGap) + 1;
            setCurrentPage(Math.max(1, current));
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [settings.height, setCurrentPage]);

    return (
        <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto relative bg-gray-100/50 flex justify-center scroll-smooth"
        >
            <div id="print-container" className="relative min-h-full py-12">
                <PageOverlay />
                <EditorLayer />
            </div>
            <PageIndicator />
        </div>
    );
};
