import type { ColorPickerType } from "./colorPickerUtils";
interface ColorInputProps {
    color: string;
    onChange: (color: string) => void;
    label: string;
    colorPickerType: ColorPickerType;
    placeholder?: string;
}
export declare const ColorInput: ({ color, onChange, label, colorPickerType, placeholder, }: ColorInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
