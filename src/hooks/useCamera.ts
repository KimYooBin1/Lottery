import { useCallback, useEffect, useState } from "react";
import { requestCameraStream, stopCameraStream } from "../lib/camera";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const start = useCallback(async () => {
    setIsStarting(true);
    try {
      const next = await requestCameraStream();
      setStream(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "카메라를 시작할 수 없습니다.");
    } finally {
      setIsStarting(false);
    }
  }, []);

  const stop = useCallback(() => {
    stopCameraStream(stream);
    setStream(null);
  }, [stream]);

  useEffect(() => stop, [stop]);

  return { stream, error, isStarting, start, stop };
}
