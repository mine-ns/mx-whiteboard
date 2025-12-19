import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppClassProperties, AppState } from "../types";
export declare const actionSelectAllElementsInFrame: {
    name: "selectAllElementsInFrame";
    label: string;
    trackEvent: {
        category: "canvas";
    };
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<AppState>, _: unknown, app: AppClassProperties) => {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: {
            selectedElementIds: Record<string, true>;
            contextMenu: {
                items: import("../components/ContextMenu").ContextMenuItems;
                top: number;
                left: number;
            } | null;
            showWelcomeScreen: boolean;
            isLoading: boolean;
            errorMessage: React.ReactNode;
            activeEmbeddable: {
                element: import("@excalidraw/element/types").NonDeletedExcalidrawElement;
                state: "hover" | "active";
            } | null;
            newElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawNonSelectionElement> | null;
            resizingElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            multiElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawLinearElement> | null;
            selectionElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            isBindingEnabled: boolean;
            startBoundElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            suggestedBinding: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            frameToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameLikeElement> | null;
            frameRendering: {
                enabled: boolean;
                name: boolean;
                outline: boolean;
                clip: boolean;
            };
            editingFrame: string | null;
            elementsToHighlight: import("@excalidraw/element/types").NonDeleted<ExcalidrawElement>[] | null;
            editingTextElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            activeTool: {
                lastActiveTool: import("../types").ActiveTool | null;
                locked: boolean;
                fromSelection: boolean;
            } & import("../types").ActiveTool;
            preferredSelectionTool: {
                type: "selection" | "lasso";
                initialized: boolean;
            };
            penMode: boolean;
            penDetected: boolean;
            exportBackground: boolean;
            exportEmbedScene: boolean;
            exportWithDarkMode: boolean;
            exportScale: number;
            currentItemStrokeColor: string;
            currentItemBackgroundColor: string;
            currentItemFillStyle: ExcalidrawElement["fillStyle"];
            currentItemStrokeWidth: number;
            currentItemStrokeStyle: ExcalidrawElement["strokeStyle"];
            currentItemRoughness: number;
            currentItemOpacity: number;
            currentItemFontFamily: import("@excalidraw/element/types").FontFamilyValues;
            currentItemFontSize: number;
            currentItemTextAlign: import("@excalidraw/element/types").TextAlign;
            currentItemStartArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentItemEndArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentHoveredFontFamily: import("@excalidraw/element/types").FontFamilyValues | null;
            currentItemRoundness: import("@excalidraw/element/types").StrokeRoundness;
            currentItemArrowType: "sharp" | "round" | "elbow";
            viewBackgroundColor: string;
            scrollX: number;
            scrollY: number;
            cursorButton: "up" | "down";
            scrolledOutside: boolean;
            name: string | null;
            isResizing: boolean;
            isRotating: boolean;
            zoom: import("../types").Zoom;
            openMenu: "canvas" | null;
            openPopup: "canvasBackground" | "elementBackground" | "elementStroke" | "fontFamily" | "compactTextProperties" | "compactStrokeStyles" | "compactOtherProperties" | "compactArrowProperties" | null;
            openSidebar: {
                name: import("../types").SidebarName;
                tab?: import("../types").SidebarTabName;
            } | null;
            openDialog: null | {
                name: "imageExport" | "help" | "jsonExport";
            } | {
                name: "ttd";
                tab: "text-to-diagram" | "mermaid";
            } | {
                name: "commandPalette";
            } | {
                name: "settings";
            } | {
                name: "elementLinkSelector";
                sourceElementId: ExcalidrawElement["id"];
            };
            defaultSidebarDockedPreference: boolean;
            lastPointerDownWith: import("@excalidraw/element/types").PointerType;
            hoveredElementIds: Readonly<{
                [id: string]: true;
            }>;
            previousSelectedElementIds: {
                [id: string]: true;
            };
            selectedElementsAreBeingDragged: boolean;
            shouldCacheIgnoreZoom: boolean;
            toast: {
                message: string;
                closable?: boolean;
                duration?: number;
            } | null;
            zenModeEnabled: boolean;
            theme: import("@excalidraw/element/types").Theme;
            gridSize: number;
            gridStep: number;
            gridModeEnabled: boolean;
            viewModeEnabled: boolean;
            selectedGroupIds: {
                [groupId: string]: boolean;
            };
            editingGroupId: import("@excalidraw/element/types").GroupId | null;
            width: number;
            height: number;
            offsetTop: number;
            offsetLeft: number;
            fileHandle: import("browser-fs-access").FileSystemHandle | null;
            collaborators: Map<import("../types").SocketId, import("../types").Collaborator>;
            stats: {
                open: boolean;
                panels: number;
            };
            currentChartType: import("@excalidraw/element/types").ChartType;
            pasteDialog: {
                shown: false;
                data: null;
            } | {
                shown: true;
                data: import("../charts").Spreadsheet;
            };
            showHyperlinkPopup: false | "info" | "editor";
            selectedLinearElement: import("@excalidraw/element").LinearElementEditor | null;
            snapLines: readonly import("../snapping").SnapLine[];
            originSnapOffset: {
                x: number;
                y: number;
            } | null;
            objectsSnapModeEnabled: boolean;
            userToFollow: import("../types").UserToFollow | null;
            followedBy: Set<import("../types").SocketId>;
            isCropping: boolean;
            croppingElementId: ExcalidrawElement["id"] | null;
            searchMatches: Readonly<{
                focusedId: ExcalidrawElement["id"] | null;
                matches: readonly import("../types").SearchMatch[];
            }> | null;
            activeLockedId: string | null;
            lockedMultiSelections: {
                [groupId: string]: true;
            };
            bindMode: import("@excalidraw/element/types").BindMode;
        };
        captureUpdate: "IMMEDIATELY";
    } | {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: Readonly<AppState>;
        captureUpdate: "EVENTUALLY";
    };
    predicate: (elements: readonly ExcalidrawElement[], appState: AppState, _: import("../types").ExcalidrawProps, app: AppClassProperties) => boolean;
} & {
    keyTest?: undefined;
};
export declare const actionRemoveAllElementsFromFrame: {
    name: "removeAllElementsFromFrame";
    label: string;
    trackEvent: {
        category: "history";
    };
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<AppState>, _: unknown, app: AppClassProperties) => {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: {
            selectedElementIds: {
                [x: string]: true;
            };
            contextMenu: {
                items: import("../components/ContextMenu").ContextMenuItems;
                top: number;
                left: number;
            } | null;
            showWelcomeScreen: boolean;
            isLoading: boolean;
            errorMessage: React.ReactNode;
            activeEmbeddable: {
                element: import("@excalidraw/element/types").NonDeletedExcalidrawElement;
                state: "hover" | "active";
            } | null;
            newElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawNonSelectionElement> | null;
            resizingElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            multiElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawLinearElement> | null;
            selectionElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            isBindingEnabled: boolean;
            startBoundElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            suggestedBinding: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            frameToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameLikeElement> | null;
            frameRendering: {
                enabled: boolean;
                name: boolean;
                outline: boolean;
                clip: boolean;
            };
            editingFrame: string | null;
            elementsToHighlight: import("@excalidraw/element/types").NonDeleted<ExcalidrawElement>[] | null;
            editingTextElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            activeTool: {
                lastActiveTool: import("../types").ActiveTool | null;
                locked: boolean;
                fromSelection: boolean;
            } & import("../types").ActiveTool;
            preferredSelectionTool: {
                type: "selection" | "lasso";
                initialized: boolean;
            };
            penMode: boolean;
            penDetected: boolean;
            exportBackground: boolean;
            exportEmbedScene: boolean;
            exportWithDarkMode: boolean;
            exportScale: number;
            currentItemStrokeColor: string;
            currentItemBackgroundColor: string;
            currentItemFillStyle: ExcalidrawElement["fillStyle"];
            currentItemStrokeWidth: number;
            currentItemStrokeStyle: ExcalidrawElement["strokeStyle"];
            currentItemRoughness: number;
            currentItemOpacity: number;
            currentItemFontFamily: import("@excalidraw/element/types").FontFamilyValues;
            currentItemFontSize: number;
            currentItemTextAlign: import("@excalidraw/element/types").TextAlign;
            currentItemStartArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentItemEndArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentHoveredFontFamily: import("@excalidraw/element/types").FontFamilyValues | null;
            currentItemRoundness: import("@excalidraw/element/types").StrokeRoundness;
            currentItemArrowType: "sharp" | "round" | "elbow";
            viewBackgroundColor: string;
            scrollX: number;
            scrollY: number;
            cursorButton: "up" | "down";
            scrolledOutside: boolean;
            name: string | null;
            isResizing: boolean;
            isRotating: boolean;
            zoom: import("../types").Zoom;
            openMenu: "canvas" | null;
            openPopup: "canvasBackground" | "elementBackground" | "elementStroke" | "fontFamily" | "compactTextProperties" | "compactStrokeStyles" | "compactOtherProperties" | "compactArrowProperties" | null;
            openSidebar: {
                name: import("../types").SidebarName;
                tab?: import("../types").SidebarTabName;
            } | null;
            openDialog: null | {
                name: "imageExport" | "help" | "jsonExport";
            } | {
                name: "ttd";
                tab: "text-to-diagram" | "mermaid";
            } | {
                name: "commandPalette";
            } | {
                name: "settings";
            } | {
                name: "elementLinkSelector";
                sourceElementId: ExcalidrawElement["id"];
            };
            defaultSidebarDockedPreference: boolean;
            lastPointerDownWith: import("@excalidraw/element/types").PointerType;
            hoveredElementIds: Readonly<{
                [id: string]: true;
            }>;
            previousSelectedElementIds: {
                [id: string]: true;
            };
            selectedElementsAreBeingDragged: boolean;
            shouldCacheIgnoreZoom: boolean;
            toast: {
                message: string;
                closable?: boolean;
                duration?: number;
            } | null;
            zenModeEnabled: boolean;
            theme: import("@excalidraw/element/types").Theme;
            gridSize: number;
            gridStep: number;
            gridModeEnabled: boolean;
            viewModeEnabled: boolean;
            selectedGroupIds: {
                [groupId: string]: boolean;
            };
            editingGroupId: import("@excalidraw/element/types").GroupId | null;
            width: number;
            height: number;
            offsetTop: number;
            offsetLeft: number;
            fileHandle: import("browser-fs-access").FileSystemHandle | null;
            collaborators: Map<import("../types").SocketId, import("../types").Collaborator>;
            stats: {
                open: boolean;
                panels: number;
            };
            currentChartType: import("@excalidraw/element/types").ChartType;
            pasteDialog: {
                shown: false;
                data: null;
            } | {
                shown: true;
                data: import("../charts").Spreadsheet;
            };
            showHyperlinkPopup: false | "info" | "editor";
            selectedLinearElement: import("@excalidraw/element").LinearElementEditor | null;
            snapLines: readonly import("../snapping").SnapLine[];
            originSnapOffset: {
                x: number;
                y: number;
            } | null;
            objectsSnapModeEnabled: boolean;
            userToFollow: import("../types").UserToFollow | null;
            followedBy: Set<import("../types").SocketId>;
            isCropping: boolean;
            croppingElementId: ExcalidrawElement["id"] | null;
            searchMatches: Readonly<{
                focusedId: ExcalidrawElement["id"] | null;
                matches: readonly import("../types").SearchMatch[];
            }> | null;
            activeLockedId: string | null;
            lockedMultiSelections: {
                [groupId: string]: true;
            };
            bindMode: import("@excalidraw/element/types").BindMode;
        };
        captureUpdate: "IMMEDIATELY";
    } | {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: Readonly<AppState>;
        captureUpdate: "EVENTUALLY";
    };
    predicate: (elements: readonly ExcalidrawElement[], appState: AppState, _: import("../types").ExcalidrawProps, app: AppClassProperties) => boolean;
} & {
    keyTest?: undefined;
};
export declare const actionupdateFrameRendering: {
    name: "updateFrameRendering";
    label: string;
    viewMode: true;
    trackEvent: {
        category: "canvas";
    };
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<AppState>) => {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: {
            frameRendering: {
                enabled: boolean;
                name: boolean;
                outline: boolean;
                clip: boolean;
            };
            contextMenu: {
                items: import("../components/ContextMenu").ContextMenuItems;
                top: number;
                left: number;
            } | null;
            showWelcomeScreen: boolean;
            isLoading: boolean;
            errorMessage: React.ReactNode;
            activeEmbeddable: {
                element: import("@excalidraw/element/types").NonDeletedExcalidrawElement;
                state: "hover" | "active";
            } | null;
            newElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawNonSelectionElement> | null;
            resizingElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            multiElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawLinearElement> | null;
            selectionElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            isBindingEnabled: boolean;
            startBoundElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            suggestedBinding: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            frameToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameLikeElement> | null;
            editingFrame: string | null;
            elementsToHighlight: import("@excalidraw/element/types").NonDeleted<ExcalidrawElement>[] | null;
            editingTextElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            activeTool: {
                lastActiveTool: import("../types").ActiveTool | null;
                locked: boolean;
                fromSelection: boolean;
            } & import("../types").ActiveTool;
            preferredSelectionTool: {
                type: "selection" | "lasso";
                initialized: boolean;
            };
            penMode: boolean;
            penDetected: boolean;
            exportBackground: boolean;
            exportEmbedScene: boolean;
            exportWithDarkMode: boolean;
            exportScale: number;
            currentItemStrokeColor: string;
            currentItemBackgroundColor: string;
            currentItemFillStyle: ExcalidrawElement["fillStyle"];
            currentItemStrokeWidth: number;
            currentItemStrokeStyle: ExcalidrawElement["strokeStyle"];
            currentItemRoughness: number;
            currentItemOpacity: number;
            currentItemFontFamily: import("@excalidraw/element/types").FontFamilyValues;
            currentItemFontSize: number;
            currentItemTextAlign: import("@excalidraw/element/types").TextAlign;
            currentItemStartArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentItemEndArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentHoveredFontFamily: import("@excalidraw/element/types").FontFamilyValues | null;
            currentItemRoundness: import("@excalidraw/element/types").StrokeRoundness;
            currentItemArrowType: "sharp" | "round" | "elbow";
            viewBackgroundColor: string;
            scrollX: number;
            scrollY: number;
            cursorButton: "up" | "down";
            scrolledOutside: boolean;
            name: string | null;
            isResizing: boolean;
            isRotating: boolean;
            zoom: import("../types").Zoom;
            openMenu: "canvas" | null;
            openPopup: "canvasBackground" | "elementBackground" | "elementStroke" | "fontFamily" | "compactTextProperties" | "compactStrokeStyles" | "compactOtherProperties" | "compactArrowProperties" | null;
            openSidebar: {
                name: import("../types").SidebarName;
                tab?: import("../types").SidebarTabName;
            } | null;
            openDialog: null | {
                name: "imageExport" | "help" | "jsonExport";
            } | {
                name: "ttd";
                tab: "text-to-diagram" | "mermaid";
            } | {
                name: "commandPalette";
            } | {
                name: "settings";
            } | {
                name: "elementLinkSelector";
                sourceElementId: ExcalidrawElement["id"];
            };
            defaultSidebarDockedPreference: boolean;
            lastPointerDownWith: import("@excalidraw/element/types").PointerType;
            selectedElementIds: Readonly<{
                [id: string]: true;
            }>;
            hoveredElementIds: Readonly<{
                [id: string]: true;
            }>;
            previousSelectedElementIds: {
                [id: string]: true;
            };
            selectedElementsAreBeingDragged: boolean;
            shouldCacheIgnoreZoom: boolean;
            toast: {
                message: string;
                closable?: boolean;
                duration?: number;
            } | null;
            zenModeEnabled: boolean;
            theme: import("@excalidraw/element/types").Theme;
            gridSize: number;
            gridStep: number;
            gridModeEnabled: boolean;
            viewModeEnabled: boolean;
            selectedGroupIds: {
                [groupId: string]: boolean;
            };
            editingGroupId: import("@excalidraw/element/types").GroupId | null;
            width: number;
            height: number;
            offsetTop: number;
            offsetLeft: number;
            fileHandle: import("browser-fs-access").FileSystemHandle | null;
            collaborators: Map<import("../types").SocketId, import("../types").Collaborator>;
            stats: {
                open: boolean;
                panels: number;
            };
            currentChartType: import("@excalidraw/element/types").ChartType;
            pasteDialog: {
                shown: false;
                data: null;
            } | {
                shown: true;
                data: import("../charts").Spreadsheet;
            };
            showHyperlinkPopup: false | "info" | "editor";
            selectedLinearElement: import("@excalidraw/element").LinearElementEditor | null;
            snapLines: readonly import("../snapping").SnapLine[];
            originSnapOffset: {
                x: number;
                y: number;
            } | null;
            objectsSnapModeEnabled: boolean;
            userToFollow: import("../types").UserToFollow | null;
            followedBy: Set<import("../types").SocketId>;
            isCropping: boolean;
            croppingElementId: ExcalidrawElement["id"] | null;
            searchMatches: Readonly<{
                focusedId: ExcalidrawElement["id"] | null;
                matches: readonly import("../types").SearchMatch[];
            }> | null;
            activeLockedId: string | null;
            lockedMultiSelections: {
                [groupId: string]: true;
            };
            bindMode: import("@excalidraw/element/types").BindMode;
        };
        captureUpdate: "EVENTUALLY";
    };
    checked: (appState: AppState) => boolean;
} & {
    keyTest?: undefined;
};
export declare const actionSetFrameAsActiveTool: {
    name: "setFrameAsActiveTool";
    label: string;
    trackEvent: {
        category: "toolbar";
    };
    icon: import("react/jsx-runtime").JSX.Element;
    viewMode: false;
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<AppState>, _: unknown, app: AppClassProperties) => {
        elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
        appState: {
            activeTool: {
                lastActiveTool: import("../types").ActiveTool | null;
                locked: boolean;
                fromSelection: boolean;
            } & import("../types").ActiveTool;
            contextMenu: {
                items: import("../components/ContextMenu").ContextMenuItems;
                top: number;
                left: number;
            } | null;
            showWelcomeScreen: boolean;
            isLoading: boolean;
            errorMessage: React.ReactNode;
            activeEmbeddable: {
                element: import("@excalidraw/element/types").NonDeletedExcalidrawElement;
                state: "hover" | "active";
            } | null;
            newElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawNonSelectionElement> | null;
            resizingElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            multiElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawLinearElement> | null;
            selectionElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            isBindingEnabled: boolean;
            startBoundElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            suggestedBinding: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            frameToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameLikeElement> | null;
            frameRendering: {
                enabled: boolean;
                name: boolean;
                outline: boolean;
                clip: boolean;
            };
            editingFrame: string | null;
            elementsToHighlight: import("@excalidraw/element/types").NonDeleted<ExcalidrawElement>[] | null;
            editingTextElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            preferredSelectionTool: {
                type: "selection" | "lasso";
                initialized: boolean;
            };
            penMode: boolean;
            penDetected: boolean;
            exportBackground: boolean;
            exportEmbedScene: boolean;
            exportWithDarkMode: boolean;
            exportScale: number;
            currentItemStrokeColor: string;
            currentItemBackgroundColor: string;
            currentItemFillStyle: ExcalidrawElement["fillStyle"];
            currentItemStrokeWidth: number;
            currentItemStrokeStyle: ExcalidrawElement["strokeStyle"];
            currentItemRoughness: number;
            currentItemOpacity: number;
            currentItemFontFamily: import("@excalidraw/element/types").FontFamilyValues;
            currentItemFontSize: number;
            currentItemTextAlign: import("@excalidraw/element/types").TextAlign;
            currentItemStartArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentItemEndArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentHoveredFontFamily: import("@excalidraw/element/types").FontFamilyValues | null;
            currentItemRoundness: import("@excalidraw/element/types").StrokeRoundness;
            currentItemArrowType: "sharp" | "round" | "elbow";
            viewBackgroundColor: string;
            scrollX: number;
            scrollY: number;
            cursorButton: "up" | "down";
            scrolledOutside: boolean;
            name: string | null;
            isResizing: boolean;
            isRotating: boolean;
            zoom: import("../types").Zoom;
            openMenu: "canvas" | null;
            openPopup: "canvasBackground" | "elementBackground" | "elementStroke" | "fontFamily" | "compactTextProperties" | "compactStrokeStyles" | "compactOtherProperties" | "compactArrowProperties" | null;
            openSidebar: {
                name: import("../types").SidebarName;
                tab?: import("../types").SidebarTabName;
            } | null;
            openDialog: null | {
                name: "imageExport" | "help" | "jsonExport";
            } | {
                name: "ttd";
                tab: "text-to-diagram" | "mermaid";
            } | {
                name: "commandPalette";
            } | {
                name: "settings";
            } | {
                name: "elementLinkSelector";
                sourceElementId: ExcalidrawElement["id"];
            };
            defaultSidebarDockedPreference: boolean;
            lastPointerDownWith: import("@excalidraw/element/types").PointerType;
            selectedElementIds: Readonly<{
                [id: string]: true;
            }>;
            hoveredElementIds: Readonly<{
                [id: string]: true;
            }>;
            previousSelectedElementIds: {
                [id: string]: true;
            };
            selectedElementsAreBeingDragged: boolean;
            shouldCacheIgnoreZoom: boolean;
            toast: {
                message: string;
                closable?: boolean;
                duration?: number;
            } | null;
            zenModeEnabled: boolean;
            theme: import("@excalidraw/element/types").Theme;
            gridSize: number;
            gridStep: number;
            gridModeEnabled: boolean;
            viewModeEnabled: boolean;
            selectedGroupIds: {
                [groupId: string]: boolean;
            };
            editingGroupId: import("@excalidraw/element/types").GroupId | null;
            width: number;
            height: number;
            offsetTop: number;
            offsetLeft: number;
            fileHandle: import("browser-fs-access").FileSystemHandle | null;
            collaborators: Map<import("../types").SocketId, import("../types").Collaborator>;
            stats: {
                open: boolean;
                panels: number;
            };
            currentChartType: import("@excalidraw/element/types").ChartType;
            pasteDialog: {
                shown: false;
                data: null;
            } | {
                shown: true;
                data: import("../charts").Spreadsheet;
            };
            showHyperlinkPopup: false | "info" | "editor";
            selectedLinearElement: import("@excalidraw/element").LinearElementEditor | null;
            snapLines: readonly import("../snapping").SnapLine[];
            originSnapOffset: {
                x: number;
                y: number;
            } | null;
            objectsSnapModeEnabled: boolean;
            userToFollow: import("../types").UserToFollow | null;
            followedBy: Set<import("../types").SocketId>;
            isCropping: boolean;
            croppingElementId: ExcalidrawElement["id"] | null;
            searchMatches: Readonly<{
                focusedId: ExcalidrawElement["id"] | null;
                matches: readonly import("../types").SearchMatch[];
            }> | null;
            activeLockedId: string | null;
            lockedMultiSelections: {
                [groupId: string]: true;
            };
            bindMode: import("@excalidraw/element/types").BindMode;
        };
        captureUpdate: "EVENTUALLY";
    };
    keyTest: (event: KeyboardEvent | import("react").KeyboardEvent<Element>) => boolean;
} & {
    keyTest?: ((event: KeyboardEvent | import("react").KeyboardEvent<Element>) => boolean) | undefined;
};
export declare const actionWrapSelectionInFrame: {
    name: "wrapSelectionInFrame";
    label: string;
    trackEvent: {
        category: "element";
    };
    predicate: (elements: readonly ExcalidrawElement[], appState: AppState, _: import("../types").ExcalidrawProps, app: AppClassProperties) => boolean;
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<AppState>, _: unknown, app: AppClassProperties) => {
        elements: ((Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "text";
            fontSize: number;
            fontFamily: import("@excalidraw/element/types").FontFamilyValues;
            text: string;
            textAlign: import("@excalidraw/element/types").TextAlign;
            verticalAlign: import("@excalidraw/element/types").VerticalAlign;
            containerId: import("@excalidraw/element/types").ExcalidrawGenericElement["id"] | null;
            originalText: string;
            autoResize: boolean;
            lineHeight: number & {
                _brand: "unitlessLineHeight";
            };
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "rectangle";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "diamond";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "frame";
            name: string | null;
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "magicframe";
            name: string | null;
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "embeddable";
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "image";
            fileId: import("@excalidraw/element/types").FileId | null;
            status: "pending" | "saved" | "error";
            scale: [number, number];
            crop: import("@excalidraw/element/types").ImageCrop | null;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "iframe";
            customData?: {
                generationData?: import("@excalidraw/element/types").MagicGenerationData;
            };
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "selection";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "ellipse";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "line" | "arrow";
            points: readonly import("@excalidraw/math").LocalPoint[];
            startBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            endBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            startArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            endArrowhead: import("@excalidraw/element/types").Arrowhead | null;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "freedraw";
            points: readonly import("@excalidraw/math").LocalPoint[];
            pressures: readonly number[];
            simulatePressure: boolean;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameElement>)[];
        appState: {
            selectedElementIds: {
                [x: string]: true;
            };
        };
        captureUpdate: "IMMEDIATELY";
    };
} & {
    keyTest?: undefined;
};
