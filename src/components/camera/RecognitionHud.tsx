type Props = {
  activeCount: number;
  winnerCount: number;
  message: string;
};

export function RecognitionHud({ activeCount, winnerCount, message }: Props) {
  return (
    <div className="panel recognition-hud">
      <div className="recognition-meta">
        <span>인식된 검지 {activeCount}</span>
        <span>당첨 인원 {winnerCount}</span>
      </div>
      <p>{message}</p>
    </div>
  );
}
