import type { ExcalidrawElement, NonDeletedExcalidrawElement } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";
import type { AppState } from "../types";
export declare class Renderer {
    private scene;
    constructor(scene: Scene);
    getRenderableElements: ((opts: {
        zoom: Readonly<{
            value: import("../types").NormalizedZoomValue;
        }>;
        offsetLeft: AppState["offsetLeft"];
        offsetTop: AppState["offsetTop"];
        scrollX: AppState["scrollX"];
        scrollY: AppState["scrollY"];
        height: AppState["height"];
        width: AppState["width"];
        editingTextElement: AppState["editingTextElement"];
        /** note: first render of newElement will always bust the cache
         * (we'd have to prefilter elements outside of this function) */
        newElementId: ExcalidrawElement["id"] | undefined;
        sceneNonce: ReturnType<InstanceType<typeof Scene>["getSceneNonce"]>;
    }) => {
        elementsMap: Map<string, NonDeletedExcalidrawElement> & import("@excalidraw/common/utility-types").MakeBrand<"NonDeletedElementsMap"> & import("@excalidraw/common/utility-types").MakeBrand<"RenderableElementsMap">;
        visibleElements: readonly NonDeletedExcalidrawElement[];
    }) & {
        clear: () => void;
    };
    destroy(): void;
}
