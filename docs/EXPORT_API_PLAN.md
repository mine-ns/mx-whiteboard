# Plan: Add HTML5 Video Player for Local Video Embeds

## Overview
Extend the existing embeddable element to support local video files (MP4, WebM, OGG) stored as binary data, rendered with a native HTML5 `<video>` element.

**Decisions:**
- **Native HTML5 `<video>`** - no third-party library
- **Scope:** Regular local video drag & drop first
- **Future:** Xilo clip annotations will be a separate element type (not part of this implementation)

---

## Files to Modify

### Phase 1: Type System
| File | Changes |
|------|---------|
| `packages/common/src/constants.ts` | Add `VIDEO_MIME_TYPES` constant |
| `packages/excalidraw/types.ts` | Update `BinaryFileData.mimeType` to include video types |
| `packages/element/src/types.ts` | Add `fileId` and `status` to `ExcalidrawEmbeddableElement`; add `localVideo` variant to `IframeData` |

### Phase 2: Element Helpers
| File | Changes |
|------|---------|
| `packages/element/src/typeChecks.ts` | Add `isLocalVideoEmbeddable()` type guard |
| `packages/element/src/newElement.ts` | Update `newEmbeddableElement()` to accept `fileId` |

### Phase 3: Video Handling
| File | Changes |
|------|---------|
| `packages/excalidraw/data/blob.ts` | Add `isSupportedVideoFile()` helper |
| `packages/element/src/video.ts` | **New file** - Video cache utilities |

### Phase 4: Rendering & Upload
| File | Changes |
|------|---------|
| `packages/excalidraw/components/VideoPlayer.tsx` | **New file** - HTML5 video component |
| `packages/excalidraw/components/App.tsx` | Update `renderEmbeddables()` to use VideoPlayer; add `initializeVideo()` method |

---

## Implementation Steps

### Step 1: Add VIDEO_MIME_TYPES
**File:** `packages/common/src/constants.ts`

Add after `IMAGE_MIME_TYPES` (line 237):
```typescript
export const VIDEO_MIME_TYPES = {
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
} as const;
```

Update `MIME_TYPES` to include video types.

---

### Step 2: Extend ExcalidrawEmbeddableElement Type
**File:** `packages/element/src/types.ts`

Change lines 100-103 from:
```typescript
export type ExcalidrawEmbeddableElement = _ExcalidrawElementBase &
  Readonly<{
    type: "embeddable";
  }>;
```

To:
```typescript
export type ExcalidrawEmbeddableElement = _ExcalidrawElementBase &
  Readonly<{
    type: "embeddable";
    fileId?: FileId | null;
    status?: "pending" | "saved" | "error";
  }>;
```

---

### Step 3: Add localVideo to IframeData
**File:** `packages/element/src/types.ts`

Extend the union at lines 127-135:
```typescript
export type IframeData =
  | {
      intrinsicSize: { w: number; h: number };
      error?: Error;
      sandbox?: { allowSameOrigin?: boolean };
    } & (
      | { type: "video" | "generic"; link: string }
      | { type: "document"; srcdoc: (theme: Theme) => string }
      | { type: "localVideo"; dataURL: string }  // NEW
    );
```

---

### Step 4: Update BinaryFileData
**File:** `packages/excalidraw/types.ts`

Update mimeType union to include video types:
```typescript
mimeType:
  | ValueOf<typeof IMAGE_MIME_TYPES>
  | ValueOf<typeof VIDEO_MIME_TYPES>
  | typeof MIME_TYPES.binary;
```

---

### Step 5: Add Type Guards
**File:** `packages/element/src/typeChecks.ts`

```typescript
export const isLocalVideoEmbeddable = (
  element: ExcalidrawElement | null,
): element is ExcalidrawEmbeddableElement & { fileId: FileId } => {
  return (
    !!element &&
    element.type === "embeddable" &&
    "fileId" in element &&
    !!element.fileId
  );
};
```

---

### Step 6: Add Video File Helpers
**File:** `packages/excalidraw/data/blob.ts`

```typescript
export const isSupportedVideoFile = (blob: Blob | null | undefined) => {
  const { type } = blob || {};
  return !!type && Object.values(VIDEO_MIME_TYPES).includes(type as any);
};
```

---

### Step 7: Create VideoPlayer Component
**File:** `packages/excalidraw/components/VideoPlayer.tsx` (NEW)

Native HTML5 video with standard browser controls:

```typescript
import React, { useRef, useEffect } from "react";
import clsx from "clsx";

interface VideoPlayerProps {
  dataURL: string;
  isActive: boolean;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  dataURL,
  isActive,
  title = "Embedded video",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when element becomes inactive (user clicks away)
  useEffect(() => {
    if (!isActive && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={dataURL}
      controls
      playsInline
      title={title}
      className="excalidraw__embeddable__video"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        pointerEvents: isActive ? "auto" : "none",
      }}
    />
  );
};
```

**CSS** (add to `packages/excalidraw/css/styles.scss`):
```scss
.excalidraw__embeddable__video {
  background: #000;
  border-radius: var(--embeddable-radius);
}
```

---

### Step 8: Update renderEmbeddables in App.tsx
**File:** `packages/excalidraw/components/App.tsx`

In the `renderEmbeddables()` method (~line 1347):

1. Detect local video embeddables by checking `el.fileId` and file MIME type
2. Render `<VideoPlayer>` instead of `<iframe>` when `src.type === "localVideo"`

```typescript
// After getting src for the element
if (isLocalVideoEmbeddable(el) && this.files[el.fileId]) {
  const fileData = this.files[el.fileId];
  if (isSupportedVideoFile({ type: fileData.mimeType } as Blob)) {
    src = {
      type: "localVideo",
      dataURL: fileData.dataURL,
      intrinsicSize: { w: el.width, h: el.height },
    };
  }
}

// In render section
{src?.type === "localVideo" ? (
  <VideoPlayer dataURL={src.dataURL} isActive={isActive} />
) : (
  <iframe ... />
)}
```

---

### Step 9: Add Video Upload Flow
**File:** `packages/excalidraw/components/App.tsx`

Add `initializeVideo()` method (similar to image initialization):
- Validate video file type
- Generate fileId via SHA-1 hash
- Convert to dataURL
- Store in BinaryFiles
- Update element with fileId and status

Integrate with file drop/paste handlers to detect video files.

---

### Step 10: Update newEmbeddableElement
**File:** `packages/element/src/newElement.ts`

Accept optional `fileId` and `status` parameters:
```typescript
export const newEmbeddableElement = (opts) => {
  return {
    ..._newElementBase("embeddable", opts),
    fileId: opts.fileId ?? null,
    status: opts.fileId ? (opts.status ?? "pending") : undefined,
  };
};
```

---

## Key Design Decisions

1. **Extend embeddable** (not new element type) - reuses existing infrastructure
2. **Optional fileId** - embeddables can be URL-based OR file-based
3. **BinaryFiles storage** - same pattern as images for persistence
4. **Discriminated union** - `IframeData.type === "localVideo"` for clean conditionals
5. **Native controls** - uses HTML5 video controls for simplicity

---

## Video File Size Limit

Consider adding a max size constant (e.g., 50MB for videos vs 4MB for images):
```typescript
export const MAX_ALLOWED_VIDEO_FILE_BYTES = 50 * 1024 * 1024; // 50MB
```

---

## Video Context Popup (Download + Description)

For local video embeddables, replace the default "No link is set" popup with a custom popup containing:
1. **Download button** - Downloads the video file to user's computer
2. **Description/Alt field** - Inline editable text for accessibility/notes

### Type Changes

**File:** `packages/element/src/types.ts`

Add `description` field to `ExcalidrawEmbeddableElement`:
```typescript
export type ExcalidrawEmbeddableElement = _ExcalidrawElementBase &
  Readonly<{
    type: "embeddable";
    fileId?: FileId | null;
    status?: "pending" | "saved" | "error";
    description?: string;  // NEW - alt text for local videos
  }>;
```

### UI Changes

**Modify:** `packages/excalidraw/components/hyperlink/Hyperlink.tsx`

Add conditional rendering for local video embeddables:

```tsx
// At top - add imports
import { isLocalVideoEmbeddable } from "@excalidraw/element";
import { downloadIcon } from "../icons";

// Inside component - detect local video
const isLocalVideo = isLocalVideoEmbeddable(element);

// Replace the empty link message for local videos
{isLocalVideo ? (
  <LocalVideoPopup
    element={element}
    files={files}
    scene={scene}
    isEditing={isEditing}
    setAppState={setAppState}
  />
) : element.link ? (
  // ... existing link display
) : (
  <div className="excalidraw-hyperlinkContainer-link">
    {t("labels.link.empty")}
  </div>
)}
```

### LocalVideoPopup Component

**New section in:** `packages/excalidraw/components/hyperlink/Hyperlink.tsx`

```tsx
const LocalVideoPopup = ({
  element,
  files,
  scene,
  isEditing,
  setAppState,
}) => {
  const fileData = files[element.fileId];
  const [descValue, setDescValue] = useState(element.description || "");

  const handleDownload = () => {
    if (!fileData) return;

    // Convert dataURL to Blob and download
    const [header, base64] = fileData.dataURL.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] || "video/mp4";
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video.${mimeType.split("/")[1]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDescriptionSubmit = () => {
    scene.mutateElement(element, { description: descValue });
    setAppState({ showHyperlinkPopup: "info" });
  };

  return (
    <>
      {isEditing ? (
        <input
          className="excalidraw-hyperlinkContainer-input"
          placeholder={t("labels.video.descriptionPlaceholder")}
          value={descValue}
          onChange={(e) => setDescValue(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === KEYS.ENTER || e.key === KEYS.ESCAPE) {
              handleDescriptionSubmit();
            }
          }}
        />
      ) : (
        <div className="excalidraw-hyperlinkContainer-link">
          {element.description || t("labels.video.noDescription")}
        </div>
      )}
      <div className="excalidraw-hyperlinkContainer__buttons">
        {!isEditing && (
          <ToolButton
            type="button"
            title={t("buttons.editDescription")}
            aria-label={t("buttons.editDescription")}
            onClick={() => setAppState({ showHyperlinkPopup: "editor" })}
            icon={FreedrawIcon}
          />
        )}
        <ToolButton
          type="button"
          title={t("buttons.download")}
          aria-label={t("buttons.download")}
          onClick={handleDownload}
          icon={downloadIcon}
        />
      </div>
    </>
  );
};
```

### Localization

**File:** `packages/excalidraw/locales/en.json`

Add new strings:
```json
{
  "labels": {
    "video": {
      "noDescription": "No description",
      "descriptionPlaceholder": "Enter video description..."
    }
  },
  "buttons": {
    "download": "Download",
    "editDescription": "Edit description"
  }
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `packages/element/src/types.ts` | Add `description?: string` to ExcalidrawEmbeddableElement |
| `packages/excalidraw/components/hyperlink/Hyperlink.tsx` | Add LocalVideoPopup component, conditional rendering |
| `packages/excalidraw/locales/en.json` | Add video label strings |
| `packages/excalidraw/components/App.tsx` | Pass `files` prop to Hyperlink component |

### Integration in App.tsx

Ensure `files` is passed to the Hyperlink component:
```tsx
<Hyperlink
  element={element}
  scene={this.scene}
  setAppState={this.setState}
  onLinkOpen={this.props.onLinkOpen}
  setToast={this.setToast}
  updateEmbedValidationStatus={this.updateEmbedValidationStatus}
  files={this.files}  // ADD THIS
/>
```

---

## Future: Xilo Clip Annotations (Not in this PR)

When this repo is used as a submodule of `mx-dod-form`, we'll need to support Xilo clip annotations. This should be a **separate element type** (not regular video embeddable):

```typescript
// Future type - NOT part of this implementation
export type ExcalidrawXiloClipElement = _ExcalidrawElementBase &
  Readonly<{
    type: "xilo-clip";  // New element type
    xiloId: string;
    annotationId: string;
    videoUrl: string;
    startMs: number;
    endMs: number;
    caption?: string;
  }>;
```

This keeps regular local videos separate from Xilo-specific clip annotations.

---
---

# Plan: Export API for JSON + Assets (R2 Cloud Storage)

## Overview
Add export/import APIs that separate scene JSON from binary assets (images, videos), enabling:
- Upload assets to R2/S3 cloud storage separately
- Reference assets by content hash (SHA-256) for deduplication
- Smaller JSON files without embedded base64 data
- Git-friendly scene files

**Use Case:** mx-whiteboard is used as a submodule in mx-dod-form, which needs to send whiteboard data to R2 cloud storage.

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
  hash: string;           // SHA-256 content hash
  mimeType: string;
  size: number;           // bytes
  filename: string;       // hash + extension, e.g., "a1b2c3.png"
}

/** Exported scene with external asset references */
export interface ExportedSceneWithAssets {
  type: "excalidraw";
  version: number;
  source: string;
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  assetReferences: AssetReference[];  // Instead of embedded files
}

/** Individual asset for upload */
export interface ExportedAsset {
  reference: AssetReference;
  blob: Blob;             // Raw binary data
}

/** Complete export result */
export interface SceneExportResult {
  scene: ExportedSceneWithAssets;
  assets: ExportedAsset[];
}

/** Import options for loading scene with external assets */
export interface AssetResolver {
  /** Resolve asset reference to dataURL (e.g., fetch from R2) */
  resolve: (reference: AssetReference) => Promise<string>;
}
```

---

### Export Functions

**File: `packages/excalidraw/data/exportAssets.ts`** (NEW)

```typescript
import { sha256 } from "@excalidraw/common";

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
    // Skip files not referenced by elements
    if (!isFileReferenced(elements, fileId)) continue;

    // Convert dataURL to Blob
    const blob = dataURLToBlob(fileData.dataURL);

    // Generate content hash
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
): Promise<{ sceneJson: string; assets: Map<string, Blob> }> => {
  const { scene, assets } = await exportSceneWithAssets(elements, appState, files);

  const assetsMap = new Map<string, Blob>();
  for (const asset of assets) {
    assetsMap.set(asset.reference.filename, asset.blob);
  }

  return {
    sceneJson: JSON.stringify(scene, null, 2),
    assets: assetsMap,
  };
};

/**
 * Export as zip archive
 */
export const exportToZip = async (
  elements: readonly ExcalidrawElement[],
  appState: Partial<AppState>,
  files: BinaryFiles,
): Promise<Blob> => {
  const { sceneJson, assets } = await exportToFolder(elements, appState, files);

  // Use JSZip or similar
  const zip = new JSZip();
  zip.file("scene.json", sceneJson);

  const assetsFolder = zip.folder("assets");
  for (const [filename, blob] of assets) {
    assetsFolder.file(filename, blob);
  }

  return zip.generateAsync({ type: "blob" });
};
```

---

### Import Functions

**File: `packages/excalidraw/data/importAssets.ts`** (NEW)

```typescript
/**
 * Import scene with external asset resolution
 * Use this when loading from R2/S3
 */
export const importSceneWithAssets = async (
  sceneJson: string | ExportedSceneWithAssets,
  resolver: AssetResolver,
): Promise<{ elements: ExcalidrawElement[]; appState: AppState; files: BinaryFiles }> => {
  const scene = typeof sceneJson === "string"
    ? JSON.parse(sceneJson) as ExportedSceneWithAssets
    : sceneJson;

  // Resolve all assets in parallel
  const files: BinaryFiles = {};

  await Promise.all(
    scene.assetReferences.map(async (ref) => {
      const dataURL = await resolver.resolve(ref);
      files[ref.id] = {
        id: ref.id,
        mimeType: ref.mimeType,
        dataURL,
        created: Date.now(),
      };
    })
  );

  const restored = restore({ elements: scene.elements, appState: scene.appState }, null, null);

  return {
    elements: restored.elements,
    appState: restored.appState,
    files,
  };
};

/**
 * Import from zip archive
 */
export const importFromZip = async (
  zipBlob: Blob,
): Promise<{ elements: ExcalidrawElement[]; appState: AppState; files: BinaryFiles }> => {
  const zip = await JSZip.loadAsync(zipBlob);

  const sceneJson = await zip.file("scene.json")?.async("string");
  if (!sceneJson) throw new Error("Invalid zip: missing scene.json");

  const scene = JSON.parse(sceneJson) as ExportedSceneWithAssets;

  // Resolver reads from zip
  const resolver: AssetResolver = {
    resolve: async (ref) => {
      const assetBlob = await zip.file(`assets/${ref.filename}`)?.async("blob");
      if (!assetBlob) throw new Error(`Missing asset: ${ref.filename}`);
      return blobToDataURL(assetBlob);
    },
  };

  return importSceneWithAssets(scene, resolver);
};
```

---

## Public API Exports

**File: `packages/excalidraw/index.tsx`**

Add to exports:
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

// Download
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

## Files to Create/Modify

| File | Action |
|------|--------|
| `packages/excalidraw/data/types.ts` | Add new types |
| `packages/excalidraw/data/exportAssets.ts` | **NEW** - Export functions |
| `packages/excalidraw/data/importAssets.ts` | **NEW** - Import functions |
| `packages/excalidraw/data/r2Helper.ts` | **NEW** - R2 integration |
| `packages/excalidraw/data/hash.ts` | **NEW** - SHA-256 utility |
| `packages/excalidraw/index.tsx` | Export new APIs |
| `packages/common/src/utils.ts` | Add dataURLToBlob, blobToDataURL utilities |
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

1. **SHA-256 content hash** - Deduplicates identical files across exports
2. **Separate scene.json** - No embedded base64, much smaller files
3. **AssetResolver pattern** - Flexible for any storage backend (R2, S3, local)
4. **Parallel uploads** - Fast export with `Promise.all`
5. **Videos included** - Works with our new local video feature
6. **Backward compatible** - Original `serializeAsJSON` still works for embedded export

---

## Import API (Enhanced)

### Import Types

```typescript
/** Import result */
export interface ImportResult {
  elements: ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

/** Asset resolver - implement this in your app (e.g., mx-dod-form) */
export interface AssetResolver {
  resolve: (ref: AssetReference) => Promise<string>;  // Returns dataURL
}
```

### Import Function

**File: `packages/excalidraw/data/exportAssets.ts`**

```typescript
/**
 * Import scene with external asset resolution
 * @param sceneJson - Scene JSON string or parsed object
 * @param resolver - Your implementation to fetch assets (e.g., from R2)
 */
export const importSceneWithAssets = async (
  sceneJson: string | ExportedSceneWithAssets,
  resolver: AssetResolver,
): Promise<ImportResult> => {
  const scene = typeof sceneJson === "string"
    ? JSON.parse(sceneJson) as ExportedSceneWithAssets
    : sceneJson;

  const files: BinaryFiles = {};

  // Resolve all assets in parallel
  await Promise.all(
    scene.assetReferences.map(async (ref) => {
      const dataURL = await resolver.resolve(ref);
      files[ref.id] = {
        id: ref.id,
        mimeType: ref.mimeType,
        dataURL,
        created: Date.now(),
      };
    })
  );

  const restored = restore(
    { elements: scene.elements, appState: scene.appState },
    null,
    null
  );

  return {
    elements: restored.elements,
    appState: restored.appState,
    files,
  };
};
```

---

## Complete Usage Flow (mx-dod-form implements R2 integration)

**Note:** R2/S3 integration lives in mx-dod-form, NOT mx-whiteboard. mx-whiteboard only provides generic export/import APIs.

### Export Flow (Save to R2) - in mx-dod-form

```typescript
import {
  exportSceneWithAssets,
  type AssetReferenceWithUrl,
  type ExportedSceneWithAssets
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
  const { scene, assets } = await exportSceneWithAssets(elements, appState, files);

  // 3. Upload assets to R2 and add URLs
  const assetRefsWithUrls: AssetReferenceWithUrl[] = await Promise.all(
    assets.map(async (asset) => {
      const url = await uploadToR2(asset.reference.filename, asset.blob);
      return { ...asset.reference, url };
    })
  );

  // 4. Create final scene JSON with URLs
  const sceneWithUrls = { ...scene, assetReferences: assetRefsWithUrls };

  // 5. Save to Convex
  await convexMutation("whiteboards:save", {
    id: whiteboardId,
    sceneJson: JSON.stringify(sceneWithUrls)
  });
}
```

### Import Flow (Load from R2) - in mx-dod-form

```typescript
import {
  importSceneWithAssets,
  blobToDataURL,
  type AssetResolver,
  type ExportedSceneWithAssets
} from "@excalidraw/excalidraw";

// Your R2 resolver (in mx-dod-form)
function createR2Resolver(): AssetResolver {
  return {
    resolve: async (ref) => {
      // ref.url was set during export
      const response = await fetch(ref.url!);
      const blob = await response.blob();
      return blobToDataURL(blob);
    }
  };
}

// Load whiteboard
export async function loadWhiteboard(excalidrawAPI, whiteboardId: string) {
  // 1. Load scene JSON from Convex
  const sceneJson = await convexQuery("whiteboards:get", { id: whiteboardId });

  // 2. Import with R2 resolver
  const resolver = createR2Resolver();
  const { elements, appState, files } = await importSceneWithAssets(sceneJson, resolver);

  // 3. Update Excalidraw
  excalidrawAPI.updateScene({ elements, appState });
  excalidrawAPI.addFiles(Object.values(files));
}
```

---

## Updated Files to Create/Modify

| File | Action |
|------|--------|
| `packages/excalidraw/data/types.ts` | Add export/import types |
| `packages/excalidraw/data/exportAssets.ts` | **NEW** - Export & import functions |
| `packages/excalidraw/data/hash.ts` | **NEW** - SHA-256 utility |
| `packages/excalidraw/index.tsx` | Export all new APIs |
| `packages/common/src/utils.ts` | Add blob conversion utilities |
| `package.json` | Add jszip dependency |

---

## Full API Surface (mx-whiteboard provides)

### Export Functions
```typescript
exportSceneWithAssets(elements, appState, files) → SceneExportResult
exportToFolder(elements, appState, files) → { sceneJson, assets }
exportToZip(elements, appState, files) → Blob
```

### Import Functions
```typescript
importSceneWithAssets(sceneJson, resolver) → ImportResult
importFromZip(zipBlob) → ImportResult
```

### Utilities
```typescript
dataURLToBlob(dataURL) → Blob
blobToDataURL(blob) → Promise<string>
```

### Types
```typescript
AssetReference           // { id, hash, mimeType, size, filename }
AssetReferenceWithUrl    // extends AssetReference + optional url
ExportedSceneWithAssets  // { type, version, elements, appState, assetReferences }
ExportedAsset            // { reference, blob }
SceneExportResult        // { scene, assets }
AssetResolver            // { resolve: (ref) => Promise<dataURL> }
ImportResult             // { elements, appState, files, failedAssets? }
```

---

## What mx-dod-form implements (NOT in mx-whiteboard)

```typescript
// R2 upload function
uploadToR2(filename, blob) → Promise<url>

// R2 resolver
createR2Resolver() → AssetResolver

// Full save/load workflows
saveWhiteboard(excalidrawAPI, id) → void
loadWhiteboard(excalidrawAPI, id) → void
```
