import React, { useEffect } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';

/**
 * Handles initial data loading from localStorage and 
 * coordinates with useDocumentStore for content synchronization.
 */
export const DocumentPersistence: React.FC = () => {
    const { loadDocument, activeEditor } = useDocumentStore();

    // Load initial metadata and layout settings on mount
    useEffect(() => {
        loadDocument();
    }, [loadDocument]);

    // Push saved content into the editor once it's initialized
    useEffect(() => {
        if (activeEditor) {
            const saved = localStorage.getItem('tiptap-editor-doc');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    // If we have saved content and the editor is currently empty (or has the default empty block)
                    if (data.contentJSON && (activeEditor.isEmpty || activeEditor.getHTML() === '<p></p>')) {
                        activeEditor.commands.setContent(data.contentJSON);
                        console.log('Restored content from localStorage');
                        
                        // Force a pagination calculation after content is set
                        setTimeout(() => {
                            if (activeEditor.options.element) {
                                // Trigger a dummy update to force pagination
                                activeEditor.commands.focus();
                            }
                        }, 100);
                    }
                } catch (e) {
                    console.error('Failed to sync content from localStorage', e);
                }
            }
        }
    }, [activeEditor]);

    return null; // Invisible manager component
};
