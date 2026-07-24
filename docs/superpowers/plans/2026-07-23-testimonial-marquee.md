# Testimonial Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static supporting testimonial layouts with a five-review, continuously left-moving rail that pauses for hover and focus.

**Architecture:** Keep the feature/outcome grid intact. The testimonial component renders two flex sets of the same content; global CSS translates the combined track by exactly one set to make a seamless loop. The content catalog gains five source reviews and enough portrait metadata to pair every review with an image.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, global CSS animation, Bun tests.

## Global Constraints

- Follow the `Turn` gallery's duplicated-set, CSS-only marquee model.
- Pause automatic movement on hover or when any rail card has focus within it.
- Do not animate when `prefers-reduced-motion: reduce` is enabled.
- Keep all review copy and asset metadata in `content.ts`.

---

### Task 1: Expand testimonial content and its contract test

**Files:**
- Modify: `content.ts:86-109,249-278`
- Modify: `content.test.ts:41-54`

**Interfaces:**
- Consumes: `content.media.testimonialAvatars` and `content.testimonials.items`.
- Produces: five testimonial entries and five corresponding portrait records.

- [ ] **Step 1: Write the failing test**

```ts
expect(content.testimonials.items).toHaveLength(5);
expect(content.media.testimonialAvatars).toHaveLength(5);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test content.test.ts`
Expected: FAIL because both lists currently have three entries.

- [ ] **Step 3: Write minimal implementation**

```ts
testimonialAvatars: [first, second, third, fourth, fifth],
testimonials: { items: [firstReview, secondReview, thirdReview, fourthReview, fifthReview] },
```

Use the existing three local portrait assets cyclically for the two new placeholder records, with unique descriptive alt text. Add two distinct placeholder quotes, names, and titles.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test content.test.ts`
Expected: PASS.

### Task 2: Render the duplicated review rail

**Files:**
- Modify: `components/sections/Testimonials.tsx:1-194`
- Modify: `components/sections/Testimonials.test.tsx:5-22`

**Interfaces:**
- Consumes: five `content.testimonials.items` entries and five `content.media.testimonialAvatars` entries.
- Produces: a labelled `.testimonial-rail` containing two `.testimonial-rail-set` elements; the duplicate set has `aria-hidden`.

- [ ] **Step 1: Write the failing test**

```ts
expect(html).toContain('class="testimonial-rail"');
expect(html).toContain('class="testimonial-rail-set"');
expect(html).toContain('aria-hidden="true"');
expect(html).not.toContain('aria-label="Previous story"');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/sections/Testimonials.test.tsx`
Expected: FAIL because the current component renders static desktop stories and a manual mobile carousel.

- [ ] **Step 3: Write minimal implementation**

```tsx
const railSets = [
  { id: "source", isDuplicate: false },
  { id: "duplicate", isDuplicate: true },
] as const;

{railSets.map(({ id, isDuplicate }) => (
  <div aria-hidden={isDuplicate || undefined} className="testimonial-rail-set" key={id}>
    {testimonials.items.map((story, index) => <TestimonialCard key={`${id}-${story.quote}`} story={story} media={media.testimonialAvatars[index]} />)}
  </div>
))}
```

Create `TestimonialCard` in the same file. It renders a square `MediaPlaceholder` followed by the quote, name, and title, with the quote constrained by `max-w-[24rem]`. Remove the scrolling ref, arrow controls, `moveStory`, and the desktop/mobile supporting-story branches.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/sections/Testimonials.test.tsx`
Expected: PASS.

### Task 3: Add the motion, pause, and reduced-motion styling

**Files:**
- Modify: `app/globals.css:483-520,646-665`
- Modify: `components/sections/Testimonials.test.tsx:5-22`

**Interfaces:**
- Consumes: `.testimonial-rail`, `.testimonial-rail-viewport`, `.testimonial-rail-track`, and `.testimonial-rail-set` markup from Task 2.
- Produces: a continuous CSS animation named `testimonial-rail-glide` that can be paused without JavaScript.

- [ ] **Step 1: Write the failing test**

```ts
expect(html).toContain("testimonial-rail-track");
expect(html).toContain("max-w-[24rem]");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/sections/Testimonials.test.tsx`
Expected: FAIL until the track and compact quote class are rendered.

- [ ] **Step 3: Write minimal implementation**

```css
.testimonial-rail-track { animation: testimonial-rail-glide 54s linear infinite; }
.testimonial-rail-viewport:hover .testimonial-rail-track,
.testimonial-rail-viewport:focus-within .testimonial-rail-track { animation-play-state: paused; }
@keyframes testimonial-rail-glide { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
@media (prefers-reduced-motion: reduce) { .testimonial-rail-track { animation: none; } }
```

Size cards responsively with a stable horizontal layout; preserve readable cards on narrow viewports.

- [ ] **Step 4: Run focused tests and static checks**

Run: `bun test components/sections/Testimonials.test.tsx content.test.ts && bun run lint && bun run build`
Expected: all commands PASS.

### Task 4: Apply the neutral card treatment

**Files:**
- Modify: `components/sections/Testimonials.tsx:17,101`
- Modify: `components/sections/Testimonials.test.tsx:5-26`
- Modify: `app/globals.css:514-580`

**Interfaces:**
- Consumes: the existing `SectionShell` `className` override and testimonial rail CSS classes.
- Produces: a `#f4f4f5` Stories background and white, shadow-free testimonial cards.

- [ ] **Step 1: Write the failing test**

```ts
expect(html).toContain("bg-[#f4f4f5]");
expect(html).toContain("testimonial-rail-card bg-white");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test components/sections/Testimonials.test.tsx -t "testimonials renders a duplicated, compact review rail"`
Expected: FAIL because the section is still warm and the cards do not declare a white surface.

- [ ] **Step 3: Write minimal implementation**

```tsx
<SectionShell className="scroll-mt-20 bg-[#f4f4f5] md:scroll-mt-24" id="stories" />
<article className="testimonial-rail-card bg-white" />
```

```css
.testimonial-rail-card { border: 1px solid rgb(18 18 18 / 8%); border-radius: 2rem; padding: clamp(1rem, 2vw, 1.75rem); }
.testimonial-rail-portrait { box-shadow: none; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test components/sections/Testimonials.test.tsx -t "testimonials renders a duplicated, compact review rail"`
Expected: PASS.
