import { type GlobalPoint } from "@excalidraw/math";
import type { Curve, LineSegment } from "@excalidraw/math";
import type { Zoom } from "@excalidraw/excalidraw/types";
import type { ElementsMap, ExcalidrawArrowElement, ExcalidrawDiamondElement, ExcalidrawElement, ExcalidrawFreeDrawElement, ExcalidrawLinearElement, ExcalidrawRectanguloidElement } from "./types";
/**
 * Returns the **rotated** components of freedraw, line or arrow elements.
 *
 * @param element The linear element to deconstruct
 * @returns The rotated in components.
 */
export declare function deconstructLinearOrFreeDrawElement(element: ExcalidrawLinearElement | ExcalidrawFreeDrawElement): [LineSegment<GlobalPoint>[], Curve<GlobalPoint>[]];
/**
 * Get the building components of a rectanguloid element in the form of
 * line segments and curves **unrotated**.
 *
 * @param element Target rectanguloid element
 * @param offset Optional offset to expand the rectanguloid shape
 * @returns Tuple of **unrotated** line segments (0) and curves (1)
 */
export declare function deconstructRectanguloidElement(element: ExcalidrawRectanguloidElement, offset?: number): [LineSegment<GlobalPoint>[], Curve<GlobalPoint>[]];
/**
 * Get the **unrotated** building components of a diamond element
 * in the form of line segments and curves as a tuple, in this order.
 *
 * @param element The element to deconstruct
 * @param offset An optional offset
 * @returns Tuple of line **unrotated** segments (0) and curves (1)
 */
export declare function deconstructDiamondElement(element: ExcalidrawDiamondElement, offset?: number): [LineSegment<GlobalPoint>[], Curve<GlobalPoint>[]];
export declare const isPathALoop: (points: ExcalidrawLinearElement["points"], 
/** supply if you want the loop detection to account for current zoom */
zoomValue?: Zoom["value"]) => boolean;
export declare const getCornerRadius: (x: number, element: ExcalidrawElement) => number;
export declare const projectFixedPointOntoDiagonal: (arrow: ExcalidrawArrowElement, point: GlobalPoint, element: ExcalidrawElement, startOrEnd: "start" | "end", elementsMap: ElementsMap) => GlobalPoint | null;
