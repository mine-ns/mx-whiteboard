# Plan: Export API for JSON + Assets (R2 Cloud Storage)

> **Status:** Planned (not yet implemented) **Use Case:** mx-whiteboard as submodule in mx-dod-form, sending whiteboard data to R2 cloud storage

## Overview

Add export/import APIs that separate scene JSON from binary assets (images, videos), enabling:

- Upload assets to R2/S3 cloud storage separately
- Reference assets by content hash (SHA-256) for deduplication
- Smaller JSON files without embedded base64 data
- Git-friendly scene files

---

## Export Formats

### 1. Folder Export

```
whiteboard-export/
├── scene.json              # Elements + appState + file references
└── assets/
    ├── a1b2c3d4...png     # SHA-256 hash as filename
    ├── e5f6g7h8...mp4     # Videos included
    └── ...
```

### 2. Zip Export

Same structure but packaged as a single `.excalidraw.zip` file.

---

## API Design

### New Types

**File: `packages/excalidraw/data/types.ts`**

```typescript
/** Asset reference (replaces embedded dataURL) */
export interface AssetReference {
  id: FileId;
  hash: string; // SHA-256 content hash
  mimeType: string;
  size: number; // bytes
  filename: string; // hash + extension, e.g., "a1b2c3.png"
}

/** Extended with optional URL (set after upload) */
export interface AssetReferenceWithUrl extends AssetReference {
  url?: string;
}

/** Exported scene with external asset references */
export interface ExportedSceneWithAssets {
  type: "excalidraw";
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  assetReferences: AssetReference[]; // Instead of embedded files
}

/** Individual asset for upload */
export interface ExportedAsset {
  reference: AssetReference;
  blob: Blob; // Raw binary data
}

/** Complete export result */
export interface SceneExportResult {
  scene: ExportedSceneWithAssets;
  assets: ExportedAsset[];
}

/** Import result */
export interface ImportResult {
  elements: ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

/** Asset resolver - implement this in your app (e.g., mx-dod-form) */
export interface AssetResolver {
  resolve: (ref: AssetReference) => Promise<string>; // Returns dataURL
}
```

---

### Export Functions

**File: `packages/excalidraw/data/exportAssets.ts`** (NEW)

```typescript
/**
 * Export scene with separate assets (not embedded)
 * Use this for R2/S3 upload workflows
 */
export const exportSceneWithAssets = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<SceneExportResult> => {
  const assets: ExportedAsset[] = [];
  const assetReferences: AssetReference[] = [];

  for (const [fileId, fileData] of Object.entries(files)) {
    if (!isFileReferenced(elements, fileId)) continue;

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
    type: "excalidraw",
    version: VERSIONS.excalidraw,
    source: getExportSource(),
    elements,
    appState: cleanAppStateForExport(appState),
    assetReferences,
  };

  return { scene, assets };
};

/**
 * Export as folder structure (for filesystem)
 */
export const exportToFolder = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<{ sceneJson: string; assets: Map<string, Blob> }>;

/**
 * Export as zip archive
 */
export const exportToZip = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<Blob>;
```

---

### Import Functions

```typescript
/**
 * Import scene with external asset resolution
 * @param sceneJson - Scene JSON string or parsed object
 * @param resolver - Your implementation to fetch assets (e.g., from R2)
 */
export const importSceneWithAssets = async (
  sceneJson: string | ExportedSceneWithAssets,
  resolver: AssetResolver,
): Promise<ImportResult>;

/**
 * Import from zip archive
 */
export const importFromZip = async (
  zipBlob: Blob,
): Promise<ImportResult>;
```

---

## Public API Exports

**File: `packages/excalidraw/index.tsx`**

```typescript
// Asset-based export/import
export {
  exportSceneWithAssets,
  exportToFolder,
  exportToZip,
  importSceneWithAssets,
  importFromZip,
  // Utilities
  dataURLToBlob,
  blobToDataURL,
} from "./data/exportAssets";

export type {
  AssetReference,
  AssetReferenceWithUrl,
  ExportedSceneWithAssets,
  ExportedAsset,
  SceneExportResult,
  AssetResolver,
  ImportResult,
} from "./data/types";
```

---

## Usage Examples

### Export as Zip (for download)

```typescript
import { exportToZip } from "@excalidraw/excalidraw";

const zipBlob = await exportToZip(elements, appState, files);
const url = URL.createObjectURL(zipBlob);

const a = document.createElement("a");
a.href = url;
a.download = "whiteboard.excalidraw.zip";
a.click();
```

### Import from Zip

```typescript
import { importFromZip } from "@excalidraw/excalidraw";

const { elements, appState, files } = await importFromZip(zipBlob);
excalidrawAPI.updateScene({ elements, appState });
excalidrawAPI.addFiles(Object.values(files));
```

---

## Complete Usage Flow (mx-dod-form implements R2 integration)

> **Note:** R2/S3 integration lives in mx-dod-form, NOT mx-whiteboard. mx-whiteboard only provides generic export/import APIs.

### Export Flow (Save to R2) - in mx-dod-form

```typescript
import {
  exportSceneWithAssets,
  type AssetReferenceWithUrl,
} from "@excalidraw/excalidraw";

// Your R2 upload function (in mx-dod-form)
async function uploadToR2(filename: string, blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, filename);
  const res = await fetch("/api/r2/upload", { method: "POST", body: formData });
  return (await res.json()).url;
}

// Export whiteboard
export async function saveWhiteboard(excalidrawAPI, whiteboardId: string) {
  // 1. Get data from Excalidraw
  const elements = excalidrawAPI.getSceneElements();
  const appState = excalidrawAPI.getAppState();
  const files = excalidrawAPI.getFiles();

  // 2. Export with separate assets
  const { scene, assets } = await exportSceneWithAssets(
    elements,
    appState,
    files,
  );

  // 3. Upload assets to R2 and add URLs
  const assetRefsWithUrls: AssetReferenceWithUrl[] = await Promise.all(
    assets.map(async (asset) => {
      const url = await uploadToR2(asset.reference.filename, asset.blob);
      return { ...asset.reference, url };
    }),
  );

  // 4. Create final scene JSON with URLs
  const sceneWithUrls = { ...scene, assetReferences: assetRefsWithUrls };

  // 5. Save to Convex
  await convexMutation("whiteboards:save", {
    id: whiteboardId,
    sceneJson: JSON.stringify(sceneWithUrls),
  });
}
```

### Import Flow (Load from R2) - in mx-dod-form

```typescript
import {
  importSceneWithAssets,
  blobToDataURL,
  type AssetResolver,
} from "@excalidraw/excalidraw";

// Your R2 resolver (in mx-dod-form)
function createR2Resolver(): AssetResolver {
  return {
    resolve: async (ref) => {
      const response = await fetch(ref.url!);
      const blob = await response.blob();
      return blobToDataURL(blob);
    },
  };
}

// Load whiteboard
export async function loadWhiteboard(excalidrawAPI, whiteboardId: string) {
  // 1. Load scene JSON from Convex
  const sceneJson = await convexQuery("whiteboards:get", { id: whiteboardId });

  // 2. Import with R2 resolver
  const resolver = createR2Resolver();
  const { elements, appState, files } = await importSceneWithAssets(
    sceneJson,
    resolver,
  );

  // 3. Update Excalidraw
  excalidrawAPI.updateScene({ elements, appState });
  excalidrawAPI.addFiles(Object.values(files));
}
```

---

## Files to Create/Modify

| File | Action |
| --- | --- |
| `packages/excalidraw/data/types.ts` | Add export/import types |
| `packages/excalidraw/data/exportAssets.ts` | **NEW** - Export & import functions |
| `packages/excalidraw/data/hash.ts` | **NEW** - SHA-256 utility |
| `packages/excalidraw/index.tsx` | Export all new APIs |
| `packages/common/src/utils.ts` | Add blob conversion utilities |
| `package.json` | Add jszip dependency |

---

## Dependencies

```json
{
  "dependencies": {
    "jszip": "^3.10.1"
  }
}
```

---

## Full API Surface

### mx-whiteboard provides (storage-agnostic)

**Export Functions:**

```typescript
exportSceneWithAssets(elements, appState, files) → SceneExportResult
exportToFolder(elements, appState, files) → { sceneJson, assets }
exportToZip(elements, appState, files) → Blob
```

**Import Functions:**

```typescript
importSceneWithAssets(sceneJson, resolver) → ImportResult
importFromZip(zipBlob) → ImportResult
```

**Utilities:**

```typescript
dataURLToBlob(dataURL) → Blob
blobToDataURL(blob) → Promise<string>
```

### mx-dod-form implements (NOT in mx-whiteboard)

```typescript
// R2 upload function
uploadToR2(filename, blob) → Promise<url>

// R2 resolver
createR2Resolver() → AssetResolver

// Full save/load workflows
saveWhiteboard(excalidrawAPI, id) → void
loadWhiteboard(excalidrawAPI, id) → void
```

---

## Key Design Decisions

1. **SHA-256 content hash** - Deduplicates identical files across exports
2. **Separate scene.json** - No embedded base64, much smaller files
3. **AssetResolver pattern** - Flexible for any storage backend (R2, S3, local)
4. **Parallel uploads** - Fast export with `Promise.all`
5. **Videos included** - Works with local video feature
6. **Backward compatible** - Original `serializeAsJSON` still works for embedded export
