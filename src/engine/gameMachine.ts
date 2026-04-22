import type { GameState } from "../types/game";

type TransitionInput = {
  activeFingerIds: string[];
  previousFingerIds: string[];
  isStable: boolean;
  countdownFinished: boolean;
};

export function getNextGameState(state: GameState, input: TransitionInput): GameState {
  switch (state) {
    case "camera_ready":
      return input.activeFingerIds.length > 0 ? "arming" : "camera_ready";
    case "arming":
      return input.isStable ? "countdown" : "arming";
    case "countdown":
      if (input.activeFingerIds.join(",") !== input.previousFingerIds.join(",")) {
        return "arming";
      }
      return input.countdownFinished ? "drawing" : "countdown";
    default:
      return state;
  }
}
