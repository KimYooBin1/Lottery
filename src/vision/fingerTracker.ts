import type { TrackedFinger } from "../types/game";

type FingerCandidate = {
  handTrackId: string;
  fingerType: TrackedFinger["fingerType"];
  x: number;
  y: number;
  confidence: number;
};

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function reconcileTrackedFingers(
  prev: TrackedFinger[],
  candidates: FingerCandidate[]
): TrackedFinger[] {
  return candidates.map((candidate, index) => {
    const match = prev.find(
      (finger) =>
        finger.handTrackId === candidate.handTrackId &&
        finger.fingerType === candidate.fingerType &&
        distance(finger, candidate) < 0.08
    );

    return {
      fingerId: match?.fingerId ?? `${candidate.handTrackId}-${candidate.fingerType}-${index}`,
      handTrackId: candidate.handTrackId,
      fingerType: candidate.fingerType,
      x: candidate.x,
      y: candidate.y,
      confidence: candidate.confidence,
      stableFrames: (match?.stableFrames ?? 0) + 1,
      missingFrames: 0,
      status: (match?.stableFrames ?? 0) + 1 >= 3 ? "active" : "candidate"
    };
  });
}
