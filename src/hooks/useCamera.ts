import { useCallback, useEffect, useState } from "react";
import { requestCameraStream, stopCameraStream } from "../lib/camera";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      const next = await requestCameraStream();
      setStream(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "카메라를 시작할 수 없습니다.");
    }
  }, []);

  const stop = useCallback(() => {
    stopCameraStream(stream);
    setStream(null);
  }, [stream]);

  useEffect(() => stop, [stop]);

  return { stream, error, start, stop };
}
