import type { TrackedFinger } from "../../types/game";

type Props = {
  winnerFingerIds: string[];
  winnerFingers: TrackedFinger[];
  resultImageUrl: string | null;
  onRestart: () => void;
  onDownload: () => void;
  onShare: () => void;
  onExit?: () => void;
  shareSupported: boolean;
};

export function ResultScreen({
  winnerFingerIds,
  winnerFingers,
  resultImageUrl,
  onRestart,
  onDownload,
  onShare,
  onExit,
  shareSupported
}: Props) {
  return (
    <section className="panel result-screen">
      <p className="eyebrow">RESULT</p>
      <h2>SELECTED</h2>
      <p>흰색 마커로 표시된 항목이 선택되었습니다.</p>
      {resultImageUrl ? (
        <figure className="result-preview">
          <img src={resultImageUrl} alt="DRAW 결과 이미지" />
          <figcaption>선택된 항목은 번호가 있는 원형 마커로 표시됩니다.</figcaption>
        </figure>
      ) : (
        <div className="result-preview-placeholder">결과 이미지를 생성하는 중입니다.</div>
      )}
      <ol className="winner-list" aria-label="선택 항목 목록">
        {winnerFingers.map((finger, index) => (
          <li key={finger.fingerId}>
            <strong>{formatSelectionLabel(index)}</strong>
            <span>{getFingerTypeLabel(finger.fingerType)}</span>
          </li>
        ))}
        {winnerFingers.length === 0
          ? winnerFingerIds.map((fingerId, index) => (
              <li key={fingerId}>
                <strong>{formatSelectionLabel(index)}</strong>
                <span>식별 정보 없음</span>
              </li>
            ))
          : null}
      </ol>
      <div className="result-actions">
        <button type="button" className="secondary-button" onClick={onRestart}>
          다시 실행
        </button>
        <button type="button" className="secondary-button" onClick={onDownload}>
        다운로드
        </button>
        {shareSupported ? (
          <button type="button" className="primary-button" onClick={onShare}>
          공유
          </button>
        ) : null}
        {onExit ? (
          <button type="button" className="ghost-button" onClick={onExit}>
            종료
          </button>
        ) : null}
      </div>
    </section>
  );
}

function getFingerTypeLabel(fingerType: TrackedFinger["fingerType"]) {
  const labels: Record<TrackedFinger["fingerType"], string> = {
    thumb: "엄지",
    index: "INDEX",
    middle: "중지",
    ring: "약지",
    pinky: "새끼"
  };
  return labels[fingerType];
}

function formatSelectionLabel(index: number) {
  return `SELECT ${String(index + 1).padStart(2, "0")}`;
}
