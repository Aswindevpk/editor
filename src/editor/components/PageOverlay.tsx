import React from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import PageView from './PageView';

const PageOverlay: React.FC = () => {
  const { pageBreaks } = useDocumentStore();
  const pageCount = pageBreaks.length + 1;

  return (
    <div className="absolute inset-0 pointer-events-none pt-10">
      {Array.from({ length: pageCount }).map((_, i) => (
        <PageView key={i} index={i} />
      ))}
    </div>
  );
};

export default PageOverlay;
