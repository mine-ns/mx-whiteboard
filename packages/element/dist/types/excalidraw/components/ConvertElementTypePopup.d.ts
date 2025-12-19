import type { ConvertibleTypes, ExcalidrawElement, ExcalidrawTextContainer, ExcalidrawTextElementWithContainer } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";
import "./ConvertElementTypePopup.scss";
import type App from "./App";
export declare const convertElementTypePopupAtom: import("jotai/vanilla/atom").PrimitiveAtom<{
    type: "panel";
} | null> & {
    init: {
        type: "panel";
    } | null;
};
declare const ConvertElementTypePopup: ({ app }: {
    app: App;
}) => import("react/jsx-runtime").JSX.Element;
export declare const adjustBoundTextSize: (container: ExcalidrawTextContainer, boundText: ExcalidrawTextElementWithContainer, scene: Scene) => void;
type ConversionType = "generic" | "linear" | null;
export declare const convertElementTypes: (app: App, { conversionType, nextType, direction, }: {
    conversionType: ConversionType;
    nextType?: ConvertibleTypes;
    direction?: "left" | "right";
}) => boolean;
export declare const getConversionTypeFromElements: (elements: ExcalidrawElement[]) => ConversionType;
export default ConvertElementTypePopup;
