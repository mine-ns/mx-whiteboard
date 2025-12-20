import React, { useRef, useState } from "react";

import Spinner from "./Spinner";

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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check if dataURL is valid
  const hasValidSrc = dataURL && dataURL.length > 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--default-bg-color)",
      }}
    >
      {isLoading && !hasError && hasValidSrc && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-primary-color)",
          }}
        >
          <Spinner size="2em" />
          <span style={{ fontSize: "0.875em", opacity: 0.7 }}>
            Loading video...
          </span>
        </div>
      )}
      {(hasError || !hasValidSrc) && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "var(--color-danger)",
          }}
        >
          <span style={{ fontSize: "1.5em" }}>!</span>
          <span style={{ fontSize: "0.875em" }}>
            {!hasValidSrc ? "Video not found" : "Failed to load video"}
          </span>
        </div>
      )}
      <video
        ref={videoRef}
        src={dataURL}
        controls={isActive}
        playsInline
        title={title}
        className="excalidraw__embeddable__video"
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error(
            "VideoPlayer: Failed to load video",
            e.currentTarget.error,
          );
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: isActive ? "auto" : "none",
          opacity: isLoading || hasError ? 0 : 1,
        }}
      />
    </div>
  );
};
