import { describe, expect, it, vi } from "vitest";
import { attachStreamToVideo } from "../../src/lib/camera";

describe("attachStreamToVideo", () => {
  it("ignores AbortError raised by an interrupted play request", async () => {
    const stream = {} as MediaStream;
    const video = document.createElement("video");
    const play = vi.fn().mockRejectedValue(new DOMException("interrupted", "AbortError"));
    Object.defineProperty(video, "play", {
      value: play,
      configurable: true
    });

    await expect(attachStreamToVideo(video, stream)).resolves.toBeUndefined();
    expect(video.srcObject).toBe(stream);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("rethrows non-AbortError failures from play", async () => {
    const stream = {} as MediaStream;
    const video = document.createElement("video");
    const play = vi.fn().mockRejectedValue(new Error("permission denied"));
    Object.defineProperty(video, "play", {
      value: play,
      configurable: true
    });

    await expect(attachStreamToVideo(video, stream)).rejects.toThrow("permission denied");
  });
});
