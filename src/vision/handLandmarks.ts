import * as mpHands from "@mediapipe/hands";
import type { HandPrediction } from "./fingerDetector";

type MediaPipeResult = {
  multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  multiHandedness?: Array<{ label?: "Left" | "Right" }>;
};

type HandsConstructor = new (config: { locateFile: (file: string) => string }) => {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (listener: (results: unknown) => void) => void;
  send: (payload: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

function resolveGlobalHandsConstructor(): HandsConstructor | null {
  const globalScope = globalThis as Record<string, unknown> | undefined;
  if (globalScope && typeof globalScope.Hands === "function") {
    return globalScope.Hands as HandsConstructor;
  }

  return null;
}

export function resolveHandsConstructor(moduleObject: Record<string, unknown>): HandsConstructor {
  if (typeof moduleObject.Hands === "function") {
    return moduleObject.Hands as HandsConstructor;
  }

  const defaultExport = moduleObject.default as Record<string, unknown> | undefined;
  if (defaultExport && typeof defaultExport.Hands === "function") {
    return defaultExport.Hands as HandsConstructor;
  }

  const commonJsExport = moduleObject["module.exports"] as Record<string, unknown> | undefined;
  if (commonJsExport && typeof commonJsExport.Hands === "function") {
    return commonJsExport.Hands as HandsConstructor;
  }

  const globalHands = resolveGlobalHandsConstructor();
  if (globalHands) {
    return globalHands;
  }

  throw new Error("MediaPipe Hands constructor를 찾을 수 없습니다.");
}

export function createHandsDetector(onPredictions: (predictions: HandPrediction[]) => void) {
  const Hands = resolveHandsConstructor(mpHands as unknown as Record<string, unknown>);
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 8,
    modelComplexity: 1,
    minDetectionConfidence: 0.55,
    minTrackingConfidence: 0.55
  });

  hands.onResults((results: unknown) => {
    const typed = results as MediaPipeResult;
    const predictions: HandPrediction[] = (typed.multiHandLandmarks ?? []).map((landmarks, index) => ({
      handedness: typed.multiHandedness?.[index]?.label ?? "Right",
      confidence: 0.9,
      landmarks
    }));
    onPredictions(predictions);
  });

  return hands;
}
