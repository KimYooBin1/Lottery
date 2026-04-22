import type { GameConfig } from "../types/game";

export const DEFAULT_GAME_CONFIG: GameConfig = {
  winnerCount: 1,
  stableDurationMs: 1000,
  countdownSeconds: 3,
  maxMissingFrames: 6
};
