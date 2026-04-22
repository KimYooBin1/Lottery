import type { FingerType, TrackedFinger } from "../types/game";

export type Landmark = { x: number; y: number; z: number };

export type HandPrediction = {
  handedness: "Left" | "Right";
  confidence: number;
  landmarks: Landmark[];
};

export type FingerCandidate = {
  handTrackId: string;
  fingerType: FingerType;
  x: number;
  y: number;
  confidence: number;
};

const FINGER_TIPS: Record<FingerType, number> = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  pinky: 20
};

function inPlayArea(x: number, y: number) {
  return x > 0.15 && x < 0.85 && y > 0.1 && y < 0.9;
}

export function getFingerCandidates(predictions: HandPrediction[]): FingerCandidate[] {
  return predictions.flatMap((hand, handIndex) => {
    if (hand.confidence < 0.55) return [];

    return Object.entries(FINGER_TIPS)
      .map(([fingerType, landmarkIndex]) => {
        const point = hand.landmarks[landmarkIndex];
        return {
          handTrackId: `${hand.handedness}-${handIndex}`,
          fingerType: fingerType as TrackedFinger["fingerType"],
          x: point?.x ?? 0,
          y: point?.y ?? 0,
          confidence: hand.confidence
        };
      })
      .filter((candidate) => inPlayArea(candidate.x, candidate.y));
  });
}
