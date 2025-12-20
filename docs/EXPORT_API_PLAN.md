# MX Whiteboard Export/Import System

> **Status:** Planned (not yet implemented)

## Overview

Replace Excalidraw's default `.excalidraw` format with a new export/import system that:

1. **Separates scene JSON from binary assets** - No embedded base64 data
2. **Uses content-addressed storage** - SHA-256 hash for asset filenames (deduplication + collision-free)
3. **Supports two output modes:**
   - **Local files** - `.mxwj` (JSON only) or `.mxwz` (ZIP with assets)
   - **Cloud storage** - `scene.mxwj` + `/assets/` folder uploaded separately

### Use Cases

| Use Case | Format | Where Used |
|----------|--------|------------|
| Save to disk (no media) | `.mxwj` | mx-whiteboard (Ctrl+S, Export dialog) |
| Save to disk (with media) | `.mxwz` | mx-whiteboard (Ctrl+S, Export dialog) |
| Save to cloud | `scene.mxwj` + `/assets/` | mx-dod-form (uses our export API) |

---

## File Formats

### `.mxwj` - JSON Only (No Media)

Used when scene contains no images or videos.

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "mx-whiteboard",
  "elements": [...],
  "appState": {...},
  "assetReferences": []
}
```

### `.mxwz` - ZIP Archive (With Media)

Used when scene contains 1+ images or videos.

```
whiteboard.mxwz
├── scene.mxwj          # ExportedSceneWithAssets JSON
└── assets/
    ├── a1b2c3def.png   # SHA-256 hash as filename
    ├── xyz789ghi.mp4
    └── ...
```

### Cloud Storage Structure (R2)

Same structure, uploaded as separate files:

```
whiteboards/{id}/
├── scene.mxwj
└── assets/
    ├── a1b2c3def.png
    ├── xyz789ghi.mp4
    └── ...
```

Convex stores just the folder URL: `https://r2.../whiteboards/{id}/`

### Auto-Detection on Save

```typescript
const hasMedia = Object.keys(files).length > 0;
// hasMedia ? .mxwz : .mxwj
```

---

## Asset Naming: SHA-256 Content Hash

Asset filenames are **SHA-256 hash of content** + extension:

```
{sha256}.{ext}
```

**Why hash-based names:**

| Scenario | Result |
|----------|--------|
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
  hash: string;              // SHA-256 content hash
  mimeType: string;
  size: number;              // bytes
  filename: string;          // hash + extension, e.g., "a1b2c3.png"
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
  "excalidraw",  // Legacy support
  "json",        // Legacy support
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

| Format | Import | Export |
|--------|--------|--------|
| `.mxwj` | ✅ | ✅ |
| `.mxwz` | ✅ | ✅ |
| `.excalidraw` | ✅ (legacy) | ❌ |
| `.json` | ✅ (legacy) | ❌ |

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
const { scene, assets } = await exportSceneWithAssets(elements, appState, files);

// Upload scene.mxwj
await uploadToR2(`whiteboards/${id}/scene.mxwj`, new Blob([JSON.stringify(scene)]));

// Upload each asset
for (const asset of assets) {
  await uploadToR2(`whiteboards/${id}/assets/${asset.reference.filename}`, asset.blob);
}

// Store folder URL in Convex
await saveToConvex({ id, url: `https://r2.../whiteboards/${id}/` });


// IMPORT: Load from R2
const folderUrl = await getFromConvex(id);
const sceneJson = await fetch(`${folderUrl}/scene.mxwj`).then(r => r.json());

const { elements, appState, files } = await importSceneWithAssets(
  sceneJson,
  async (filename) => {
    const response = await fetch(`${folderUrl}/assets/${filename}`);
    return response.blob();
  }
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
|------|--------|
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

1. **SHA-256 content hash filenames** - Deduplicates + prevents collisions
2. **Separate scene.mxwj** - No embedded base64, smaller and git-friendly
3. **Simple asset fetcher** - Just pass a function `(filename) => Blob`
4. **Auto-format detection** - Saves as `.mxwj` or `.mxwz` based on media presence
5. **Videos included** - Works with local video feature
6. **Legacy import support** - Can import old `.excalidraw` files
7. **Excalidraw runtime unchanged** - Always uses base64 internally

---

## Implementation Checklist

### Phase 1: Core API
- [ ] Create `packages/excalidraw/data/hash.ts` - SHA-256 utility
- [ ] Create `packages/excalidraw/data/exportAssets.ts` - Core export/import
- [ ] Add jszip dependency
- [ ] Add types to `packages/excalidraw/data/types.ts`
- [ ] Add blob utilities to `packages/common/src/utils.ts`

### Phase 2: MX File Format
- [ ] Create `packages/excalidraw/data/mxFormat.ts` - Save/load functions
- [ ] Update `actionSaveFileToDisk` to use `saveToMxFile`
- [ ] Update `actionLoadScene` to use `loadFromMxFile`
- [ ] Update file input `accept` attributes to `.mxwj,.mxwz,.excalidraw,.json`
- [ ] Update Ctrl+S keyboard shortcut handler

### Phase 3: UI Updates
- [ ] Update `packages/excalidraw/locales/en.json` dialog labels
- [ ] Update export dialog descriptions

### Phase 4: Public API
- [ ] Export all new APIs from `packages/excalidraw/index.tsx`

### Phase 5: Testing
- [ ] Test: Save scene without media → `.mxwj`
- [ ] Test: Save scene with image → `.mxwz`
- [ ] Test: Save scene with video → `.mxwz`
- [ ] Test: Import `.mxwj` file
- [ ] Test: Import `.mxwz` file
- [ ] Test: Import legacy `.excalidraw` file
- [ ] Test: Import legacy `.json` file
