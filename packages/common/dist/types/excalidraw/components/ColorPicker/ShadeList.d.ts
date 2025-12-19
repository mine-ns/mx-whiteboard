import type { ColorPaletteCustom } from "@excalidraw/common";
interface ShadeListProps {
    color: string | null;
    onChange: (color: string) => void;
    palette: ColorPaletteCustom;
    showHotKey?: boolean;
}
export declare const ShadeList: ({ color, onChange, palette, showHotKey, }: ShadeListProps) => import("react/jsx-runtime").JSX.Element;
export {};
