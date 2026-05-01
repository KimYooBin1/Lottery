import type { GameState } from "../types/game";

type TransitionInput = {
  activeFingerIds: string[];
  previousFingerIds: string[];
  isStable: boolean;
  countdownFinished: boolean;
};

export function areSameFingerSet(left: string[], right: string[]) {
  if (left.length !== right.length) return false;

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((id, index) => id === sortedRight[index]);
}

export function getNextGameState(state: GameState, input: TransitionInput): GameState {
  switch (state) {
    case "camera_ready":
      return input.activeFingerIds.length > 0 ? "arming" : "camera_ready";
    case "arming":
      return input.isStable ? "countdown" : "arming";
    case "countdown":
      if (!areSameFingerSet(input.activeFingerIds, input.previousFingerIds)) {
        return "arming";
      }
      return input.countdownFinished ? "drawing" : "countdown";
    default:
      return state;
  }
}
