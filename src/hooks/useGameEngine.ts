import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_GAME_CONFIG } from "../config/gameConfig";
import { getCountdownRemaining } from "../engine/countdown";
import { getNextGameState } from "../engine/gameMachine";
import type { DrawResult, GameState, TrackedFinger } from "../types/game";
import { pickUniqueRandomItems } from "../utils/random";
import { isStableForDuration } from "../utils/time";

export function useGameEngine(activeFingers: TrackedFinger[], winnerCount: number) {
  const [state, setState] = useState<GameState>("camera_ready");
  const [stableSince, setStableSince] = useState<number | null>(null);
  const [countdownStart, setCountdownStart] = useState<number | null>(null);
  const [result, setResult] = useState<DrawResult | null>(null);
  const previousFingerIds = useRef<string[]>([]);

  const activeFingerIds = useMemo(() => activeFingers.map((finger) => finger.fingerId), [activeFingers]);
  const now = Date.now();
  const isStable = isStableForDuration(stableSince, now, DEFAULT_GAME_CONFIG.stableDurationMs);
  const countdown = countdownStart
    ? getCountdownRemaining(countdownStart, now, DEFAULT_GAME_CONFIG.countdownSeconds)
    : undefined;

  useEffect(() => {
    const previous = previousFingerIds.current;
    const sameSet = activeFingerIds.join(",") === previous.join(",");

    if (activeFingerIds.length === 0) {
      setState("camera_ready");
      setStableSince(null);
      setCountdownStart(null);
      previousFingerIds.current = [];
      return;
    }

    if (!sameSet) {
      setStableSince(Date.now());
    }

    const nextState = getNextGameState(state, {
      activeFingerIds,
      previousFingerIds: previous,
      isStable,
      countdownFinished: countdown === 0 && countdownStart !== null
    });

    if (nextState !== state) {
      setState(nextState);
      if (nextState === "countdown") {
        setCountdownStart(Date.now());
      }
      if (nextState === "arming") {
        setCountdownStart(null);
      }
      if (nextState === "drawing") {
        const winnerFingerIds = pickUniqueRandomItems(activeFingerIds, Math.min(winnerCount, activeFingerIds.length));
        setResult({
          winnerFingerIds,
          capturedAt: Date.now()
        });
        setState("result");
      }
    }

    previousFingerIds.current = activeFingerIds;
  }, [activeFingerIds, countdown, countdownStart, isStable, state, winnerCount]);

  function reset() {
    setStableSince(null);
    setCountdownStart(null);
    setResult(null);
    previousFingerIds.current = [];
    setState("camera_ready");
  }

  return { state, countdown, result, reset };
}
