# Hero Gliding Media Rail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the hero images into a seamless, slowly gliding carousel whose hovered card returns to an upright neutral pose without pausing the track.

**Architecture:** `Hero` will render two equal visual media sets: one accessible source set and one decorative `aria-hidden` duplicate. CSS will animate their shared track by exactly one set width, while individual cards retain independent rotation and vertical-offset longhands so hover can neutralize only the card.

**Tech Stack:** Next.js 16.2.11 App Router, React 19.2.4, TypeScript, Tailwind CSS 4 global stylesheet, Motion 12, Bun test runner.

## Global Constraints

- Preserve existing hero copy, CTA, image assets, CTA target, and entrance choreography.
- Modify only `components/sections/Hero.tsx`, `components/sections/Hero.test.tsx`, and `app/globals.css`.
- Add no dependencies or routes.
- Keep `Hero` as the existing Client Component; do not move client behavior into `app/page.tsx`.
- The duplicate visual media set must be `aria-hidden`; source images retain their current semantics.
- Carousel movement is linear, slow, seamless, and must continue while a card is hovered.
- On a fine pointer hover, only the active card becomes `rotate(0deg)` with zero vertical offset.
- In `prefers-reduced-motion`, do not animate the track and show a static centered arrangement.
- Prefix every shell command with `rtk`.
- Leave unrelated modified and untracked workspace files untouched.

---

### Task 1: Define the duplicated-rail markup contract

**Files:**
- Modify: `components/sections/Hero.test.tsx`

**Interfaces:**
- `Hero` will render `data-hero-media-set="source"` once and `data-hero-media-set="duplicate"` once.
- The duplicate set will have `aria-hidden="true"` and the combined markup will render ten `.hero-media-card` elements.

- [ ] **Step 1: Add a failing media-rail test**

Append this test to `components/sections/Hero.test.tsx`:

```tsx
test("hero renders one accessible media set and one hidden looping duplicate", () => {
  const html = renderToStaticMarkup(<Hero />);

  expect(html).toMatch(/<div[^>]*data-hero-media-set="source"[^>]*>/);
  expect(html).toMatch(
    /<div[^>]*aria-hidden="true"[^>]*data-hero-media-set="duplicate"[^>]*>/,
  );
  expect(html.match(/hero-media-card/g)).toHaveLength(10);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `rtk bun test components/sections/Hero.test.tsx`

Expected: FAIL in the new test because the current hero renders one unlabelled five-card rail and no hidden duplicate set.

- [ ] **Step 3: Commit the test contract**

```bash
rtk git add components/sections/Hero.test.tsx
rtk git commit -m "test: define looping hero rail markup"
```

### Task 2: Render an accessible source set plus decorative duplicate

**Files:**
- Modify: `components/sections/Hero.tsx`
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- `hero-media-viewport` clips the moving content.
- `hero-media-track` contains exactly two `hero-media-set` elements.
- The source set uses `data-hero-media-set="source"`; the duplicate uses `data-hero-media-set="duplicate"` plus `aria-hidden="true"`.

- [ ] **Step 1: Add the rail-set definition**

Add this constant immediately after `railClasses` in `components/sections/Hero.tsx`:

```tsx
const railSets = [
  { id: "source", isDuplicate: false },
  { id: "duplicate", isDuplicate: true },
] as const;
```

- [ ] **Step 2: Replace the current single rail map with two labelled sets**

Inside the existing `motion.div` with `className="hero-media-rail"`, replace the direct `media.heroRail.map(...)` with:

```tsx
<div className="hero-media-viewport">
  <div className="hero-media-track">
    {railSets.map(({ id, isDuplicate }) => (
      <div
        aria-hidden={isDuplicate || undefined}
        className="hero-media-set"
        data-hero-media-set={id}
        key={id}
      >
        {media.heroRail.map((item, index) => (
          <div className={railClasses[index]} key={`${id}-${item.src}`}>
            <MediaPlaceholder
              className="h-full w-full"
              media={item}
              priority={!isDuplicate && index < 3}
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 28vw"
            />
          </div>
        ))}
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Run the focused test and verify GREEN**

Run: `rtk bun test components/sections/Hero.test.tsx`

Expected: PASS. The source marker, hidden duplicate marker, and ten-card assertion all pass without changing existing copy or CTA assertions.

- [ ] **Step 4: Commit the render structure**

```bash
rtk git add components/sections/Hero.tsx components/sections/Hero.test.tsx
rtk git commit -m "feat: duplicate hero rail for seamless looping"
```

### Task 3: Style the continuous glide and per-card hover neutralization

**Files:**
- Modify: `app/globals.css`
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- `hero-media-rail` defines `--hero-media-card-width` and `--hero-media-gap` for both duplicate sets.
- `hero-media-track` uses `hero-media-glide` and is never paused by hover.
- `hero-media-card` transitions `rotate` and `translate` independently from the track transform.

- [ ] **Step 1: Replace the existing rail layout rules**

Replace the current `.hero-media-rail` and `.hero-media-card` rules with these rules, keeping the existing five per-card rotation/translate modifier rules directly below them:

```css
.hero-media-rail {
  --hero-media-card-width: clamp(270px, 28vw, 420px);
  --hero-media-gap: clamp(1rem, 2vw, 1.8rem);
  position: relative;
  width: 100%;
  margin-top: 2.5rem;
}

.hero-media-viewport {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  padding: 1rem 0 4.5rem;
}

.hero-media-track {
  display: flex;
  width: max-content;
  animation: hero-media-glide 46s linear infinite;
  will-change: transform;
}

.hero-media-set {
  display: flex;
  gap: var(--hero-media-gap);
  padding-right: var(--hero-media-gap);
}

.hero-media-card {
  width: var(--hero-media-card-width);
  height: clamp(220px, 22vw, 320px);
  flex: 0 0 var(--hero-media-card-width);
  overflow: hidden;
  border: 8px solid var(--color-paper);
  border-radius: 34px;
  background: var(--color-paper);
  box-shadow: var(--shadow-media);
  transform-origin: 50% 100%;
}

@keyframes hero-media-glide {
  from {
    transform: translate3d(calc(-25% + 50vw), 0, 0);
  }

  to {
    transform: translate3d(calc(-75% + 50vw), 0, 0);
  }
}
```

The `-25%` to `-75%` movement is exactly half the doubled track width, or one media set. The `50vw` term centers the static initial arrangement inside the full-bleed viewport.

- [ ] **Step 2: Replace the existing fine-pointer card hover transition**

Inside `@media (hover: hover) and (pointer: fine)`, replace the current `.hero-media-card` transition and hover declarations with:

```css
.hero-media-card {
  transition: rotate 320ms var(--ease-out-ui), translate 320ms var(--ease-out-ui),
    filter 260ms ease;
}

.hero-media-card:hover {
  rotate: 0deg;
  translate: 0 0;
  filter: saturate(1.04);
}
```

Do not add `animation-play-state`; the `.hero-media-track` animation must remain active during card hover.

- [ ] **Step 3: Replace the mobile rail overrides**

In `@media (max-width: 640px)`, replace the current `.hero-media-rail` and `.hero-media-card` declarations with:

```css
.hero-media-rail {
  --hero-media-card-width: 72vw;
  --hero-media-gap: 0.8rem;
  margin-top: 2.5rem;
}

.hero-media-viewport { padding-bottom: 3rem; }

.hero-media-card {
  height: 48vw;
  min-height: 190px;
  border-width: 6px;
  border-radius: 25px;
}
```

- [ ] **Step 4: Add the reduced-motion static fallback**

Append these declarations inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
.hero-media-track {
  animation: none;
  transform: translate3d(calc(-25% + 50vw), 0, 0);
}
```

- [ ] **Step 5: Run automated verification**

Run: `rtk bun test`

Expected: PASS for all Bun tests, including the new duplicated-rail contract.

Run: `rtk bun run lint`

Expected: exit code 0 with no lint errors.

Run: `rtk bun run build`

Expected: production build completes without errors.

- [ ] **Step 6: Visually verify the interaction**

Run: `rtk bun run dev`

Expected: a local development server starts. At desktop and mobile widths, verify the rail has no visible seam after at least one full cycle, it continues moving under hover, the hovered card becomes upright and returns to its normal tilt after leaving, and reduced-motion mode shows a static centered rail.

- [ ] **Step 7: Commit the styles**

```bash
rtk git add app/globals.css components/sections/Hero.tsx components/sections/Hero.test.tsx
rtk git commit -m "style: glide hero media rail continuously"
```

## Plan Self-Review

- **Spec coverage:** Task 1 establishes the accessible/duplicate-set contract; Task 2 supplies the two equal sets; Task 3 supplies the seamless linear motion, hover-only card neutralization, mobile scale, reduced-motion fallback, and full verification.
- **Placeholder scan:** No TODOs, deferred decisions, or unspecified code steps remain.
- **Type consistency:** The only new render definition is `railSets`, whose `id` and `isDuplicate` properties are consumed in the same component. CSS class names introduced in Task 2 exactly match Task 3.
- **Scope:** The plan preserves the existing client boundary, content, image component, and dependency list, and limits edits to the three approved files.
