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

const MAX_MATCH_DISTANCE = 0.08;

function createFingerId(candidate: FingerCandidate) {
  return `${candidate.handTrackId}-${candidate.fingerType}`;
}

export function reconcileTrackedFingers(
  prev: TrackedFinger[],
  candidates: FingerCandidate[]
): TrackedFinger[] {
  const usedPreviousIds = new Set<string>();

  return candidates.map((candidate, index) => {
    const match = prev
      .map((finger) => ({
        finger,
        distance: distance(finger, candidate),
        sameHandTrack: finger.handTrackId === candidate.handTrackId
      }))
      .filter(
        ({ finger, distance }) =>
          !usedPreviousIds.has(finger.fingerId) &&
          finger.fingerType === candidate.fingerType &&
          distance < MAX_MATCH_DISTANCE
      )
      .sort((a, b) => {
        if (a.sameHandTrack !== b.sameHandTrack) {
          return a.sameHandTrack ? -1 : 1;
        }
        return a.distance - b.distance;
      })[0]?.finger;

    if (match) {
      usedPreviousIds.add(match.fingerId);
    }

    return {
      fingerId: match?.fingerId ?? `${createFingerId(candidate)}-${index}`,
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
