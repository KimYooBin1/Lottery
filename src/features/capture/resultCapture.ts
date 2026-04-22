import type { TrackedFinger } from "../../types/game";
import { createOffscreenCanvas } from "../../utils/canvas";
import { drawResultOverlay } from "../result/resultOverlay";

export async function captureResultImage(
  video: HTMLVideoElement,
  fingers: TrackedFinger[],
  winnerFingerIds: string[],
  winnerCount: number
) {
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;
  const canvas = createOffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("캔버스 컨텍스트를 가져올 수 없습니다.");
  }

  ctx.drawImage(video, 0, 0, width, height);
  drawResultOverlay(ctx, width, height, fingers, winnerFingerIds, winnerCount);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("이미지 생성에 실패했습니다."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}
