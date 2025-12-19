import type { AppClassProperties } from "../types";
export declare const actionTextAutoResize: {
    name: "autoResize";
    label: string;
    icon: null;
    trackEvent: {
        category: "element";
    };
    predicate: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: import("../types").AppState, _: unknown, app: AppClassProperties) => boolean;
    perform: (elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<import("../types").AppState>, _: unknown, app: AppClassProperties) => {
        appState: Readonly<import("../types").AppState>;
        elements: import("@excalidraw/element/types").OrderedExcalidrawElement[];
        captureUpdate: "IMMEDIATELY";
    };
} & {
    keyTest?: undefined;
};
