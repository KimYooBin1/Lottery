import type { RefObject } from "react";
import type { TrackedFinger } from "../../types/game";
import { CameraCanvas } from "./CameraCanvas";
import { RecognitionHud } from "./RecognitionHud";

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  stream: MediaStream;
  trackedFingers: TrackedFinger[];
  activeFingers: TrackedFinger[];
  winnerCount: number;
  message: string;
  countdown?: number;
  onExit: () => void;
};

export function CameraScreen({
  videoRef,
  stream,
  trackedFingers,
  activeFingers,
  winnerCount,
  message,
  countdown,
  onExit
}: Props) {
  return (
    <section className="camera-layout">
      <div className="camera-header">
        <h2>이번엔 누가 쏠까?</h2>
        <button type="button" onClick={onExit}>
          종료
        </button>
      </div>
      <CameraCanvas videoRef={videoRef} trackedFingers={trackedFingers} />
      <RecognitionHud
        activeCount={activeFingers.length}
        winnerCount={winnerCount}
        message={message}
        countdown={countdown}
      />
    </section>
  );
}
