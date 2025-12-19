import type { ExcalidrawLinearElement } from "@excalidraw/element/types";
export declare const actionToggleLinearEditor: {
    name: "toggleLinearEditor";
    category: string;
    label: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: Readonly<import("../types").AppState>, app: import("../types").AppClassProperties) => "labels.lineEditor.editArrow" | "labels.lineEditor.edit";
    keywords: string[];
    trackEvent: {
        category: "element";
    };
    predicate: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: import("../types").AppState, _: import("../types").ExcalidrawProps, app: import("../types").AppClassProperties) => boolean;
    perform(elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<import("../types").AppState>, _: unknown, app: import("../types").AppClassProperties): {
        appState: {
            selectedLinearElement: {
                isEditing: boolean;
                elementId: import("@excalidraw/element/types").ExcalidrawElement["id"] & {
                    _brand: "excalidrawLinearElementId";
                };
                selectedPointsIndices: readonly number[] | null;
                initialState: Readonly<{
                    prevSelectedPointsIndices: readonly number[] | null;
                    lastClickedPoint: number;
                    origin: Readonly<import("@excalidraw/math").GlobalPoint> | null;
                    segmentMidpoint: {
                        value: import("@excalidraw/math").GlobalPoint | null;
                        index: number | null;
                        added: boolean;
                    };
                    arrowStartIsInside: boolean;
                    altFocusPoint: Readonly<import("@excalidraw/math").GlobalPoint> | null;
                }>;
                isDragging: boolean;
                lastUncommittedPoint: import("@excalidraw/math").LocalPoint | null;
                lastCommittedPoint: import("@excalidraw/math").LocalPoint | null;
                pointerOffset: Readonly<{
                    x: number;
                    y: number;
                }>;
                hoverPointIndex: number;
                segmentMidPointHoveredCoords: import("@excalidraw/math").GlobalPoint | null;
                elbowed: boolean;
                customLineAngle: number | null;
                pointerDownState: never;
            };
            contextMenu: {
                items: import("../components/ContextMenu").ContextMenuItems;
                top: number;
                left: number;
            } | null;
            showWelcomeScreen: boolean;
            isLoading: boolean;
            errorMessage: React.ReactNode;
            activeEmbeddable: {
                element: import("@excalidraw/element/types").NonDeletedExcalidrawElement;
                state: "hover" | "active";
            } | null;
            newElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawNonSelectionElement> | null;
            resizingElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            multiElement: import("@excalidraw/element/types").NonDeleted<ExcalidrawLinearElement> | null;
            selectionElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            isBindingEnabled: boolean;
            startBoundElement: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            suggestedBinding: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawBindableElement> | null;
            frameToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawFrameLikeElement> | null;
            frameRendering: {
                enabled: boolean;
                name: boolean;
                outline: boolean;
                clip: boolean;
            };
            editingFrame: string | null;
            elementsToHighlight: import("@excalidraw/element/types").NonDeleted<import("@excalidraw/element/types").ExcalidrawElement>[] | null;
            editingTextElement: import("@excalidraw/element/types").NonDeletedExcalidrawElement | null;
            activeTool: {
                lastActiveTool: import("../types").ActiveTool | null;
                locked: boolean;
                fromSelection: boolean;
            } & import("../types").ActiveTool;
            preferredSelectionTool: {
                type: "selection" | "lasso";
                initialized: boolean;
            };
            penMode: boolean;
            penDetected: boolean;
            exportBackground: boolean;
            exportEmbedScene: boolean;
            exportWithDarkMode: boolean;
            exportScale: number;
            currentItemStrokeColor: string;
            currentItemBackgroundColor: string;
            currentItemFillStyle: import("@excalidraw/element/types").ExcalidrawElement["fillStyle"];
            currentItemStrokeWidth: number;
            currentItemStrokeStyle: import("@excalidraw/element/types").ExcalidrawElement["strokeStyle"];
            currentItemRoughness: number;
            currentItemOpacity: number;
            currentItemFontFamily: import("@excalidraw/element/types").FontFamilyValues;
            currentItemFontSize: number;
            currentItemTextAlign: import("@excalidraw/element/types").TextAlign;
            currentItemStartArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentItemEndArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            currentHoveredFontFamily: import("@excalidraw/element/types").FontFamilyValues | null;
            currentItemRoundness: import("@excalidraw/element/types").StrokeRoundness;
            currentItemArrowType: "sharp" | "round" | "elbow";
            viewBackgroundColor: string;
            scrollX: number;
            scrollY: number;
            cursorButton: "up" | "down";
            scrolledOutside: boolean;
            name: string | null;
            isResizing: boolean;
            isRotating: boolean;
            zoom: import("../types").Zoom;
            openMenu: "canvas" | null;
            openPopup: "canvasBackground" | "elementBackground" | "elementStroke" | "fontFamily" | "compactTextProperties" | "compactStrokeStyles" | "compactOtherProperties" | "compactArrowProperties" | null;
            openSidebar: {
                name: import("../types").SidebarName;
                tab?: import("../types").SidebarTabName;
            } | null;
            openDialog: null | {
                name: "imageExport" | "help" | "jsonExport";
            } | {
                name: "ttd";
                tab: "text-to-diagram" | "mermaid";
            } | {
                name: "commandPalette";
            } | {
                name: "settings";
            } | {
                name: "elementLinkSelector";
                sourceElementId: import("@excalidraw/element/types").ExcalidrawElement["id"];
            };
            defaultSidebarDockedPreference: boolean;
            lastPointerDownWith: import("@excalidraw/element/types").PointerType;
            selectedElementIds: Readonly<{
                [id: string]: true;
            }>;
            hoveredElementIds: Readonly<{
                [id: string]: true;
            }>;
            previousSelectedElementIds: {
                [id: string]: true;
            };
            selectedElementsAreBeingDragged: boolean;
            shouldCacheIgnoreZoom: boolean;
            toast: {
                message: string;
                closable?: boolean;
                duration?: number;
            } | null;
            zenModeEnabled: boolean;
            theme: import("@excalidraw/element/types").Theme;
            gridSize: number;
            gridStep: number;
            gridModeEnabled: boolean;
            viewModeEnabled: boolean;
            selectedGroupIds: {
                [groupId: string]: boolean;
            };
            editingGroupId: import("@excalidraw/element/types").GroupId | null;
            width: number;
            height: number;
            offsetTop: number;
            offsetLeft: number;
            fileHandle: import("browser-fs-access").FileSystemHandle | null;
            collaborators: Map<import("../types").SocketId, import("../types").Collaborator>;
            stats: {
                open: boolean;
                panels: number;
            };
            currentChartType: import("@excalidraw/element/types").ChartType;
            pasteDialog: {
                shown: false;
                data: null;
            } | {
                shown: true;
                data: import("../charts").Spreadsheet;
            };
            showHyperlinkPopup: false | "info" | "editor";
            snapLines: readonly import("../snapping").SnapLine[];
            originSnapOffset: {
                x: number;
                y: number;
            } | null;
            objectsSnapModeEnabled: boolean;
            userToFollow: import("../types").UserToFollow | null;
            followedBy: Set<import("../types").SocketId>;
            isCropping: boolean;
            croppingElementId: import("@excalidraw/element/types").ExcalidrawElement["id"] | null;
            searchMatches: Readonly<{
                focusedId: import("@excalidraw/element/types").ExcalidrawElement["id"] | null;
                matches: readonly import("../types").SearchMatch[];
            }> | null;
            activeLockedId: string | null;
            lockedMultiSelections: {
                [groupId: string]: true;
            };
            bindMode: import("@excalidraw/element/types").BindMode;
        };
        captureUpdate: "IMMEDIATELY";
    };
    PanelComponent: ({ appState, updateData, app }: import("./types").PanelComponentProps) => import("react/jsx-runtime").JSX.Element | null;
} & {
    keyTest?: undefined;
};
export declare const actionTogglePolygon: {
    name: "togglePolygon";
    category: string;
    icon: import("react/jsx-runtime").JSX.Element;
    keywords: string[];
    label: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: Readonly<import("../types").AppState>, app: import("../types").AppClassProperties) => "labels.polygon.breakPolygon" | "labels.polygon.convertToPolygon";
    trackEvent: {
        category: "element";
    };
    predicate: (elements: readonly import("@excalidraw/element/types").ExcalidrawElement[], appState: import("../types").AppState, _: import("../types").ExcalidrawProps, app: import("../types").AppClassProperties) => boolean;
    perform(elements: readonly import("@excalidraw/element/types").OrderedExcalidrawElement[], appState: Readonly<import("../types").AppState>, _: unknown, app: import("../types").AppClassProperties): false | {
        elements: ((Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "text";
            fontSize: number;
            fontFamily: import("@excalidraw/element/types").FontFamilyValues;
            text: string;
            textAlign: import("@excalidraw/element/types").TextAlign;
            verticalAlign: import("@excalidraw/element/types").VerticalAlign;
            containerId: import("@excalidraw/element/types").ExcalidrawGenericElement["id"] | null;
            originalText: string;
            autoResize: boolean;
            lineHeight: number & {
                _brand: "unitlessLineHeight";
            };
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "rectangle";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "diamond";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "frame";
            name: string | null;
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "magicframe";
            name: string | null;
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "embeddable";
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "image";
            fileId: import("@excalidraw/element/types").FileId | null;
            status: "pending" | "saved" | "error";
            scale: [number, number];
            crop: import("@excalidraw/element/types").ImageCrop | null;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "iframe";
            customData?: {
                generationData?: import("@excalidraw/element/types").MagicGenerationData;
            };
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "selection";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & {
            type: "ellipse";
        } & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "line" | "arrow";
            points: readonly import("@excalidraw/math").LocalPoint[];
            startBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            endBinding: import("@excalidraw/element/types").FixedPointBinding | null;
            startArrowhead: import("@excalidraw/element/types").Arrowhead | null;
            endArrowhead: import("@excalidraw/element/types").Arrowhead | null;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }) | (Readonly<{
            id: string;
            x: number;
            y: number;
            strokeColor: string;
            backgroundColor: string;
            fillStyle: import("@excalidraw/element/types").FillStyle;
            strokeWidth: number;
            strokeStyle: import("@excalidraw/element/types").StrokeStyle;
            roundness: null | {
                type: import("@excalidraw/element/types").RoundnessType;
                value?: number;
            };
            roughness: number;
            opacity: number;
            width: number;
            height: number;
            angle: import("@excalidraw/math").Radians;
            seed: number;
            version: number;
            versionNonce: number;
            index: import("@excalidraw/element/types").FractionalIndex | null;
            isDeleted: boolean;
            groupIds: readonly import("@excalidraw/element/types").GroupId[];
            frameId: string | null;
            boundElements: readonly import("@excalidraw/element/types").BoundElement[] | null;
            updated: number;
            link: string | null;
            locked: boolean;
            customData?: Record<string, any>;
        }> & Readonly<{
            type: "freedraw";
            points: readonly import("@excalidraw/math").LocalPoint[];
            pressures: readonly number[];
            simulatePressure: boolean;
        }> & {
            index: import("@excalidraw/element/types").FractionalIndex;
        }))[];
        appState: Readonly<import("../types").AppState>;
        captureUpdate: "IMMEDIATELY";
    };
    PanelComponent: ({ appState, updateData, app }: import("./types").PanelComponentProps) => import("react/jsx-runtime").JSX.Element | null;
} & {
    keyTest?: undefined;
};
