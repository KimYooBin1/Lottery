import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultScreen } from "../../src/components/result/ResultScreen";

describe("ResultScreen", () => {
  it("renders result actions", () => {
    render(
      <ResultScreen
        winnerFingerIds={["f1"]}
        onRestart={() => {}}
        onDownload={() => {}}
        onShare={() => {}}
        shareSupported={true}
      />
    );

    expect(screen.getByRole("button", { name: /다시하기/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /다운로드/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /공유/i })).toBeInTheDocument();
  });
});
