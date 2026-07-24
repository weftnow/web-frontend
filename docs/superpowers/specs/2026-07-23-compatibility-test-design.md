# Compatibility Test — Design Spec

Date: 2026-07-23
Route: `/compatibility-test`

## Purpose

A standalone, immersive quiz page. The user answers 3 questions (one per screen),
watches a creative loader while the "backend" pretends to compute, then receives a
shareable "networking archetype" personality card. Backend is fully mocked — answers
are collected but the result is a single canned archetype.

## Architecture

- `app/compatibility-test/page.tsx` — server component shell. Sets page metadata,
  renders the client component. No Nav/footer (immersive).
- `components/compatibility/CompatibilityTest.tsx` — `"use client"` component owning a
  state machine: `intro → quiz → analyzing → result`.
- Supporting presentational pieces may be split into the same folder if the main file
  grows too large (e.g. `QuestionScreen`, `ResultCard`), each with one clear purpose.
- Data authored in `content.ts` under a new `compatibilityTest` key.
- New CSS in `app/globals.css` under a `.ctest-*` namespace for effects Tailwind can't
  cleanly express (option fill transition, progress dots, stat-meter bars, ambient glow).

## State machine

`phase: "intro" | "quiz" | "analyzing" | "result"`

- **intro** — headline, context line, ember `PremiumButton` "Begin" → `quiz` (question 0).
- **quiz** — `activeIndex` (0..2). Progress dots. Directional slide+blur transition
  between questions via `AnimatePresence`. Back affordance returns to previous question;
  from question 0, back returns to `intro`. After last question's answer is confirmed →
  `analyzing`.
- **analyzing** — reuses existing `WeaveLoader` (spinning `icon.svg` + cycling phrases).
  Mock timer ~3600ms → `result`. Timer cleared on unmount.
- **result** — archetype card + share + retake ("Retake" resets state to `intro` with
  cleared answers).

## Data shapes (content.ts)

```ts
compatibilityTest: {
  intro: { eyebrow, headline: string[], sub, cta },
  questions: Array<{
    id: string;
    prompt: string;
    kind: "single" | "multi";
    helper?: string;            // e.g. "Pick all that apply"
    options: Array<{ id: string; label: string; hint?: string }>;
  }>,                            // exactly 3
  loaderPhrases: string[],      // fed to WeaveLoader
  result: {
    archetype: string;          // "The Weaver"
    tagline: string;
    values: string[];           // chips
    stats: Array<{ label: string; value: number }>; // 0..100 meters
    connectionStyle: string;
    matchedWith: string[];
    shareUrl: string;           // mock, e.g. "weft.app/c/AB12CD"
  }
}
```

Answers held in component state: `Record<questionId, string[]>`.
Single-select stores one id; multi-select stores many. Result is fixed regardless.

## Interaction detail

- **Option grid** — consistent template across all 3 questions. Responsive grid of
  option buttons. Selected state: ember fill + check glyph, animated.
- **Single-select** — choosing an option marks it and auto-advances after a short beat
  (~450ms) so the selection is visible first.
- **Multi-select** — toggles; a "Next →" button appears, disabled until ≥1 selected.
- **Progress dots** — segmented indicator; filled up to `activeIndex`.
- **Share** — copies `result.shareUrl` to clipboard via `navigator.clipboard`, shows a
  transient "Copied ✓" confirmation (revert after ~2s). Falls back gracefully if
  clipboard unavailable (button still shows the URL text).
- **Stat meters** — animate width from 0 to `value%` on result mount.

## Motion & accessibility

- Uses `motion/react` (`AnimatePresence`, `motion`, `useReducedMotion`) consistent with
  the rest of the codebase.
- All transitions honor `useReducedMotion` — reduced motion swaps to opacity-only /
  instant, matching existing components.
- CSS additions include `@media (prefers-reduced-motion: reduce)` fallbacks.
- Semantics: questions use `role="radiogroup"`/`role="group"` with proper labeling;
  progress uses `aria` where meaningful; loader keeps existing `aria-live="polite"`.
- Focus-visible outlines using `--color-signal`, matching site convention.

## Styling

Palette (ember/ink/paper/bone/signal/ash), Comfortaa (display) + Geist Mono (meta).
Rounded 2rem cards, `--shadow-premium`, mono uppercase eyebrow labels, ambient blur
glow reminiscent of `hero-ambient`.

## Testing

`components/compatibility/CompatibilityTest.test.tsx` (bun, matching co-located
convention):

- renders intro; Begin advances to first question
- single-select auto-advances; multi-select requires ≥1 and gates Next
- back navigation works
- completing all questions transitions to analyzing (loader visible)
- loader timer (mocked) transitions to result
- result renders archetype, values, stats, matched-with
- share copies mock URL and shows confirmation
- retake resets to intro

## Scope guardrails (YAGNI)

- No real backend, scoring, or persistence.
- No per-step URL routing — single-page internal state.
- Exactly 3 questions, one canned result.
- No auth, no analytics.
