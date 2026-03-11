import { create } from 'zustand';

export interface PageSettings {
  width: number;       // 794px for A4 at 96 DPI
  height: number;      // 1122px for A4
  marginTop: number;   // 96px (1 inch)
  marginBottom: number; // 96px
  marginLeft: number;  // 72px (0.75 inch)
  marginRight: number; // 72px
}

interface DocumentState {
  settings: PageSettings;
  headerHTML: string;
  footerHTML: string;
  pageBreaks: number[]; // Indices of blocks that start a new page
  contentHeight: number;
  isHeaderEditing: boolean;
  isFooterEditing: boolean;
  setSettings: (settings: Partial<PageSettings>) => void;
  setHeaderHTML: (html: string) => void;
  setFooterHTML: (html: string) => void;
  setIsHeaderEditing: (isEditing: boolean) => void;
  setIsFooterEditing: (isEditing: boolean) => void;
  setPageBreaks: (breaks: number[]) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  settings: {
    width: 794,
    height: 1122,
    marginTop: 96,
    marginBottom: 96,
    marginLeft: 72,
    marginRight: 72,
  },
  headerHTML: '<p class="text-gray-400">Document Header</p>',
  footerHTML: '<p class="text-gray-400">Document Footer</p>',
  pageBreaks: [],
  contentHeight: 1122 - (96 + 96),
  isHeaderEditing: false,
  isFooterEditing: false,

  setSettings: (newSettings) => set((state) => {
    const settings = { ...state.settings, ...newSettings };
    return {
      settings,
      contentHeight: settings.height - (settings.marginTop + settings.marginBottom),
    };
  }),
  setHeaderHTML: (html) => set({ headerHTML: html }),
  setFooterHTML: (html) => set({ footerHTML: html }),
  setIsHeaderEditing: (isEditing) => set({ isHeaderEditing: isEditing }),
  setIsFooterEditing: (isEditing) => set({ isFooterEditing: isEditing }),
  setPageBreaks: (breaks) => set({ pageBreaks: breaks }),
}));
