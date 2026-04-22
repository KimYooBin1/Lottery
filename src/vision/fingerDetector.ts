import type { FingerType } from "../types/game";

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

const INDEX_FINGER_TIP_INDEX = 8;

function inPlayArea(x: number, y: number) {
  return x > 0.15 && x < 0.85 && y > 0.1 && y < 0.9;
}

export function getFingerCandidates(predictions: HandPrediction[]): FingerCandidate[] {
  return predictions.flatMap((hand, handIndex) => {
    if (hand.confidence < 0.55) return [];

    const point = hand.landmarks[INDEX_FINGER_TIP_INDEX];
    const candidate = {
      handTrackId: `${hand.handedness}-${handIndex}`,
      fingerType: "index" as FingerType,
      x: point?.x ?? 0,
      y: point?.y ?? 0,
      confidence: hand.confidence
    };

    return inPlayArea(candidate.x, candidate.y) ? [candidate] : [];
  });
}
