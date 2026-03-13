import { useEffect, useRef, useCallback } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import { runPagination } from '../pagination/runPagination';

export const usePagination = (editorElement: HTMLElement | null) => {
  const { settings } = useDocumentStore();
  const lastHeightRef = useRef(0);

  const calculatePagination = useCallback(() => {
    if (!editorElement) return;
    
    // We need to wait for a tick to ensure offsetHeights are accurate
    requestAnimationFrame(() => {
      const result = runPagination(editorElement, settings);
      const { setTotalPages, setPageBreaks } = useDocumentStore.getState();
      setPageBreaks(result.pageBreaks);
      setTotalPages(result.totalPages);
    });
  }, [editorElement, settings]);

  useEffect(() => {
    if (!editorElement) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.scrollHeight;
        if (height !== lastHeightRef.current) {
          lastHeightRef.current = height;
          calculatePagination();
        }
      }
    });

    // Observe children as well to catch style changes or content shifts
    observer.observe(editorElement);
    
    const mutationObserver = new MutationObserver(() => {
      calculatePagination();
    });
    
    mutationObserver.observe(editorElement, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    calculatePagination();

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [editorElement, calculatePagination]);

  return { calculatePagination };
};
