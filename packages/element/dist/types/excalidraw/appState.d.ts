import type { AppState, NormalizedZoomValue } from "./types";
export declare const getDefaultAppState: () => Omit<AppState, "offsetTop" | "offsetLeft" | "width" | "height">;
export declare const clearAppStateForLocalStorage: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    name?: string | null | undefined;
    zoom?: Readonly<{
        value: NormalizedZoomValue;
    }> | undefined;
    scrollX?: number | undefined;
    scrollY?: number | undefined;
    editingGroupId?: string | null | undefined;
    selectedElementIds?: Readonly<{
        [id: string]: true;
    }> | undefined;
    theme?: import("@excalidraw/element/types").Theme | undefined;
    selectedGroupIds?: {
        [groupId: string]: boolean;
    } | undefined;
    selectedLinearElement?: import("@excalidraw/element").LinearElementEditor | null | undefined;
    zenModeEnabled?: boolean | undefined;
    shouldCacheIgnoreZoom?: boolean | undefined;
    exportScale?: number | undefined;
    bindMode?: import("@excalidraw/element/types").BindMode | undefined;
    gridSize?: number | undefined;
    showWelcomeScreen?: boolean | undefined;
    activeTool?: ({
        lastActiveTool: import("./types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("./types").ActiveTool) | undefined;
    preferredSelectionTool?: {
        type: "selection" | "lasso";
        initialized: boolean;
    } | undefined;
    penMode?: boolean | undefined;
    penDetected?: boolean | undefined;
    exportBackground?: boolean | undefined;
    exportEmbedScene?: boolean | undefined;
    exportWithDarkMode?: boolean | undefined;
    currentItemStrokeColor?: string | undefined;
    currentItemBackgroundColor?: string | undefined;
    currentItemFillStyle?: import("@excalidraw/element/types").FillStyle | undefined;
    currentItemStrokeWidth?: number | undefined;
    currentItemStrokeStyle?: import("@excalidraw/element/types").StrokeStyle | undefined;
    currentItemRoughness?: number | undefined;
    currentItemOpacity?: number | undefined;
    currentItemFontFamily?: number | undefined;
    currentItemFontSize?: number | undefined;
    currentItemTextAlign?: string | undefined;
    currentItemStartArrowhead?: import("@excalidraw/element/types").Arrowhead | null | undefined;
    currentItemEndArrowhead?: import("@excalidraw/element/types").Arrowhead | null | undefined;
    currentItemRoundness?: import("@excalidraw/element/types").StrokeRoundness | undefined;
    currentItemArrowType?: "round" | "sharp" | "elbow" | undefined;
    cursorButton?: "up" | "down" | undefined;
    scrolledOutside?: boolean | undefined;
    openMenu?: "canvas" | null | undefined;
    openSidebar?: {
        name: import("./types").SidebarName;
        tab?: import("./types").SidebarTabName;
    } | null | undefined;
    defaultSidebarDockedPreference?: boolean | undefined;
    lastPointerDownWith?: import("@excalidraw/element/types").PointerType | undefined;
    previousSelectedElementIds?: {
        [id: string]: true;
    } | undefined;
    gridStep?: number | undefined;
    gridModeEnabled?: boolean | undefined;
    stats?: {
        open: boolean;
        panels: number;
    } | undefined;
    currentChartType?: import("@excalidraw/element/types").ChartType | undefined;
    objectsSnapModeEnabled?: boolean | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
};
export declare const cleanAppStateForExport: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    gridSize?: number | undefined;
    gridStep?: number | undefined;
    gridModeEnabled?: boolean | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
};
export declare const clearAppStateForDatabase: (appState: Partial<AppState>) => {
    viewBackgroundColor?: string | undefined;
    gridSize?: number | undefined;
    gridStep?: number | undefined;
    gridModeEnabled?: boolean | undefined;
    lockedMultiSelections?: {
        [groupId: string]: true;
    } | undefined;
};
export declare const isEraserActive: ({ activeTool, }: {
    activeTool: AppState["activeTool"];
}) => boolean;
export declare const isHandToolActive: ({ activeTool, }: {
    activeTool: AppState["activeTool"];
}) => boolean;
