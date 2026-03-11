import { create } from 'zustand';
import { Editor } from '@tiptap/react';

interface EditorInstanceState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorInstanceState>((set) => ({
  editor: null,
  setEditor: (editor) => {
    console.log('useEditorStore: setting editor to', editor ? 'instance' : 'null');
    set({ editor });
  },
}));
