import type { ColorPaletteCustom } from "@excalidraw/common";
interface PickerColorListProps {
    palette: ColorPaletteCustom;
    color: string | null;
    onChange: (color: string) => void;
    activeShade: number;
    showHotKey?: boolean;
}
declare const PickerColorList: ({ palette, color, onChange, activeShade, showHotKey, }: PickerColorListProps) => import("react/jsx-runtime").JSX.Element;
export default PickerColorList;
