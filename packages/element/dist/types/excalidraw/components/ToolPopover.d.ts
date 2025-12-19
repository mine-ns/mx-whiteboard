import React from "react";
import "./ToolPopover.scss";
import type { AppClassProperties } from "../types";
type ToolOption = {
    type: string;
    icon: React.ReactNode;
    title?: string;
};
type ToolPopoverProps = {
    app: AppClassProperties;
    options: readonly ToolOption[];
    activeTool: {
        type: string;
    };
    defaultOption: string;
    className?: string;
    namePrefix: string;
    title: string;
    "data-testid": string;
    onToolChange: (type: string) => void;
    displayedOption: ToolOption;
    fillable?: boolean;
};
export declare const ToolPopover: ({ app, options, activeTool, defaultOption, className, namePrefix, title, "data-testid": dataTestId, onToolChange, displayedOption, fillable, }: ToolPopoverProps) => import("react/jsx-runtime").JSX.Element;
export {};
