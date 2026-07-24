# Testimonial Carousel & Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the auto-scrolling testimonial marquee with a user-driven, arrow-controlled carousel, and redesign the testimonial card to a quote-mark / quote / avatar-footer layout, while scaffolding (unused) video-testimonial support.

**Architecture:** The testimonial rail becomes a native horizontally-scrollable, snap-aligned flex track. Two arrow buttons drive it by calling a pure `getTestimonialScrollTarget` helper (new, in `lib/interactions.ts`) that computes the wrap-aware target `scrollLeft`, keeping the interaction math unit-testable without a DOM. `content.testimonials.items` becomes a discriminated union (`"quote" | "video"`) so `TestimonialCard` can branch on content type; all five current entries stay `"quote"`. `MediaPlaceholder` gains an opt-in `controls` prop for click-to-play video, used by the (not-yet-populated) video branch, without changing its existing autoplay/loop/muted behavior for other callers.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, global CSS (scroll-snap, no keyframe animation), Bun test (`renderToStaticMarkup`-based, no jsdom/interaction testing — matches this codebase's existing test style).

## Global Constraints

- Testimonial cards must have a white background — not the gray shown in the user's reference image.
- No auto-scroll/autoplay. The rail only moves via arrow-button clicks or native user drag/touch/trackpad scroll.
- Arrows always wrap (loop) at both ends — never disabled.
- Video-testimonial support (data shape + card branch + `MediaPlaceholder` `controls` prop) must exist but no testimonial entry uses it yet — all 5 stay `type: "quote"`.
- `MediaPlaceholder`'s existing autoplay/loop/muted behavior for other callers (hero rail, how-it-works video) must be unchanged when `controls` is omitted.
- Tests follow the existing pattern in this repo: `renderToStaticMarkup` + string assertions on the output HTML. No new test infra.

---

### Task 1: Add click-to-play `controls` support to `MediaPlaceholder`

**Files:**
- Modify: `components/ui/MediaPlaceholder.tsx:12-55`
- Create: `components/ui/MediaPlaceholder.test.tsx`

**Interfaces:**
- Consumes: existing `MediaAsset` type (unchanged).
- Produces: `MediaPlaceholder` accepts an optional `controls?: boolean` prop (default `false`). When `true`, the rendered `<video>` has `controls` and omits `autoPlay`/`loop`/`muted`. When omitted/`false`, behavior is identical to today (autoplay, loop, muted, no controls).

- [ ] **Step 1: Write the failing test**

Create `components/ui/MediaPlaceholder.test.tsx`:

```tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MediaPlaceholder, type MediaAsset } from "./MediaPlaceholder";

const video: MediaAsset = {
  src: "/placeholders/weft/video1.mp4",
  width: 1080,
  height: 1350,
  alt: "Sample testimonial clip",
  placeholder: false,
  type: "video",
};

test("video autoplays, loops, and mutes by default", () => {
  const html = renderToStaticMarkup(<MediaPlaceholder media={video} sizes="100vw" />);
  expect(html).toContain('autoPlay=""');
  expect(html).toContain('loop=""');
  expect(html).toContain('muted=""');
  expect(html.includes('controls=""')).toBe(false);
});

test("controls prop swaps to click-to-play with native controls", () => {
  const html = renderToStaticMarkup(<MediaPlaceholder controls media={video} sizes="100vw" />);
  expect(html).toContain('controls=""');
  expect(html.includes('autoPlay=""')).toBe(false);
  expect(html.includes('loop=""')).toBe(false);
  expect(html.includes('muted=""')).toBe(false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/ui/MediaPlaceholder.test.tsx`
Expected: FAIL on the second test — the current component always renders `autoPlay`/`loop`/`muted` and never `controls`, since there is no `controls` prop.

- [ ] **Step 3: Write minimal implementation**

Replace `components/ui/MediaPlaceholder.tsx:12-55` with:

```tsx
export function MediaPlaceholder({
  media,
  className = "",
  loading,
  sizes,
  priority = false,
  controls = false,
}: {
  media: MediaAsset;
  className?: string;
  loading?: "eager" | "lazy";
  sizes: string;
  priority?: boolean;
  controls?: boolean;
}) {
  return (
    <figure className={`media-placeholder ${className}`.trim()}>
      {media.type === "video" ? (
        <video
          aria-label={media.alt}
          autoPlay={!controls}
          className="h-full w-full object-cover"
          controls={controls}
          height={media.height}
          loop={!controls}
          muted={!controls}
          playsInline
          preload={loading === "eager" ? "auto" : "metadata"}
          width={media.width}
        >
          <source src={media.src} />
        </video>
      ) : (
        <Image
          alt={media.alt}
          className="h-full w-full object-cover"
          height={media.height}
          loading={loading}
          priority={priority}
          sizes={sizes}
          src={media.src}
          width={media.width}
        />
      )}
    </figure>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/ui/MediaPlaceholder.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/MediaPlaceholder.tsx components/ui/MediaPlaceholder.test.tsx
git commit -m "feat(media): add click-to-play controls prop to MediaPlaceholder"
```

---

### Task 2: Add a `type` discriminant to testimonial content

**Files:**
- Modify: `content.ts:272-303`
- Modify: `content.test.ts` (add one test near line 56)

**Interfaces:**
- Consumes: nothing new.
- Produces: every entry in `content.testimonials.items` gains a `type: "quote"` literal field, alongside its existing `quote`, `name`, `title` fields.

- [ ] **Step 1: Write the failing test**

Add to `content.test.ts` after the existing `"uses the approved featured story and outcome messages"` test:

```ts
test("every testimonial declares its content type", () => {
  expect(
    content.testimonials.items.every((item) => item.type === "quote"),
  ).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test content.test.ts`
Expected: FAIL — no item currently has a `type` field, so every comparison is `undefined === "quote"` (`false`).

- [ ] **Step 3: Write minimal implementation**

Replace `content.ts:272-303` (the `items:` array inside `testimonials`) with:

```ts
    items: [
      {
        type: "quote",
        quote:
          "The best part was seeing people stay do not want to leave even after the event ended",
        name: "Placeholder Name",
        title: "Head of Events, Placeholder Co.",
      },
      {
        type: "quote",
        quote:
          "Weft did in one evening what our community usually takes six months of Slack to do.",
        name: "Placeholder Name",
        title: "Community Lead, Placeholder Co.",
      },
      {
        type: "quote",
        quote:
          "The reveal moment got a genuine gasp. I have never seen a networking session do that.",
        name: "Placeholder Name",
        title: "Founder, Placeholder Co.",
      },
      {
        type: "quote",
        quote:
          "People left with conversations they were still talking about the next day.",
        name: "Placeholder Name",
        title: "Program Director, Placeholder Co.",
      },
      {
        type: "quote",
        quote:
          "It made a big room feel intentional from the very first introduction.",
        name: "Placeholder Name",
        title: "Experience Lead, Placeholder Co.",
      },
    ],
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content.ts content.test.ts
git commit -m "content: tag testimonials with a quote/video type discriminant"
```

---

### Task 3: Add a pure wrap-aware scroll-target helper

**Files:**
- Modify: `lib/interactions.ts` (append)
- Modify: `lib/interactions.test.ts` (append)

**Interfaces:**
- Consumes: nothing.
- Produces: `getTestimonialScrollTarget({ direction, scrollLeft, maxScroll, step }): number`, where `direction` is `1 | -1`. Returns the `scrollLeft` value the caller should scroll to — `step` past the current position, wrapping to `0` (going forward from the last card) or `maxScroll` (going backward from the first card) when within 4px of the relevant end.

- [ ] **Step 1: Write the failing test**

Append to `lib/interactions.test.ts`:

```ts
import { getTestimonialScrollTarget } from "./interactions";
```

(add `getTestimonialScrollTarget` to the existing named import from `"./interactions"` at the top of the file instead of a second import statement)

```ts
describe("testimonial rail scroll target", () => {
  test("advances by one card", () => {
    expect(
      getTestimonialScrollTarget({ direction: 1, scrollLeft: 0, maxScroll: 900, step: 300 }),
    ).toBe(300);
  });

  test("wraps to the start when advancing past the last card", () => {
    expect(
      getTestimonialScrollTarget({ direction: 1, scrollLeft: 900, maxScroll: 900, step: 300 }),
    ).toBe(0);
  });

  test("wraps to the end when reversing past the first card", () => {
    expect(
      getTestimonialScrollTarget({ direction: -1, scrollLeft: 0, maxScroll: 900, step: 300 }),
    ).toBe(900);
  });

  test("steps back by one card", () => {
    expect(
      getTestimonialScrollTarget({ direction: -1, scrollLeft: 600, maxScroll: 900, step: 300 }),
    ).toBe(300);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test lib/interactions.test.ts`
Expected: FAIL — `getTestimonialScrollTarget` is not exported from `./interactions` yet (import/type error at collection time).

- [ ] **Step 3: Write minimal implementation**

Append to `lib/interactions.ts`:

```ts
export function getTestimonialScrollTarget({
  direction,
  scrollLeft,
  maxScroll,
  step,
}: {
  direction: 1 | -1;
  scrollLeft: number;
  maxScroll: number;
  step: number;
}): number {
  const WRAP_EPSILON = 4;

  if (direction === 1 && scrollLeft >= maxScroll - WRAP_EPSILON) {
    return 0;
  }

  if (direction === -1 && scrollLeft <= WRAP_EPSILON) {
    return maxScroll;
  }

  return Math.min(Math.max(scrollLeft + step * direction, 0), maxScroll);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test lib/interactions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/interactions.ts lib/interactions.test.ts
git commit -m "feat(interactions): add wrap-aware testimonial scroll target helper"
```

---

### Task 4: Rebuild the testimonial rail as an arrow-controlled carousel with redesigned cards

**Files:**
- Modify: `components/sections/Testimonials.tsx:1-133`
- Modify: `app/globals.css:517-604`
- Modify: `components/sections/Testimonials.test.tsx`

**Interfaces:**
- Consumes: `getTestimonialScrollTarget` from `@/lib/interactions` (Task 3), `type: "quote"` items from `content.testimonials.items` (Task 2), `MediaPlaceholder`'s `controls` prop (Task 1).
- Produces: a `.testimonial-rail` region containing two `aria-label`ed arrow buttons (`"Previous story"` / `"Next story"`) and a `.testimonial-rail-viewport` scroll container with one `.testimonial-rail-track` holding exactly 5 `[data-testimonial-card]` articles (no duplicate set). `OutcomeList` and the feature/outcome hero block above the rail are untouched.

- [ ] **Step 1: Write the failing test**

Replace `components/sections/Testimonials.test.tsx` with:

```tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Testimonials } from "./Testimonials";

test("testimonials renders an arrow-controlled review rail", () => {
  const html = renderToStaticMarkup(<Testimonials />);

  expect(html).toContain("Placeholder portrait for the featured event outcome");
  expect(html).toContain("Placeholder portrait for the second testimonial");
  expect(html).toContain("Placeholder portrait for the third testimonial");
  expect(html).toContain("Turn random networking into real connection");
  expect(html).toContain("Make your event impossible to forget");
  expect(html).toContain("Prove your event created real value");
  expect(html).toContain("font-bold leading-snug text-ink");
  expect(html).toContain("text-lg sm:text-xl md:text-2xl");
  expect(html).toContain("scroll-mt-20");
  expect(html).toContain("bg-[#f4f4f5]");
  expect(html.includes("#d8d3cb")).toBe(false);
  expect(html.includes("The outcome")).toBe(false);
  expect(html.includes("92%")).toBe(false);

  expect(html).toContain("testimonial-rail-viewport");
  expect(html).toContain("testimonial-rail-viewport--faded");
  expect(html).toContain("testimonial-rail-track");
  expect(html).toContain("testimonial-rail-card bg-white");
  expect(html).toContain("testimonial-rail-avatar");
  expect(html).toContain('aria-label="Previous story"');
  expect(html).toContain('aria-label="Next story"');
  expect(html).toContain("Placeholder testimonials");

  expect(html.includes("testimonial-rail-set")).toBe(false);
  expect(html.includes("testimonial-rail-card--wide")).toBe(false);

  const cardMatches = html.match(/data-testimonial-card="true"/g) ?? [];
  expect(cardMatches).toHaveLength(5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/sections/Testimonials.test.tsx`
Expected: FAIL — the current component has no arrow buttons, no `data-testimonial-card` markers, and still renders the duplicated `testimonial-rail-set` marquee.

- [ ] **Step 3: Replace the component**

Replace `components/sections/Testimonials.tsx:1-133` with:

```tsx
"use client";

import { useRef } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder, type MediaAsset } from "@/components/ui/MediaPlaceholder";
import { getTestimonialScrollTarget } from "@/lib/interactions";

type QuoteTestimonial = {
  type: "quote";
  quote: string;
  name: string;
  title: string;
};

type VideoTestimonial = {
  type: "video";
  video: MediaAsset;
  name: string;
  title: string;
};

type TestimonialItem = QuoteTestimonial | VideoTestimonial;

export function Testimonials() {
  const { media, testimonials } = content;
  const feature = testimonials.items[0];
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToDirection = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const firstCard = viewport.querySelector<HTMLElement>("[data-testimonial-card]");
    const track = viewport.firstElementChild;
    if (!firstCard || !track) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const step = firstCard.offsetWidth + gap;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const target = getTestimonialScrollTarget({
      direction,
      scrollLeft: viewport.scrollLeft,
      maxScroll,
      step,
    });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    viewport.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <SectionShell
      id="stories"
      act="warm"
      className="scroll-mt-20 bg-[#f4f4f5] md:scroll-mt-24"
    >
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <SectionHeading
          as="h2"
          lines={testimonials.headline}
          className="text-4xl text-ink md:text-5xl"
        />
      </div>

      <div className="mt-14 hidden md:block">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:gap-16">
          <article className="relative aspect-[1.06/1] overflow-hidden rounded-[2rem] shadow-[var(--shadow-media)]">
            <MediaPlaceholder
              className="absolute inset-0 h-full w-full [&_img]:object-[center_55%]"
              media={media.outcome}
              sizes="(max-width: 1023px) 54vw, 620px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(18,18,18,0.86)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-paper lg:p-10">
              <p className="max-w-xl font-display text-2xl leading-snug lg:text-3xl">
                &ldquo;{feature.quote}&rdquo;
              </p>
            </div>
          </article>

          <OutcomeList outcomes={testimonials.outcomes} />
        </div>

      </div>

      <div className="mt-12 md:hidden">
        <div className="grid gap-4">
          <article className="relative aspect-square overflow-hidden rounded-[1.75rem]">
            <MediaPlaceholder
              className="absolute inset-0 h-full w-full [&_img]:object-[center_55%]"
              media={media.outcome}
              sizes="calc(100vw - 3rem)"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(18,18,18,0.86)_100%)]" />
            <p className="absolute inset-x-0 bottom-0 p-6 font-display text-xl leading-snug text-paper">
              &ldquo;{feature.quote}&rdquo;
            </p>
          </article>

          <OutcomeList compact outcomes={testimonials.outcomes} />
        </div>

      </div>

      <div aria-label="Customer stories" className="testimonial-rail relative mt-14" role="region">
        <button
          aria-label="Previous story"
          className="testimonial-rail-arrow left-0 md:left-2"
          onClick={() => scrollToDirection(-1)}
          type="button"
        >
          <ChevronIcon direction="left" />
        </button>

        <div
          className="testimonial-rail-viewport testimonial-rail-viewport--faded"
          ref={viewportRef}
        >
          <div className="testimonial-rail-track">
            {testimonials.items.map((story, index) => (
              <TestimonialCard
                key={story.type === "quote" ? story.quote : story.video.src}
                media={media.testimonialAvatars[index]}
                story={story}
              />
            ))}
          </div>
        </div>

        <button
          aria-label="Next story"
          className="testimonial-rail-arrow right-0 md:right-2"
          onClick={() => scrollToDirection(1)}
          type="button"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <p className="font-meta mt-6 text-[10px] text-ash">
        Placeholder testimonials — replace in content.ts before launch.
      </p>
    </SectionShell>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 ${direction === "right" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function TestimonialCard({
  media,
  story,
}: {
  media: (typeof content.media.testimonialAvatars)[number];
  story: TestimonialItem;
}) {
  return (
    <article className="testimonial-rail-card bg-white" data-testimonial-card tabIndex={0}>
      {story.type === "video" ? (
        <MediaPlaceholder
          className="testimonial-rail-media"
          controls
          media={story.video}
          sizes="(max-width: 640px) 90vw, 40vw"
        />
      ) : (
        <div>
          <span aria-hidden="true" className="font-display text-4xl leading-none text-ink/25">
            &ldquo;
          </span>
          <p className="mt-3 font-display text-xl leading-snug text-ink">
            &ldquo;{story.quote}&rdquo;
          </p>
        </div>
      )}

      <div className="testimonial-rail-footer">
        <MediaPlaceholder className="testimonial-rail-avatar" media={media} sizes="48px" />
        <div className="min-w-0">
          <p className="font-medium text-ink">{story.name}</p>
          <p className="font-meta mt-1 text-[10px] leading-relaxed text-ink/68">{story.title}</p>
        </div>
      </div>
    </article>
  );
}
```

`OutcomeList` (the remainder of the current file, below line 133) is unchanged — leave it exactly as-is below the code above.

- [ ] **Step 4: Replace the CSS**

Replace `app/globals.css:517-604` (from `.testimonial-rail {` through the closing brace of `@keyframes testimonial-rail-glide`) with:

```css
.testimonial-rail {
  --testimonial-rail-card-width: clamp(20rem, 30vw, 26rem);
  --testimonial-rail-gap: clamp(1.25rem, 2.25vw, 2.75rem);
}

.testimonial-rail-viewport {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.testimonial-rail-viewport::-webkit-scrollbar {
  display: none;
}

.testimonial-rail-viewport--faded::before,
.testimonial-rail-viewport--faded::after {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  width: clamp(3rem, 9vw, 10rem);
  content: "";
  pointer-events: none;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.testimonial-rail-viewport--faded::before {
  left: 0;
  background: linear-gradient(90deg, #f4f4f5 8%, rgb(244 244 245 / 82%) 38%, transparent);
}

.testimonial-rail-viewport--faded::after {
  right: 0;
  background: linear-gradient(270deg, #f4f4f5 8%, rgb(244 244 245 / 82%) 38%, transparent);
}

.testimonial-rail-track {
  display: flex;
  width: max-content;
  gap: var(--testimonial-rail-gap);
}

.testimonial-rail-card {
  display: flex;
  flex-direction: column;
  width: var(--testimonial-rail-card-width);
  flex: 0 0 var(--testimonial-rail-card-width);
  border: 1px solid rgb(18 18 18 / 8%);
  border-radius: 2rem;
  padding: clamp(1.5rem, 2.5vw, 2.25rem);
  box-shadow: none;
  outline: none;
  scroll-snap-align: start;
}

.testimonial-rail-card:focus-visible {
  outline: 3px solid var(--color-signal);
  outline-offset: 0.5rem;
}

.testimonial-rail-media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1.25rem;
}

.testimonial-rail-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.5rem;
}

.testimonial-rail-avatar {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 9999px;
  box-shadow: none;
  width: 2.75rem;
  flex: 0 0 2.75rem;
}

.testimonial-rail-arrow {
  position: absolute;
  top: 50%;
  z-index: 20;
  display: flex;
  height: 2.75rem;
  width: 2.75rem;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--color-ink);
  color: var(--color-paper);
  box-shadow: 0 8px 24px rgb(18 18 18 / 18%);
  transition: transform 200ms ease;
}

.testimonial-rail-arrow:hover {
  transform: translateY(-50%) scale(1.05);
}

.testimonial-rail-arrow:focus-visible {
  outline: 3px solid var(--color-signal);
  outline-offset: 2px;
}
```

This removes the `testimonial-rail-glide` keyframes, the hover/focus-pause rule, and the old `--testimonial-rail-portrait-size` variable — none are referenced anymore since there is no animation and no duplicate set to pause.

- [ ] **Step 5: Run test to verify it passes**

Run: `bun test components/sections/Testimonials.test.tsx`
Expected: PASS.

- [ ] **Step 6: Full verification**

Run: `bun test && bun run lint && bun run build`
Expected: all PASS. (`bun test` covers `content.test.ts`, `lib/interactions.test.ts`, `components/ui/MediaPlaceholder.test.tsx`, and `components/sections/Testimonials.test.tsx` together with the rest of the suite.)

- [ ] **Step 7: Commit**

```bash
git add components/sections/Testimonials.tsx components/sections/Testimonials.test.tsx app/globals.css
git commit -m "feat(testimonials): replace auto-scroll marquee with arrow-controlled carousel and redesigned cards"
```
