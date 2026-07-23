# Weave Thread Edge Start + Slower Crossing — Design

## Problem

`WeaveCanvas` draws two decorative SVG threads (ember and signal) that trace
their `pathLength` in lockstep with page scroll. Two issues:

1. The threads start at `x=20` / `x=80` in the `0 0 100 100` viewBox —
   noticeably inset from the actual screen edges rather than hugging them.
2. The threads cross at the vertical middle of their path (`y=50`), which
   is reached after only ~50% of scroll progress, since `pathLength` is
   drawn linearly with `scrollYProgress`.

## Goal

1. Start each thread closer to the true left/right screen edges.
2. Require more scroll before the threads cross — i.e. push the crossing
   point later along the path so more of the page needs to be scrolled
   before the "growing" threads meet.

## Approach

Reshape the two cubic paths in `components/ui/WeaveCanvas.tsx`:

- Move the starting `x` from `20`/`80` to `4`/`96`, closer to the viewBox
  (and thus screen) edges.
- Move the crossing point from `(50, 50)` to `(50, 70)`, keeping the same
  relative control-point ratios as the original curve (scaled to the new
  segment spans) so the curve shape/feel is preserved, just later and
  wider. Since `pathLength` draws linearly with scroll, moving the cross
  from the 50%-drawn mark to the 70%-drawn mark means ~70% scroll is now
  needed to reach it, instead of ~50%.

No changes to `pathLength`/`useTransform` scroll-drive logic, stroke
styling, opacity, or the `prefers-reduced-motion` static fallback — only
the two `d` attribute strings change.

## Scope

- Modify only: `components/ui/WeaveCanvas.tsx`
- No new dependencies, no new components, no test changes (no existing
  automated coverage targets these path coordinates).

## Verification

Visual check in the dev server at desktop width: scroll through the page
and confirm the threads now originate close to the left/right screen
edges, and that noticeably more scrolling is required before they cross
near `y=70`, compared to the previous mid-page crossing.
