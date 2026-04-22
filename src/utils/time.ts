export function isStableForDuration(stableSince: number | null, now: number, durationMs: number) {
  return stableSince !== null && now - stableSince >= durationMs;
}
