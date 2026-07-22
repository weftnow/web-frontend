# Weft Premium Landing Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing Weft landing page to the approved premium visual and interaction standard while preserving its orange/blue identity, copy, routes, and stack.

**Architecture:** Keep `app/page.tsx` as a Server Component that composes focused section components. Static composition and media remain server-renderable; state, pointer behavior, and `motion` springs live in small Client Components. All copy and media metadata remain in `content.ts`, all deterministic interaction state lives in `lib/interactions.ts`, and all shipped imagery is local under `public/placeholders/weft/`.

**Tech Stack:** Next.js 16.2.11 App Router, React 19.2.4, TypeScript, Tailwind CSS 4, Motion 12, Bun test runner, `next/image`, Comfortaa, Geist Mono.

## Global Constraints

- Preserve `--ember: #F4511E` and `--signal: #0090DE`; Zolo is a craft reference, not a brand template.
- Use Bun for tests, scripts, lint, build, and development commands.
- Prefix every shell command with `rtk`.
- Before changing a Next.js API, read the relevant file under `node_modules/next/dist/docs/`.
- Do not add dependencies or remote media URLs.
- Copy only the approved temporary assets from `/Users/antoniopertuz/Downloads/zolo-framer-website/images`.
- Use `next/image` with stable intrinsic dimensions or a stable `fill` container and exact `sizes`.
- Keep Client Component boundaries narrow; do not convert `app/page.tsx` into a Client Component.
- Do not use `transition-all`, pointer animation on touch devices, `ease-in`, or entry animation from `scale(0)`.
- Keyboard focus must never depend on hover and must not play positional travel.
- `prefers-reduced-motion` removes parallax, rolling text, and spring travel while preserving opacity/color feedback.
- Preserve visible placeholder disclosures for invented metrics and testimonials.
- Do not touch the unrelated untracked `.serena/` directory.

---

### Task 1: Deterministic interaction contracts

**Files:**
- Create: `lib/interactions.test.ts`
- Create: `lib/interactions.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `getPortraitTransforms(expanded, reducedMotion)` returning exactly three CSS transform strings.
- Produces `getNextOpenIndex(current, requested)` for one-open accordion behavior.
- Produces `PORTRAIT_STACKED_TRANSFORMS` and `PORTRAIT_SPREAD_TRANSFORMS` for visual components.

- [ ] **Step 1: Write the failing interaction tests**

```ts
// lib/interactions.test.ts
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
    expect(getPortraitTransforms(true, false)).toEqual(PORTRAIT_SPREAD_TRANSFORMS);
    expect(getPortraitTransforms(false, true)).toEqual(PORTRAIT_SPREAD_TRANSFORMS);
  });

  test("keeps the measured stack when inactive", () => {
    expect(getPortraitTransforms(false, false)).toEqual(PORTRAIT_STACKED_TRANSFORMS);
  });
});

describe("one-open disclosure state", () => {
  test("opens a different row", () => expect(getNextOpenIndex(0, 2)).toBe(2));
  test("closes the active row", () => expect(getNextOpenIndex(2, 2)).toBeNull());
});
```

- [ ] **Step 2: Run the tests and confirm the expected failure**

Run: `rtk bun test lib/interactions.test.ts`  
Expected: FAIL because `./interactions` does not exist.

- [ ] **Step 3: Implement the minimal interaction helpers**

```ts
// lib/interactions.ts
export const PORTRAIT_STACKED_TRANSFORMS = [
  "translate3d(90px, 20px, 0) rotate(-15deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(-90px, 20px, 0) rotate(15deg)",
] as const;

export const PORTRAIT_SPREAD_TRANSFORMS = [
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
  "translate3d(0, 0, 0) rotate(0deg)",
] as const;

export function getPortraitTransforms(expanded: boolean, reducedMotion: boolean) {
  return expanded || reducedMotion
    ? PORTRAIT_SPREAD_TRANSFORMS
    : PORTRAIT_STACKED_TRANSFORMS;
}

export function getNextOpenIndex(current: number | null, requested: number) {
  return current === requested ? null : requested;
}
```

Add the script to `package.json`:

```json
"test": "bun test"
```

- [ ] **Step 4: Verify green**

Run: `rtk bun test lib/interactions.test.ts`  
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
rtk git add package.json lib/interactions.ts lib/interactions.test.ts
rtk git commit -m "test: define premium interaction contracts"
```

---

### Task 2: Local placeholder media and typed content

**Files:**
- Create: `content.test.ts`
- Modify: `content.ts`
- Create: `public/placeholders/weft/attendee-01.png`
- Create: `public/placeholders/weft/attendee-02.png`
- Create: `public/placeholders/weft/attendee-03.png`
- Create: `public/placeholders/weft/problem-room.png`
- Create: `public/placeholders/weft/intake-preview.png`
- Create: `public/placeholders/weft/matching-preview.png`
- Create: `public/placeholders/weft/reveal-preview.png`
- Create: `public/placeholders/weft/dashboard-preview.png`
- Create: `public/placeholders/weft/event-detail.png`
- Create: `public/placeholders/weft/outcome-feature.png`
- Create: `public/placeholders/weft/testimonial-01.png`
- Create: `public/placeholders/weft/testimonial-02.png`
- Create: `public/placeholders/weft/testimonial-03.png`
- Create: `public/placeholders/weft/contact-art.png`

**Interfaces:**
- Extends `content` with typed media records containing `src`, `width`, `height`, `alt`, and `placeholder: true`.
- Existing sections consume only semantic media keys and never source hashes or Downloads paths.

- [ ] **Step 1: Write the failing content contract test**

```ts
// content.test.ts
import { describe, expect, test } from "bun:test";
import { content } from "./content";

describe("placeholder media catalog", () => {
  test("contains the approved image-led page inventory", () => {
    expect(content.media.heroRail).toHaveLength(5);
    expect(content.media.portraits).toHaveLength(3);
    expect(content.media.how).toHaveLength(3);
  });

  test("ships only local, replaceable assets with intrinsic sizes", () => {
    const media = [
      ...content.media.heroRail,
      ...content.media.portraits,
      ...content.media.how,
      content.media.problem,
      content.media.outcome,
      ...content.media.testimonialAvatars,
      content.media.contact,
    ];

    for (const item of media) {
      expect(item.src.startsWith("/placeholders/weft/")).toBe(true);
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
      expect(item.alt.length).toBeGreaterThan(8);
      expect(item.placeholder).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the content test and confirm RED**

Run: `rtk bun test content.test.ts`  
Expected: FAIL because `content.media` does not exist.

- [ ] **Step 3: Copy and semantically rename the exact approved assets**

```bash
rtk proxy mkdir -p public/placeholders/weft
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/g2hegfl2nyj0ehxo4jzklppx3w.png public/placeholders/weft/attendee-01.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/wvlunzimw002thv3mycddcyuer0.png public/placeholders/weft/attendee-02.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/ecndgypyos8r6z4z8dyprrn3j8.png public/placeholders/weft/attendee-03.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/rek36wtdrzoes7zzstcyqemo.png public/placeholders/weft/problem-room.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/eiec03od38ml4fqtvuranwgef2g.png public/placeholders/weft/intake-preview.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/ivvoohp3eppudtqevhmsgpcfi.png public/placeholders/weft/matching-preview.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/9jht8muhue8fz24foy3llwiib78.png public/placeholders/weft/reveal-preview.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/0mbi099xer10skfpxzw1az2eu.png public/placeholders/weft/dashboard-preview.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/orwvqsoe7vieje53knmclxknc.png public/placeholders/weft/event-detail.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/cmgylws8o2cfhxt1afufzhwedi.png public/placeholders/weft/outcome-feature.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/svck9usja9wxvglnnh6jthrmfv4.png public/placeholders/weft/testimonial-01.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/ywyic2d6cpsizfq382eyhpl88.png public/placeholders/weft/testimonial-02.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/mcktggx6ac9fuxzwdeibicuvs8.png public/placeholders/weft/testimonial-03.png
rtk proxy cp /Users/antoniopertuz/Downloads/zolo-framer-website/images/qfsexdeshuxsi5jn7psvyf0hw4.png public/placeholders/weft/contact-art.png
```

- [ ] **Step 4: Add the complete media catalog to `content.ts`**

Insert this key at the top level of `content`:

```ts
media: {
  heroRail: [
    { src: "/placeholders/weft/intake-preview.png", width: 2340, height: 1560, alt: "Placeholder view of an attendee intake experience", placeholder: true },
    { src: "/placeholders/weft/matching-preview.png", width: 2340, height: 1560, alt: "Placeholder visual for Weft matchmaking", placeholder: true },
    { src: "/placeholders/weft/reveal-preview.png", width: 2340, height: 1560, alt: "Placeholder visual for a group reveal", placeholder: true },
    { src: "/placeholders/weft/dashboard-preview.png", width: 2340, height: 1560, alt: "Placeholder view of an organizer dashboard", placeholder: true },
    { src: "/placeholders/weft/event-detail.png", width: 2340, height: 1560, alt: "Placeholder detail from a branded event experience", placeholder: true },
  ],
  portraits: [
    { src: "/placeholders/weft/attendee-01.png", width: 1000, height: 1500, alt: "Placeholder portrait of a smiling event attendee", placeholder: true },
    { src: "/placeholders/weft/attendee-02.png", width: 447, height: 495, alt: "Placeholder portrait of a matched event attendee", placeholder: true },
    { src: "/placeholders/weft/attendee-03.png", width: 700, height: 806, alt: "Placeholder portrait of another matched attendee", placeholder: true },
  ],
  problem: { src: "/placeholders/weft/problem-room.png", width: 816, height: 1126, alt: "Placeholder event portrait representing an unproductive room", placeholder: true },
  how: [
    { src: "/placeholders/weft/intake-preview.png", width: 2340, height: 1560, alt: "Placeholder preview of attendee intake", placeholder: true },
    { src: "/placeholders/weft/matching-preview.png", width: 2340, height: 1560, alt: "Placeholder preview of group computation", placeholder: true },
    { src: "/placeholders/weft/reveal-preview.png", width: 2340, height: 1560, alt: "Placeholder preview of attendee reveal", placeholder: true },
  ],
  outcome: { src: "/placeholders/weft/outcome-feature.png", width: 3021, height: 2904, alt: "Placeholder portrait for the featured event outcome", placeholder: true },
  testimonialAvatars: [
    { src: "/placeholders/weft/testimonial-01.png", width: 1630, height: 1775, alt: "Placeholder portrait for the first testimonial", placeholder: true },
    { src: "/placeholders/weft/testimonial-02.png", width: 943, height: 979, alt: "Placeholder portrait for the second testimonial", placeholder: true },
    { src: "/placeholders/weft/testimonial-03.png", width: 736, height: 1104, alt: "Placeholder portrait for the third testimonial", placeholder: true },
  ],
  contact: { src: "/placeholders/weft/contact-art.png", width: 800, height: 800, alt: "Placeholder artwork for the Weft contact panel", placeholder: true },
},
```

- [ ] **Step 5: Verify the asset contract and typecheck**

Run: `rtk bun test content.test.ts`  
Expected: 2 tests pass.  
Run: `rtk bunx tsc --noEmit`  
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
rtk git add content.ts content.test.ts public/placeholders/weft
rtk git commit -m "feat: add local placeholder media catalog"
```

---

### Task 3: Premium shared primitives and motion tokens

**Files:**
- Create: `components/ui/PremiumButton.test.tsx`
- Create: `components/ui/PremiumButton.tsx`
- Create: `components/ui/GestureIcon.tsx`
- Create: `components/ui/MediaPlaceholder.tsx`
- Create: `components/ui/PortraitStack.test.tsx`
- Create: `components/ui/PortraitStack.tsx`
- Create: `components/ui/SectionHeading.tsx`
- Modify: `app/globals.css`
- Modify: `lib/motion.ts`

**Interfaces:**
- `PremiumButton({ children, href, tone })` implements rolling characters, hand traversal, focus, and press states.
- `MediaPlaceholder({ media, className, sizes, priority })` renders stable local imagery.
- `PortraitStack({ portraits })` implements measured stacked/spread geometry and accessible tap state.
- `SectionHeading` replaces the repeated word-writing effect with one masked section reveal.

- [ ] **Step 1: Write failing server-markup tests**

```tsx
// components/ui/PremiumButton.test.tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PremiumButton } from "./PremiumButton";

test("premium CTA keeps one accessible label while rendering rolling glyphs", () => {
  const html = renderToStaticMarkup(
    <PremiumButton href="#contact">Book a demo</PremiumButton>,
  );
  expect(html).toContain('href="#contact"');
  expect(html).toContain('aria-label="Book a demo"');
  expect(html).toContain('class="premium-cta');
  expect(html).toContain('aria-hidden="true"');
});
```

```tsx
// components/ui/PortraitStack.test.tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PortraitStack } from "./PortraitStack";

const portraits = [
  { src: "/a.png", width: 100, height: 100, alt: "Portrait one", placeholder: true },
  { src: "/b.png", width: 100, height: 100, alt: "Portrait two", placeholder: true },
  { src: "/c.png", width: 100, height: 100, alt: "Portrait three", placeholder: true },
] as const;

test("portrait stack exposes its collapsed disclosure state and all portraits", () => {
  const html = renderToStaticMarkup(<PortraitStack portraits={portraits} />);
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain("Portrait one");
  expect(html).toContain("Portrait two");
  expect(html).toContain("Portrait three");
});
```

- [ ] **Step 2: Verify RED**

Run: `rtk bun test components/ui/PremiumButton.test.tsx components/ui/PortraitStack.test.tsx`  
Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement `GestureIcon` and `PremiumButton`**

Use two small custom inline SVG gestures, both `aria-hidden`, with a consistent 1.8px rounded stroke.
`PremiumButton` must render only one accessible label on the anchor/button; duplicated rolling glyphs and
gesture icons remain hidden from assistive technology. Use this public signature:

```tsx
export type PremiumButtonProps = {
  children: string;
  href?: string;
  tone?: "ink" | "ember" | "paper";
  className?: string;
};

export function PremiumButton({
  children,
  href,
  tone = "ink",
  className = "",
}: PremiumButtonProps) {
  // Split with Array.from so punctuation and spaces keep deterministic indexes.
  // Render two glyph rows for the rolling label and the two crossfading gestures.
}
```

CSS contract in `app/globals.css`:

```css
:root {
  --ease-out-ui: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out-ui: cubic-bezier(0.77, 0, 0.175, 1);
  --shadow-premium:
    0 1px 1px rgb(18 18 18 / 8%),
    0 3px 4px rgb(18 18 18 / 7%),
    0 8px 12px rgb(18 18 18 / 6%),
    0 20px 24px -8px rgb(18 18 18 / 18%);
}

.premium-cta { transition: transform 140ms var(--ease-out-ui); }
.premium-cta:active { transform: scale(.97); }
.premium-cta:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-signal) 70%, white); outline-offset: 4px; }

@media (hover: hover) and (pointer: fine) {
  .premium-cta-glyph { transition: transform 300ms var(--ease-out-ui); transition-delay: calc(var(--glyph-index) * 18ms); }
  .premium-cta:hover .premium-cta-glyph { transform: translate3d(0, -100%, 0); }
  .premium-cta-hand { transition: transform 320ms var(--ease-out-ui), opacity 160ms ease, filter 160ms ease; }
}
```

- [ ] **Step 4: Implement `MediaPlaceholder`, `SectionHeading`, and `PortraitStack`**

`MediaPlaceholder` imports `Image` from `next/image`, renders a stable relative frame, and passes exact
`sizes`. `SectionHeading` animates one clipped line group with opacity and `translate3d(0, 24px, 0)`.
`PortraitStack` uses `getPortraitTransforms`, full `transform` strings, `duration: 0.42`, and `bounce: 0.1`.
Pointer hover sets the expanded state only for `pointerType === "mouse"`; focus reveals instantly; click
toggles for touch. The outer control has:

```tsx
aria-label="Show the matched attendee group"
aria-expanded={expanded}
```

The card frame is 180×180px, 8px paper border, 32px radius, and the approved layered shadow. The group
width is 564px with 8px final gaps. On reduced motion it renders spread immediately.

- [ ] **Step 5: Verify green and lint**

Run: `rtk bun test components/ui/PremiumButton.test.tsx components/ui/PortraitStack.test.tsx`  
Expected: 2 tests pass.  
Run: `rtk bunx tsc --noEmit`  
Expected: no errors.  
Run: `rtk bun run lint`  
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
rtk git add app/globals.css lib/motion.ts components/ui
rtk git commit -m "feat: add premium media and interaction primitives"
```

---

### Task 4: Floating navigation and image-led hero

**Files:**
- Create: `components/sections/Nav.test.tsx`
- Modify: `components/sections/Nav.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `Nav` retains the current anchors and CTA, adds active-section indication and an accessible mobile panel.
- `Hero` consumes `content.media.heroRail`, `PremiumButton`, `SectionHeading`, and `MediaPlaceholder`.

- [ ] **Step 1: Write the failing navigation contract test**

```tsx
// components/sections/Nav.test.tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Nav } from "./Nav";

test("navigation exposes the premium shell and accessible mobile disclosure", () => {
  const html = renderToStaticMarkup(<Nav />);
  expect(html).toContain('aria-label="Primary navigation"');
  expect(html).toContain('aria-label="Open navigation"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain("nav-premium-shell");
});
```

- [ ] **Step 2: Verify RED**

Run: `rtk bun test components/sections/Nav.test.tsx`  
Expected: FAIL because the current nav lacks the accessible mobile disclosure and premium shell class.

- [ ] **Step 3: Rebuild the navigation in place**

Keep the existing `content.nav.links`. Use a 920px desktop maximum, 64px shell, 22–24px radius, 12px
viewport gutter, inner white edge, `ink/8` outer border, and the approved layered shadow only after
scroll. Use an `IntersectionObserver` for active anchors. The mobile disclosure is a button with
`aria-controls="mobile-navigation"`; its panel scales from the button-side origin in 180–220ms and
closes when a link is chosen. Nav label rolling is CSS-only and gated to fine pointers.

- [ ] **Step 4: Recompose the hero**

Keep the approved headline and subcopy. Replace the primary pill with `PremiumButton`; render the
secondary CTA as a quiet underlined text link. Add the five-item media rail from `content.media.heroRail`
with mixed widths, alternating rotations no greater than 6deg, stable aspect ratios, and overflow clipped
at the page level. Keep the first laptop viewport focused on headline and CTA; the rail enters at the
bottom edge rather than pushing copy above the fold.

- [ ] **Step 5: Add the skip link and main target**

Add before `<Nav />` in `app/page.tsx`:

```tsx
<a className="skip-link" href="#main-content">Skip to content</a>
```

Set `<main id="main-content" className="relative">`.

- [ ] **Step 6: Verify**

Run: `rtk bun test components/sections/Nav.test.tsx`  
Expected: PASS.  
Run: `rtk bunx tsc --noEmit`  
Expected: no errors.  
Run: `rtk bun run lint`  
Expected: no errors.  
Browser: verify desktop nav edge definition, CTA hand travel, hero rail, keyboard focus, and mobile panel.

- [ ] **Step 7: Commit**

```bash
rtk git add app/page.tsx components/sections/Nav.tsx components/sections/Nav.test.tsx components/sections/Hero.tsx
rtk git commit -m "feat: polish floating nav and image-led hero"
```

---

### Task 5: Editorial problem, transition, and interactive process rows

**Files:**
- Modify: `components/sections/Problem.tsx`
- Modify: `components/sections/Turn.tsx`
- Modify: `components/sections/HowItWorks.tsx`

**Interfaces:**
- `Problem` consumes `content.media.problem`.
- `HowItWorks` consumes `content.media.how` and keeps `activeStep` in local client state.

- [ ] **Step 1: Write the failing process-state test**

Extend `lib/interactions.test.ts`:

```ts
import { clampPreviewIndex } from "./interactions";

test("preview index stays within the three-step media catalog", () => {
  expect(clampPreviewIndex(-1, 3)).toBe(0);
  expect(clampPreviewIndex(1, 3)).toBe(1);
  expect(clampPreviewIndex(4, 3)).toBe(2);
});
```

Run: `rtk bun test lib/interactions.test.ts`  
Expected: FAIL because `clampPreviewIndex` is missing.

- [ ] **Step 2: Implement `clampPreviewIndex` and verify green**

```ts
export function clampPreviewIndex(index: number, count: number) {
  if (count < 1) return 0;
  return Math.min(Math.max(index, 0), count - 1);
}
```

Run: `rtk bun test lib/interactions.test.ts`  
Expected: all interaction tests pass.

- [ ] **Step 3: Recompose `Problem`**

Use one large framed `problem` image on the left and the existing three statistics as editorial rows on
the right. Remove the equal three-card grid. Give each row a mono index, an ember marker, a hairline, and
a fine-pointer hover/focus state that translates the marker by 8px. Preserve the dark act and soften both
section boundaries with 160–220px gradients.

- [ ] **Step 4: Refine `Turn`**

Replace the flat ember surface with bone plus an oversized ember radial wash, smaller signal wash, and
the existing crossing threads. Reveal the sentence as one masked block. Keep the section content-sized;
do not use exactly `100vh`.

- [ ] **Step 5: Recompose `HowItWorks`**

Desktop: rows occupy two-thirds and one sticky 4:3 media preview occupies one-third. Pointer hover and
keyboard focus update `activeStep`; images crossfade with `clip-path`, opacity, and at most 2px blur in
240ms. Mobile: each row renders its own image inline so information never depends on hover. Preserve all
existing step copy and anchors.

- [ ] **Step 6: Verify and commit**

Run: `rtk bun test lib/interactions.test.ts`  
Run: `rtk bunx tsc --noEmit`  
Run: `rtk bun run lint`  
Browser: verify dark-section continuity, How preview switching, keyboard focus, and mobile inline media.

```bash
rtk git add lib/interactions.ts lib/interactions.test.ts components/sections/Problem.tsx components/sections/Turn.tsx components/sections/HowItWorks.tsx
rtk git commit -m "feat: add editorial problem and interactive process"
```

---

### Task 6: Measured match stack and media-led outcomes

**Files:**
- Modify: `components/sections/Reveal.tsx`
- Modify: `components/sections/Testimonials.tsx`

**Interfaces:**
- `Reveal` uses `PortraitStack` and the three approved portrait records.
- `Testimonials` uses the feature outcome image plus three local avatar records.

- [ ] **Step 1: Replace the initials orbit with `PortraitStack`**

Keep the current heading, body, and statistics. Place the portrait interaction in a spacious left column;
place a mono “matched group” label and gesture-state caption below it. The desktop resting state must use
the tested ±90px/20px/±15deg transforms and spring to an 8px-gap row in approximately 420ms. On focus,
show the spread state instantly. On touch, tap toggles `aria-expanded`. Reduced motion renders spread.

- [ ] **Step 2: Recompose testimonials as an editorial outcome grid**

Desktop uses a two-column feature block: local outcome image with text overlay on one side, outcome copy
and figures on the other. Below it, render two supporting stories with local square avatars and unequal
column widths. Mobile keeps a horizontal draggable track with explicit previous/next controls so drag is
not the only input method. Retain the visible placeholder disclosure.

- [ ] **Step 3: Verify**

Run: `rtk bun test components/ui/PortraitStack.test.tsx lib/interactions.test.ts`  
Run: `rtk bunx tsc --noEmit`  
Run: `rtk bun run lint`  
Browser: compare portrait default/hover geometry to the supplied screenshots; verify tap, focus, drag,
controls, and reduced motion.

- [ ] **Step 4: Commit**

```bash
rtk git add components/sections/Reveal.tsx components/sections/Testimonials.tsx
rtk git commit -m "feat: add measured match stack and outcome stories"
```

---

### Task 7: Spacious FAQ, contact panel, and footer finish

**Files:**
- Create: `components/sections/Faq.test.tsx`
- Modify: `components/sections/Faq.tsx`
- Modify: `components/sections/Contact.tsx`

**Interfaces:**
- `Faq` uses `getNextOpenIndex` and exposes correct disclosure ARIA.
- `Contact` uses visible labels, local artwork, existing non-submitting behavior, and simplified footer links.

- [ ] **Step 1: Write the failing FAQ markup test**

```tsx
// components/sections/Faq.test.tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Faq } from "./Faq";

test("FAQ renders indexed accessible disclosure controls", () => {
  const html = renderToStaticMarkup(<Faq />);
  expect(html).toContain('aria-expanded="true"');
  expect(html).toContain('aria-controls="faq-answer-0"');
  expect(html).toContain('id="faq-answer-0"');
  expect(html).toContain("01");
});
```

- [ ] **Step 2: Verify RED**

Run: `rtk bun test components/sections/Faq.test.tsx`  
Expected: FAIL because the current FAQ lacks disclosure relationships and indexes.

- [ ] **Step 3: Rebuild the FAQ layout and state**

Use a 35/65 desktop split with sticky heading, mono indexes, 20–24px questions, 32–40px row padding, and
hairlines. Keep one row open with `getNextOpenIndex`. Every button sets `aria-expanded` and
`aria-controls`; every answer has the matching `id` and `role="region"`. Enter in 240ms and exit in
180ms. Hover background is fine-pointer-only; focus ring remains visible.

- [ ] **Step 4: Recompose contact and footer**

Create one large rounded panel combining local contact artwork, proof text, and the existing form. Replace
placeholder-only inputs with visible `<label>` elements while retaining placeholders as examples. Keep
`preventDefault`, required name/email fields, and a submit button using `PremiumButton`. Simplify the
footer to the current primary links, Privacy, Terms, copyright, and the oversized Weft wordmark over the
woven treatment. Privacy and Terms render as visibly disabled text until real routes exist; do not ship
dead `href="#"` links.

- [ ] **Step 5: Verify and commit**

Run: `rtk bun test components/sections/Faq.test.tsx lib/interactions.test.ts`  
Run: `rtk bunx tsc --noEmit`  
Run: `rtk bun run lint`  
Browser: verify accordion spacing, one-open state, keyboard control, form labels, focus order, and mobile
stacking.

```bash
rtk git add components/sections/Faq.tsx components/sections/Faq.test.tsx components/sections/Contact.tsx
rtk git commit -m "feat: polish FAQ contact and footer"
```

---

### Task 8: Global motion cleanup and full responsive verification

**Files:**
- Modify: `components/ui/RevealText.tsx`
- Modify: `components/ui/WeaveCanvas.tsx`
- Modify: `components/ui/SectionShell.tsx`
- Modify: `app/globals.css`
- Modify: any section file with a verified responsive or accessibility defect

**Interfaces:**
- Removes repeated per-word writing as the dominant reveal.
- Keeps the weave as a subtle narrative spine without obscuring text or creating scroll jank.

- [ ] **Step 1: Replace remaining repeated word reveals**

Migrate section headings to `SectionHeading`. Keep `RevealText` only where a deliberately staggered short
phrase adds meaning; otherwise make it a single masked group. Remove blur values above 4px and entry
durations above 600ms. Keep decorative stagger between 30ms and 60ms.

- [ ] **Step 2: Audit motion code mechanically**

Run:

```bash
rtk grep -n "transition-all|ease-in|scale(0)|duration-700|duration-1000" app components lib
```

Expected: no invalid interaction patterns. Any intentional `ease-in-out` is allowed only for on-screen
movement and must use the custom curve.

- [ ] **Step 3: Run the complete automated verification set**

```bash
rtk bun test
rtk bunx tsc --noEmit
rtk bun run lint
rtk bun run build
```

Expected: all tests pass; typecheck, lint, and production build complete without warnings or errors.

- [ ] **Step 4: Browser QA at required widths**

Using the already-running Bun development server, verify:

- 1440×900 and 1280×800: hero fits, nav is optically centered, FAQ/How use width well.
- 1024×768 and 768×1024: editorial grids collapse intentionally and sticky elements release.
- 430×932 and 375×812: no horizontal scroll, portrait control scales, mobile nav and touch states work.
- Fine pointer: CTA hand crosses left-to-right, rolling glyphs are interruptible, portraits spread.
- Keyboard: skip link, nav, How rows, portrait control, FAQ, form, and footer follow logical order.
- Reduced motion: no travel, parallax, rolling text, or springs; all final content remains visible.
- Console: no errors, hydration warnings, missing image warnings, or failed requests.

- [ ] **Step 5: Apply only defects found by QA, then rerun affected checks**

Record each verified defect in the commit body and change only the component responsible. Rerun the full
automated verification set after the final visual fix.

- [ ] **Step 6: Final commit**

```bash
rtk git add app components lib content.ts content.test.ts public/placeholders/weft package.json
rtk git commit -m "feat: complete premium responsive landing polish"
```

---

## Plan self-review

- **Spec coverage:** Navigation, hero, ten-plus image slots, problem, transition, How preview, measured
  portrait stack, outcomes, FAQ, contact, footer, responsiveness, accessibility, motion, and verification
  each map to a task.
- **Test-first coverage:** Deterministic transform/accordion/preview helpers and the new accessible markup
  contracts are written and observed failing before implementation.
- **Asset integrity:** Every source hash, semantic destination, intrinsic dimension, alt string, and local
  runtime path is explicit. No Downloads path or Framer URL ships in production.
- **Type consistency:** All media records use the same `src/width/height/alt/placeholder` shape. The exact
  transform and disclosure helper names remain unchanged across tasks.
- **Scope:** No backend, analytics, new route, image generation, dependency migration, or marketing-copy
  rewrite is included.
