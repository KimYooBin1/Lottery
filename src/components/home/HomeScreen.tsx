type Props = {
  winnerCount: number;
  isStarting?: boolean;
  onWinnerCountChange: (value: number) => void;
  onStart: () => void;
};

export function HomeScreen({ winnerCount, isStarting = false, onWinnerCountChange, onStart }: Props) {
  return (
    <section className="panel home-screen">
      <p className="eyebrow">WEBCAM DRAWING TOOL</p>
      <h1>DRAW</h1>
      <p>프레임 안의 검지를 기준으로 참여자를 인식하고 순서를 정하지 않은 추첨을 실행합니다.</p>
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
        {isStarting ? "카메라 준비 중" : "실행"}
      </button>
    </section>
  );
}
