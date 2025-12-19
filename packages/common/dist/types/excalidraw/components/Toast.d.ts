import "./Toast.scss";
import type { CSSProperties } from "react";
export declare const Toast: ({ message, onClose, closable, duration, style, }: {
    message: string;
    onClose: () => void;
    closable?: boolean;
    duration?: number;
    style?: CSSProperties;
}) => import("react/jsx-runtime").JSX.Element;
