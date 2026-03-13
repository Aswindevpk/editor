import React from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import HeaderFooterEditor from './HeaderFooterEditor';

import { mmToPx } from '../utils/pageSizes';

interface PageViewProps {
  index: number;
}

const PageView: React.FC<PageViewProps> = ({ index }) => {
  const {
    settings,
    headerHTML,
    footerHTML,
    isHeaderEditing,
    isFooterEditing,
    setIsHeaderEditing,
    setIsFooterEditing
  } = useDocumentStore();

  const contentHeight = settings.height - (mmToPx(settings.margins.top) + mmToPx(settings.margins.bottom));

  const handleHeaderDoubleClick = () => {
    setIsHeaderEditing(true);
  };

  const handleFooterDoubleClick = () => {
    setIsFooterEditing(true);
  };

  return (
    <div
      className="page-view relative bg-white shadow-page mx-auto mb-10 overflow-hidden"
      style={{
        width: `${settings.width}px`,
        height: `${settings.height}px`,
        boxSizing: 'border-box'
      }}
    >
      {/* HEADER: Placed inside the Top Margin */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between text-gray-400 text-sm group z-20"
        style={{
          height: `${mmToPx(settings.margins.top)}px`,
        }}
        onDoubleClick={handleHeaderDoubleClick}
      >
        {isHeaderEditing ? (
          <HeaderFooterEditor type="header" onClose={() => setIsHeaderEditing(false)} />
        ) : (
          <div
            className="w-full h-full flex items-center border-b border-transparent group-hover:border-blue-200 transition-colors"
            style={{
              paddingLeft: `${mmToPx(settings.margins.left)}px`,
              paddingRight: `${mmToPx(settings.margins.right)}px`,
            }}
          >
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: headerHTML }} />
          </div>
        )}
      </div>

      {/* CONTENT AREA PLACEHOLDER: Visual only, Editor sits on top. Pointer events none so editor is clickable. Used for PDF Export injection. */}
      <div
        className="content-area pointer-events-none"
        style={{ 
          marginTop: `${mmToPx(settings.margins.top)}px`, 
          height: `${contentHeight}px`,
          paddingLeft: `${mmToPx(settings.margins.left)}px`,
          paddingRight: `${mmToPx(settings.margins.right)}px`,
          boxSizing: 'border-box'
        }}
      />

      {/* FOOTER: Placed inside the Bottom Margin */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between text-gray-400 text-sm group z-20"
        style={{
          height: `${mmToPx(settings.margins.bottom)}px`,
        }}
        onDoubleClick={handleFooterDoubleClick}
      >
        {isFooterEditing ? (
          <HeaderFooterEditor type="footer" onClose={() => setIsFooterEditing(false)} />
        ) : (
          <>
            <div
              className="w-full h-full flex items-center border-t border-transparent group-hover:border-blue-200 transition-colors"
              style={{
                paddingLeft: `${mmToPx(settings.margins.left)}px`,
                paddingRight: `${mmToPx(settings.margins.right)}px`,
              }}
            >
              <div className="flex-1" dangerouslySetInnerHTML={{ __html: footerHTML }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PageView;
