# MX Whiteboard Export/Import System

> **Status:** Complete (All phases done, tested and working)

## Overview

Replace Excalidraw's default `.excalidraw` format with a new export/import system that:

1. **Separates scene JSON from binary assets** - No embedded base64 data
2. **Uses content-addressed storage** - SHA-256 hash for asset filenames (deduplication + collision-free)
3. **Supports two output modes:**
   - **Local files** - Always `.mxwz` (ZIP archive) for consistency
   - **Cloud storage** - `scene.mxwj` + `/assets/` folder uploaded separately

### Use Cases

| Use Case | Format | Where Used |
| --- | --- | --- |
| Save to disk | `.mxwz` | mx-whiteboard (Ctrl+S, Export dialog) |
| Save to cloud | `scene.mxwj` + `/assets/` | mx-dod-form (uses our export API) |
| Import | `.mxwz`, `.mxwj`, `.excalidraw`, `.json` | mx-whiteboard (Ctrl+O) |

---

## File Formats

### `.mxwz` - ZIP Archive (Local Files)

Always used for local file saves. Contains scene JSON + assets.

```
whiteboard.mxwz
├── scene_a1b2c3d4.mxwj  # ExportedSceneWithAssets JSON (content-hashed filename)
└── assets/
    ├── a1b2c3def.png    # SHA-256 hash as filename
    ├── xyz789ghi.mp4
    └── ...
```

**Note:** Scene filename uses content hash (`scene_{hash}.mxwj`) to ensure unique filenames across different whiteboards.

### `.mxwj` - JSON Only (Inside ZIP or Cloud)

The scene JSON format used inside `.mxwz` and for cloud storage.

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "mx-whiteboard",
  "elements": [...],
  "appState": {...},
  "assetReferences": [
    { "id": "...", "hash": "a1b2c3...", "filename": "a1b2c3....png", ... }
  ]
}
```

### Cloud Storage Structure (R2)

Each whiteboard has its own folder with a fixed `scene.mxwj` filename:

```
whiteboards/{id}/
├── scene.mxwj           # Fixed filename (enables overwrite)
└── assets/
    ├── a1b2c3def.png    # SHA-256 hash as filename
    ├── xyz789ghi.mp4
    └── ...
```

Convex stores the folder URL:

- `folderUrl`: `https://r2.../whiteboards/{id}/`

**Note:** Cloud storage uses fixed `scene.mxwj` (not content-hashed) since each whiteboard has its own folder. This allows overwriting without creating duplicate files.

---

## Asset Naming: SHA-256 Content Hash

Asset filenames are **SHA-256 hash of content** + extension:

```
{sha256}.{ext}
```

**Why hash-based names:**

| Scenario | Result |
| --- | --- |
| 2 different videos, same original name | Different content → different hashes → no collision |
| 2 identical videos, different names | Same content → same hash → deduplicated |

This ensures:

- **No collisions** - different content always gets unique name
- **Deduplication** - identical files only stored once
- **Deterministic** - same content always produces same filename

---

## Core Types

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

/** Exported scene with external asset references */
export interface ExportedSceneWithAssets {
  type: "excalidraw";
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  assetReferences: AssetReference[];
}

/** Individual asset for upload/save */
export interface ExportedAsset {
  reference: AssetReference;
  blob: Blob;
}

/** Complete export result */
export interface SceneExportResult {
  scene: ExportedSceneWithAssets;
  assets: ExportedAsset[];
  /** Scene filename with content hash, e.g., "scene_a1b2c3d4.mxwj" */
  sceneFilename: string;
}

/** Import result */
export interface ImportResult {
  elements: ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}
```

---

## Core Export/Import API

**File: `packages/excalidraw/data/exportAssets.ts`** (NEW)

### Export Functions

```typescript
/**
 * Core export - separates scene from assets
 * Used by both local file save and cloud upload
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
 * Export as ZIP archive (.mxwz)
 */
export const exportToZip = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<Blob>;
```

### Import Functions

```typescript
/**
 * Import from ZIP archive (.mxwz)
 */
export const importFromZip = async (
  zipBlob: Blob,
): Promise<ImportResult>;

/**
 * Import from JSON file (.mxwj) - no assets
 */
export const importFromMxJson = async (
  file: File,
): Promise<ImportResult>;

/**
 * Import scene with assets fetched from URLs
 * Used by mx-dod-form to load from cloud storage
 * @param scene - Parsed scene JSON
 * @param assetFetcher - Function to fetch asset blob by filename
 */
export const importSceneWithAssets = async (
  scene: ExportedSceneWithAssets,
  assetFetcher: (filename: string) => Promise<Blob>,
): Promise<ImportResult>;
```

---

## Local File Save/Import

**File: `packages/excalidraw/data/mxFormat.ts`** (NEW)

Replaces default `.excalidraw` save/import with `.mxwj` and `.mxwz`.

### File Extension Constants

```typescript
export const MX_FILE_EXTENSIONS = {
  json: "mxwj",
  zip: "mxwz",
} as const;

export const SUPPORTED_IMPORT_EXTENSIONS = [
  "mxwj",
  "mxwz",
  "excalidraw", // Legacy support
  "json", // Legacy support
];
```

### Save to File

```typescript
export const saveToMxFile = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
  filename: string = "whiteboard",
) => {
  const hasMedia = Object.keys(files).length > 0;

  if (hasMedia) {
    // Export as .mxwz (ZIP with assets)
    const zipBlob = await exportToZip(elements, appState, files);
    downloadBlob(zipBlob, `${filename}.mxwz`);
  } else {
    // Export as .mxwj (JSON only)
    const { scene } = await exportSceneWithAssets(elements, appState, files);
    const jsonBlob = new Blob([JSON.stringify(scene, null, 2)], {
      type: "application/json",
    });
    downloadBlob(jsonBlob, `${filename}.mxwj`);
  }
};
```

### Load from File

```typescript
export const loadFromMxFile = async (file: File): Promise<ImportResult> => {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "mxwz") {
    return importFromZip(file);
  } else if (ext === "mxwj") {
    return importFromMxJson(file);
  } else if (ext === "excalidraw" || ext === "json") {
    // Legacy support - import old Excalidraw format
    return importLegacyExcalidraw(file);
  } else {
    throw new Error(`Unsupported file type: .${ext}`);
  }
};
```

### Backward Compatibility

| Format        | Import      | Export |
| ------------- | ----------- | ------ |
| `.mxwj`       | ✅          | ✅     |
| `.mxwz`       | ✅          | ✅     |
| `.excalidraw` | ✅ (legacy) | ❌     |
| `.json`       | ✅ (legacy) | ❌     |

---

## Cloud Storage API (for mx-dod-form)

mx-whiteboard provides the API. mx-dod-form handles the actual R2/Convex integration.

### What mx-whiteboard exports:

```typescript
// Core export - gives you scene JSON + asset blobs
exportSceneWithAssets(elements, appState, files) → { scene, assets[] }

// Import with custom asset fetcher
importSceneWithAssets(scene, assetFetcher) → ImportResult

// Utilities
dataURLToBlob(dataURL) → Blob
blobToDataURL(blob) → Promise<string>
```

### Example usage in mx-dod-form:

```typescript
// EXPORT: Save to R2
const { scene, assets } = await exportSceneWithAssets(
  elements,
  appState,
  files,
);

// Upload scene with fixed filename (enables overwrite)
await uploadToR2(
  `whiteboards/${id}/scene.mxwj`,
  new Blob([JSON.stringify(scene)]),
);

// Upload each asset (content-hashed filenames for deduplication)
for (const asset of assets) {
  await uploadToR2(
    `whiteboards/${id}/assets/${asset.reference.filename}`,
    asset.blob,
  );
}

// Store folder URL in Convex
await saveToConvex({
  id,
  url: `https://r2.../whiteboards/${id}/`,
});

// IMPORT: Load from R2
const { folderUrl } = await getFromConvex(id);
const sceneJson = await fetch(`${folderUrl}/scene.mxwj`).then((r) =>
  r.json(),
);

const { elements, appState, files } = await importSceneWithAssets(
  sceneJson,
  async (filename) => {
    const response = await fetch(`${folderUrl}/assets/${filename}`);
    return response.blob();
  },
);
```

---

## Public API Exports

**File: `packages/excalidraw/index.tsx`**

```typescript
// Core export/import
export {
  exportSceneWithAssets,
  exportToZip,
  importFromZip,
  importFromMxJson,
  importSceneWithAssets,
  // Utilities
  dataURLToBlob,
  blobToDataURL,
} from "./data/exportAssets";

// MX file format (local save/load)
export {
  saveToMxFile,
  loadFromMxFile,
  MX_FILE_EXTENSIONS,
  SUPPORTED_IMPORT_EXTENSIONS,
} from "./data/mxFormat";

// Types
export type {
  AssetReference,
  ExportedSceneWithAssets,
  ExportedAsset,
  SceneExportResult,
  ImportResult,
} from "./data/types";
```

---

## Files to Create/Modify

| File | Action |
| --- | --- |
| `packages/excalidraw/data/types.ts` | Add export/import types |
| `packages/excalidraw/data/exportAssets.ts` | **NEW** - Core export/import functions |
| `packages/excalidraw/data/mxFormat.ts` | **NEW** - MX file save/load functions |
| `packages/excalidraw/data/hash.ts` | **NEW** - SHA-256 utility |
| `packages/excalidraw/index.tsx` | Export all new APIs |
| `packages/excalidraw/actions/actionExport.ts` | Update save/load to use `saveToMxFile`/`loadFromMxFile` |
| `packages/common/src/utils.ts` | Add blob conversion utilities |
| `packages/excalidraw/locales/en.json` | Update dialog labels |
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

## Key Design Decisions

1. **SHA-256 content hash filenames** - Deduplicates assets + prevents collisions
2. **Fixed scene filename for cloud** - `scene.mxwj` enables overwrite (each whiteboard has own folder)
3. **Content-hashed scene for local** - `scene_{hash}.mxwj` in ZIP avoids collision when saving multiple files
4. **Simple asset fetcher** - Just pass a function `(filename) => Blob`
5. **Auto-format detection** - Saves as `.mxwj` or `.mxwz` based on media presence
6. **Videos included** - Works with local video feature
7. **Legacy import support** - Can import old `.excalidraw` files
8. **Excalidraw runtime unchanged** - Always uses base64 internally

---

## Implementation Notes

### JSZip MIME Type Fix

When importing from ZIP, JSZip returns blobs without the correct MIME type. The import function must recreate blobs with the correct type from `assetReference.mimeType`:

```typescript
const rawBlob = await assetFetcher(ref.filename);
// JSZip returns blobs without correct MIME type, so we need to set it
const blob = new Blob([rawBlob], { type: ref.mimeType });
```

### VideoPlayer Component

The VideoPlayer component includes:

- **Loading spinner** - Shows while video is loading
- **Error states** - Displays error message if video fails to load
- **Valid source check** - Shows "Video not found" if dataURL is empty

---

## Implementation Checklist

### Phase 1: Core API

- [x] Create `packages/excalidraw/data/hash.ts` - SHA-256 utility
- [x] Create `packages/excalidraw/data/exportAssets.ts` - Core export/import
- [x] Add jszip dependency
- [x] Add types to `packages/excalidraw/data/types.ts`
- [x] Add blob utilities to `packages/common/src/utils.ts`

### Phase 2: MX File Format

- [x] Create `packages/excalidraw/data/mxFormat.ts` - Save/load functions
- [x] Update `actionSaveFileToDisk` to use `saveToMxFile`
- [x] Update `actionLoadScene` to use `loadFromMxFile`/`openMxFile`
- [x] Update file input handling (shows all files, filters by extension after selection)
- [x] Ctrl+S keyboard shortcut now uses MX format

### Phase 3: UI Updates

- [x] File descriptions set in `mxFormat.ts` ("MX Whiteboard file", "MX Whiteboard file (with media)")
- [x] Generic locale labels work with new format (no changes needed)

### Phase 4: Public API

- [x] Export all new APIs from `packages/excalidraw/index.tsx`

### Phase 5: Testing

- [x] Test: Save scene without media → `.mxwj`
- [x] Test: Save scene with image → `.mxwz`
- [x] Test: Save scene with video → `.mxwz`
- [x] Test: Import `.mxwj` file
- [x] Test: Import `.mxwz` file (with video MIME type fix)
- [x] Test: Import legacy `.excalidraw` file
- [x] Test: Import legacy `.json` file

### Additional Fixes (During Testing)

- [x] Fix: Video flashing "empty web embed" when switching tabs
- [x] Fix: Unique scene filenames (`scene_{hash}.mxwj`) for cloud storage
- [x] Fix: JSZip MIME type for video import
- [x] Add: VideoPlayer loading spinner and error states
