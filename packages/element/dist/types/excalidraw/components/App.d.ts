import React from "react";
import { type EXPORT_IMAGE_TYPES, Emitter, type EditorInterface, type StylesPanelMode } from "@excalidraw/common";
import { LinearElementEditor, FlowChartCreator, Scene, Store, type ElementUpdate, StoreDelta, type ApplyToOptions } from "@excalidraw/element";
import type { ExcalidrawElement, NonDeleted, NonDeletedExcalidrawElement, ExcalidrawFrameLikeElement, ExcalidrawIframeElement, ExcalidrawEmbeddableElement, Ordered, SceneElementsMap } from "@excalidraw/element/types";
import type { Mutable } from "@excalidraw/common/utility-types";
import { ActionManager } from "../actions/manager";
import { AnimationFrameHandler } from "../animation-frame-handler";
import { History } from "../history";
import { Fonts } from "../fonts";
import { type WritableAtom } from "../editor-jotai";
import { Renderer } from "../scene/Renderer";
import { LaserTrails } from "../laser-trails";
import { isOverScrollBars } from "../scene/scrollbars";
import { LassoTrail } from "../lasso";
import { EraserTrail } from "../eraser";
import type { ExportedElements } from "../data";
import type { FileSystemHandle } from "../data/filesystem";
import type { AppClassProperties, AppProps, AppState, ExcalidrawImperativeAPI, BinaryFiles, LibraryItems, SceneData, FrameNameBoundsCache, SidebarName, SidebarTabName, ToolType, OnUserFollowedPayload, GenerateDiagramToCode, NullableGridSize, Offsets } from "../types";
import type { RoughCanvas } from "roughjs/bin/canvas";
import type { ActionResult } from "../actions/types";
export declare const ExcalidrawContainerContext: React.Context<{
    container: HTMLDivElement | null;
    id: string | null;
}>;
export declare const useApp: () => AppClassProperties;
export declare const useAppProps: () => AppProps;
export declare const useEditorInterface: () => Readonly<{
    formFactor: "phone" | "tablet" | "desktop";
    desktopUIMode: "compact" | "full";
    userAgent: Readonly<{
        isMobileDevice: boolean;
        platform: "ios" | "android" | "other" | "unknown";
    }>;
    isTouchScreen: boolean;
    canFitSidebar: boolean;
    isLandscape: boolean;
}>;
export declare const useStylesPanelMode: () => StylesPanelMode;
export declare const useExcalidrawContainer: () => {
    container: HTMLDivElement | null;
    id: string | null;
};
export declare const useExcalidrawElements: () => readonly NonDeletedExcalidrawElement[];
export declare const useExcalidrawAppState: () => AppState;
export declare const useExcalidrawSetAppState: () => <K extends keyof AppState>(state: AppState | ((prevState: Readonly<AppState>, props: Readonly<any>) => AppState | Pick<AppState, K> | null) | Pick<AppState, K> | null, callback?: (() => void) | undefined) => void;
export declare const useExcalidrawActionManager: () => ActionManager;
declare class App extends React.Component<AppProps, AppState> {
    canvas: AppClassProperties["canvas"];
    interactiveCanvas: AppClassProperties["interactiveCanvas"];
    rc: RoughCanvas;
    unmounted: boolean;
    actionManager: ActionManager;
    editorInterface: EditorInterface;
    private stylesPanelMode;
    private excalidrawContainerRef;
    scene: Scene;
    fonts: Fonts;
    renderer: Renderer;
    visibleElements: readonly NonDeletedExcalidrawElement[];
    private resizeObserver;
    library: AppClassProperties["library"];
    libraryItemsFromStorage: LibraryItems | undefined;
    id: string;
    private store;
    private history;
    excalidrawContainerValue: {
        container: HTMLDivElement | null;
        id: string;
    };
    files: BinaryFiles;
    imageCache: AppClassProperties["imageCache"];
    private iFrameRefs;
    /**
     * Indicates whether the embeddable's url has been validated for rendering.
     * If value not set, indicates that the validation is pending.
     * Initially or on url change the flag is not reset so that we can guarantee
     * the validation came from a trusted source (the editor).
     **/
    private embedsValidationStatus;
    /** embeds that have been inserted to DOM (as a perf optim, we don't want to
     * insert to DOM before user initially scrolls to them) */
    private initializedEmbeds;
    private handleToastClose;
    private elementsPendingErasure;
    flowChartCreator: FlowChartCreator;
    private flowChartNavigator;
    bindModeHandler: ReturnType<typeof setTimeout> | null;
    hitLinkElement?: NonDeletedExcalidrawElement;
    lastPointerDownEvent: React.PointerEvent<HTMLElement> | null;
    lastPointerUpEvent: React.PointerEvent<HTMLElement> | PointerEvent | null;
    lastPointerMoveEvent: PointerEvent | null;
    lastPointerMoveCoords: {
        x: number;
        y: number;
    } | null;
    lastViewportPosition: {
        x: number;
        y: number;
    };
    animationFrameHandler: AnimationFrameHandler;
    laserTrails: LaserTrails;
    eraserTrail: EraserTrail;
    lassoTrail: LassoTrail;
    onChangeEmitter: Emitter<[elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles]>;
    onPointerDownEmitter: Emitter<[activeTool: {
        lastActiveTool: import("../types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("../types").ActiveTool, pointerDownState: Readonly<{
        origin: Readonly<{
            x: number;
            y: number;
        }>;
        originInGrid: Readonly<{
            x: number;
            y: number;
        }>;
        scrollbars: ReturnType<typeof isOverScrollBars>;
        lastCoords: {
            x: number;
            y: number;
        };
        originalElements: Map<string, NonDeleted<ExcalidrawElement>>;
        resize: {
            handleType: import("@excalidraw/element").MaybeTransformHandleType;
            isResizing: boolean;
            offset: {
                x: number;
                y: number;
            };
            arrowDirection: "origin" | "end";
            center: {
                x: number;
                y: number;
            };
        };
        hit: {
            element: NonDeleted<ExcalidrawElement> | null;
            allHitElements: NonDeleted<ExcalidrawElement>[];
            wasAddedToSelection: boolean;
            hasBeenDuplicated: boolean;
            hasHitCommonBoundingBoxOfSelectedElements: boolean;
        };
        withCmdOrCtrl: boolean;
        drag: {
            hasOccurred: boolean;
            offset: {
                x: number;
                y: number;
            } | null;
            origin: {
                x: number;
                y: number;
            };
            blockDragging: boolean;
        };
        eventListeners: {
            onMove: null | ReturnType<typeof import("@excalidraw/common").throttleRAF>;
            onUp: null | ((event: PointerEvent) => void);
            onKeyDown: null | ((event: KeyboardEvent) => void);
            onKeyUp: null | ((event: KeyboardEvent) => void);
        };
        boxSelection: {
            hasOccurred: boolean;
        };
    }>, event: React.PointerEvent<HTMLElement>]>;
    onPointerUpEmitter: Emitter<[activeTool: {
        lastActiveTool: import("../types").ActiveTool | null;
        locked: boolean;
        fromSelection: boolean;
    } & import("../types").ActiveTool, pointerDownState: Readonly<{
        origin: Readonly<{
            x: number;
            y: number;
        }>;
        originInGrid: Readonly<{
            x: number;
            y: number;
        }>;
        scrollbars: ReturnType<typeof isOverScrollBars>;
        lastCoords: {
            x: number;
            y: number;
        };
        originalElements: Map<string, NonDeleted<ExcalidrawElement>>;
        resize: {
            handleType: import("@excalidraw/element").MaybeTransformHandleType;
            isResizing: boolean;
            offset: {
                x: number;
                y: number;
            };
            arrowDirection: "origin" | "end";
            center: {
                x: number;
                y: number;
            };
        };
        hit: {
            element: NonDeleted<ExcalidrawElement> | null;
            allHitElements: NonDeleted<ExcalidrawElement>[];
            wasAddedToSelection: boolean;
            hasBeenDuplicated: boolean;
            hasHitCommonBoundingBoxOfSelectedElements: boolean;
        };
        withCmdOrCtrl: boolean;
        drag: {
            hasOccurred: boolean;
            offset: {
                x: number;
                y: number;
            } | null;
            origin: {
                x: number;
                y: number;
            };
            blockDragging: boolean;
        };
        eventListeners: {
            onMove: null | ReturnType<typeof import("@excalidraw/common").throttleRAF>;
            onUp: null | ((event: PointerEvent) => void);
            onKeyDown: null | ((event: KeyboardEvent) => void);
            onKeyUp: null | ((event: KeyboardEvent) => void);
        };
        boxSelection: {
            hasOccurred: boolean;
        };
    }>, event: PointerEvent]>;
    onUserFollowEmitter: Emitter<[payload: OnUserFollowedPayload]>;
    onScrollChangeEmitter: Emitter<[scrollX: number, scrollY: number, zoom: Readonly<{
        value: import("../types").NormalizedZoomValue;
    }>]>;
    missingPointerEventCleanupEmitter: Emitter<[event: PointerEvent | null]>;
    onRemoveEventListenersEmitter: Emitter<[]>;
    constructor(props: AppProps);
    updateEditorAtom: <Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>, ...args: Args) => Result;
    private onWindowMessage;
    private handleSkipBindMode;
    private resetDelayedBindMode;
    private previousHoveredBindableElement;
    private handleDelayedBindModeChange;
    private cacheEmbeddableRef;
    /**
     * Returns gridSize taking into account `gridModeEnabled`.
     * If disabled, returns null.
     */
    getEffectiveGridSize: () => NullableGridSize;
    private getHTMLIFrameElement;
    private handleEmbeddableCenterClick;
    private isIframeLikeElementCenter;
    private updateEmbedValidationStatus;
    private updateEmbeddables;
    private renderEmbeddables;
    private getFrameNameDOMId;
    frameNameBoundsCache: FrameNameBoundsCache;
    private resetEditingFrame;
    private renderFrameNames;
    private toggleOverscrollBehavior;
    render(): import("react/jsx-runtime").JSX.Element;
    focusContainer: AppClassProperties["focusContainer"];
    getSceneElementsIncludingDeleted: () => readonly import("@excalidraw/element/types").OrderedExcalidrawElement[];
    getSceneElementsMapIncludingDeleted: () => Map<string, Ordered<ExcalidrawElement>> & import("@excalidraw/common/utility-types").MakeBrand<"SceneElementsMap">;
    getSceneElements: () => readonly Ordered<NonDeletedExcalidrawElement>[];
    onInsertElements: (elements: readonly ExcalidrawElement[]) => void;
    onExportImage: (type: keyof typeof EXPORT_IMAGE_TYPES, elements: ExportedElements, opts: {
        exportingFrame: ExcalidrawFrameLikeElement | null;
    }) => Promise<void>;
    private magicGenerations;
    private updateMagicGeneration;
    plugins: {
        diagramToCode?: {
            generate: GenerateDiagramToCode;
        };
    };
    setPlugins(plugins: Partial<App["plugins"]>): void;
    private onMagicFrameGenerate;
    private onIframeSrcCopy;
    onMagicframeToolSelect: () => void;
    private openEyeDropper;
    dismissLinearEditor: () => void;
    syncActionResult: (actionResult: ActionResult) => void;
    private onBlur;
    private onUnload;
    private disableEvent;
    private resetHistory;
    private resetStore;
    /**
     * Resets scene & history.
     * ! Do not use to clear scene user action !
     */
    private resetScene;
    private initializeScene;
    private getFormFactor;
    refreshEditorInterface: () => void;
    private reconcileStylesPanelMode;
    /** TO BE USED LATER */
    private setDesktopUIMode;
    private clearImageShapeCache;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    private onResize;
    /** generally invoked only if fullscreen was invoked programmatically */
    private onFullscreenChange;
    private removeEventListeners;
    private addEventListeners;
    componentDidUpdate(prevProps: AppProps, prevState: AppState): void;
    private renderInteractiveSceneCallback;
    private onScroll;
    private onCut;
    private onCopy;
    private static resetTapTwice;
    private onTouchStart;
    private onTouchEnd;
    private insertClipboardContent;
    pasteFromClipboard: (event: ClipboardEvent) => Promise<void>;
    addElementsFromPasteOrLibrary: (opts: {
        elements: readonly ExcalidrawElement[];
        files: BinaryFiles | null;
        position: {
            clientX: number;
            clientY: number;
        } | "cursor" | "center";
        retainSeed?: boolean;
        fitToContent?: boolean;
    }) => void;
    private addElementsFromMixedContentPaste;
    private addTextFromPaste;
    setAppState: React.Component<any, AppState>["setState"];
    removePointer: (event: React.PointerEvent<HTMLElement> | PointerEvent) => void;
    toggleLock: (source?: "keyboard" | "ui") => void;
    updateFrameRendering: (opts: Partial<AppState["frameRendering"]> | ((prevState: AppState["frameRendering"]) => Partial<AppState["frameRendering"]>)) => void;
    togglePenMode: (force: boolean | null) => void;
    onHandToolToggle: () => void;
    /**
     * Zooms on canvas viewport center
     */
    zoomCanvas: (
    /**
     * Decimal fraction, auto-clamped between MIN_ZOOM and MAX_ZOOM.
     * 1 = 100% zoom, 2 = 200% zoom, 0.5 = 50% zoom
     */
    value: number) => void;
    private cancelInProgressAnimation;
    scrollToContent: (
    /**
     * target to scroll to
     *
     * - string - id of element or group, or url containing elementLink
     * - ExcalidrawElement | ExcalidrawElement[] - element(s) objects
     */
    target?: string | ExcalidrawElement | readonly ExcalidrawElement[], opts?: ({
        fitToContent?: boolean;
        fitToViewport?: never;
        viewportZoomFactor?: number;
        animate?: boolean;
        duration?: number;
    } | {
        fitToContent?: never;
        fitToViewport?: boolean;
        /** when fitToViewport=true, how much screen should the content cover,
         * between 0.1 (10%) and 1 (100%)
         */
        viewportZoomFactor?: number;
        animate?: boolean;
        duration?: number;
    }) & {
        minZoom?: number;
        maxZoom?: number;
        canvasOffsets?: Offsets;
    }) => void;
    private maybeUnfollowRemoteUser;
    /** use when changing scrollX/scrollY/zoom based on user interaction */
    private translateCanvas;
    setToast: (toast: {
        message: string;
        closable?: boolean;
        duration?: number;
    } | null) => void;
    restoreFileFromShare: () => Promise<void>;
    /**
     * adds supplied files to existing files in the appState.
     * NOTE if file already exists in editor state, the file data is not updated
     * */
    addFiles: ExcalidrawImperativeAPI["addFiles"];
    private addMissingFiles;
    updateScene: <K extends keyof AppState>(sceneData: {
        elements?: SceneData["elements"];
        appState?: Pick<AppState, K> | null;
        collaborators?: SceneData["collaborators"];
        /**
         *  Controls which updates should be captured by the `Store`. Captured updates are emmitted and listened to by other components, such as `History` for undo / redo purposes.
         *
         *  - `CaptureUpdateAction.IMMEDIATELY`: Updates are immediately undoable. Use for most local updates.
         *  - `CaptureUpdateAction.NEVER`: Updates never make it to undo/redo stack. Use for remote updates or scene initialization.
         *  - `CaptureUpdateAction.EVENTUALLY`: Updates will be eventually be captured as part of a future increment.
         *
         * Check [API docs](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api#captureUpdate) for more details.
         *
         * @default CaptureUpdateAction.EVENTUALLY
         */
        captureUpdate?: SceneData["captureUpdate"];
    }) => void;
    applyDeltas: (deltas: StoreDelta[], options?: ApplyToOptions) => [SceneElementsMap, AppState, boolean];
    mutateElement: <TElement extends Mutable<ExcalidrawElement>>(element: TElement, updates: ElementUpdate<TElement>, informMutation?: boolean) => TElement;
    private triggerRender;
    /**
     * @returns whether the menu was toggled on or off
     */
    toggleSidebar: ({ name, tab, force, }: {
        name: SidebarName | null;
        tab?: SidebarTabName;
        force?: boolean;
    }) => boolean;
    private updateCurrentCursorPosition;
    getEditorUIOffsets: () => Offsets;
    private onKeyDown;
    private onKeyUp;
    private isToolSupported;
    setActiveTool: (tool: ({
        type: ToolType;
    } | {
        type: "custom";
        customType: string;
    }) & {
        locked?: boolean;
        fromSelection?: boolean;
    }, keepSelection?: boolean) => void;
    setOpenDialog: (dialogType: AppState["openDialog"]) => void;
    private setCursor;
    private resetCursor;
    /**
     * returns whether user is making a gesture with >= 2 fingers (points)
     * on o touch screen (not on a trackpad). Currently only relates to Darwin
     * (iOS/iPadOS,MacOS), but may work on other devices in the future if
     * GestureEvent is standardized.
     */
    private isTouchScreenMultiTouchGesture;
    getName: () => string;
    private onGestureStart;
    private onGestureChange;
    private onGestureEnd;
    private handleTextWysiwyg;
    private deselectElements;
    private getTextElementAtPosition;
    private getElementAtPosition;
    private getElementsAtPosition;
    getElementHitThreshold(element: ExcalidrawElement): number;
    private hitElement;
    private getTextBindableContainerAtPosition;
    private startTextEditing;
    private startImageCropping;
    private finishImageCropping;
    private handleCanvasDoubleClick;
    private getElementLinkAtPosition;
    private redirectToLink;
    private getTopLayerFrameAtSceneCoords;
    private handleCanvasPointerMove;
    private handleEraser;
    private handleTouchMove;
    handleHoverSelectedLinearElement(linearElementEditor: LinearElementEditor, scenePointerX: number, scenePointerY: number): void;
    private handleCanvasPointerDown;
    private handleCanvasPointerUp;
    private maybeOpenContextMenuAfterPointerDownOnTouchDevices;
    private resetContextMenuTimer;
    /**
     * pointerup may not fire in certian cases (user tabs away...), so in order
     * to properly cleanup pointerdown state, we need to fire any hanging
     * pointerup handlers manually
     */
    private maybeCleanupAfterMissingPointerUp;
    handleCanvasPanUsingWheelOrSpaceDrag: (event: React.PointerEvent<HTMLElement> | MouseEvent) => boolean;
    private updateGestureOnPointerDown;
    private initialPointerDownState;
    private handleDraggingScrollBar;
    private clearSelectionIfNotUsingSelection;
    /**
     * @returns whether the pointer event has been completely handled
     */
    private handleSelectionOnPointerDown;
    private isASelectedElement;
    private isHittingCommonBoundingBoxOfSelectedElements;
    private handleTextOnPointerDown;
    private handleFreeDrawElementOnPointerDown;
    insertIframeElement: ({ sceneX, sceneY, width, height, }: {
        sceneX: number;
        sceneY: number;
        width: number;
        height: number;
    }) => NonDeleted<ExcalidrawIframeElement>;
    insertEmbeddableElement: ({ sceneX, sceneY, link, }: {
        sceneX: number;
        sceneY: number;
        link: string;
    }) => NonDeleted<ExcalidrawEmbeddableElement> | undefined;
    private newImagePlaceholder;
    private handleLinearElementOnPointerDown;
    private getCurrentItemRoundness;
    private createGenericElementOnPointerDown;
    private createFrameElementOnPointerDown;
    private maybeCacheReferenceSnapPoints;
    private maybeCacheVisibleGaps;
    private onKeyDownFromPointerDownHandler;
    private onKeyUpFromPointerDownHandler;
    private onPointerMoveFromPointerDownHandler;
    private handlePointerMoveOverScrollbars;
    private onPointerUpFromPointerDownHandler;
    private restoreReadyToEraseElements;
    private eraseElements;
    private initializeImage;
    /**
     * use during async image initialization,
     * when the placeholder image could have been modified in the meantime,
     * and when you don't want to loose those modifications
     */
    private getLatestInitializedImageElement;
    private onImageToolbarButtonClick;
    private getImageNaturalDimensions;
    /** updates image cache, refreshing updated elements and/or setting status
        to error for images that fail during <img> element creation */
    private updateImageCache;
    /** adds new images to imageCache and re-renders if needed */
    private addNewImagesToImageCache;
    /** generally you should use `addNewImagesToImageCache()` directly if you need
     *  to render new images. This is just a failsafe  */
    private scheduleImageRefresh;
    private updateBindingEnabledOnPointerMove;
    private clearSelection;
    private handleInteractiveCanvasRef;
    private insertImages;
    private handleAppOnDrop;
    loadFileToCanvas: (file: File, fileHandle: FileSystemHandle | null) => Promise<void>;
    private handleCanvasContextMenu;
    private maybeDragNewGenericElement;
    private maybeHandleCrop;
    private maybeHandleResize;
    private getContextMenuItems;
    private handleWheel;
    private getTextWysiwygSnappedToCenterPosition;
    private savePointer;
    private resetShouldCacheIgnoreZoomDebounced;
    private updateDOMRect;
    refresh: () => void;
    private getCanvasOffsets;
    watchState: () => void;
    private updateLanguage;
}
declare global {
    interface Window {
        h: {
            scene: Scene;
            elements: readonly ExcalidrawElement[];
            state: AppState;
            setState: React.Component<any, AppState>["setState"];
            watchState: (prev: any, next: any) => void | undefined;
            app: InstanceType<typeof App>;
            history: History;
            store: Store;
        };
    }
}
export declare const createTestHook: () => void;
export default App;
