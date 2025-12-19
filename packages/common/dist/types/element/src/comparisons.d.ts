import type { ElementOrToolType } from "@excalidraw/excalidraw/types";
export declare const hasBackground: (type: ElementOrToolType) => type is "line" | "ellipse" | "rectangle" | "diamond" | "embeddable" | "iframe" | "freedraw";
export declare const hasStrokeColor: (type: ElementOrToolType) => type is "text" | "line" | "ellipse" | "rectangle" | "diamond" | "arrow" | "freedraw";
export declare const hasStrokeWidth: (type: ElementOrToolType) => type is "line" | "ellipse" | "rectangle" | "diamond" | "embeddable" | "iframe" | "arrow" | "freedraw";
export declare const hasStrokeStyle: (type: ElementOrToolType) => type is "line" | "ellipse" | "rectangle" | "diamond" | "embeddable" | "iframe" | "arrow";
export declare const canChangeRoundness: (type: ElementOrToolType) => type is "line" | "rectangle" | "diamond" | "embeddable" | "image" | "iframe";
export declare const toolIsArrow: (type: ElementOrToolType) => type is "arrow";
export declare const canHaveArrowheads: (type: ElementOrToolType) => type is "arrow";
