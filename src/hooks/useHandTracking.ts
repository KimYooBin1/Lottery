import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { DEFAULT_GAME_CONFIG } from "../config/gameConfig";
import type { TrackedFinger } from "../types/game";
import { getFingerCandidates, type HandPrediction } from "../vision/fingerDetector";
import { reconcileTrackedFingers } from "../vision/fingerTracker";
import { createHandsDetector } from "../vision/handLandmarks";

export function useHandTracking(videoRef: RefObject<HTMLVideoElement>, stream: MediaStream | null) {
  const [tracked, setTracked] = useState<TrackedFinger[]>([]);
  const [statusMessage, setStatusMessage] = useState("손가락을 화면 안에 넣어 주세요");
  const detectorRef = useRef<Awaited<ReturnType<typeof createHandsDetector>> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    void video.play();
  }, [stream, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    detectorRef.current = createHandsDetector((predictions: HandPrediction[]) => {
      const candidates = getFingerCandidates(predictions);
      setTracked((prev) => reconcileTrackedFingers(prev, candidates));
    });

    let cancelled = false;

    const loop = async () => {
      if (cancelled || !detectorRef.current || !video.videoWidth) return;
      await detectorRef.current.send({ image: video });
      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    const startLoop = () => {
      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    if (video.readyState >= 2) {
      startLoop();
    } else {
      video.onloadeddata = startLoop;
    }

    return () => {
      cancelled = true;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      detectorRef.current?.close();
      detectorRef.current = null;
      video.onloadeddata = null;
    };
  }, [stream, videoRef]);

  const activeFingers = useMemo(
    () => tracked.filter((finger) => finger.status === "active"),
    [tracked]
  );

  useEffect(() => {
    if (activeFingers.length === 0) {
      setStatusMessage("손가락을 화면 안에 넣어 주세요");
    } else if (activeFingers.length < DEFAULT_GAME_CONFIG.winnerCount) {
      setStatusMessage("당첨 인원 수보다 많은 손가락이 필요합니다");
    } else {
      setStatusMessage("잠시 그대로 유지해 주세요");
    }
  }, [activeFingers]);

  return { tracked, activeFingers, statusMessage };
}
