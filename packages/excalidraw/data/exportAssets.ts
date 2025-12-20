/**
 * MX Whiteboard Export/Import API
 *
 * Provides functions to export scenes with separate asset references
 * and import them back with assets fetched from external sources.
 */

import JSZip from "jszip";

import {
  EXPORT_DATA_TYPES,
  getExportSource,
  VERSIONS,
  dataURLToBlob,
  blobToDataURL,
} from "@excalidraw/common";

import type { ExcalidrawElement, FileId } from "@excalidraw/element/types";

import { cleanAppStateForExport } from "../appState";

import { sha256, getExtensionFromMimeType } from "./hash";

import type { AppState, BinaryFiles, BinaryFileData, DataURL } from "../types";
import type {
  AssetReference,
  ExportedSceneWithAssets,
  ExportedAsset,
  SceneExportResult,
  MxImportResult,
} from "./types";

/**
 * Check if a file is referenced by any non-deleted element
 */
const isFileReferenced = (
  elements: readonly ExcalidrawElement[],
  fileId: string,
): boolean => {
  return elements.some(
    (element) =>
      !element.isDeleted &&
      "fileId" in element &&
      element.fileId === fileId,
  );
};

/**
 * Core export - separates scene from assets
 * Used by both local file save and cloud upload
 *
 * @param elements - Scene elements
 * @param appState - Application state
 * @param files - Binary files (images/videos) with base64 dataURLs
 * @returns Scene JSON and asset blobs ready for storage
 */
export const exportSceneWithAssets = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<SceneExportResult> => {
  const assets: ExportedAsset[] = [];
  const assetReferences: AssetReference[] = [];

  for (const [fileId, fileData] of Object.entries(files)) {
    if (!isFileReferenced(elements, fileId)) {
      continue;
    }

    const blob = dataURLToBlob(fileData.dataURL);
    const hash = await sha256(blob);
    const ext = getExtensionFromMimeType(fileData.mimeType);

    const reference: AssetReference = {
      id: fileId as FileId,
      hash,
      mimeType: fileData.mimeType,
      size: blob.size,
      filename: `${hash}.${ext}`,
    };

    assetReferences.push(reference);
    assets.push({ reference, blob });
  }

  const scene: ExportedSceneWithAssets = {
    type: EXPORT_DATA_TYPES.excalidraw,
    version: VERSIONS.excalidraw,
    source: getExportSource(),
    elements,
    appState: cleanAppStateForExport(appState),
    assetReferences,
  };

  return { scene, assets };
};

/**
 * Export as ZIP archive (.mxwz)
 *
 * Creates a ZIP containing:
 * - scene.mxwj (scene JSON with asset references)
 * - assets/{hash}.{ext} (binary asset files)
 *
 * @param elements - Scene elements
 * @param appState - Application state
 * @param files - Binary files (images/videos)
 * @returns ZIP blob ready for download/storage
 */
export const exportToZip = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<Blob> => {
  const { scene, assets } = await exportSceneWithAssets(
    elements,
    appState,
    files,
  );

  const zip = new JSZip();

  // Add scene JSON
  zip.file("scene.mxwj", JSON.stringify(scene, null, 2));

  // Add assets
  const assetsFolder = zip.folder("assets");
  if (assetsFolder) {
    for (const asset of assets) {
      assetsFolder.file(asset.reference.filename, asset.blob);
    }
  }

  return zip.generateAsync({ type: "blob" });
};

/**
 * Import from ZIP archive (.mxwz)
 *
 * @param zipBlob - ZIP file blob
 * @returns Parsed elements, appState, and files ready for Excalidraw
 */
export const importFromZip = async (zipBlob: Blob): Promise<MxImportResult> => {
  const zip = await JSZip.loadAsync(zipBlob);

  // Read scene JSON
  const sceneFile = zip.file("scene.mxwj");
  if (!sceneFile) {
    throw new Error("Invalid .mxwz file: missing scene.mxwj");
  }

  const sceneJson = await sceneFile.async("string");
  const scene: ExportedSceneWithAssets = JSON.parse(sceneJson);

  // Create asset fetcher for ZIP contents
  const assetFetcher = async (filename: string): Promise<Blob> => {
    const assetFile = zip.file(`assets/${filename}`);
    if (!assetFile) {
      throw new Error(`Asset not found in ZIP: ${filename}`);
    }
    return assetFile.async("blob");
  };

  return importSceneWithAssets(scene, assetFetcher);
};

/**
 * Import from JSON file (.mxwj) - no assets
 *
 * @param file - JSON file
 * @returns Parsed elements, appState, and empty files
 */
export const importFromMxJson = async (file: File): Promise<MxImportResult> => {
  const text = await file.text();
  const scene: ExportedSceneWithAssets = JSON.parse(text);

  // No assets to fetch for JSON-only files
  return {
    elements: scene.elements as ExcalidrawElement[],
    appState: scene.appState,
    files: {},
  };
};

/**
 * Import scene with assets fetched from external source
 * Used by mx-dod-form to load from cloud storage (R2)
 *
 * @param scene - Parsed scene JSON (ExportedSceneWithAssets)
 * @param assetFetcher - Function to fetch asset blob by filename
 * @returns Elements, appState, and files ready for Excalidraw
 *
 * @example
 * ```typescript
 * // Load from R2 cloud storage
 * const folderUrl = await getFromConvex(id);
 * const sceneJson = await fetch(`${folderUrl}/scene.mxwj`).then(r => r.json());
 *
 * const result = await importSceneWithAssets(
 *   sceneJson,
 *   async (filename) => {
 *     const response = await fetch(`${folderUrl}/assets/${filename}`);
 *     return response.blob();
 *   }
 * );
 * ```
 */
export const importSceneWithAssets = async (
  scene: ExportedSceneWithAssets,
  assetFetcher: (filename: string) => Promise<Blob>,
): Promise<MxImportResult> => {
  const files: BinaryFiles = {};

  // Fetch all assets and convert to dataURLs
  for (const ref of scene.assetReferences) {
    const blob = await assetFetcher(ref.filename);
    const dataURL = await blobToDataURL(blob) as DataURL;

    const fileData: BinaryFileData = {
      id: ref.id,
      mimeType: ref.mimeType as BinaryFileData["mimeType"],
      dataURL,
      created: Date.now(),
    };

    files[ref.id] = fileData;
  }

  return {
    elements: scene.elements as ExcalidrawElement[],
    appState: scene.appState,
    files,
  };
};
