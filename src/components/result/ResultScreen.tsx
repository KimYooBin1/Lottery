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
      <h2>당첨!</h2>
      <p>노란색으로 표시된 검지가 당첨입니다.</p>
      {resultImageUrl ? (
        <figure className="result-preview">
          <img src={resultImageUrl} alt="당첨 결과 사진" />
          <figcaption>당첨 검지가 원형 테두리와 번호로 표시됩니다.</figcaption>
        </figure>
      ) : (
        <div className="result-preview-placeholder">결과 사진을 만드는 중입니다...</div>
      )}
      <ol className="winner-list" aria-label="당첨 검지 목록">
        {winnerFingers.map((finger, index) => (
          <li key={finger.fingerId}>
            <strong>{index + 1}번 검지</strong>
            <span>{getFingerTypeLabel(finger.fingerType)}</span>
          </li>
        ))}
        {winnerFingers.length === 0
          ? winnerFingerIds.map((fingerId, index) => (
              <li key={fingerId}>
                <strong>{index + 1}번 검지</strong>
                <span>식별 정보 없음</span>
              </li>
            ))
          : null}
      </ol>
      <div className="result-actions">
        <button type="button" className="secondary-button" onClick={onRestart}>
        다시하기
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
    index: "검지",
    middle: "중지",
    ring: "약지",
    pinky: "새끼"
  };
  return labels[fingerType];
}
