\# Plan: Add HTML5 Video Player for Local Video Embeds



\## Overview

Extend the existing embeddable element to support local video files (MP4, WebM, OGG) stored as binary data, rendered with a native HTML5 `<video>` element.



\*\*Decisions:\*\*

\- \*\*Native HTML5 `<video>`\*\* - no third-party library

\- \*\*Scope:\*\* Regular local video drag \& drop first

\- \*\*Future:\*\* Xilo clip annotations will be a separate element type (not part of this implementation)



---



\## Files to Modify



\### Phase 1: Type System

| File | Changes |

|------|---------|

| `packages/common/src/constants.ts` | Add `VIDEO\_MIME\_TYPES` constant |

| `packages/excalidraw/types.ts` | Update `BinaryFileData.mimeType` to include video types |

| `packages/element/src/types.ts` | Add `fileId` and `status` to `ExcalidrawEmbeddableElement`; add `localVideo` variant to `IframeData` |



\### Phase 2: Element Helpers

| File | Changes |

|------|---------|

| `packages/element/src/typeChecks.ts` | Add `isLocalVideoEmbeddable()` type guard |

| `packages/element/src/newElement.ts` | Update `newEmbeddableElement()` to accept `fileId` |



\### Phase 3: Video Handling

| File | Changes |

|------|---------|

| `packages/excalidraw/data/blob.ts` | Add `isSupportedVideoFile()` helper |

| `packages/element/src/video.ts` | \*\*New file\*\* - Video cache utilities |



\### Phase 4: Rendering \& Upload

| File | Changes |

|------|---------|

| `packages/excalidraw/components/VideoPlayer.tsx` | \*\*New file\*\* - HTML5 video component |

| `packages/excalidraw/components/App.tsx` | Update `renderEmbeddables()` to use VideoPlayer; add `initializeVideo()` method |



---



\## Implementation Steps



\### Step 1: Add VIDEO\_MIME\_TYPES

\*\*File:\*\* `packages/common/src/constants.ts`



Add after `IMAGE\_MIME\_TYPES` (line 237):

```typescript

export const VIDEO\_MIME\_TYPES = {

&nbsp; mp4: "video/mp4",

&nbsp; webm: "video/webm",

&nbsp; ogg: "video/ogg",

} as const;

```



Update `MIME\_TYPES` to include video types.



---



\### Step 2: Extend ExcalidrawEmbeddableElement Type

\*\*File:\*\* `packages/element/src/types.ts`



Change lines 100-103 from:

```typescript

export type ExcalidrawEmbeddableElement = \_ExcalidrawElementBase \&

&nbsp; Readonly<{

&nbsp;   type: "embeddable";

&nbsp; }>;

```



To:

```typescript

export type ExcalidrawEmbeddableElement = \_ExcalidrawElementBase \&

&nbsp; Readonly<{

&nbsp;   type: "embeddable";

&nbsp;   fileId?: FileId | null;

&nbsp;   status?: "pending" | "saved" | "error";

&nbsp; }>;

```



---



\### Step 3: Add localVideo to IframeData

\*\*File:\*\* `packages/element/src/types.ts`



Extend the union at lines 127-135:

```typescript

export type IframeData =

&nbsp; | {

&nbsp;     intrinsicSize: { w: number; h: number };

&nbsp;     error?: Error;

&nbsp;     sandbox?: { allowSameOrigin?: boolean };

&nbsp;   } \& (

&nbsp;     | { type: "video" | "generic"; link: string }

&nbsp;     | { type: "document"; srcdoc: (theme: Theme) => string }

&nbsp;     | { type: "localVideo"; dataURL: string }  // NEW

&nbsp;   );

```



---



\### Step 4: Update BinaryFileData

\*\*File:\*\* `packages/excalidraw/types.ts`



Update mimeType union to include video types:

```typescript

mimeType:

&nbsp; | ValueOf<typeof IMAGE\_MIME\_TYPES>

&nbsp; | ValueOf<typeof VIDEO\_MIME\_TYPES>

&nbsp; | typeof MIME\_TYPES.binary;

```



---



\### Step 5: Add Type Guards

\*\*File:\*\* `packages/element/src/typeChecks.ts`



```typescript

export const isLocalVideoEmbeddable = (

&nbsp; element: ExcalidrawElement | null,

): element is ExcalidrawEmbeddableElement \& { fileId: FileId } => {

&nbsp; return (

&nbsp;   !!element \&\&

&nbsp;   element.type === "embeddable" \&\&

&nbsp;   "fileId" in element \&\&

&nbsp;   !!element.fileId

&nbsp; );

};

```



---



\### Step 6: Add Video File Helpers

\*\*File:\*\* `packages/excalidraw/data/blob.ts`



```typescript

export const isSupportedVideoFile = (blob: Blob | null | undefined) => {

&nbsp; const { type } = blob || {};

&nbsp; return !!type \&\& Object.values(VIDEO\_MIME\_TYPES).includes(type as any);

};

```



---



\### Step 7: Create VideoPlayer Component

\*\*File:\*\* `packages/excalidraw/components/VideoPlayer.tsx` (NEW)



Native HTML5 video with standard browser controls:



```typescript

import React, { useRef, useEffect } from "react";

import clsx from "clsx";



interface VideoPlayerProps {

&nbsp; dataURL: string;

&nbsp; isActive: boolean;

&nbsp; title?: string;

}



export const VideoPlayer: React.FC<VideoPlayerProps> = ({

&nbsp; dataURL,

&nbsp; isActive,

&nbsp; title = "Embedded video",

}) => {

&nbsp; const videoRef = useRef<HTMLVideoElement>(null);



&nbsp; // Pause video when element becomes inactive (user clicks away)

&nbsp; useEffect(() => {

&nbsp;   if (!isActive \&\& videoRef.current \&\& !videoRef.current.paused) {

&nbsp;     videoRef.current.pause();

&nbsp;   }

&nbsp; }, \[isActive]);



&nbsp; return (

&nbsp;   <video

&nbsp;     ref={videoRef}

&nbsp;     src={dataURL}

&nbsp;     controls

&nbsp;     playsInline

&nbsp;     title={title}

&nbsp;     className="excalidraw\_\_embeddable\_\_video"

&nbsp;     style={{

&nbsp;       width: "100%",

&nbsp;       height: "100%",

&nbsp;       objectFit: "contain",

&nbsp;       pointerEvents: isActive ? "auto" : "none",

&nbsp;     }}

&nbsp;   />

&nbsp; );

};

```



\*\*CSS\*\* (add to `packages/excalidraw/css/styles.scss`):

```scss

.excalidraw\_\_embeddable\_\_video {

&nbsp; background: #000;

&nbsp; border-radius: var(--embeddable-radius);

}

```



---



\### Step 8: Update renderEmbeddables in App.tsx

\*\*File:\*\* `packages/excalidraw/components/App.tsx`



In the `renderEmbeddables()` method (~line 1347):



1\. Detect local video embeddables by checking `el.fileId` and file MIME type

2\. Render `<VideoPlayer>` instead of `<iframe>` when `src.type === "localVideo"`



```typescript

// After getting src for the element

if (isLocalVideoEmbeddable(el) \&\& this.files\[el.fileId]) {

&nbsp; const fileData = this.files\[el.fileId];

&nbsp; if (isSupportedVideoFile({ type: fileData.mimeType } as Blob)) {

&nbsp;   src = {

&nbsp;     type: "localVideo",

&nbsp;     dataURL: fileData.dataURL,

&nbsp;     intrinsicSize: { w: el.width, h: el.height },

&nbsp;   };

&nbsp; }

}



// In render section

{src?.type === "localVideo" ? (

&nbsp; <VideoPlayer dataURL={src.dataURL} isActive={isActive} />

) : (

&nbsp; <iframe ... />

)}

```



---



\### Step 9: Add Video Upload Flow

\*\*File:\*\* `packages/excalidraw/components/App.tsx`



Add `initializeVideo()` method (similar to image initialization):

\- Validate video file type

\- Generate fileId via SHA-1 hash

\- Convert to dataURL

\- Store in BinaryFiles

\- Update element with fileId and status



Integrate with file drop/paste handlers to detect video files.



---



\### Step 10: Update newEmbeddableElement

\*\*File:\*\* `packages/element/src/newElement.ts`



Accept optional `fileId` and `status` parameters:

```typescript

export const newEmbeddableElement = (opts) => {

&nbsp; return {

&nbsp;   ...\_newElementBase("embeddable", opts),

&nbsp;   fileId: opts.fileId ?? null,

&nbsp;   status: opts.fileId ? (opts.status ?? "pending") : undefined,

&nbsp; };

};

```



---



\## Key Design Decisions



1\. \*\*Extend embeddable\*\* (not new element type) - reuses existing infrastructure

2\. \*\*Optional fileId\*\* - embeddables can be URL-based OR file-based

3\. \*\*BinaryFiles storage\*\* - same pattern as images for persistence

4\. \*\*Discriminated union\*\* - `IframeData.type === "localVideo"` for clean conditionals

5\. \*\*Native controls\*\* - uses HTML5 video controls for simplicity



---



\## Video File Size Limit



Consider adding a max size constant (e.g., 50MB for videos vs 4MB for images):

```typescript

export const MAX\_ALLOWED\_VIDEO\_FILE\_BYTES = 50 \* 1024 \* 1024; // 50MB

```



---



\## Video Context Popup (Download + Description)



For local video embeddables, replace the default "No link is set" popup with a custom popup containing:

1\. \*\*Download button\*\* - Downloads the video file to user's computer

2\. \*\*Description/Alt field\*\* - Inline editable text for accessibility/notes



\### Type Changes



\*\*File:\*\* `packages/element/src/types.ts`



Add `description` field to `ExcalidrawEmbeddableElement`:

```typescript

export type ExcalidrawEmbeddableElement = \_ExcalidrawElementBase \&

&nbsp; Readonly<{

&nbsp;   type: "embeddable";

&nbsp;   fileId?: FileId | null;

&nbsp;   status?: "pending" | "saved" | "error";

&nbsp;   description?: string;  // NEW - alt text for local videos

&nbsp; }>;

```



\### UI Changes



\*\*Modify:\*\* `packages/excalidraw/components/hyperlink/Hyperlink.tsx`



Add conditional rendering for local video embeddables:



```tsx

// At top - add imports

import { isLocalVideoEmbeddable } from "@excalidraw/element";

import { downloadIcon } from "../icons";



// Inside component - detect local video

const isLocalVideo = isLocalVideoEmbeddable(element);



// Replace the empty link message for local videos

{isLocalVideo ? (

&nbsp; <LocalVideoPopup

&nbsp;   element={element}

&nbsp;   files={files}

&nbsp;   scene={scene}

&nbsp;   isEditing={isEditing}

&nbsp;   setAppState={setAppState}

&nbsp; />

) : element.link ? (

&nbsp; // ... existing link display

) : (

&nbsp; <div className="excalidraw-hyperlinkContainer-link">

&nbsp;   {t("labels.link.empty")}

&nbsp; </div>

)}

```



\### LocalVideoPopup Component



\*\*New section in:\*\* `packages/excalidraw/components/hyperlink/Hyperlink.tsx`



```tsx

const LocalVideoPopup = ({

&nbsp; element,

&nbsp; files,

&nbsp; scene,

&nbsp; isEditing,

&nbsp; setAppState,

}) => {

&nbsp; const fileData = files\[element.fileId];

&nbsp; const \[descValue, setDescValue] = useState(element.description || "");



&nbsp; const handleDownload = () => {

&nbsp;   if (!fileData) return;



&nbsp;   // Convert dataURL to Blob and download

&nbsp;   const \[header, base64] = fileData.dataURL.split(",");

&nbsp;   const mimeType = header.match(/:(.\*?);/)?.\[1] || "video/mp4";

&nbsp;   const binary = atob(base64);

&nbsp;   const array = new Uint8Array(binary.length);

&nbsp;   for (let i = 0; i < binary.length; i++) {

&nbsp;     array\[i] = binary.charCodeAt(i);

&nbsp;   }

&nbsp;   const blob = new Blob(\[array], { type: mimeType });



&nbsp;   const url = URL.createObjectURL(blob);

&nbsp;   const a = document.createElement("a");

&nbsp;   a.href = url;

&nbsp;   a.download = `video.${mimeType.split("/")\[1]}`;

&nbsp;   a.click();

&nbsp;   URL.revokeObjectURL(url);

&nbsp; };



&nbsp; const handleDescriptionSubmit = () => {

&nbsp;   scene.mutateElement(element, { description: descValue });

&nbsp;   setAppState({ showHyperlinkPopup: "info" });

&nbsp; };



&nbsp; return (

&nbsp;   <>

&nbsp;     {isEditing ? (

&nbsp;       <input

&nbsp;         className="excalidraw-hyperlinkContainer-input"

&nbsp;         placeholder={t("labels.video.descriptionPlaceholder")}

&nbsp;         value={descValue}

&nbsp;         onChange={(e) => setDescValue(e.target.value)}

&nbsp;         autoFocus

&nbsp;         onKeyDown={(e) => {

&nbsp;           e.stopPropagation();

&nbsp;           if (e.key === KEYS.ENTER || e.key === KEYS.ESCAPE) {

&nbsp;             handleDescriptionSubmit();

&nbsp;           }

&nbsp;         }}

&nbsp;       />

&nbsp;     ) : (

&nbsp;       <div className="excalidraw-hyperlinkContainer-link">

&nbsp;         {element.description || t("labels.video.noDescription")}

&nbsp;       </div>

&nbsp;     )}

&nbsp;     <div className="excalidraw-hyperlinkContainer\_\_buttons">

&nbsp;       {!isEditing \&\& (

&nbsp;         <ToolButton

&nbsp;           type="button"

&nbsp;           title={t("buttons.editDescription")}

&nbsp;           aria-label={t("buttons.editDescription")}

&nbsp;           onClick={() => setAppState({ showHyperlinkPopup: "editor" })}

&nbsp;           icon={FreedrawIcon}

&nbsp;         />

&nbsp;       )}

&nbsp;       <ToolButton

&nbsp;         type="button"

&nbsp;         title={t("buttons.download")}

&nbsp;         aria-label={t("buttons.download")}

&nbsp;         onClick={handleDownload}

&nbsp;         icon={downloadIcon}

&nbsp;       />

&nbsp;     </div>

&nbsp;   </>

&nbsp; );

};

```



\### Localization



\*\*File:\*\* `packages/excalidraw/locales/en.json`



Add new strings:

```json

{

&nbsp; "labels": {

&nbsp;   "video": {

&nbsp;     "noDescription": "No description",

&nbsp;     "descriptionPlaceholder": "Enter video description..."

&nbsp;   }

&nbsp; },

&nbsp; "buttons": {

&nbsp;   "download": "Download",

&nbsp;   "editDescription": "Edit description"

&nbsp; }

}

```



\### Files to Modify



| File | Changes |

|------|---------|

| `packages/element/src/types.ts` | Add `description?: string` to ExcalidrawEmbeddableElement |

| `packages/excalidraw/components/hyperlink/Hyperlink.tsx` | Add LocalVideoPopup component, conditional rendering |

| `packages/excalidraw/locales/en.json` | Add video label strings |

| `packages/excalidraw/components/App.tsx` | Pass `files` prop to Hyperlink component |



\### Integration in App.tsx



Ensure `files` is passed to the Hyperlink component:

```tsx

<Hyperlink

&nbsp; element={element}

&nbsp; scene={this.scene}

&nbsp; setAppState={this.setState}

&nbsp; onLinkOpen={this.props.onLinkOpen}

&nbsp; setToast={this.setToast}

&nbsp; updateEmbedValidationStatus={this.updateEmbedValidationStatus}

&nbsp; files={this.files}  // ADD THIS

/>

```



---



\## Future: Xilo Clip Annotations (Not in this PR)



When this repo is used as a submodule of `mx-dod-form`, we'll need to support Xilo clip annotations. This should be a \*\*separate element type\*\* (not regular video embeddable):



```typescript

// Future type - NOT part of this implementation

export type ExcalidrawXiloClipElement = \_ExcalidrawElementBase \&

&nbsp; Readonly<{

&nbsp;   type: "xilo-clip";  // New element type

&nbsp;   xiloId: string;

&nbsp;   annotationId: string;

&nbsp;   videoUrl: string;

&nbsp;   startMs: number;

&nbsp;   endMs: number;

&nbsp;   caption?: string;

&nbsp; }>;

```



This keeps regular local videos separate from Xilo-specific clip annotations.

