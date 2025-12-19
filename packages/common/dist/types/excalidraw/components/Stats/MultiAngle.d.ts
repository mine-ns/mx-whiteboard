import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { Scene } from "@excalidraw/element";
import type { AppState } from "../../types";
interface MultiAngleProps {
    elements: readonly ExcalidrawElement[];
    scene: Scene;
    appState: AppState;
    property: "angle";
}
declare const MultiAngle: ({ elements, scene, appState, property, }: MultiAngleProps) => import("react/jsx-runtime").JSX.Element;
export default MultiAngle;
