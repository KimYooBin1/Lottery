type Props = {
  activeCount: number;
  winnerCount: number;
  message: string;
};

export function RecognitionHud({ activeCount, winnerCount, message }: Props) {
  return (
    <div className="panel recognition-hud">
      <div className="recognition-meta">
        <span>ENTRIES {activeCount}</span>
        <span>SELECT {winnerCount}</span>
      </div>
      <p>{message}</p>
    </div>
  );
}
