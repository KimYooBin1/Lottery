import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HomeScreen } from "./components/home/HomeScreen";
import { CameraPermissionScreen } from "./components/home/CameraPermissionScreen";
import { CameraScreen } from "./components/camera/CameraScreen";
import { ResultScreen } from "./components/result/ResultScreen";
import { DEFAULT_GAME_CONFIG } from "./config/gameConfig";
import { useCamera } from "./hooks/useCamera";
import { useHandTracking } from "./hooks/useHandTracking";
import { useGameEngine } from "./hooks/useGameEngine";
import { downloadBlob, shareBlob, supportsFileShare } from "./lib/share";
import { captureResultImage } from "./features/capture/resultCapture";
import type { TrackedFinger } from "./types/game";

export default function App() {
  const [winnerCount, setWinnerCount] = useState(DEFAULT_GAME_CONFIG.winnerCount);
  const [isPreparingCamera, setIsPreparingCamera] = useState(false);
  const [resultImageBlob, setResultImageBlob] = useState<Blob | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultWinnerFingers, setResultWinnerFingers] = useState<TrackedFinger[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, isStarting, permissionHint, start, stop } = useCamera();
  const { tracked, activeFingers, statusMessage } = useHandTracking(videoRef, stream);
  const shareSupported = useMemo(() => supportsFileShare(), []);
  const showPermissionScreen = !stream && isPreparingCamera;

  const clearResultPreview = useCallback(() => {
    setResultImageBlob(null);
    setResultWinnerFingers([]);
    setResultImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return null;
    });
  }, []);

  const handleDrawResult = useCallback(
    (winnerFingerIds: string[], winnerFingers: TrackedFinger[]) => {
      const video = videoRef.current;
      setResultWinnerFingers(winnerFingers);
      if (!video) return;

      void captureResultImage(video, tracked, winnerFingerIds, winnerCount).then((blob) => {
        const nextUrl = URL.createObjectURL(blob);
        setResultImageBlob(blob);
        setResultImageUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }
          return nextUrl;
        });
      });
    },
    [tracked, winnerCount]
  );

  const { state, countdown, result, reset } = useGameEngine(activeFingers, winnerCount, handleDrawResult);

  useEffect(() => clearResultPreview, [clearResultPreview]);

  useEffect(() => {
    if (stream) {
      setIsPreparingCamera(false);
    }
  }, [stream]);

  async function handleDownload() {
    if (!result) return;
    if (resultImageBlob) {
      downloadBlob(resultImageBlob, `finger-lottery-result-${Date.now()}.png`);
    }
  }

  async function handleShare() {
    if (!result) return;
    if (resultImageBlob) {
      await shareBlob(resultImageBlob, `finger-lottery-result-${Date.now()}.png`);
    }
  }

  function handleRestart() {
    clearResultPreview();
    reset();
  }

  function handleExit() {
    stop();
    clearResultPreview();
    reset();
    setIsPreparingCamera(false);
  }

  function handleStart() {
    setIsPreparingCamera(true);
    void start();
  }

  function handleRetryCamera() {
    void start();
  }

  function handleBackHome() {
    stop();
    clearResultPreview();
    reset();
    setIsPreparingCamera(false);
  }

  return (
    <div className="app-shell">
      {showPermissionScreen ? (
        <CameraPermissionScreen
          isStarting={isStarting}
          permissionHint={permissionHint}
          error={error}
          onRetry={handleRetryCamera}
          onBack={handleBackHome}
        />
      ) : !stream ? (
        <HomeScreen
          winnerCount={winnerCount}
          isStarting={isStarting}
          onWinnerCountChange={setWinnerCount}
          onStart={handleStart}
        />
      ) : result ? (
        <ResultScreen
          winnerFingerIds={result.winnerFingerIds}
          winnerFingers={resultWinnerFingers}
          resultImageUrl={resultImageUrl}
          onRestart={handleRestart}
          onDownload={handleDownload}
          onShare={handleShare}
          onExit={handleExit}
          shareSupported={shareSupported}
        />
      ) : (
        <CameraScreen
          videoRef={videoRef}
          stream={stream}
          trackedFingers={tracked}
          activeFingers={activeFingers}
          winnerCount={winnerCount}
          countdown={state === "countdown" ? countdown : undefined}
          message={statusMessage}
          onExit={handleExit}
        />
      )}
      {!showPermissionScreen && isStarting ? <p className="app-info">카메라 권한을 확인하고 있습니다...</p> : null}
      {!showPermissionScreen && permissionHint ? <p className="app-info">{permissionHint}</p> : null}
      {!showPermissionScreen && error ? <p className="app-error">{error}</p> : null}
    </div>
  );
}
