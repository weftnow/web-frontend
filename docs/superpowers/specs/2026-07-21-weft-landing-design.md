# Weft Landing Page — Design Spec

Date: 2026-07-21
Status: Approved

## Context

Weft is a YC-backed startup selling an app that event organizers use to run AI matchmaking at
business and professional networking events. Attendees are grouped with people they are
compatible with. The matchmaking process is designed to be fun as well as effective.

The landing page must read at the level of the company's credibility: YC-backed, with customers
like Google.

**Design reference:** https://zolo.framer.website/ — treated as a library for typography, shape,
spacing, motion, interaction, and section structure, rebuilt with a narrative optimized for Weft.

## Narrative spine

Bad networking → bad experience → attendees associate that experience with your brand.
Weft → good networking → fun experience → memorable event → memorable brand.

This is expressed as a two-act page with a tonal break:

- **Act I** — the room that didn't work. Dark (`--ink`). Threads run parallel, grey, never touching.
- **The turn** — full-bleed `--ember` wash. Threads cross.
- **Act II** — the room that did. Light and warm. Threads woven into cloth.

The tonal break is a ~40vh gradient wash, never a hard edge.

## Hero message

Headline, two lines, two-tone treatment:

> The person who changes your year is in this room.
> You will spend the night talking to someone else.

`someone else` is the muted word that resolves to full ink last.

Sub-line:

> Weft finds the four people at your event who should be in a room together, and puts them there.

Primary CTA: **Book a demo**. Secondary: **See how it works** (anchor to §04).

The line is about the specific person the attendee needed, not about proximity. Weft sells
connection and precise pairing, not mere meeting.

## Section map

8 sections, ordered to be read as one continuous scroll.

| # | Section | Act | Job |
|---|---------|-----|-----|
| 01 | Hero → logo wall + YC | — | The loss, the CTA, then credibility with no section break between |
| 02 | The problem | I (dark) | Badge-scanning, small talk, the 3 people you already knew — and that is what they remember about your brand |
| 03 | The turn | break | One line, full-bleed ember. Threads cross. |
| 04 | How it works | II | 3 numbered steps, each expanding |
| 05 | The reveal | II | The moment at the event when the group is revealed; outcome stats woven into the same section |
| 06 | Testimonials | II | Drag carousel |
| 07 | FAQ | II | Hairline-divided accordion, not a card stack |
| 08 | CTA + footer | II | Split contact form + giant `weft` wordmark on a woven panel |

Cut deliberately: a standalone "why groups, not pairs" section (not important enough to earn
its scroll), and a separate "cost" section (the cost belongs inside the problem).

## Visual system

The name is the system. In weaving, the weft is the thread drawn across the warp that binds
separate strands into cloth. Zolo's abstract gradient blobs are replaced with a woven-thread
system: `--ember` and `--signal` are two threads that cross.

The two colors never sit as flat neighbors. They meet only as crossing threads.

## Tokens

```
--ember    #F4511E   primary — CTAs, the turn, thread A, accents
--ink      #121212   Act I ground, all body text
--paper    #FFFFFF   cards, Act II ground
--bone     #F7F5F2   warm off-white sections (warmer than Zolo's cold grey, ties to ember)
--signal   #0090DE   thread B — algorithm and connection visuals only, never a CTA
--ash      #B4B0AA   the muted word in two-tone headlines
```

## Typography

- **Headings:** Comfortaa 400/500/700, letter-spacing `-0.05em`, line-height `1.14`.
- **Eyebrows, nav, meta:** Geist Mono, uppercase, letter-spacing `+0.12em`.

Both match the reference's computed values. Comfortaa is soft at display sizes, which serves
the "fun" half of the positioning; the mono pairing keeps it credible.

## Motion system

Library: `motion` (Framer Motion). Every animation gated behind `prefers-reduced-motion`.

- **Word reveal** — per-word `blur(8px) → 0`, opacity plus 12px rise, 40ms stagger. The page's
  base rhythm.
- **Two-tone headline** — the muted word resolves to full ink 200ms after its neighbors.
- **The weave** — one continuous SVG running the full page length, `pathLength` driven by
  scroll. Parallel and grey in Act I; crosses and locks into cloth at the turn. This is the
  page's spine, not decoration, and it is what makes the sections read as one scroll.
- **Buttons** — pill shape, letter-by-letter vertical rise on hover, 20ms stagger.
- **Counters** — stats count up on enter.
- **The group reveal (§05)** — five avatar cards (the attendee plus the four matches named in
  the hero sub-line) fan out from a stack and settle into a circle with spring physics. The
  emotional peak of the page; worth disproportionate polish.

## Smoothness rules

Sections must dissolve into each other rather than start and stop. These are requirements, not
suggestions:

1. The thread never breaks — one continuous SVG spans the whole page.
2. Bleed, don't butt — content from one section rises into the previous one's whitespace.
3. Asymmetric rhythm — alternate centered-narrow with full-bleed-wide; nothing sits in the same
   column twice running.
4. Reveals overlap boundaries — an element begins animating while the previous section still
   owns most of the viewport, so motion crosses the seam.
5. No section is exactly `100vh`. Equal-height blocks are what make a page read as slides.

## Content and proof

- **Real:** "Backed by Y Combinator" and the client logo wall including Google.
- **Placeholder:** all stats, testimonial quotes, and attributed names. These are marked clearly
  as placeholders and live in a single `content.ts` so they can be replaced in one place.

No invented numbers and no fabricated quotes attributed to real people or companies.

## Build shape

- `app/page.tsx` composes `components/sections/*.tsx`, one file per section, each self-contained.
- Shared primitives in `components/ui/`: `Eyebrow`, `PillButton`, `RevealText`, `SectionShell`,
  `WeaveCanvas`.
- Tailwind v4 `@theme` tokens in `app/globals.css`.
- Sections are server components by default; only those with motion are `"use client"`.
- All copy and placeholder data in `content.ts`.

Stack is the existing scaffold: Next.js 16.2.11, React 19.2.4, Tailwind v4. Adds one dependency,
`motion`.

## Out of scope

Real backend for the contact form (renders and validates; submission handler is a stub), routes
other than `/`, CMS integration, and analytics.
