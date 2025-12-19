interface CustomColorListProps {
    colors: string[];
    color: string | null;
    onChange: (color: string) => void;
    label: string;
}
export declare const CustomColorList: ({ colors, color, onChange, label, }: CustomColorListProps) => import("react/jsx-runtime").JSX.Element;
export {};
