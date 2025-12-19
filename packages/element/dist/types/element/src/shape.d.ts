import { type GeometricShape } from "@excalidraw/utils/shape";
import { type LocalPoint } from "@excalidraw/math";
import type { GlobalPoint } from "@excalidraw/math";
import type { AppState, EmbedsValidationStatus } from "@excalidraw/excalidraw/types";
import type { ElementShape, ElementShapes } from "@excalidraw/excalidraw/scene/types";
import type { ExcalidrawElement, ExcalidrawSelectionElement, ExcalidrawLinearElement, ExcalidrawFreeDrawElement, ElementsMap, ExcalidrawLineElement } from "./types";
import type { Drawable, Options } from "roughjs/bin/core";
export declare class ShapeCache {
    private static rg;
    private static cache;
    /**
     * Retrieves shape from cache if available. Use this only if shape
     * is optional and you have a fallback in case it's not cached.
     */
    static get: <T extends ExcalidrawElement>(element: T) => T["type"] extends keyof ElementShapes ? ElementShapes[T["type"]] | undefined : ElementShape | undefined;
    static set: <T extends ExcalidrawElement>(element: T, shape: T["type"] extends keyof ElementShapes ? ElementShapes[T["type"]] : Drawable) => WeakMap<ExcalidrawElement, ElementShape>;
    static delete: (element: ExcalidrawElement) => boolean;
    static destroy: () => void;
    /**
     * Generates & caches shape for element if not already cached, otherwise
     * returns cached shape.
     */
    static generateElementShape: <T extends Exclude<ExcalidrawElement, ExcalidrawSelectionElement>>(element: T, renderConfig: {
        isExporting: boolean;
        canvasBackgroundColor: AppState["viewBackgroundColor"];
        embedsValidationStatus: EmbedsValidationStatus;
    } | null) => ((T["type"] extends keyof ElementShapes ? ElementShapes[T["type"]] | undefined : ElementShape | undefined) & {}) | (T["type"] extends keyof ElementShapes ? ElementShapes[T["type"]] : Drawable | null);
}
export declare const generateRoughOptions: (element: ExcalidrawElement, continuousPath?: boolean) => Options;
export declare const generateLinearCollisionShape: (element: ExcalidrawLinearElement | ExcalidrawFreeDrawElement) => {
    op: string;
    data: number[];
}[];
/**
 * get the pure geometric shape of an excalidraw elementw
 * which is then used for hit detection
 */
export declare const getElementShape: <Point extends GlobalPoint | LocalPoint>(element: ExcalidrawElement, elementsMap: ElementsMap) => GeometricShape<Point>;
export declare const toggleLinePolygonState: (element: ExcalidrawLineElement, nextPolygonState: boolean) => {
    polygon: ExcalidrawLineElement["polygon"];
    points: ExcalidrawLineElement["points"];
} | null;
