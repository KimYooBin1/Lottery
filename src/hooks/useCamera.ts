import { useCallback, useEffect, useRef, useState } from "react";
import { requestCameraStream, stopCameraStream } from "../lib/camera";

const ADDRESS_BAR_PERMISSION_HINT_DELAY_MS = 2000;

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [permissionHint, setPermissionHint] = useState<string | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearPermissionHintTimer = useCallback(() => {
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    setPermissionHint("카메라 권한 요청을 확인해 주세요.");
    clearPermissionHintTimer();
    hintTimerRef.current = window.setTimeout(() => {
      setPermissionHint("주소창의 카메라 아이콘을 눌러 접근을 허용해 주세요.");
    }, ADDRESS_BAR_PERMISSION_HINT_DELAY_MS);

    try {
      const next = await requestCameraStream();
      streamRef.current = next;
      setStream(next);
      setError(null);
      setPermissionHint(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "카메라를 시작할 수 없습니다.");
      setPermissionHint(null);
    } finally {
      clearPermissionHintTimer();
      setIsStarting(false);
    }
  }, [clearPermissionHintTimer]);

  const stop = useCallback(() => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    setStream(null);
    setPermissionHint(null);
    clearPermissionHintTimer();
  }, [clearPermissionHintTimer]);

  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current);
      clearPermissionHintTimer();
    };
  }, [clearPermissionHintTimer]);

  return { stream, error, isStarting, permissionHint, start, stop };
}
