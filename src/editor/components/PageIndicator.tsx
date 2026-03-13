import React, { useEffect, useState, useRef } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';

const PageIndicator: React.FC = () => {
  const { currentPage, totalPages } = useDocumentStore();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    // Show indicator when page or total pages change
    setIsVisible(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Hide after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPage, totalPages]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
    >
      <div className="bg-gray-800/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-gray-700/50 flex items-center space-x-2 text-sm font-medium">
        <span className="text-blue-400">Page</span>
        <span>{currentPage}</span>
        <span className="text-gray-500 text-xs">of</span>
        <span>{totalPages}</span>
      </div>
    </div>
  );
};

export default PageIndicator;
