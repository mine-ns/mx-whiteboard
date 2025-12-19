import type { ElementOrToolType } from "@excalidraw/excalidraw/types";
import type { MarkNonNullable } from "@excalidraw/common/utility-types";
import type { Bounds } from "./bounds";
import type { ExcalidrawElement, ExcalidrawTextElement, ExcalidrawEmbeddableElement, ExcalidrawLinearElement, ExcalidrawBindableElement, ExcalidrawFreeDrawElement, InitializedExcalidrawImageElement, ExcalidrawImageElement, ExcalidrawTextElementWithContainer, ExcalidrawTextContainer, ExcalidrawFrameElement, RoundnessType, ExcalidrawFrameLikeElement, ExcalidrawElementType, ExcalidrawIframeElement, ExcalidrawIframeLikeElement, ExcalidrawMagicFrameElement, ExcalidrawArrowElement, ExcalidrawElbowArrowElement, ExcalidrawLineElement, ExcalidrawFlowchartNodeElement, ExcalidrawLinearElementSubType } from "./types";
export declare const isInitializedImageElement: (element: ExcalidrawElement | null) => element is InitializedExcalidrawImageElement;
export declare const isImageElement: (element: ExcalidrawElement | null) => element is ExcalidrawImageElement;
export declare const isEmbeddableElement: (element: ExcalidrawElement | null | undefined) => element is ExcalidrawEmbeddableElement;
export declare const isIframeElement: (element: ExcalidrawElement | null) => element is ExcalidrawIframeElement;
export declare const isIframeLikeElement: (element: ExcalidrawElement | null) => element is ExcalidrawIframeLikeElement;
export declare const isTextElement: (element: ExcalidrawElement | null) => element is ExcalidrawTextElement;
export declare const isFrameElement: (element: ExcalidrawElement | null) => element is ExcalidrawFrameElement;
export declare const isMagicFrameElement: (element: ExcalidrawElement | null) => element is ExcalidrawMagicFrameElement;
export declare const isFrameLikeElement: (element: ExcalidrawElement | null) => element is ExcalidrawFrameLikeElement;
export declare const isFreeDrawElement: (element?: ExcalidrawElement | null) => element is ExcalidrawFreeDrawElement;
export declare const isFreeDrawElementType: (elementType: ExcalidrawElementType) => boolean;
export declare const isLinearElement: (element?: ExcalidrawElement | null) => element is ExcalidrawLinearElement;
export declare const isLineElement: (element?: ExcalidrawElement | null) => element is ExcalidrawLineElement;
export declare const isArrowElement: (element?: ExcalidrawElement | null) => element is ExcalidrawArrowElement;
export declare const isElbowArrow: (element?: ExcalidrawElement) => element is ExcalidrawElbowArrowElement;
/**
 * sharp or curved arrow, but not elbow
 */
export declare const isSimpleArrow: (element?: ExcalidrawElement) => element is ExcalidrawArrowElement;
export declare const isSharpArrow: (element?: ExcalidrawElement) => element is ExcalidrawArrowElement;
export declare const isCurvedArrow: (element?: ExcalidrawElement) => element is ExcalidrawArrowElement;
export declare const isLinearElementType: (elementType: ElementOrToolType) => boolean;
export declare const isBindingElement: (element?: ExcalidrawElement | null, includeLocked?: boolean) => element is ExcalidrawArrowElement;
export declare const isBindingElementType: (elementType: ElementOrToolType) => boolean;
export declare const isBindableElement: (element: ExcalidrawElement | null | undefined, includeLocked?: boolean) => element is ExcalidrawBindableElement;
export declare const isRectanguloidElement: (element?: ExcalidrawElement | null) => element is ExcalidrawBindableElement;
export declare const isRectangularElement: (element?: ExcalidrawElement | null) => element is ExcalidrawBindableElement;
export declare const isTextBindableContainer: (element: ExcalidrawElement | null, includeLocked?: boolean) => element is ExcalidrawTextContainer;
export declare const isExcalidrawElement: (element: any) => element is ExcalidrawElement;
export declare const isFlowchartNodeElement: (element: ExcalidrawElement) => element is ExcalidrawFlowchartNodeElement;
export declare const hasBoundTextElement: (element: ExcalidrawElement | null) => element is MarkNonNullable<ExcalidrawBindableElement, "boundElements">;
export declare const isBoundToContainer: (element: ExcalidrawElement | null) => element is ExcalidrawTextElementWithContainer;
export declare const isArrowBoundToElement: (element: ExcalidrawArrowElement) => boolean;
export declare const isUsingAdaptiveRadius: (type: string) => type is "rectangle" | "embeddable" | "iframe" | "image";
export declare const isUsingProportionalRadius: (type: string) => type is "line" | "arrow" | "diamond";
export declare const canApplyRoundnessTypeToElement: (roundnessType: RoundnessType, element: ExcalidrawElement) => boolean;
export declare const getDefaultRoundnessTypeForElement: (element: ExcalidrawElement) => {
    type: 2;
} | {
    type: 3;
} | null;
export declare const isBounds: (box: unknown) => box is Bounds;
export declare const getLinearElementSubType: (element: ExcalidrawLinearElement) => ExcalidrawLinearElementSubType;
/**
 * Checks if current element points meet all the conditions for polygon=true
 * (this isn't a element type check, for that use isLineElement).
 *
 * If you want to check if points *can* be turned into a polygon, use
 *  canBecomePolygon(points).
 */
export declare const isValidPolygon: (points: ExcalidrawLineElement["points"]) => boolean;
export declare const canBecomePolygon: (points: ExcalidrawLineElement["points"]) => boolean;
