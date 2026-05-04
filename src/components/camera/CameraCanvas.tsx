import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { TrackedFinger } from "../../types/game";

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  trackedFingers: TrackedFinger[];
  winnerFingerIds?: string[];
  countdown?: number;
};

export function CameraCanvas({ videoRef, trackedFingers, winnerFingerIds = [], countdown }: Props) {
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = overlayRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(width * 0.15, height * 0.1, width * 0.7, height * 0.8);

    trackedFingers.forEach((finger) => {
      const isWinner = winnerFingerIds.includes(finger.fingerId);
      ctx.beginPath();
      ctx.arc(finger.x * width, finger.y * height, isWinner ? 26 : 18, 0, Math.PI * 2);
      ctx.strokeStyle = isWinner ? "#ffffff" : finger.status === "active" ? "#ffffff" : "rgba(255,255,255,0.55)";
      ctx.lineWidth = isWinner ? 6 : 4;
      ctx.stroke();
    });
  }, [trackedFingers, videoRef, winnerFingerIds]);

  return (
    <div className="camera-stage">
      <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
      <canvas ref={overlayRef} className="camera-overlay" />
      {countdown !== undefined ? <strong className="camera-countdown">{countdown}</strong> : null}
    </div>
  );
}
