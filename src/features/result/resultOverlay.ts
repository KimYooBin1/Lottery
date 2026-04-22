import type { TrackedFinger } from "../../types/game";

export function drawResultOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fingers: TrackedFinger[],
  winnerFingerIds: string[],
  winnerCount: number
) {
  ctx.fillStyle = "rgba(14, 7, 24, 0.26)";
  ctx.fillRect(0, 0, width, height);

  let winnerIndex = 0;

  fingers.forEach((finger) => {
    const isWinner = winnerFingerIds.includes(finger.fingerId);
    const x = finger.x * width;
    const y = finger.y * height;
    ctx.beginPath();
    ctx.arc(x, y, isWinner ? 34 : 20, 0, Math.PI * 2);
    ctx.strokeStyle = isWinner ? "#ffe95b" : "rgba(255,255,255,0.5)";
    ctx.lineWidth = isWinner ? 8 : 4;
    ctx.stroke();

    if (isWinner) {
      winnerIndex += 1;
      ctx.fillStyle = "#ffe95b";
      ctx.beginPath();
      ctx.arc(x + 38, y - 38, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#12091f";
      ctx.font = "700 28px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(winnerIndex), x + 38, y - 38);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  });

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 56px sans-serif";
  ctx.fillText("당첨!", 48, 84);
  ctx.font = "400 28px sans-serif";
  ctx.fillText(`당첨 인원 ${winnerCount}명`, 48, 126);
}
