import React from 'react';
import EditorToolbar from './EditorToolbar';
import PageOverlay from './PageOverlay';
import EditorLayer from './EditorLayer';

const DocumentEditor: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <EditorToolbar />
      <div className="flex-1 overflow-y-auto relative bg-gray-200">
        <PageOverlay />
        <EditorLayer />
      </div>
    </div>
  );
};

export default DocumentEditor;
