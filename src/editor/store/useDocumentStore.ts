import { create } from 'zustand';
import { Editor } from '@tiptap/react';
import { generateHTML } from '@tiptap/html';
import { HEADER_FOOTER_EXTENSIONS } from '../config/editorExtensions';

const STORAGE_KEY = 'tiptap-editor-doc';

import type { PageSizeType, MarginConfig } from '../utils/pageSizes';
import { PAGE_SIZES, DEFAULT_MARGINS, mmToPx } from '../utils/pageSizes';

export interface PageSettings {
  size: PageSizeType;
  orientation: 'portrait' | 'landscape';
  margins: MarginConfig;
  showHeader: boolean;
  showFooter: boolean;
  // Derived values for internal use
  width: number;
  height: number;
}

export interface DocumentMetadata {
  title: string;
}

interface DocumentState {
  settings: PageSettings;
  metadata: DocumentMetadata;
  headerJSON: any;
  footerJSON: any;
  headerHTML: string; // Cached for rendering
  footerHTML: string; // Cached for rendering
  pageBreaks: number[]; // Indices of blocks that start a new page
  contentHeight: number;
  isHeaderEditing: boolean;
  isFooterEditing: boolean;
  activeEditor: Editor | null;
  isSaving: boolean;
  lastSaved: string | null;
  isPaginationPending: boolean;
  totalPages: number;
  currentPage: number;
  pages: { id: string; content: any }[];
  updateSettings: (settings: Partial<PageSettings>) => void;
  updateMetadata: (metadata: Partial<DocumentMetadata>) => void;
  setHeaderJSON: (json: any) => void;
  setFooterJSON: (json: any) => void;
  setIsHeaderEditing: (isEditing: boolean) => void;
  setIsFooterEditing: (isEditing: boolean) => void;
  setPageBreaks: (breaks: number[]) => void;
  setActiveEditor: (editor: Editor | null) => void;
  saveDocument: () => Promise<void>;
  loadDocument: () => void;
  triggerPagination: () => void;
  setIsPaginationPending: (isPending: boolean) => void;
  setTotalPages: (total: number) => void;
  setCurrentPage: (current: number) => void;
  updatePages: (pages: { id: string; content: any }[]) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  settings: {
    size: 'A4',
    orientation: 'portrait',
    margins: DEFAULT_MARGINS,
    showHeader: true,
    showFooter: true,
    width: PAGE_SIZES.A4.widthPx ,
    height: PAGE_SIZES.A4.heightPx,
  },
  metadata: {
    title: 'Untitled Document',
  },
  headerJSON: { type: 'doc', content: [{ type: 'paragraph', attrs: { textAlign: 'left' }, content: [{ type: 'text', text: 'Document Header' }] }] },
  footerJSON: { type: 'doc', content: [{ type: 'paragraph', attrs: { textAlign: 'left' }, content: [{ type: 'text', text: 'Document Footer' }] }] },
  headerHTML: '',
  footerHTML: '',
  pageBreaks: [],
  pages: [],
  contentHeight: PAGE_SIZES.A4.heightPx - (mmToPx(DEFAULT_MARGINS.top) + mmToPx(DEFAULT_MARGINS.bottom)),
  isHeaderEditing: false,
  isFooterEditing: false,
  activeEditor: null,
  isSaving: false,
  lastSaved: null,
  isPaginationPending: false,
  totalPages: 1,
  currentPage: 1,

  updateSettings: (newSettings) => set((state) => {
    const updated = { ...state.settings, ...newSettings };
    
    // Calculate width/height based on size and orientation
    const pageSize = PAGE_SIZES[updated.size];
    let width = pageSize.widthPx;
    let height = pageSize.heightPx;
    
    if (updated.orientation === 'landscape') {
      width = pageSize.heightPx;
      height = pageSize.heightPx; // Error found here in existing code: should be height = pageSize.widthPx?
      width = pageSize.heightPx;
      height = pageSize.widthPx;
    }
    
    const settings = { ...updated, width, height };
    
    return {
      settings,
      contentHeight: settings.height - (mmToPx(settings.margins.top) + mmToPx(settings.margins.bottom)),
    };
  }),
  updateMetadata: (newMetadata) => set((state) => ({
    metadata: { ...state.metadata, ...newMetadata }
  })),
  setHeaderJSON: (json) => set({ 
    headerJSON: json,
    headerHTML: generateHTML(json, HEADER_FOOTER_EXTENSIONS)
  }),
  setFooterJSON: (json) => set({ 
    footerJSON: json,
    footerHTML: generateHTML(json, HEADER_FOOTER_EXTENSIONS)
  }),
  setIsHeaderEditing: (isEditing) => set({ isHeaderEditing: isEditing }),
  setIsFooterEditing: (isEditing) => set({ isFooterEditing: isEditing }),
  setPageBreaks: (breaks) => set({ pageBreaks: breaks }),
  setActiveEditor: (editor) => set({ activeEditor: editor }),
  saveDocument: async () => {
    const state = get();
    set({ isSaving: true });
    
    // Data to persist
    const docData = {
      metadata: state.metadata,
      settings: state.settings,
      headerJSON: state.headerJSON,
      footerJSON: state.footerJSON,
      contentJSON: state.activeEditor?.getJSON() || {},
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(docData));
    
    // Simulate short delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    set({ isSaving: false, lastSaved: docData.lastSaved });
    console.log('Document saved to localStorage');
  },
  loadDocument: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      const hJSON = data.headerJSON || get().headerJSON;
      const fJSON = data.footerJSON || get().footerJSON;

      set({
        metadata: data.metadata || { title: 'Untitled Document' },
        settings: data.settings || get().settings,
        headerJSON: hJSON,
        footerJSON: fJSON,
        headerHTML: generateHTML(hJSON, HEADER_FOOTER_EXTENSIONS),
        footerHTML: generateHTML(fJSON, HEADER_FOOTER_EXTENSIONS),
        lastSaved: data.lastSaved || null
      });
      
      // Content is handled by the persistence component if it detects a reload
      if (data.contentJSON && get().activeEditor) {
         get().activeEditor?.commands.setContent(data.contentJSON);
      }
    } catch (e) {
      console.error('Failed to parse saved document', e);
    }
  },
  triggerPagination: () => {
    set((state) => ({ ...state })); 
  },
  setIsPaginationPending: (isPending) => set({ isPaginationPending: isPending }),
  setTotalPages: (total) => set({ totalPages: total }),
  setCurrentPage: (current) => set({ currentPage: current }),
  updatePages: (pages) => set({ pages }),
}));
