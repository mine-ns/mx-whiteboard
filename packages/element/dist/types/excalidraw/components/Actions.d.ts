import type { ExcalidrawElement, NonDeletedElementsMap, NonDeletedSceneElementsMap } from "@excalidraw/element/types";
import "./Actions.scss";
import type { AppClassProperties, AppProps, UIAppState, Zoom, AppState } from "../types";
import type { ActionManager } from "../actions/manager";
export declare const canChangeStrokeColor: (appState: UIAppState, targetElements: ExcalidrawElement[]) => boolean;
export declare const canChangeBackgroundColor: (appState: UIAppState, targetElements: ExcalidrawElement[]) => boolean;
export declare const SelectedShapeActions: ({ appState, elementsMap, renderAction, app, }: {
    appState: UIAppState;
    elementsMap: NonDeletedElementsMap | NonDeletedSceneElementsMap;
    renderAction: ActionManager["renderAction"];
    app: AppClassProperties;
}) => import("react/jsx-runtime").JSX.Element;
export declare const CompactShapeActions: ({ appState, elementsMap, renderAction, app, setAppState, }: {
    appState: UIAppState;
    elementsMap: NonDeletedElementsMap | NonDeletedSceneElementsMap;
    renderAction: ActionManager["renderAction"];
    app: AppClassProperties;
    setAppState: React.Component<any, AppState>["setState"];
}) => import("react/jsx-runtime").JSX.Element;
export declare const MobileShapeActions: ({ appState, elementsMap, renderAction, app, setAppState, }: {
    appState: UIAppState;
    elementsMap: NonDeletedElementsMap | NonDeletedSceneElementsMap;
    renderAction: ActionManager["renderAction"];
    app: AppClassProperties;
    setAppState: React.Component<any, AppState>["setState"];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ShapesSwitcher: ({ activeTool, setAppState, app, UIOptions, }: {
    activeTool: UIAppState["activeTool"];
    setAppState: React.Component<any, AppState>["setState"];
    app: AppClassProperties;
    UIOptions: AppProps["UIOptions"];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ZoomActions: ({ renderAction, zoom, }: {
    renderAction: ActionManager["renderAction"];
    zoom: Zoom;
}) => import("react/jsx-runtime").JSX.Element;
export declare const UndoRedoActions: ({ renderAction, className, }: {
    renderAction: ActionManager["renderAction"];
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ExitZenModeButton: ({ actionManager, showExitZenModeBtn, }: {
    actionManager: ActionManager;
    showExitZenModeBtn: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ExitViewModeButton: ({ actionManager, }: {
    actionManager: ActionManager;
}) => import("react/jsx-runtime").JSX.Element;
