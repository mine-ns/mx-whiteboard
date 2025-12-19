import "./ToolIcon.scss";
import "./MobileToolBar.scss";
import type { AppClassProperties, UIAppState } from "../types";
type MobileToolBarProps = {
    app: AppClassProperties;
    onHandToolToggle: () => void;
    setAppState: React.Component<any, UIAppState>["setState"];
};
export declare const MobileToolBar: ({ app, onHandToolToggle, setAppState, }: MobileToolBarProps) => import("react/jsx-runtime").JSX.Element;
export {};
