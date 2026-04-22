import { describe, expect, it } from "vitest";
import { getFingerCandidates, type Landmark } from "../../src/vision/fingerDetector";

function landmarksWithVisibleFingerTips(): Landmark[] {
  return Array.from({ length: 21 }, (_, index) => ({
    x: 0.2 + index * 0.01,
    y: 0.2 + index * 0.01,
    z: 0
  }));
}

describe("getFingerCandidates", () => {
  it("tracks only the index finger tip for each detected hand", () => {
    const candidates = getFingerCandidates([
      {
        handedness: "Right",
        confidence: 0.9,
        landmarks: landmarksWithVisibleFingerTips()
      }
    ]);

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({
      handTrackId: "Right-0",
      fingerType: "index",
      x: 0.28,
      y: 0.28
    });
  });
});
