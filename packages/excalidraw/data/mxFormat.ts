/**
 * MX Whiteboard File Format
 *
 * Replaces default .excalidraw save/import with .mxwj and .mxwz formats.
 * - .mxwj: JSON only (no media)
 * - .mxwz: ZIP archive (with media assets)
 */

import { DEFAULT_FILENAME } from "@excalidraw/common";

import type { ExcalidrawElement } from "@excalidraw/element/types";

import {
  exportSceneWithAssets,
  exportToZip,
  importFromZip,
  importFromMxJson,
} from "./exportAssets";
import { loadFromBlob } from "./blob";
import { fileSave, fileOpen } from "./filesystem";

import type { AppState, BinaryFiles } from "../types";
import type { MxImportResult } from "./types";
import type { FileSystemHandle } from "./filesystem";

export const MX_FILE_EXTENSIONS = {
  json: "mxwj",
  zip: "mxwz",
} as const;

export const SUPPORTED_IMPORT_EXTENSIONS = [
  "mxwj",
  "mxwz",
  "excalidraw", // Legacy support
  "json", // Legacy support
] as const;

/**
 * Save scene to MX format file
 *
 * Automatically selects format based on media presence:
 * - No media → .mxwj (JSON only)
 * - Has media → .mxwz (ZIP with assets)
 *
 * @param elements - Scene elements
 * @param appState - Application state
 * @param files - Binary files (images/videos)
 * @param name - Filename (without extension)
 * @param fileHandle - Optional existing file handle for "Save" (vs "Save As")
 */
export const saveToMxFile = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
  name: string = DEFAULT_FILENAME,
  fileHandle?: FileSystemHandle | null,
): Promise<{ fileHandle: FileSystemHandle | null }> => {
  // Check if scene has any media files referenced by non-deleted elements
  const hasMedia = Object.keys(files).some((fileId) =>
    elements.some(
      (element) =>
        !element.isDeleted &&
        "fileId" in element &&
        element.fileId === fileId,
    ),
  );

  if (hasMedia) {
    // Export as .mxwz (ZIP with assets)
    const zipBlob = await exportToZip(elements, appState, files);
    const handle = await fileSave(zipBlob, {
      name,
      extension: "mxwz" as any, // Cast needed as mxwz not in original MIME_TYPES
      description: "MX Whiteboard file (with media)",
      fileHandle,
    });
    return { fileHandle: handle };
  } else {
    // Export as .mxwj (JSON only)
    const { scene } = await exportSceneWithAssets(elements, appState, files);
    const jsonBlob = new Blob([JSON.stringify(scene, null, 2)], {
      type: "application/json",
    });
    const handle = await fileSave(jsonBlob, {
      name,
      extension: "mxwj" as any, // Cast needed as mxwj not in original MIME_TYPES
      description: "MX Whiteboard file",
      fileHandle,
    });
    return { fileHandle: handle };
  }
};

/**
 * Load scene from MX format file or legacy Excalidraw file
 *
 * Supports:
 * - .mxwj - MX JSON format (no media)
 * - .mxwz - MX ZIP format (with media)
 * - .excalidraw - Legacy Excalidraw format
 * - .json - Legacy JSON format
 *
 * @param file - File to load
 * @param localAppState - Current app state for restoration
 * @param localElements - Current elements for restoration
 * @returns Parsed elements, appState, and files
 */
export const loadFromMxFile = async (
  file: File,
  localAppState: AppState | null = null,
  localElements: readonly ExcalidrawElement[] | null = null,
): Promise<MxImportResult> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "mxwz") {
    return importFromZip(file);
  } else if (ext === "mxwj") {
    return importFromMxJson(file);
  } else if (ext === "excalidraw" || ext === "json") {
    // Legacy support - use existing Excalidraw loader
    const result = await loadFromBlob(file, localAppState, localElements);
    return {
      elements: result.elements as ExcalidrawElement[],
      appState: result.appState,
      files: result.files || {},
    };
  } else {
    throw new Error(`Unsupported file type: .${ext}`);
  }
};

/**
 * Open file dialog and load MX format file
 *
 * @param localAppState - Current app state for restoration
 * @param localElements - Current elements for restoration
 * @returns Parsed elements, appState, files, and file handle
 */
export const openMxFile = async (
  localAppState: AppState | null = null,
  localElements: readonly ExcalidrawElement[] | null = null,
): Promise<MxImportResult & { fileHandle: FileSystemHandle | null }> => {
  const file = await fileOpen({
    description: "MX Whiteboard files",
    // Note: fileOpen uses keys from MIME_TYPES, so we can't use custom extensions directly
    // The file picker will show all files, and we filter by extension after selection
  });

  const result = await loadFromMxFile(
    file,
    localAppState,
    localElements,
  );

  return {
    ...result,
    fileHandle: (file as any).handle || null,
  };
};
