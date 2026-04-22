type Props = {
  isStarting: boolean;
  permissionHint: string | null;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
};

export function CameraPermissionScreen({
  isStarting,
  permissionHint,
  error,
  onRetry,
  onBack
}: Props) {
  const message = error ?? permissionHint ?? "카메라 권한을 확인하고 있습니다...";

  return (
    <section className="panel permission-screen">
      <p className="eyebrow">웹캠 연결</p>
      <h1>카메라 연결 준비</h1>
      <p>
        브라우저가 카메라 접근 권한을 확인하는 중입니다. 팝업이 보이지 않으면 주소창의 카메라 아이콘을
        눌러 허용해 주세요.
      </p>
      <div className="permission-status">
        <strong>{isStarting ? "카메라 권한을 확인하고 있습니다..." : "카메라 연결을 다시 확인해 주세요."}</strong>
        <p>{message}</p>
      </div>
      <div className="result-actions">
        <button type="button" className="primary-button" onClick={onRetry} disabled={isStarting}>
          {isStarting ? "카메라 요청 중..." : "다시 요청"}
        </button>
        <button type="button" className="ghost-button" onClick={onBack}>
          처음으로
        </button>
      </div>
    </section>
  );
}
