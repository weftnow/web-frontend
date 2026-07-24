import { describe, expect, test } from "bun:test";
import {
  ANALYZING_MS,
  canAdvance,
  getSelected,
  isSelected,
  nextQuizState,
  prevQuizState,
  progressDots,
  toggleOption,
} from "./compatibility";

describe("toggleOption", () => {
  test("single select replaces the prior choice", () => {
    const a = toggleOption({}, "q1", "a", "single");
    expect(getSelected(a, "q1")).toEqual(["a"]);
    const b = toggleOption(a, "q1", "b", "single");
    expect(getSelected(b, "q1")).toEqual(["b"]);
  });

  test("single select toggling the same option clears it", () => {
    const a = toggleOption({}, "q1", "a", "single");
    const b = toggleOption(a, "q1", "a", "single");
    expect(getSelected(b, "q1")).toEqual([]);
  });

  test("multi select accumulates and toggles off", () => {
    let a = toggleOption({}, "q2", "x", "multi");
    a = toggleOption(a, "q2", "y", "multi");
    expect(getSelected(a, "q2").sort()).toEqual(["x", "y"]);
    a = toggleOption(a, "q2", "x", "multi");
    expect(getSelected(a, "q2")).toEqual(["y"]);
  });

  test("does not mutate the input object", () => {
    const input = {};
    toggleOption(input, "q1", "a", "single");
    expect(input).toEqual({});
  });
});

describe("canAdvance / isSelected", () => {
  test("requires at least one selection", () => {
    expect(canAdvance({}, "q1")).toBe(false);
    expect(canAdvance({ q1: ["a"] }, "q1")).toBe(true);
  });
  test("isSelected reflects membership", () => {
    expect(isSelected({ q1: ["a"] }, "q1", "a")).toBe(true);
    expect(isSelected({ q1: ["a"] }, "q1", "b")).toBe(false);
  });
});

describe("quiz navigation", () => {
  test("advancing a middle question moves to the next index", () => {
    expect(nextQuizState(0, 3)).toEqual({ phase: "quiz", activeIndex: 1 });
  });
  test("advancing the last question enters analyzing", () => {
    expect(nextQuizState(2, 3)).toEqual({ phase: "analyzing", activeIndex: 2 });
  });
  test("going back from a middle question decrements", () => {
    expect(prevQuizState(2)).toEqual({ phase: "quiz", activeIndex: 1 });
  });
  test("going back from the first question returns to intro", () => {
    expect(prevQuizState(0)).toEqual({ phase: "intro", activeIndex: 0 });
  });
});

describe("progressDots", () => {
  test("marks completed and current segments", () => {
    expect(progressDots(0, 3)).toEqual([true, false, false]);
    expect(progressDots(2, 3)).toEqual([true, true, true]);
  });
});

test("analyzing duration is a positive constant", () => {
  expect(ANALYZING_MS).toBeGreaterThan(0);
});
