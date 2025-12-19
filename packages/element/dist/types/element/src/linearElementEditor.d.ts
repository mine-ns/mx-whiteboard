import { type GlobalPoint, type LocalPoint } from "@excalidraw/math";
import { type Store } from "@excalidraw/element";
import type { AppState, PointerCoords, InteractiveCanvasAppState, AppClassProperties, NullableGridSize, Zoom } from "@excalidraw/excalidraw/types";
import type { Scene } from "./Scene";
import type { Bounds } from "./bounds";
import type { NonDeleted, ExcalidrawLinearElement, ExcalidrawElement, ExcalidrawTextElementWithContainer, ElementsMap, NonDeletedSceneElementsMap, FixedPointBinding, ExcalidrawElbowArrowElement, PointsPositionUpdates } from "./types";
export declare class LinearElementEditor {
    readonly elementId: ExcalidrawElement["id"] & {
        _brand: "excalidrawLinearElementId";
    };
    /** indices */
    readonly selectedPointsIndices: readonly number[] | null;
    readonly initialState: Readonly<{
        prevSelectedPointsIndices: readonly number[] | null;
        /** index */
        lastClickedPoint: number;
        origin: Readonly<GlobalPoint> | null;
        segmentMidpoint: {
            value: GlobalPoint | null;
            index: number | null;
            added: boolean;
        };
        arrowStartIsInside: boolean;
        altFocusPoint: Readonly<GlobalPoint> | null;
    }>;
    /** whether you're dragging a point */
    readonly isDragging: boolean;
    readonly lastUncommittedPoint: LocalPoint | null;
    readonly lastCommittedPoint: LocalPoint | null;
    readonly pointerOffset: Readonly<{
        x: number;
        y: number;
    }>;
    readonly hoverPointIndex: number;
    readonly segmentMidPointHoveredCoords: GlobalPoint | null;
    readonly elbowed: boolean;
    readonly customLineAngle: number | null;
    readonly isEditing: boolean;
    readonly pointerDownState: never;
    constructor(element: NonDeleted<ExcalidrawLinearElement>, elementsMap: ElementsMap, isEditing?: boolean);
    static POINT_HANDLE_SIZE: number;
    /**
     * @param id the `elementId` from the instance of this class (so that we can
     *  statically guarantee this method returns an ExcalidrawLinearElement)
     */
    static getElement<T extends ExcalidrawLinearElement>(id: InstanceType<typeof LinearElementEditor>["elementId"], elementsMap: ElementsMap): T | null;
    static handleBoxSelection(event: PointerEvent, appState: AppState, setState: React.Component<any, AppState>["setState"], elementsMap: NonDeletedSceneElementsMap): false | undefined;
    static handlePointerMove(event: PointerEvent, app: AppClassProperties, scenePointerX: number, scenePointerY: number, linearElementEditor: LinearElementEditor): Pick<AppState, "suggestedBinding" | "selectedLinearElement"> | null;
    static handlePointDragging(event: PointerEvent, app: AppClassProperties, scenePointerX: number, scenePointerY: number, linearElementEditor: LinearElementEditor): Pick<AppState, "suggestedBinding" | "selectedLinearElement"> | null;
    static handlePointerUp(event: PointerEvent, editingLinearElement: LinearElementEditor, appState: AppState, scene: Scene): LinearElementEditor;
    static getEditorMidPoints: (element: NonDeleted<ExcalidrawLinearElement>, elementsMap: ElementsMap, appState: InteractiveCanvasAppState) => (GlobalPoint | null)[];
    static getSegmentMidpointHitCoords: (linearElementEditor: LinearElementEditor, scenePointer: {
        x: number;
        y: number;
    }, appState: AppState, elementsMap: ElementsMap) => GlobalPoint | null;
    static isSegmentTooShort<P extends GlobalPoint | LocalPoint>(element: NonDeleted<ExcalidrawLinearElement>, startPoint: P, endPoint: P, index: number, zoom: Zoom): boolean;
    static getSegmentMidPoint(element: NonDeleted<ExcalidrawLinearElement>, index: number): GlobalPoint;
    static getSegmentMidPointIndex(linearElementEditor: LinearElementEditor, appState: AppState, midPoint: GlobalPoint, elementsMap: ElementsMap): number;
    static handlePointerDown(event: React.PointerEvent<HTMLElement>, app: AppClassProperties, store: Store, scenePointer: {
        x: number;
        y: number;
    }, linearElementEditor: LinearElementEditor, scene: Scene): {
        didAddPoint: boolean;
        hitElement: NonDeleted<ExcalidrawElement> | null;
        linearElementEditor: LinearElementEditor | null;
    };
    static arePointsEqual<Point extends LocalPoint | GlobalPoint>(point1: Point | null, point2: Point | null): boolean;
    static handlePointerMoveInEditMode(event: React.PointerEvent<HTMLCanvasElement>, scenePointerX: number, scenePointerY: number, app: AppClassProperties): LinearElementEditor | null;
    /** scene coords */
    static getPointGlobalCoordinates(element: NonDeleted<ExcalidrawLinearElement>, p: LocalPoint, elementsMap: ElementsMap): GlobalPoint;
    /** scene coords */
    static getPointsGlobalCoordinates(element: NonDeleted<ExcalidrawLinearElement>, elementsMap: ElementsMap): GlobalPoint[];
    static getPointAtIndexGlobalCoordinates(element: NonDeleted<ExcalidrawLinearElement>, indexMaybeFromEnd: number, // -1 for last element
    elementsMap: ElementsMap): GlobalPoint;
    static pointFromAbsoluteCoords(element: NonDeleted<ExcalidrawLinearElement>, absoluteCoords: GlobalPoint, elementsMap: ElementsMap): LocalPoint;
    static getPointIndexUnderCursor(element: NonDeleted<ExcalidrawLinearElement>, elementsMap: ElementsMap, zoom: AppState["zoom"], x: number, y: number): number;
    static createPointAt(element: NonDeleted<ExcalidrawLinearElement>, elementsMap: ElementsMap, scenePointerX: number, scenePointerY: number, gridSize: NullableGridSize): LocalPoint;
    /**
     * Normalizes line points so that the start point is at [0,0]. This is
     * expected in various parts of the codebase.
     *
     * Also returns normalized x and y coords to account for the normalization
     * of the points.
     */
    static getNormalizeElementPointsAndCoords(element: ExcalidrawLinearElement): {
        points: LocalPoint[];
        x: number;
        y: number;
    };
    static duplicateSelectedPoints(appState: AppState, scene: Scene): AppState;
    static deletePoints(element: NonDeleted<ExcalidrawLinearElement>, app: AppClassProperties, pointIndices: readonly number[]): void;
    static addPoints(element: NonDeleted<ExcalidrawLinearElement>, scene: Scene, addedPoints: LocalPoint[]): void;
    static movePoints(element: NonDeleted<ExcalidrawLinearElement>, scene: Scene, pointUpdates: PointsPositionUpdates, otherUpdates?: {
        startBinding?: FixedPointBinding | null;
        endBinding?: FixedPointBinding | null;
        moveMidPointsWithElement?: boolean | null;
    }): void;
    static shouldAddMidpoint(linearElementEditor: LinearElementEditor, pointerCoords: PointerCoords, appState: AppState, elementsMap: ElementsMap): boolean;
    static addMidpoint(linearElementEditor: LinearElementEditor, pointerCoords: PointerCoords, app: AppClassProperties, snapToGrid: boolean, scene: Scene): {
        pointerDownState: LinearElementEditor["initialState"];
        selectedPointsIndices: LinearElementEditor["selectedPointsIndices"];
    } | undefined;
    private static _updatePoints;
    private static _getShiftLockedDelta;
    static getBoundTextElementPosition: (element: ExcalidrawLinearElement, boundTextElement: ExcalidrawTextElementWithContainer, elementsMap: ElementsMap) => {
        x: number;
        y: number;
    };
    static getMinMaxXYWithBoundText: (element: ExcalidrawLinearElement, elementsMap: ElementsMap, elementBounds: Bounds, boundTextElement: ExcalidrawTextElementWithContainer) => [number, number, number, number, number, number];
    static getElementAbsoluteCoords: (element: ExcalidrawLinearElement, elementsMap: ElementsMap, includeBoundText?: boolean) => [number, number, number, number, number, number];
    static moveFixedSegment(linearElement: LinearElementEditor, index: number, x: number, y: number, scene: Scene): Pick<LinearElementEditor, "segmentMidPointHoveredCoords" | "initialState">;
    static deleteFixedSegment(element: ExcalidrawElbowArrowElement, scene: Scene, index: number): void;
}
