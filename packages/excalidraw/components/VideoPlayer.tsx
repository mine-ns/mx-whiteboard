import React, { useRef, useState, useEffect } from "react";

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
  const [isLooping, setIsLooping] = useState(false);
  const [prevIsActive, setPrevIsActive] = useState(false);

  // Check if dataURL is valid
  const hasValidSrc = dataURL && dataURL.length > 0;

  // Toggle play/pause when activated (click to interact)
  useEffect(() => {
    // When transitioning from inactive to active, toggle play/pause
    if (isActive && !prevIsActive && videoRef.current) {
      setTimeout(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused || video.ended) {
          // Video is paused/stopped -> play
          video.play().catch(() => {
            // Autoplay might be blocked by browser, that's ok
          });
        } else {
          // Video is playing -> pause
          video.pause();
        }
      }, 100);
    }
    setPrevIsActive(isActive);
  }, [isActive, prevIsActive]);

  const toggleLoop = () => {
    const newLooping = !isLooping;
    setIsLooping(newLooping);
    if (videoRef.current) {
      videoRef.current.loop = newLooping;
    }
  };

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
      {/* Native video controls show loading state, so no need for custom spinner */}
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
      {/* Small loop pill button */}
      {hasValidSrc && !hasError && isActive && (
        <button
          onClick={toggleLoop}
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            padding: "2px 8px",
            fontSize: "11px",
            fontWeight: 500,
            backgroundColor: isLooping ? "rgba(59, 130, 246, 0.9)" : "rgba(0, 0, 0, 0.5)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            pointerEvents: "auto",
            zIndex: 10,
          }}
        >
          Loop{isLooping ? " ✓" : ""}
        </button>
      )}
      <video
        ref={videoRef}
        src={dataURL}
        controls={isActive} // Show controls only when active
        loop={isLooping}
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
          pointerEvents: isActive ? "auto" : "none", // Only interactive when active
          opacity: hasError ? 0 : 1,
        }}
      />
    </div>
  );
};
