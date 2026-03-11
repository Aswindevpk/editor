import React from 'react';
import { useDocumentStore } from '../store/useDocumentStore';

interface PageViewProps {
  index: number;
}

const PageView: React.FC<PageViewProps> = ({ index }) => {
  const { settings, headerHTML, footerHTML } = useDocumentStore();
  
  const contentHeight = settings.height - (settings.marginTop + settings.marginBottom);

  return (
    <div 
      className="relative bg-white shadow-page mx-auto mb-10 overflow-hidden" 
      style={{ 
        width: `${settings.width}px`, 
        height: `${settings.height}px` 
      }}
    >
      {/* HEADER: Placed inside the Top Margin */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center cursor-default group"
        style={{ 
          height: `${settings.marginTop}px`,
          paddingLeft: `${settings.marginLeft}px`,
          paddingRight: `${settings.marginRight}px`
        }}
      >
        <div 
          className="w-full text-sm border-b border-transparent group-hover:border-blue-100 transition-colors py-1" 
          dangerouslySetInnerHTML={{ __html: headerHTML }} 
        />
      </div>

      {/* CONTENT AREA PLACEHOLDER: Visual only, Editor sits on top */}
      <div style={{ marginTop: `${settings.marginTop}px`, height: `${contentHeight}px` }} />

      {/* FOOTER: Placed inside the Bottom Margin */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between text-gray-400 text-sm"
        style={{ 
          height: `${settings.marginBottom}px`,
          paddingLeft: `${settings.marginLeft}px`,
          paddingRight: `${settings.marginRight}px`
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: footerHTML }} />
        <span>Page {index + 1}</span>
      </div>
    </div>
  );
};

export default PageView;
