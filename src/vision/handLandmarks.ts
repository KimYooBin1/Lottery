import { Hands } from "@mediapipe/hands";
import type { HandPrediction } from "./fingerDetector";

type MediaPipeResult = {
  multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  multiHandedness?: Array<{ label?: "Left" | "Right" }>;
};

export function createHandsDetector(onPredictions: (predictions: HandPrediction[]) => void) {
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
