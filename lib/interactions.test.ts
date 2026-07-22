import { describe, expect, test } from "bun:test";
import {
  getNextOpenIndex,
  getPortraitTransforms,
  PORTRAIT_SPREAD_TRANSFORMS,
  PORTRAIT_STACKED_TRANSFORMS,
} from "./interactions";

describe("portrait stack transforms", () => {
  test("matches the measured Zolo resting geometry", () => {
    expect(PORTRAIT_STACKED_TRANSFORMS).toEqual([
      "translate3d(90px, 20px, 0) rotate(-15deg)",
      "translate3d(0, 0, 0) rotate(0deg)",
      "translate3d(-90px, 20px, 0) rotate(15deg)",
    ]);
  });

  test("spreads every portrait for hover, tap, or reduced motion", () => {
    expect(getPortraitTransforms(true, false)).toEqual(
      PORTRAIT_SPREAD_TRANSFORMS,
    );
    expect(getPortraitTransforms(false, true)).toEqual(
      PORTRAIT_SPREAD_TRANSFORMS,
    );
  });

  test("keeps the measured stack when inactive", () => {
    expect(getPortraitTransforms(false, false)).toEqual(
      PORTRAIT_STACKED_TRANSFORMS,
    );
  });
});

describe("one-open disclosure state", () => {
  test("opens a different row", () => {
    expect(getNextOpenIndex(0, 2)).toBe(2);
  });

  test("closes the active row", () => {
    expect(getNextOpenIndex(2, 2)).toBeNull();
  });
});
