import type { ElementsSegmentsMap, GlobalPoint } from "@excalidraw/math/types";
import type { ElementsMap, ExcalidrawElement } from "@excalidraw/element/types";
export declare const getLassoSelectedElementIds: (input: {
    lassoPath: GlobalPoint[];
    elements: readonly ExcalidrawElement[];
    elementsMap: ElementsMap;
    elementsSegments: ElementsSegmentsMap;
    intersectedElements: Set<ExcalidrawElement["id"]>;
    enclosedElements: Set<ExcalidrawElement["id"]>;
    simplifyDistance?: number;
}) => {
    selectedElementIds: string[];
};
