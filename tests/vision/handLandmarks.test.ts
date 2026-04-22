import { describe, expect, it } from "vitest";
import { resolveHandsConstructor } from "../../src/vision/handLandmarks";

describe("resolveHandsConstructor", () => {
  it("returns direct Hands export when available", () => {
    const Hands = class {};
    expect(resolveHandsConstructor({ Hands })).toBe(Hands);
  });

  it("returns Hands from default wrapper export", () => {
    const Hands = class {};
    expect(resolveHandsConstructor({ default: { Hands } })).toBe(Hands);
  });

  it("returns Hands from module.exports wrapper export", () => {
    const Hands = class {};
    expect(resolveHandsConstructor({ "module.exports": { Hands } })).toBe(Hands);
  });
});
