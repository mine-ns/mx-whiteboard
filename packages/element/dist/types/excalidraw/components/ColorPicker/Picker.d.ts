import React from "react";
import type { ExcalidrawElement } from "@excalidraw/element/types";
import type { ColorPaletteCustom } from "@excalidraw/common";
import type { ColorPickerType } from "./colorPickerUtils";
interface PickerProps {
    color: string | null;
    onChange: (color: string) => void;
    type: ColorPickerType;
    elements: readonly ExcalidrawElement[];
    palette: ColorPaletteCustom;
    updateData: (formData?: any) => void;
    children?: React.ReactNode;
    showTitle?: boolean;
    onEyeDropperToggle: (force?: boolean) => void;
    onEscape: (event: React.KeyboardEvent | KeyboardEvent) => void;
    showHotKey?: boolean;
}
export declare const Picker: React.ForwardRefExoticComponent<PickerProps & React.RefAttributes<unknown>>;
export {};
