import type { VERSIONS } from "@excalidraw/common";

import type { ExcalidrawElement, FileId } from "@excalidraw/element/types";

import type { cleanAppStateForExport } from "../appState";
import type {
  AppState,
  BinaryFiles,
  LibraryItem,
  LibraryItems,
  LibraryItems_anyVersion,
} from "../types";

export interface ExportedDataState {
  type: string;
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: ReturnType<typeof cleanAppStateForExport>;
  files: BinaryFiles | undefined;
}

/**
 * Map of legacy AppState keys, with values of:
 *  [<legacy type>, <new AppState proeprty>]
 *
 * This is a helper type used in downstream abstractions.
 * Don't consume on its own.
 */
export type LegacyAppState = {
  /** @deprecated #6213 TODO remove 23-06-01 */
  isSidebarDocked: [boolean, "defaultSidebarDockedPreference"];
};

export interface ImportedDataState {
  type?: string;
  version?: number;
  source?: string;
  elements?: readonly ExcalidrawElement[] | null;
  appState?: Readonly<
    Partial<
      AppState & {
        [T in keyof LegacyAppState]: LegacyAppState[T][0];
      }
    >
  > | null;
  scrollToContent?: boolean;
  libraryItems?: LibraryItems_anyVersion;
  files?: BinaryFiles;
}

export interface ExportedLibraryData {
  type: string;
  version: typeof VERSIONS.excalidrawLibrary;
  source: string;
  libraryItems: LibraryItems;
}

export interface ImportedLibraryData extends Partial<ExportedLibraryData> {
  /** @deprecated v1 */
  library?: LibraryItems;
}

export type ExcalidrawLibraryIds = {
  itemIds: LibraryItem["id"][];
};

// ============================================================================
// MX Whiteboard Export/Import Types
// ============================================================================

/** Asset reference (replaces embedded dataURL in exported files) */
export interface AssetReference {
  id: FileId;
  hash: string; // SHA-256 content hash
  mimeType: string;
  size: number; // bytes
  filename: string; // hash + extension, e.g., "a1b2c3.png"
}

/** Exported scene with external asset references (.mxwj format) */
export interface ExportedSceneWithAssets {
  type: "excalidraw";
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: ReturnType<typeof cleanAppStateForExport>;
  assetReferences: AssetReference[];
}

/** Individual asset for upload/save */
export interface ExportedAsset {
  reference: AssetReference;
  blob: Blob;
}

/** Complete export result from exportSceneWithAssets */
export interface SceneExportResult {
  scene: ExportedSceneWithAssets;
  assets: ExportedAsset[];
  /** Scene filename with content hash, e.g., "scene_a1b2c3d4.mxwj" */
  sceneFilename: string;
}

/** Import result for loadFromMxFile and importSceneWithAssets */
export interface MxImportResult {
  elements: ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
}
