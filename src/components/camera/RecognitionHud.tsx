type Props = {
  activeCount: number;
  winnerCount: number;
  message: string;
  countdown?: number;
};

export function RecognitionHud({ activeCount, winnerCount, message, countdown }: Props) {
  return (
    <div className="panel recognition-hud">
      <div className="recognition-meta">
        <span>인식된 검지 {activeCount}</span>
        <span>당첨 인원 {winnerCount}</span>
      </div>
      <p>{message}</p>
      {countdown !== undefined ? <strong className="countdown-value">{countdown}</strong> : null}
    </div>
  );
}
