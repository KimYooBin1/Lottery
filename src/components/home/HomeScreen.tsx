type Props = {
  winnerCount: number;
  isStarting?: boolean;
  onWinnerCountChange: (value: number) => void;
  onStart: () => void;
};

export function HomeScreen({ winnerCount, isStarting = false, onWinnerCountChange, onStart }: Props) {
  return (
    <section className="panel home-screen">
      <p className="eyebrow">웹캠 랜덤 게임</p>
      <h1>손가락 뽑기 게임</h1>
      <p>웹캠으로 손가락을 인식해 오늘의 당첨자를 뽑습니다.</p>
      <div className="stepper">
        <button
          type="button"
          aria-label="-"
          disabled={isStarting}
          onClick={() => onWinnerCountChange(Math.max(1, winnerCount - 1))}
        >
          -
        </button>
        <span className="stepper-value">{winnerCount}</span>
        <button type="button" aria-label="+" disabled={isStarting} onClick={() => onWinnerCountChange(winnerCount + 1)}>
          +
        </button>
      </div>
      <button type="button" className="primary-button" onClick={onStart} disabled={isStarting}>
        {isStarting ? "카메라 준비 중..." : "시작하기"}
      </button>
    </section>
  );
}
