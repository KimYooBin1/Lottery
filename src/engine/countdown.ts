export function getCountdownRemaining(startedAt: number, now: number, totalSeconds: number) {
  const elapsed = Math.floor((now - startedAt) / 1000);
  return Math.max(totalSeconds - elapsed, 0);
}
