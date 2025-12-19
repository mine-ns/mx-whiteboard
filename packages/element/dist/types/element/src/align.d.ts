import type { AppState } from "@excalidraw/excalidraw/types";
import type { Scene } from "./Scene";
import type { ExcalidrawElement } from "./types";
export interface Alignment {
    position: "start" | "center" | "end";
    axis: "x" | "y";
}
export declare const alignElements: (selectedElements: ExcalidrawElement[], alignment: Alignment, scene: Scene, appState: Readonly<AppState>) => ExcalidrawElement[];
