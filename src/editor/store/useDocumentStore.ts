import { create } from 'zustand';
import { Editor } from '@tiptap/react';
import { generateHTML } from '@tiptap/html';
import { HEADER_FOOTER_EXTENSIONS } from '../config/editorExtensions';

const STORAGE_KEY = 'tiptap-editor-doc';

export interface PageSettings {
  width: number;       // 794px for A4 at 96 DPI
  height: number;      // 1122px for A4
  marginTop: number;   // 96px (1 inch)
  marginBottom: number; // 96px
  marginLeft: number;  // 72px (0.75 inch)
  marginRight: number; // 72px
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
  setSettings: (settings: Partial<PageSettings>) => void;
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
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  settings: {
    width: 794,
    height: 1122,
    marginTop: 96,
    marginBottom: 96,
    marginLeft: 72,
    marginRight: 72,
  },
  metadata: {
    title: 'Untitled Document',
  },
  headerJSON: { type: 'doc', content: [{ type: 'paragraph', attrs: { textAlign: 'left' }, content: [{ type: 'text', text: 'Document Header' }] }] },
  footerJSON: { type: 'doc', content: [{ type: 'paragraph', attrs: { textAlign: 'left' }, content: [{ type: 'text', text: 'Document Footer' }] }] },
  headerHTML: '<p style="text-align: left">Document Header</p>',
  footerHTML: '<p style="text-align: left">Document Footer</p>',
  pageBreaks: [],
  contentHeight: 1122 - (96 + 96),
  isHeaderEditing: false,
  isFooterEditing: false,
  activeEditor: null,
  isSaving: false,
  lastSaved: null,
  isPaginationPending: false,

  setSettings: (newSettings) => set((state) => {
    const settings = { ...state.settings, ...newSettings };
    return {
      settings,
      contentHeight: settings.height - (settings.marginTop + settings.marginBottom),
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
}));
