export type FingerStatus = "candidate" | "active" | "dropped";
export type FingerType = "thumb" | "index" | "middle" | "ring" | "pinky";

export type GameState =
  | "idle"
  | "requesting_camera"
  | "camera_ready"
  | "arming"
  | "countdown"
  | "drawing"
  | "result"
  | "sharing"
  | "error";

export type TrackedFinger = {
  fingerId: string;
  handTrackId: string;
  fingerType: FingerType;
  x: number;
  y: number;
  confidence: number;
  stableFrames: number;
  missingFrames: number;
  status: FingerStatus;
};

export type GameConfig = {
  winnerCount: number;
  stableDurationMs: number;
  countdownSeconds: number;
  maxMissingFrames: number;
};

export type DrawResult = {
  winnerFingerIds: string[];
  capturedAt: number;
  imageBlob?: Blob;
};
