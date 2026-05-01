import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { CameraScreen } from "../../src/components/camera/CameraScreen";

describe("CameraScreen", () => {
  it("shows countdown over the camera stage", () => {
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => ({
        clearRect: vi.fn(),
        strokeRect: vi.fn()
      }))
    });

    const videoRef = createRef<HTMLVideoElement>();

    render(
      <CameraScreen
        videoRef={videoRef}
        stream={{} as MediaStream}
        trackedFingers={[]}
        activeFingers={[]}
        winnerCount={1}
        message="잠시 그대로 유지해 주세요"
        countdown={3}
        onExit={() => {}}
      />
    );

    const countdown = screen.getByText("3");
    expect(countdown).toHaveClass("camera-countdown");
    expect(countdown.closest(".camera-stage")).not.toBeNull();
  });
});
