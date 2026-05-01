import { describe, expect, it } from "vitest";
import { reconcileTrackedFingers } from "../../src/vision/fingerTracker";

describe("reconcileTrackedFingers", () => {
  it("keeps stable ids for nearby candidates", () => {
    const current = reconcileTrackedFingers([], [
      { handTrackId: "Right-0", fingerType: "index", x: 0.5, y: 0.5, confidence: 0.9 }
    ]);

    const next = reconcileTrackedFingers(current, [
      { handTrackId: "Right-0", fingerType: "index", x: 0.51, y: 0.5, confidence: 0.9 }
    ]);

    expect(next[0].fingerId).toBe(current[0].fingerId);
    expect(next[0].status).toBe("candidate");
  });

  it("keeps the same id when detector hand labels shift but the finger stays nearby", () => {
    const current = reconcileTrackedFingers([], [
      { handTrackId: "Right-0", fingerType: "index", x: 0.5, y: 0.5, confidence: 0.9 }
    ]);

    const next = reconcileTrackedFingers(current, [
      { handTrackId: "Right-1", fingerType: "index", x: 0.51, y: 0.5, confidence: 0.9 }
    ]);

    expect(next[0].fingerId).toBe(current[0].fingerId);
  });

  it("does not reuse one previous finger for multiple nearby candidates", () => {
    const current = reconcileTrackedFingers([], [
      { handTrackId: "Right-0", fingerType: "index", x: 0.5, y: 0.5, confidence: 0.9 }
    ]);

    const next = reconcileTrackedFingers(current, [
      { handTrackId: "Right-0", fingerType: "index", x: 0.51, y: 0.5, confidence: 0.9 },
      { handTrackId: "Right-1", fingerType: "index", x: 0.52, y: 0.5, confidence: 0.9 }
    ]);

    expect(new Set(next.map((finger) => finger.fingerId)).size).toBe(2);
  });
});
