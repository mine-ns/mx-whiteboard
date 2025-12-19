import type { AppState } from "@excalidraw/excalidraw/types";
import type { GlobalPoint } from "@excalidraw/math";
import type { Scene } from "./Scene";
import type { ExcalidrawArrowElement, ExcalidrawElement, NonDeletedExcalidrawElement, NonDeletedSceneElementsMap, Ordered, OrderedExcalidrawElement } from "./types";
/**
 * Moves the arrow element above any bindable elements it intersects with or
 * hovers over.
 */
export declare const moveArrowAboveBindable: (point: GlobalPoint, arrow: ExcalidrawArrowElement, elements: readonly Ordered<NonDeletedExcalidrawElement>[], elementsMap: NonDeletedSceneElementsMap, scene: Scene) => readonly OrderedExcalidrawElement[];
export declare const moveOneLeft: (allElements: readonly ExcalidrawElement[], appState: AppState, scene: Scene) => readonly ExcalidrawElement[];
export declare const moveOneRight: (allElements: readonly ExcalidrawElement[], appState: AppState, scene: Scene) => readonly ExcalidrawElement[];
export declare const moveAllLeft: (allElements: readonly ExcalidrawElement[], appState: AppState) => readonly ExcalidrawElement[] | ExcalidrawElement[];
export declare const moveAllRight: (allElements: readonly ExcalidrawElement[], appState: AppState) => readonly ExcalidrawElement[] | ExcalidrawElement[];
