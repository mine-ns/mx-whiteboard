import React from "react";
declare const MenuContent: {
    ({ children, onClickOutside, className, onSelect, style, placement, }: {
        children?: React.ReactNode;
        onClickOutside?: () => void;
        className?: string;
        /**
         * Called when any menu item is selected (clicked on).
         */
        onSelect?: (event: Event) => void;
        style?: React.CSSProperties;
        placement?: "top" | "bottom";
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export default MenuContent;
