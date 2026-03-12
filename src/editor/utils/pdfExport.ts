import { Editor } from '@tiptap/react';
import type { PageSettings } from '../store/useDocumentStore';

interface ExportData {
  editor: Editor | null;
  settings: PageSettings;
  headerHTML: string;
  footerHTML: string;
  pageBreaks: number[];
}

/**
 * Extracts all relevant CSS from the current document to ensure 
 * the PDF accurately reflects the editor's visual state.
 */
function extractStyles(): string {
  let styles = '';
  const styleSheets = document.styleSheets;

  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const sheet = styleSheets[i];
      const rules = sheet.cssRules || sheet.rules;
      for (let j = 0; j < rules.length; j++) {
        styles += rules[j].cssText + '\n';
      }
    } catch (e) {
      // Skip cross-origin stylesheets that we can't access
      console.warn('Could not access stylesheet:', e);
    }
  }

  return styles;
}

/**
 * Generates high-fidelity PDF by constructing a standalone HTML document
 * that replicates the editor's multi-layered layout.
 */
export async function exportToPdf({
  editor,
  settings,
  headerHTML,
  footerHTML,
}: ExportData) {
  if (!editor) return;

  const styles = extractStyles();

  // 1. Create a temporary container to calculate heights
  const scratchpad = document.createElement('div');
  scratchpad.style.width = `${settings.width}px`;
  scratchpad.style.visibility = 'hidden';
  scratchpad.style.position = 'absolute';
  scratchpad.innerHTML = editor.getHTML();
  document.body.appendChild(scratchpad);

  const nodes = Array.from(scratchpad.childNodes);
  const pages: string[][] = [[]];
  let currentPageIndex = 0;

  // A4 content height calculation
  const maxContentHeight = settings.height - settings.margins.top - settings.margins.bottom;

  // 2. Pagination Logic: Group nodes into pages
  let currentHeight = 0;
  const tempPage = document.createElement('div');
  tempPage.style.width = `${settings.width - settings.margins.left - settings.margins.right}px`;
  document.body.appendChild(tempPage);

  nodes.forEach((node) => {
    const clone = node.cloneNode(true) as HTMLElement;
    tempPage.appendChild(clone);
    const nodeHeight = (node as HTMLElement).offsetHeight || 20; // fallback for text nodes

    if (currentHeight + nodeHeight > maxContentHeight) {
      currentPageIndex++;
      pages[currentPageIndex] = [];
      currentHeight = nodeHeight;
    } else {
      currentHeight += nodeHeight;
    }

    pages[currentPageIndex].push((node as HTMLElement).outerHTML || (node as Text).textContent || '');
  });

  // Cleanup temp elements
  document.body.removeChild(scratchpad);
  document.body.removeChild(tempPage);

  // 3. Construct Final HTML
    const finalPagesHtml = pages.map((pageContent) => `
    <div class="page-sheet">
      <div class="header" style="height: ${settings.margins.top}px;">${headerHTML}</div>
      <div class="content-area" style="padding: 0 ${settings.margins.right}px 0 ${settings.margins.left}px; min-height: ${maxContentHeight}px;">
        ${pageContent.join('')}
      </div>
      <div class="footer" style="height: ${settings.margins.bottom}px;">
        ${footerHTML}
      </div>
    </div>
  `).join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Sora:wght@400;500;600&display=swap');
        
        ${styles}
        
        @page { size: A4; margin: 0; }
        body { 
          background: #f3f4f6; 
          margin: 0; 
          font-family: 'Inter', sans-serif;
        }
        .page-sheet {
          width: ${settings.width}px;
          height: ${settings.height}px;
          background: white;
          margin: 40px auto;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header, .footer {
          display: flex;
          align-items: center;
          padding: 0 ${settings.margins.left}px;
          color: #9ca3af;
          font-size: 14px;
        }
        .content-area { flex-grow: 1; overflow: hidden; }
        
        /* Ensure fonts are applied in the prose content */
        .prose {
          font-family: inherit;
        }
        
        @media print {
          body { background: none; }
          .page-sheet { margin: 0; box-shadow: none; page-break-after: always; }
        }
      </style>
    </head>
    <body class="prose">${finalPagesHtml}</body>
    </html>
  `;

  try {
    console.log('Sending HTML to PDF server...');
    const response = await fetch('https://pdfserver-production-1ed8.up.railway.app/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: fullHtml,
        fileName: 'document.pdf',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response not OK:', response.status, errorText);
      throw new Error(`Failed to generate PDF: ${response.status} ${errorText}`);
    }

    console.log('PDF received, starting download...');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    alert('Failed to export PDF. Please ensure the PDF server is running.');
    throw error;
  }
}
