import type { PageSettings } from '../store/useDocumentStore';

export interface PaginationResult {
  pageBreaks: number[];
  totalPages: number;
}

export const runPagination = (
  container: HTMLElement,
  settings: PageSettings
): PaginationResult => {
  const blocks = Array.from(container.querySelectorAll('.tiptap > *')) as HTMLElement[];
  const contentHeight = settings.height - (settings.margins.top + settings.margins.bottom);
  
  const pageBreaks: number[] = [];
  let currentHeight = 0;
  let totalPages = 1;

  blocks.forEach((block, index) => {
    const blockHeight = block.offsetHeight;
    
    // Check if adding this block exceeds the content height of the current page
    if (currentHeight + blockHeight > contentHeight) {
      // Index of the block that starts the new page
      pageBreaks.push(index);
      currentHeight = blockHeight;
      totalPages++;
    } else {
      currentHeight += blockHeight;
    }
  });

  return { pageBreaks, totalPages };
};
