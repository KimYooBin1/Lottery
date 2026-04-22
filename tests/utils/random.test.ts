import { describe, expect, it, vi } from "vitest";
import { pickUniqueRandomItems } from "../../src/utils/random";

describe("pickUniqueRandomItems", () => {
  it("returns unique items up to requested count", () => {
    const mock = vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((arr) => {
      const buffer = arr as Uint32Array;
      buffer[0] = 1;
      return arr;
    });

    const result = pickUniqueRandomItems(["a", "b", "c", "d"], 2);
    expect(result).toHaveLength(2);
    expect(new Set(result).size).toBe(2);
    mock.mockRestore();
  });

  it("returns all items when count exceeds size", () => {
    expect(pickUniqueRandomItems(["a", "b"], 3).sort()).toEqual(["a", "b"]);
  });
});
