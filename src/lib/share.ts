export function supportsFileShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function shareBlob(blob: Blob, fileName: string) {
  const file = new File([blob], fileName, { type: "image/png" });
  if (!navigator.canShare?.({ files: [file] })) {
    throw new Error("이 브라우저에서는 파일 공유를 지원하지 않습니다.");
  }
  await navigator.share({
    title: "손가락 뽑기 결과",
    files: [file]
  });
}
