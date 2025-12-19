export type CaretPosition = {
    start: number;
    end: number;
};
export declare const saveCaretPosition: () => CaretPosition | null;
export declare const restoreCaretPosition: (position: CaretPosition | null) => void;
export declare const withCaretPositionPreservation: (callback: () => void, isCompactMode: boolean, isEditingText: boolean, onPreventClose?: () => void) => void;
export declare const useTextEditorFocus: () => {
    saveCaretPosition: () => void;
    restoreCaretPosition: () => void;
    clearSavedPosition: () => void;
    hasSavedPosition: boolean;
};
export declare const temporarilyDisableTextEditorBlur: (duration?: number) => void;
