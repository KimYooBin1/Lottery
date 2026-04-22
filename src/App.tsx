import { useMemo, useRef, useState } from "react";
import { HomeScreen } from "./components/home/HomeScreen";
import { CameraScreen } from "./components/camera/CameraScreen";
import { ResultScreen } from "./components/result/ResultScreen";
import { DEFAULT_GAME_CONFIG } from "./config/gameConfig";
import { useCamera } from "./hooks/useCamera";
import { useHandTracking } from "./hooks/useHandTracking";
import { useGameEngine } from "./hooks/useGameEngine";
import { downloadBlob, shareBlob, supportsFileShare } from "./lib/share";
import { captureResultImage } from "./features/capture/resultCapture";

export default function App() {
  const [winnerCount, setWinnerCount] = useState(DEFAULT_GAME_CONFIG.winnerCount);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, error, start, stop } = useCamera();
  const { tracked, activeFingers, statusMessage } = useHandTracking(videoRef, stream);
  const { state, countdown, result, reset } = useGameEngine(activeFingers, winnerCount);
  const shareSupported = useMemo(() => supportsFileShare(), []);

  async function handleDownload() {
    if (!videoRef.current || !result) return;
    const blob = await captureResultImage(videoRef.current, tracked, result.winnerFingerIds, winnerCount);
    downloadBlob(blob, `finger-lottery-result-${Date.now()}.png`);
  }

  async function handleShare() {
    if (!videoRef.current || !result) return;
    const blob = await captureResultImage(videoRef.current, tracked, result.winnerFingerIds, winnerCount);
    await shareBlob(blob, `finger-lottery-result-${Date.now()}.png`);
  }

  function handleRestart() {
    reset();
  }

  function handleExit() {
    stop();
    reset();
  }

  return (
    <div className="app-shell">
      {!stream ? (
        <HomeScreen winnerCount={winnerCount} onWinnerCountChange={setWinnerCount} onStart={start} />
      ) : result ? (
        <ResultScreen
          winnerFingerIds={result.winnerFingerIds}
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
      {error ? <p className="app-error">{error}</p> : null}
    </div>
  );
}
