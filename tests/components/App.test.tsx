import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";

vi.mock("../../src/vision/handLandmarks", () => ({
  createHandsDetector: () => ({
    send: vi.fn().mockResolvedValue(undefined),
    close: vi.fn()
  })
}));

describe("App start flow", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows camera request feedback immediately after clicking start", async () => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined)
    });

    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => ({
        clearRect: vi.fn(),
        strokeRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        stroke: vi.fn()
      }))
    });

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(
          () =>
            new Promise<MediaStream>((resolve) => {
              setTimeout(() => resolve({ getTracks: () => [] } as unknown as MediaStream), 50);
            })
        )
      }
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /시작하기/i }));

    expect(screen.getByText(/카메라 권한을 확인하고 있습니다/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/손가락을 화면 안에 넣어 주세요/i)).toBeInTheDocument();
    });
  });

  it("shows permission guidance when the camera request stays pending", async () => {
    vi.useFakeTimers();

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn(() => new Promise<MediaStream>(() => undefined))
      }
    });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /시작하기/i }));

    expect(screen.getByRole("button", { name: /카메라 준비 중/i })).toBeDisabled();
    expect(screen.getByText(/카메라 권한을 확인하고 있습니다/i)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/주소창의 카메라 아이콘을 눌러 접근을 허용/i)).toBeInTheDocument();
  });
});
