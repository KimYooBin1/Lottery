export async function requestCameraStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  });
}

export async function attachStreamToVideo(
  video: HTMLVideoElement,
  stream: MediaStream
): Promise<void> {
  if (video.srcObject !== stream) {
    video.srcObject = stream;
  }

  try {
    await video.play();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    throw error;
  }
}

export function stopCameraStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
