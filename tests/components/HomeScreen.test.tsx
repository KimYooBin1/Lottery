import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HomeScreen } from "../../src/components/home/HomeScreen";

describe("HomeScreen", () => {
  it("triggers start and allows winner count updates", async () => {
    const user = userEvent.setup();
    const onWinnerCountChange = vi.fn();
    const onStart = vi.fn();

    render(
      <HomeScreen
        winnerCount={1}
        onWinnerCountChange={onWinnerCountChange}
        onStart={onStart}
      />
    );

    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: /시작하기/i }));

    expect(onWinnerCountChange).toHaveBeenCalled();
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
