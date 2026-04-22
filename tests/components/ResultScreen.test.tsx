import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultScreen } from "../../src/components/result/ResultScreen";

describe("ResultScreen", () => {
  it("renders winner fingers, result image, and actions", () => {
    render(
      <ResultScreen
        winnerFingerIds={["f1"]}
        winnerFingers={[
          {
            fingerId: "f1",
            handTrackId: "Right-0",
            fingerType: "index",
            x: 0.5,
            y: 0.4,
            confidence: 0.9,
            stableFrames: 3,
            missingFrames: 0,
            status: "active"
          }
        ]}
        resultImageUrl="blob:result-preview"
        onRestart={() => {}}
        onDownload={() => {}}
        onShare={() => {}}
        shareSupported={true}
      />
    );

    expect(screen.getByRole("img", { name: /당첨 결과 사진/i })).toHaveAttribute("src", "blob:result-preview");
    expect(screen.getByText(/1번 손가락/i)).toBeInTheDocument();
    expect(screen.getByText(/검지/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다시하기/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다운로드/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /공유/i })).toBeInTheDocument();
  });
});
