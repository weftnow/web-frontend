# Weave Thread Late Convergence — Design

## Problem

`WeaveCanvas` draws two decorative SVG threads (ember and signal) that trace
their `pathLength` in lockstep with page scroll. Today both threads cross at
the exact vertical middle of the viewBox (`x=50, y=50`), which lands the
crossing motif over mid-page content and can compete with it visually.

## Goal

Move the crossing so it happens late in the scroll — around `y≈82` in the
`0 0 100 100` viewBox (roughly 80–85% of total scroll progress) — and keep
each thread close to its starting edge (`x=20` for ember, `x=80` for signal)
through the rest of the page. The threads should still cross (swap sides),
matching the current motif, just relocated near the end.

## Approach

Reshape the two cubic paths in `components/ui/WeaveCanvas.tsx`:

- Each thread stays flat against its starting `x` (20 or 80) from `y=0`
  through roughly `y=64`, so it doesn't visually intrude on mid-page content.
- From `y≈64` to the crossing at `y≈82`, the curve bends inward to `x=50`,
  with control points pushed toward the tail of that span so the bend reads
  as a late, quick "coming together" rather than a gradual drift.
- From the crossing (`y≈82`) to `y=100`, the curve mirrors that bend outward
  to the opposite edge (`x=80` for ember, `x=20` for signal), finishing at
  the bottom of the viewBox — same divergence motif as today, just
  compressed into the last ~18 units instead of the last ~50.

No changes to `pathLength`/`useTransform` scroll-drive logic, stroke styling,
opacity, or the `prefers-reduced-motion` static fallback — only the two `d`
attribute strings change.

## Scope

- Modify only: `components/ui/WeaveCanvas.tsx`
- No new dependencies, no new components, no test changes (no existing
  automated coverage targets these path coordinates).

## Verification

Visual check in the dev server at desktop width: scroll through the full
page and confirm the threads stay pinned near their edges through the
content sections, converge and cross only near the bottom of the page, and
that reduced-motion mode still renders the static full-length paths.
