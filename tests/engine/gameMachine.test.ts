import { describe, expect, it } from "vitest";
import { areSameFingerSet, getNextGameState } from "../../src/engine/gameMachine";
import { DEFAULT_GAME_CONFIG } from "../../src/config/gameConfig";

describe("game machine", () => {
  it("uses MVP defaults", () => {
    expect(DEFAULT_GAME_CONFIG.winnerCount).toBe(1);
    expect(DEFAULT_GAME_CONFIG.stableDurationMs).toBe(1000);
    expect(DEFAULT_GAME_CONFIG.countdownSeconds).toBe(3);
  });

  it("moves from camera_ready to arming when fingers exist", () => {
    expect(
      getNextGameState("camera_ready", {
        activeFingerIds: ["f1"],
        previousFingerIds: [],
        isStable: false,
        countdownFinished: false
      })
    ).toBe("arming");
  });

  it("resets countdown when active set changes", () => {
    expect(
      getNextGameState("countdown", {
        activeFingerIds: ["f1", "f2"],
        previousFingerIds: ["f1"],
        isStable: false,
        countdownFinished: false
      })
    ).toBe("arming");
  });

  it("keeps counting down when the same active set is reported in a different order", () => {
    expect(
      getNextGameState("countdown", {
        activeFingerIds: ["f2", "f1"],
        previousFingerIds: ["f1", "f2"],
        isStable: false,
        countdownFinished: false
      })
    ).toBe("countdown");
  });

  it("compares finger id collections as sets", () => {
    expect(areSameFingerSet(["f2", "f1"], ["f1", "f2"])).toBe(true);
    expect(areSameFingerSet(["f1", "f2"], ["f1", "f3"])).toBe(false);
  });
});
