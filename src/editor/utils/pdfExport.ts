import { Editor } from '@tiptap/react';
import type { PageSettings } from '../store/useDocumentStore';

interface ExportData {
  editor: Editor | null;
  settings: PageSettings;
  pageBreaks: number[];
}

const PDF_SERVER_URL = 'https://pdfserver-production-1ed8.up.railway.app';
// const PDF_SERVER_URL = 'http://localhost:4000';

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
  pageBreaks,
}: ExportData) {
  if (!editor) return;

  const styles = extractStyles();

  const editorDom = editor.view.dom;
  const blocks = Array.from(editorDom.children);
  const chunkedPages: string[][] = [[]];
  let currentPageIndex = 0;

  blocks.forEach((block, index) => {
    if (pageBreaks.includes(index)) {
      currentPageIndex++;
      chunkedPages[currentPageIndex] = [];
    }
    chunkedPages[currentPageIndex].push(block.outerHTML);
  });

  const pages = document.querySelectorAll('.page-view');
  
  if (pages.length === 0) {
    console.warn("No pages found to export.");
    return;
  }

  // Clone each page to safely strip out editing-specific UI (like borders/hover effects on headers) 
  // without affecting the live DOM.
  const pageHtmls = Array.from(pages).map((pageNode, index) => {
     const clone = pageNode.cloneNode(true) as HTMLElement;
     // Clean up editor-specific classes
     clone.classList.remove('mb-10', 'shadow-page', 'mx-auto');
     clone.style.margin = '0'; // reset margin for print

     // Inject the actual editor content for this page
     const contentArea = clone.querySelector('.content-area');
     if (contentArea) {
         contentArea.innerHTML = chunkedPages[index]?.join('') || '';
         contentArea.classList.add('prose', 'prose-sm', 'max-w-none'); // ensure tiptap prose classes apply
     }

     return clone.outerHTML;
  });

  const finalHtml = pageHtmls.join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Sora:wght@400;500;600&display=swap');
        
        ${styles}
        
        @page { size: ${settings.size}${settings.orientation === 'landscape' ? ' landscape' : ''}; margin: 0; }
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
        .prose, .content-area {
          font-family: inherit;
        }
        
        @media print {
          body { background: none; }
          .page-view { 
             box-shadow: none !important; 
             margin: 0 !important;
             page-break-after: always;
          }
        }
      </style>
    </head>
    <body class="prose prose-sm max-w-none bg-white">
      ${finalHtml}
    </body>
    </html>
  `;

  try {
    console.log('Sending HTML to PDF server...');
    const response = await fetch(PDF_SERVER_URL + '/api/export-pdf', {
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
