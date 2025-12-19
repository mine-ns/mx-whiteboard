import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { AppState } from "../types";
type FormData = {
    event: PointerEvent;
    sceneCoords: {
        x: number;
        y: number;
    };
};
export declare const actionFinalize: import("./types").Action<FormData> & {
    keyTest?: ((event: React.KeyboardEvent | KeyboardEvent, appState: AppState, elements: readonly ExcalidrawElement[], app: import("../types").AppClassProperties) => boolean) | undefined;
};
export {};
