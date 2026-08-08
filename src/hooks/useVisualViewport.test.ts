import { describe, expect, it } from "vitest";
import { getKeyboardInset } from "./useVisualViewport";

describe("getKeyboardInset", () => {
  it("detects an overlay keyboard while an input is focused", () => {
    expect(
      getKeyboardInset({
        baselineHeight: 812,
        hasFocusedInput: true,
        offsetTop: 0,
        visualHeight: 500,
      })
    ).toBe(312);
  });

  it("ignores small browser chrome changes", () => {
    expect(
      getKeyboardInset({
        baselineHeight: 812,
        hasFocusedInput: true,
        offsetTop: 0,
        visualHeight: 744,
      })
    ).toBe(0);
  });

  it("does not report a keyboard without a focused input", () => {
    expect(
      getKeyboardInset({
        baselineHeight: 812,
        hasFocusedInput: false,
        offsetTop: 0,
        visualHeight: 500,
      })
    ).toBe(0);
  });
});
