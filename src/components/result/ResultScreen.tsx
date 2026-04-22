type Props = {
  winnerFingerIds: string[];
  onRestart: () => void;
  onDownload: () => void;
  onShare: () => void;
  onExit?: () => void;
  shareSupported: boolean;
};

export function ResultScreen({
  winnerFingerIds,
  onRestart,
  onDownload,
  onShare,
  onExit,
  shareSupported
}: Props) {
  return (
    <section className="panel result-screen">
      <h2>당첨!</h2>
      <p>당첨 손가락 수: {winnerFingerIds.length}</p>
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
