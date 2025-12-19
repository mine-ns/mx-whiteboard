import type { StaticCanvasRenderConfig } from "../scene/types";
import type { AppState, StaticCanvasAppState } from "../types";
export declare const fillCircle: (context: CanvasRenderingContext2D, cx: number, cy: number, radius: number, stroke: boolean, fill?: boolean) => void;
export declare const getNormalizedCanvasDimensions: (canvas: HTMLCanvasElement, scale: number) => [number, number];
export declare const bootstrapCanvas: ({ canvas, scale, normalizedWidth, normalizedHeight, theme, isExporting, viewBackgroundColor, }: {
    canvas: HTMLCanvasElement;
    scale: number;
    normalizedWidth: number;
    normalizedHeight: number;
    theme?: AppState["theme"];
    isExporting?: StaticCanvasRenderConfig["isExporting"];
    viewBackgroundColor?: StaticCanvasAppState["viewBackgroundColor"];
}) => CanvasRenderingContext2D;
export declare const strokeRectWithRotation_simple: (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, cx: number, cy: number, angle: number, fill?: boolean, 
/** should account for zoom */
radius?: number) => void;
