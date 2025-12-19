import type { ElementOrToolType } from "@excalidraw/excalidraw/types";
export declare const hasBackground: (type: ElementOrToolType) => type is "line" | "rectangle" | "diamond" | "ellipse" | "embeddable" | "iframe" | "freedraw";
export declare const hasStrokeColor: (type: ElementOrToolType) => type is "line" | "arrow" | "text" | "rectangle" | "diamond" | "ellipse" | "freedraw";
export declare const hasStrokeWidth: (type: ElementOrToolType) => type is "line" | "arrow" | "rectangle" | "diamond" | "ellipse" | "embeddable" | "iframe" | "freedraw";
export declare const hasStrokeStyle: (type: ElementOrToolType) => type is "line" | "arrow" | "rectangle" | "diamond" | "ellipse" | "embeddable" | "iframe";
export declare const canChangeRoundness: (type: ElementOrToolType) => type is "line" | "rectangle" | "diamond" | "embeddable" | "iframe" | "image";
export declare const toolIsArrow: (type: ElementOrToolType) => type is "arrow";
export declare const canHaveArrowheads: (type: ElementOrToolType) => type is "arrow";
