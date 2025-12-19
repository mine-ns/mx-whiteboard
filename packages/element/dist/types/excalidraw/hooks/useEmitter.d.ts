import type { Emitter } from "@excalidraw/common";
export declare const useEmitter: <TEvent extends unknown>(emitter: Emitter<[TEvent]>, initialState: TEvent) => TEvent;
