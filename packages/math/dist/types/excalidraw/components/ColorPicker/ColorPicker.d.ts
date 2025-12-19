import type { ColorTuple, ColorPaletteCustom } from "@excalidraw/common";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import "./ColorPicker.scss";
import type { ColorPickerType } from "./colorPickerUtils";
import type { AppState } from "../../types";
export declare const getColor: (color: string) => string | null;
interface ColorPickerProps {
    type: ColorPickerType;
    /**
     * null indicates no color should be displayed as active
     * (e.g. when multiple shapes selected with different colors)
     */
    color: string | null;
    onChange: (color: string) => void;
    label: string;
    elements: readonly ExcalidrawElement[];
    appState: AppState;
    palette?: ColorPaletteCustom | null;
    topPicks?: ColorTuple;
    updateData: (formData?: any) => void;
}
export declare const ColorPicker: ({ type, color, onChange, label, elements, palette, topPicks, updateData, appState, }: ColorPickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
