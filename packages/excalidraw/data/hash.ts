/**
 * SHA-256 hashing utilities for content-addressed asset storage
 */

/**
 * Calculate SHA-256 hash of a Blob
 * @param blob - The blob to hash
 * @returns Hex string of the SHA-256 hash
 */
export const sha256 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Get file extension from MIME type
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    // Images
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/avif": "avif",
    "image/jfif": "jfif",
    // Videos
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "video/x-matroska": "mkv",
  };

  return mimeToExt[mimeType] || mimeType.split("/")[1] || "bin";
};
