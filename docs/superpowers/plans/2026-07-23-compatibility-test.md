# Compatibility Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an immersive `/compatibility-test` quiz page — 3 one-per-screen questions, a creative loader, and a shareable networking-archetype result card, all on mock data.

**Architecture:** A single client component `CompatibilityTest` owns a `intro → quiz → analyzing → result` state machine. All decision logic (answer toggling, advance-gating, phase transitions, share code) is extracted into pure functions in `lib/compatibility.ts` and unit-tested with bun; the component and content are asserted via `renderToStaticMarkup` static-markup tests, matching the repo convention. The existing `WeaveLoader` powers the analyzing phase.

**Tech Stack:** Next.js 16 (App Router), React 19, `motion` (motion/react), Tailwind v4, bun test.

## Global Constraints

- Test runner: `bun test`. Tests use `bun:test` + `renderToStaticMarkup` for components; pure logic tested directly. No DOM testing library is available — do NOT introduce one.
- Palette tokens only: `ember #F4511E`, `ink #121212`, `paper #f4f4f5`, `bone #F7F5F2`, `signal #0090DE`, `ash #B4B0AA`. Fonts: Comfortaa (display) / Geist Mono (`font-meta`, mono).
- Every animation honors `useReducedMotion`; every new CSS block has a `@media (prefers-reduced-motion: reduce)` fallback.
- Data authored in `content.ts` under a new `compatibilityTest` key. Exactly 3 questions, one canned result. No real backend/scoring/persistence.
- Focus-visible outlines use `--color-signal`, matching site convention.
- This is Next.js 16 — before writing page/metadata code, consult `node_modules/next/dist/docs/` if any App Router API is uncertain.

---

### Task 1: Content data + types

**Files:**
- Modify: `content.ts` (add `compatibilityTest` block to the `content` object)
- Test: `content.test.ts` (add assertions)

**Interfaces:**
- Produces: `content.compatibilityTest` with shape:
  ```ts
  {
    intro: { eyebrow: string; headline: string[]; sub: string; cta: string };
    questions: Array<{
      id: string;
      prompt: string;
      kind: "single" | "multi";
      helper?: string;
      options: Array<{ id: string; label: string; hint?: string }>;
    }>; // length 3
    loaderPhrases: string[];
    result: {
      archetype: string; tagline: string;
      values: string[];
      stats: Array<{ label: string; value: number }>;
      connectionStyle: string;
      matchedWith: string[];
      shareUrl: string;
    };
  }
  ```

- [ ] **Step 1: Write the failing test** — append to `content.test.ts`:

```ts
import { content } from "./content";
// (existing imports/tests remain)

test("compatibility test has exactly three questions", () => {
  expect(content.compatibilityTest.questions).toHaveLength(3);
});

test("compatibility test questions declare valid select kinds", () => {
  for (const q of content.compatibilityTest.questions) {
    expect(["single", "multi"]).toContain(q.kind);
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.id).toBeTruthy();
  }
});

test("compatibility result exposes shareable archetype stats", () => {
  const r = content.compatibilityTest.result;
  expect(r.archetype).toBeTruthy();
  expect(r.values.length).toBeGreaterThan(0);
  expect(r.stats.every((s) => s.value >= 0 && s.value <= 100)).toBe(true);
  expect(r.shareUrl).toContain("weft");
});

test("compatibility loader supplies multiple phrases", () => {
  expect(content.compatibilityTest.loaderPhrases.length).toBeGreaterThan(2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test content.test.ts`
Expected: FAIL — `content.compatibilityTest` is undefined.

- [ ] **Step 3: Write minimal implementation** — add a `compatibilityTest` key inside the `content` object in `content.ts` (place it before the closing of the object). Use on-brand copy:

```ts
  compatibilityTest: {
    intro: {
      eyebrow: "Compatibility Test",
      headline: ["How do you", "really connect?"],
      sub: "Three quick questions. We read the signal between them, then hand you a thread worth sharing.",
      cta: "Begin",
    },
    questions: [
      {
        id: "energy",
        prompt: "A room full of strangers. What pulls you in?",
        kind: "single",
        helper: "Pick the one that fits",
        options: [
          { id: "ideas", label: "A conversation about ideas", hint: "Depth over small talk" },
          { id: "people", label: "The most interesting person", hint: "One real connection" },
          { id: "energy", label: "Wherever the energy is", hint: "You read the room" },
          { id: "quiet", label: "A quieter corner to observe", hint: "Warm up, then engage" },
        ],
      },
      {
        id: "values",
        prompt: "What do you want people to feel after meeting you?",
        kind: "multi",
        helper: "Pick all that apply",
        options: [
          { id: "understood", label: "Understood" },
          { id: "inspired", label: "Inspired" },
          { id: "challenged", label: "Challenged" },
          { id: "at-ease", label: "At ease" },
          { id: "curious", label: "Curious to know more" },
        ],
      },
      {
        id: "follow-up",
        prompt: "You met someone great. What happens next?",
        kind: "single",
        helper: "Pick the one that fits",
        options: [
          { id: "message", label: "A thoughtful message that night", hint: "Strike while it's warm" },
          { id: "coffee", label: "You propose a coffee", hint: "Take it off the clock" },
          { id: "intro", label: "You introduce them to someone", hint: "Connector instinct" },
          { id: "orbit", label: "You keep them in your orbit", hint: "Slow burn" },
        ],
      },
    ],
    loaderPhrases: [
      "Reading the signal between your answers…",
      "Mapping your values…",
      "Finding your connection style…",
      "Weaving your thread…",
    ],
    result: {
      archetype: "The Weaver",
      tagline: "You turn strangers into a network that holds.",
      values: ["Depth", "Curiosity", "Generosity"],
      stats: [
        { label: "Depth", value: 88 },
        { label: "Curiosity", value: 76 },
        { label: "Initiative", value: 64 },
      ],
      connectionStyle: "One real conversation at a time",
      matchedWith: ["Catalysts", "Anchors"],
      shareUrl: "weft.app/c/AB12CD",
    },
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test content.test.ts`
Expected: PASS (all content tests).

- [ ] **Step 5: Commit**

```bash
git add content.ts content.test.ts
git commit -m "feat(compatibility): add quiz content and mock result data"
```

---

### Task 2: Pure quiz logic (`lib/compatibility.ts`)

**Files:**
- Create: `lib/compatibility.ts`
- Test: `lib/compatibility.test.ts`

**Interfaces:**
- Consumes: nothing (pure).
- Produces:
  - `type Phase = "intro" | "quiz" | "analyzing" | "result"`
  - `type Answers = Record<string, string[]>`
  - `toggleOption(answers: Answers, questionId: string, optionId: string, kind: "single" | "multi"): Answers`
  - `canAdvance(answers: Answers, questionId: string): boolean`
  - `getSelected(answers: Answers, questionId: string): string[]`
  - `isSelected(answers: Answers, questionId: string, optionId: string): boolean`
  - `nextQuizState(activeIndex: number, questionCount: number): { phase: Phase; activeIndex: number }`
  - `prevQuizState(activeIndex: number): { phase: Phase; activeIndex: number }`
  - `progressDots(activeIndex: number, questionCount: number): boolean[]`
  - `ANALYZING_MS = 3600`

- [ ] **Step 1: Write the failing test** — create `lib/compatibility.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/compatibility.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation** — create `lib/compatibility.ts`:

```ts
export type Phase = "intro" | "quiz" | "analyzing" | "result";
export type SelectKind = "single" | "multi";
export type Answers = Record<string, string[]>;

export const ANALYZING_MS = 3600;

export function getSelected(answers: Answers, questionId: string): string[] {
  return answers[questionId] ?? [];
}

export function isSelected(answers: Answers, questionId: string, optionId: string): boolean {
  return getSelected(answers, questionId).includes(optionId);
}

export function toggleOption(
  answers: Answers,
  questionId: string,
  optionId: string,
  kind: SelectKind,
): Answers {
  const current = getSelected(answers, questionId);
  let next: string[];
  if (kind === "single") {
    next = current.includes(optionId) ? [] : [optionId];
  } else {
    next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
  }
  return { ...answers, [questionId]: next };
}

export function canAdvance(answers: Answers, questionId: string): boolean {
  return getSelected(answers, questionId).length > 0;
}

export function nextQuizState(activeIndex: number, questionCount: number): {
  phase: Phase;
  activeIndex: number;
} {
  if (activeIndex >= questionCount - 1) {
    return { phase: "analyzing", activeIndex };
  }
  return { phase: "quiz", activeIndex: activeIndex + 1 };
}

export function prevQuizState(activeIndex: number): { phase: Phase; activeIndex: number } {
  if (activeIndex <= 0) {
    return { phase: "intro", activeIndex: 0 };
  }
  return { phase: "quiz", activeIndex: activeIndex - 1 };
}

export function progressDots(activeIndex: number, questionCount: number): boolean[] {
  return Array.from({ length: questionCount }, (_, i) => i <= activeIndex);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/compatibility.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/compatibility.ts lib/compatibility.test.ts
git commit -m "feat(compatibility): add pure quiz state logic"
```

---

### Task 3: CSS for quiz visuals

**Files:**
- Modify: `app/globals.css` (append `.ctest-*` block before the final `@media (prefers-reduced-motion: reduce)` block, and add the new rules into that existing reduced-motion block)

**Interfaces:**
- Produces CSS classes consumed by Task 4/5: `ctest-shell`, `ctest-ambient`, `ctest-ambient--ember`, `ctest-ambient--signal`, `ctest-home`, `ctest-progress`, `ctest-dot`, `ctest-dot--on`, `ctest-eyebrow`, `ctest-prompt`, `ctest-grid`, `ctest-option`, `ctest-option--on`, `ctest-option-check`, `ctest-option-hint`, `ctest-card`, `ctest-chip`, `ctest-meter`, `ctest-meter-fill`, `ctest-share`, `ctest-copied`.

- [ ] **Step 1: Append the style block** to `app/globals.css` (no test — visual/CSS; verified by build + component markup tests in later tasks):

```css
.ctest-shell {
  position: relative;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bone);
  padding: clamp(4.5rem, 9vh, 7rem) 1.5rem clamp(3rem, 6vh, 5rem);
}

.ctest-ambient { position: absolute; border-radius: 999px; filter: blur(90px); pointer-events: none; }
.ctest-ambient--ember { top: 6%; left: -9rem; width: 24rem; height: 24rem; background: rgb(244 81 30 / 9%); }
.ctest-ambient--signal { bottom: 4%; right: -8rem; width: 22rem; height: 22rem; background: rgb(0 144 222 / 8%); }

.ctest-home {
  position: fixed;
  z-index: 20;
  top: 1.25rem;
  left: 1.35rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgb(18 18 18 / 62%);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 160ms ease;
}
.ctest-home:hover { color: var(--color-ink); }
.ctest-home:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-signal) 70%, white); outline-offset: 4px; }

.ctest-progress { display: flex; gap: 0.5rem; margin-bottom: clamp(1.5rem, 4vh, 2.75rem); }
.ctest-dot {
  width: 2.2rem;
  height: 0.32rem;
  border-radius: 999px;
  background: rgb(18 18 18 / 12%);
  transition: background-color 320ms var(--ease-out-ui);
}
.ctest-dot--on { background: var(--color-ember); }

.ctest-eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: color-mix(in srgb, var(--color-ink) 52%, transparent); }

.ctest-prompt {
  max-width: 22ch;
  margin: 0.9rem auto 0;
  font-family: var(--font-display);
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.05em;
  line-height: 1.04;
  text-wrap: balance;
  color: var(--color-ink);
}

.ctest-grid {
  display: grid;
  width: min(640px, 100%);
  margin-top: clamp(1.75rem, 4vh, 2.75rem);
  gap: 0.75rem;
  grid-template-columns: 1fr;
}
@media (min-width: 560px) { .ctest-grid { grid-template-columns: 1fr 1fr; } }

.ctest-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 4.4rem;
  border: 1px solid rgb(18 18 18 / 10%);
  border-radius: 1.4rem;
  background: rgb(255 255 255 / 70%);
  padding: 1rem 2.6rem 1rem 1.15rem;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: transform 160ms var(--ease-out-ui), border-color 180ms ease,
    background-color 200ms ease, box-shadow 200ms ease;
}
.ctest-option:hover { transform: translate3d(0, -2px, 0); box-shadow: var(--shadow-media); }
.ctest-option:active { transform: scale(0.99); }
.ctest-option:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-signal) 70%, white); outline-offset: 3px; }
.ctest-option--on {
  border-color: var(--color-ember);
  background: color-mix(in srgb, var(--color-ember) 10%, white);
  box-shadow: 0 0 0 1px var(--color-ember);
}

.ctest-option span:first-child { font-family: var(--font-display); font-size: 1rem; font-weight: 500; letter-spacing: -0.02em; color: var(--color-ink); }
.ctest-option-hint { font-family: var(--font-mono); font-size: 0.64rem; letter-spacing: 0.04em; color: rgb(18 18 18 / 48%); }

.ctest-option-check {
  position: absolute;
  top: 50%;
  right: 1.05rem;
  display: grid;
  width: 1.4rem;
  height: 1.4rem;
  place-items: center;
  border: 1.5px solid rgb(18 18 18 / 22%);
  border-radius: 999px;
  color: var(--color-paper);
  font-size: 0.7rem;
  translate: 0 -50%;
  scale: 0.6;
  opacity: 0;
  background: var(--color-ember);
  transition: opacity 180ms ease, scale 220ms var(--ease-out-ui), border-color 180ms ease;
}
.ctest-option--on .ctest-option-check { opacity: 1; scale: 1; border-color: var(--color-ember); }

.ctest-card {
  width: min(560px, 100%);
  border: 1px solid rgb(18 18 18 / 8%);
  border-radius: 2rem;
  background: rgb(255 255 255 / 82%);
  padding: clamp(1.75rem, 4vw, 2.75rem);
  box-shadow: var(--shadow-premium);
  backdrop-filter: blur(12px);
}

.ctest-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-ember) 12%, white);
  padding: 0.4rem 0.85rem;
  color: color-mix(in srgb, var(--color-ember) 82%, var(--color-ink));
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ctest-meter { position: relative; height: 0.5rem; border-radius: 999px; background: rgb(18 18 18 / 8%); overflow: hidden; }
.ctest-meter-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-ember), color-mix(in srgb, var(--color-ember) 60%, var(--color-signal)));
}

.ctest-share {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 3rem;
  border-radius: 999px;
  border: 1px solid rgb(18 18 18 / 14%);
  background: var(--color-ink);
  padding: 0 1.4rem;
  color: var(--color-paper);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 140ms var(--ease-out-ui), background-color 180ms ease;
}
.ctest-share:hover { transform: translate3d(0, -1px, 0); }
.ctest-share:active { transform: scale(0.98); }
.ctest-share:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-signal) 70%, white); outline-offset: 3px; }
.ctest-copied { font-family: var(--font-mono); font-size: 0.72rem; color: color-mix(in srgb, var(--color-signal) 80%, var(--color-ink)); }
```

- [ ] **Step 2: Add reduced-motion fallbacks** — inside the EXISTING `@media (prefers-reduced-motion: reduce)` block at the end of `app/globals.css`, add these selectors to the rule that zeroes transitions:

```css
  .ctest-option,
  .ctest-option-check,
  .ctest-dot,
  .ctest-share {
    transition-duration: 0.01ms;
  }
```

- [ ] **Step 3: Verify the app still builds/lints**

Run: `bun run lint`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(compatibility): add quiz and result-card styles"
```

---

### Task 4: `CompatibilityTest` component

**Files:**
- Create: `components/compatibility/CompatibilityTest.tsx`
- Test: `components/compatibility/CompatibilityTest.test.tsx`

**Interfaces:**
- Consumes: `content.compatibilityTest` (Task 1); all exports of `lib/compatibility.ts` (Task 2); `WeaveLoader` from `components/ui/WeaveLoader`; `.ctest-*` CSS (Task 3).
- Produces: `export function CompatibilityTest()` — default-renders the intro phase in SSR.

- [ ] **Step 1: Write the failing test** — create `components/compatibility/CompatibilityTest.test.tsx`:

```tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CompatibilityTest } from "./CompatibilityTest";
import { content } from "@/content";

test("compatibility test renders the intro phase by default", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).toContain(content.compatibilityTest.intro.cta);
  expect(html).toContain("ctest-shell");
});

test("compatibility test exposes a home link back to Weft", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).toContain('href="/"');
  expect(html).toContain("ctest-home");
});

test("compatibility intro does not leak later phases into static markup", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).not.toContain(content.compatibilityTest.result.archetype);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/compatibility/CompatibilityTest.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation** — create `components/compatibility/CompatibilityTest.tsx`. Full component (intro/quiz/analyzing/result phases, single & multi select, gated Next, progress dots, animated meters, share-to-clipboard):

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "@/content";
import { WeaveLoader } from "@/components/ui/WeaveLoader";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  ANALYZING_MS,
  canAdvance,
  isSelected,
  nextQuizState,
  prevQuizState,
  progressDots,
  toggleOption,
  type Answers,
  type Phase,
} from "@/lib/compatibility";

const AUTO_ADVANCE_MS = 460;
const COPIED_MS = 2000;

export function CompatibilityTest() {
  const reduce = Boolean(useReducedMotion());
  const data = content.compatibilityTest;
  const questions = data.questions;

  const [phase, setPhase] = useState<Phase>("intro");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[activeIndex];

  // Analyzing → result on a mock timer.
  useEffect(() => {
    if (phase !== "analyzing") return;
    const id = setTimeout(() => setPhase("result"), reduce ? 900 : ANALYZING_MS);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  function advance() {
    const nextState = nextQuizState(activeIndex, questions.length);
    setPhase(nextState.phase);
    setActiveIndex(nextState.activeIndex);
  }

  function goBack() {
    const prev = prevQuizState(activeIndex);
    setPhase(prev.phase);
    setActiveIndex(prev.activeIndex);
  }

  function choose(optionId: string) {
    const nextAnswers = toggleOption(answers, question.id, optionId, question.kind);
    setAnswers(nextAnswers);
    if (
      question.kind === "single" &&
      (nextAnswers[question.id]?.length ?? 0) > 0
    ) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, reduce ? 120 : AUTO_ADVANCE_MS);
    }
  }

  function reset() {
    setAnswers({});
    setActiveIndex(0);
    setCopied(false);
    setPhase("intro");
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(`https://${data.result.shareUrl}`);
    } catch {
      // Clipboard unavailable — the URL text stays visible on the button.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 18, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -18, filter: "blur(6px)" },
      };
  const transition = { duration: reduce ? 0.01 : 0.42, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <div className="ctest-shell">
      <span aria-hidden className="ctest-ambient ctest-ambient--ember" />
      <span aria-hidden className="ctest-ambient ctest-ambient--signal" />
      <a className="ctest-home" href="/">
        <span aria-hidden>&larr;</span> Weft
      </a>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" {...fade} transition={transition} className="relative z-10 flex flex-col items-center text-center">
            <span className="ctest-eyebrow">{data.intro.eyebrow}</span>
            <h1 className="ctest-prompt">
              {data.intro.headline.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-ink/60">{data.intro.sub}</p>
            <div className="mt-8">
              <PremiumButton tone="ember" onClick={() => { setPhase("quiz"); setActiveIndex(0); }}>
                {data.intro.cta}
              </PremiumButton>
            </div>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${activeIndex}`} {...fade} transition={transition} className="relative z-10 flex w-full flex-col items-center text-center">
            <div className="ctest-progress" aria-hidden>
              {progressDots(activeIndex, questions.length).map((on, i) => (
                <span key={i} className={`ctest-dot${on ? " ctest-dot--on" : ""}`} />
              ))}
            </div>
            <span className="ctest-eyebrow">
              Question {activeIndex + 1} of {questions.length}
            </span>
            <h2 className="ctest-prompt">{question.prompt}</h2>
            {question.helper && (
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ink/45">{question.helper}</p>
            )}
            <div
              className="ctest-grid"
              role={question.kind === "single" ? "radiogroup" : "group"}
              aria-label={question.prompt}
            >
              {question.options.map((option) => {
                const on = isSelected(answers, question.id, option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    role={question.kind === "single" ? "radio" : "checkbox"}
                    aria-checked={on}
                    className={`ctest-option${on ? " ctest-option--on" : ""}`}
                    onClick={() => choose(option.id)}
                  >
                    <span>{option.label}</span>
                    {option.hint && <span className="ctest-option-hint">{option.hint}</span>}
                    <span aria-hidden className="ctest-option-check">&#10003;</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-5">
              <button type="button" onClick={goBack} className="font-mono text-xs uppercase tracking-wider text-ink/50 transition-colors hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal">
                &larr; Back
              </button>
              {question.kind === "multi" && (
                <PremiumButton
                  tone="ink"
                  onClick={advance}
                  disabled={!canAdvance(answers, question.id)}
                >
                  Next
                </PremiumButton>
              )}
            </div>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div key="analyzing" {...fade} transition={transition} className="relative z-10 h-64 w-full max-w-md">
            <WeaveLoader phrases={data.loaderPhrases} />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" {...fade} transition={transition} className="relative z-10 w-full flex flex-col items-center">
            <span className="ctest-eyebrow">Your networking archetype</span>
            <div className="ctest-card mt-4">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {data.result.archetype}
              </h2>
              <p className="mt-2 text-pretty text-base leading-relaxed text-ink/62">{data.result.tagline}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {data.result.values.map((value) => (
                  <span key={value} className="ctest-chip">{value}</span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {data.result.stats.map((stat, i) => (
                  <div key={stat.label}>
                    <div className="mb-1 flex justify-between font-mono text-[0.68rem] uppercase tracking-wider text-ink/55">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="ctest-meter">
                      <motion.span
                        className="ctest-meter-fill"
                        initial={{ width: reduce ? `${stat.value}%` : 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: reduce ? 0.01 : 0.9, delay: reduce ? 0 : 0.15 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-ink/8 pt-5 text-left sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-wider text-ink/45">Connection style</dt>
                  <dd className="mt-1 font-display text-sm text-ink">{data.result.connectionStyle}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-wider text-ink/45">Best matched with</dt>
                  <dd className="mt-1 font-display text-sm text-ink">{data.result.matchedWith.join(" · ")}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button type="button" className="ctest-share" onClick={share}>
                <span aria-hidden>&#8599;</span>
                {copied ? "Copied ✓" : `Share · ${data.result.shareUrl}`}
              </button>
              <button type="button" onClick={reset} className="font-mono text-xs uppercase tracking-wider text-ink/50 transition-colors hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal">
                Retake
              </button>
            </div>
            <p aria-live="polite" className="ctest-copied mt-3 h-4">{copied ? "Link copied to clipboard" : ""}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

Note: `PremiumButton` must accept `onClick` and `disabled`. If it does not yet, that is handled in Task 5 — this task's test only renders the intro phase statically, which uses `PremiumButton` with `onClick`. Ensure Task 5 is applied before running the full app.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/compatibility/CompatibilityTest.test.tsx`
Expected: PASS (intro renders; no result leakage). If `PremiumButton` types reject `onClick`, complete Task 5 first, then re-run.

- [ ] **Step 5: Commit**

```bash
git add components/compatibility/CompatibilityTest.tsx components/compatibility/CompatibilityTest.test.tsx
git commit -m "feat(compatibility): add quiz flow component"
```

---

### Task 5: Extend `PremiumButton` with `onClick` + `disabled`

**Files:**
- Modify: `components/ui/PremiumButton.tsx`
- Test: `components/ui/PremiumButton.test.tsx`

**Interfaces:**
- Produces: `PremiumButtonProps` gains optional `onClick?: () => void` and `disabled?: boolean`. When `disabled`, the button renders `disabled` attribute and reduced opacity; `href` form is unaffected.

- [ ] **Step 1: Read the current file** to see the button/anchor branches.

Run: `cat components/ui/PremiumButton.tsx`

- [ ] **Step 2: Write the failing test** — append to `components/ui/PremiumButton.test.tsx`:

```tsx
test("premium button reflects a disabled state in markup", () => {
  const html = renderToStaticMarkup(
    <PremiumButton tone="ink" disabled>
      Next
    </PremiumButton>,
  );
  expect(html).toContain("disabled");
});
```

(If the test file has no imports yet, mirror the existing test file's imports: `import { expect, test } from "bun:test";`, `import { renderToStaticMarkup } from "react-dom/server";`, `import { PremiumButton } from "./PremiumButton";`.)

- [ ] **Step 3: Run test to verify it fails**

Run: `bun test components/ui/PremiumButton.test.tsx`
Expected: FAIL — no `disabled` attribute in markup.

- [ ] **Step 4: Implement** — update `PremiumButtonProps` and the `<button>` branch in `components/ui/PremiumButton.tsx`:

```tsx
export type PremiumButtonProps = {
  children: string;
  href?: string;
  tone?: "ink" | "ember" | "paper";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};
```

In the component signature add `onClick` and `disabled`, and in the non-`href` (`<button>`) branch pass them through, plus a disabled style:

```tsx
  const buttonClass =
    `premium-cta premium-cta--${tone} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`.trim();
  // ...button branch:
  //   <button type={type} onClick={onClick} disabled={disabled} className={buttonClass}> ... </button>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `bun test components/ui/PremiumButton.test.tsx`
Expected: PASS (existing + new).

- [ ] **Step 6: Commit**

```bash
git add components/ui/PremiumButton.tsx components/ui/PremiumButton.test.tsx
git commit -m "feat(button): support onClick and disabled on PremiumButton"
```

---

### Task 6: Route page

**Files:**
- Create: `app/compatibility-test/page.tsx`
- Test: `app/compatibility-test/page.test.tsx`

**Interfaces:**
- Consumes: `CompatibilityTest` (Task 4).
- Produces: default-export React page + `metadata`.

- [ ] **Step 1: Write the failing test** — create `app/compatibility-test/page.test.tsx`:

```tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";

test("compatibility-test page renders the quiz shell", () => {
  const html = renderToStaticMarkup(<Page />);
  expect(html).toContain("ctest-shell");
});

test("compatibility-test page sets its own metadata title", () => {
  expect(String(metadata.title)).toContain("Compatibility");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test app/compatibility-test/page.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement** — create `app/compatibility-test/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CompatibilityTest } from "@/components/compatibility/CompatibilityTest";

export const metadata: Metadata = {
  title: "Weft: Compatibility Test",
  description:
    "Answer three quick questions and discover your networking archetype — the values, connection style, and stats worth sharing.",
};

export default function CompatibilityTestPage() {
  return (
    <main id="main-content">
      <CompatibilityTest />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test app/compatibility-test/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Full test suite + build sanity**

Run: `bun test && bun run lint`
Expected: all pass, no new lint errors.

- [ ] **Step 6: Commit**

```bash
git add app/compatibility-test/page.tsx app/compatibility-test/page.test.tsx
git commit -m "feat(compatibility): add /compatibility-test route"
```

---

## Self-Review

- **Spec coverage:** intro/quiz/analyzing/result state machine (T2,T4) ✓; 3 questions single+multi (T1,T4) ✓; progress dots (T2,T4) ✓; per-question animated transitions + reduced motion (T4) ✓; WeaveLoader analyzing phase w/ mock timer (T4) ✓; result card values/stats/matched-with (T1,T4) ✓; share-to-clipboard + confirmation (T4) ✓; retake (T4) ✓; immersive full-screen no-nav shell + home link (T3,T4,T6) ✓; content in content.ts (T1) ✓; CSS namespaced + reduced-motion fallbacks (T3) ✓; tests match SSR-static convention + pure-logic unit tests (T1,T2,T4,T5,T6) ✓.
- **Placeholders:** none — all steps carry real code/commands.
- **Type consistency:** `Answers`, `Phase`, `nextQuizState`, `prevQuizState`, `progressDots`, `toggleOption`, `canAdvance`, `isSelected` names match between T2 definition and T4 usage; `PremiumButton` `onClick`/`disabled` added in T5 and consumed in T4.
- **Ordering note:** T4 depends on T5 for `PremiumButton` prop types at runtime; T4's static test only needs the intro (which uses `onClick`). Apply T5 before running the full app / full suite (T6 step 5 gates this).
