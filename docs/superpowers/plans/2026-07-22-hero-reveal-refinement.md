# Hero Reveal Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero message and deliver a CTA-first, accessible word-by-word headline reveal.

**Architecture:** Keep editorial copy in `content.ts`. `Hero` remains the existing narrow Client Component and owns the Motion entrance timing; it will render semantic word spans inside the `h1`. CSS controls headline scale, the horizontal initial hand pose, and responsive layout while reduced-motion users receive all content immediately.

**Tech Stack:** Next.js 16.2.11 App Router, React 19.2.4, TypeScript, Motion 12, Tailwind CSS 4, Bun test runner.

## Global Constraints

- Preserve the approved text verbatim: `Real matches at neworking events.` and `In that networking event there's someone you align with, somoene you need. Weft helps you find them`.
- Do not add dependencies or change `app/page.tsx` into a Client Component.
- Keep the primary CTA target `#contact`, visible label, and focus behavior unchanged.
- Keep the secondary CTA as commented JSX; it must not render.
- Use the existing `useReducedMotion` behavior so reduced-motion users get content immediately.
- Use the existing Motion dependency and `--ease-out-ui` curve.
- Prefix every shell command with `rtk`.
- Leave the unrelated modified premium-polish plan and untracked `.serena/` directory untouched.

---

### Task 1: Define the new hero content and rendered markup contract

**Files:**
- Create: `components/sections/Hero.test.tsx`
- Modify: `content.test.ts`
- Modify: `content.ts`

**Interfaces:**
- `content.hero.headline` supplies one line: `{ text: "Real matches at neworking events.", muted: "" }`.
- `Hero` renders each headline word in an element with `data-hero-word` and renders no `.hero-secondary-link`.

- [ ] **Step 1: Write the failing content and hero tests**

Append this test to `content.test.ts`:

```ts
test("uses the approved hero message", () => {
  expect(content.hero.headline).toEqual([
    { text: "Real matches at neworking events.", muted: "" },
  ]);
  expect(content.hero.sub).toBe(
    "In that networking event there's someone you align with, somoene you need. Weft helps you find them",
  );
});
```

Create `components/sections/Hero.test.tsx`:

```tsx
import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "./Hero";

test("hero renders CTA-first markup with separately addressable headline words", () => {
  const html = renderToStaticMarkup(<Hero />);

  expect(html).toContain('class="hero-actions hero-actions--initial"');
  expect(html).toContain('aria-label="Book a demo"');
  expect(html).toContain('data-hero-word="Real"');
  expect(html).toContain('data-hero-word="matches"');
  expect(html).toContain('data-hero-word="at"');
  expect(html).toContain('data-hero-word="neworking"');
  expect(html).toContain('data-hero-word="events."');
  expect(html).toContain(
    "In that networking event there&#x27;s someone you align with, somoene you need. Weft helps you find them",
  );
  expect(html).not.toContain("hero-secondary-link");
});
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `rtk bun test content.test.ts components/sections/Hero.test.tsx`  
Expected: FAIL because the current hero copy, CTA class, word spans, and visible secondary link do not meet this contract.

- [ ] **Step 3: Update the approved copy in `content.ts`**

Replace the `hero` copy with:

```ts
hero: {
  headline: [{ text: "Real matches at neworking events.", muted: "" }],
  sub: "In that networking event there's someone you align with, somoene you need. Weft helps you find them",
  ctaPrimary: "Book a demo",
  ctaSecondary: "See how it works",
  ycLabel: "Backed by Y Combinator",
},
```

- [ ] **Step 4: Verify the content portion is green**

Run: `rtk bun test content.test.ts`  
Expected: all content tests pass; the Hero test remains red until Task 2.

- [ ] **Step 5: Commit the content contract**

```bash
rtk git add content.ts content.test.ts components/sections/Hero.test.tsx
rtk git commit -m "test: define hero copy and markup contract"
```

### Task 2: Implement CTA-first word choreography

**Files:**
- Modify: `components/sections/Hero.tsx`

**Interfaces:**
- `Hero` derives `headlineWords` from `content.hero.headline` and renders `motion.span` per word.
- The initial CTA uses `hero-actions hero-actions--initial` and has no hidden initial state.
- Later motion elements receive `initial={false}` when reduced motion is enabled.

- [ ] **Step 1: Implement the word and timing helpers at the top of `Hero.tsx`**

Add after `railClasses`:

```ts
const wordRevealDelay = 0.28;
const wordRevealStagger = 0.1;
const wordRevealDuration = 0.42;
const heroEase = [0.23, 1, 0.32, 1] as const;

function getHeadlineWords(lines: readonly { text: string; muted: string }[]) {
  return lines
    .flatMap(({ text, muted }) => [text, muted].filter(Boolean))
    .flatMap((line) => line.split(/\s+/).filter(Boolean));
}
```

Inside `Hero`, directly after reading `content`, add:

```ts
const headlineWords = getHeadlineWords(hero.headline);
const supportingDelay = wordRevealDelay + headlineWords.length * wordRevealStagger + 0.18;
```

- [ ] **Step 2: Replace the hero copy order and heading markup**

Render the always-visible CTA before the animated elements so it is the first visible hero content on load:

```tsx
<motion.div className="hero-actions hero-actions--initial" initial={false}>
  <PremiumButton href="#contact" tone="ink">
    {hero.ctaPrimary}
  </PremiumButton>
  {/*
  <a className="hero-secondary-link" href="#how">
    <span>{hero.ctaSecondary}</span>
    <span aria-hidden="true">↘</span>
  </a>
  */}
</motion.div>

<motion.h1 className="font-display text-balance hero-title" initial={false}>
  {headlineWords.map((word, index) => (
    <motion.span
      animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      className="hero-title-word"
      data-hero-word={word}
      initial={reduce ? false : { opacity: 0, transform: "translate3d(0, 0.38em, 0)" }}
      key={`${word}-${index}`}
      transition={{
        delay: reduce ? 0 : wordRevealDelay + index * wordRevealStagger,
        duration: wordRevealDuration,
        ease: heroEase,
      }}
    >
      {word}{index < headlineWords.length - 1 ? "\u00a0" : ""}
    </motion.span>
  ))}
</motion.h1>
```

Do not import or render `SectionHeading` in `Hero` after this replacement.

- [ ] **Step 3: Stagger the remaining elements after the headline**

Apply the same `opacity` plus `translate3d(0, 16px, 0)` entrance to the eyebrow, subheadline, proof, and rail. Use `supportingDelay`, `supportingDelay + 0.1`, `supportingDelay + 0.2`, and `supportingDelay + 0.3` respectively; use `duration: 0.48` and `ease: heroEase` for the text/proof and `duration: 0.68` for the rail. Each must use `initial={reduce ? false : ...}` and a zero delay when `reduce` is true.

- [ ] **Step 4: Verify green**

Run: `rtk bun test content.test.ts components/sections/Hero.test.tsx`  
Expected: all focused tests pass.

- [ ] **Step 5: Commit the choreography**

```bash
rtk git add components/sections/Hero.tsx components/sections/Hero.test.tsx content.ts content.test.ts
rtk git commit -m "feat: add CTA-first hero word reveal"
```

### Task 3: Reduce type scale and set the hand’s initial pose

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- `.hero-title` uses a smaller desktop clamp and inline `.hero-title-word` spans.
- `.premium-cta-hand-marker` begins left of the CTA and rotates the existing raised-point icon toward the button.

- [ ] **Step 1: Update the hero typography and word layout**

Replace the desktop title rule and its line rule with:

```css
.hero-title {
  max-width: 760px;
  margin-top: 1.5rem;
  color: var(--color-ink);
  font-size: clamp(2.75rem, 4.25vw, 4.5rem);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1;
}

.hero-title-word { display: inline-block; }
.hero-actions--initial { margin-top: 2rem; }
```

Keep the existing mobile title clamp, which is already comfortably smaller. Remove the obsolete `.hero-title > span + span` rule.

- [ ] **Step 2: Set the initial hand position from the supplied reference**

Replace the initial hand marker transform with the horizontal pose:

```css
.premium-cta-hand-marker {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--color-ink);
  transform: translate3d(-50%, 0, 0) rotate(82deg);
}
```

In the fine-pointer hover rule, preserve left-to-right travel while retaining the horizontal pose:

```css
.premium-cta-cluster:hover .premium-cta-hand-marker {
  transform: translate3d(50%, 0, 0) rotate(95deg);
}
```

- [ ] **Step 3: Run the full automated verification**

Run: `rtk bun test`  
Expected: all Bun tests pass.

Run: `rtk bun run lint`  
Expected: no lint errors.

Run: `rtk bun run build`  
Expected: production build completes without errors.

- [ ] **Step 4: Visually verify the first-load sequence**

Run: `rtk bun run dev`  
Expected: local Next development server starts.

At a desktop viewport and a mobile viewport, reload and verify: the CTA/hand is visible first; words reveal left-to-right; YC label, subheadline, proof, and rail follow; the secondary link does not render; keyboard focus reaches the CTA; and reduced-motion mode shows all content immediately.

- [ ] **Step 5: Commit visual refinement**

```bash
rtk git add app/globals.css
rtk git commit -m "style: refine hero scale and CTA hand pose"
```

## Plan self-review

- **Spec coverage:** Tasks cover exact copy, smaller headline, commented secondary CTA, CTA-first loading, word-level headline reveal, staggered support reveal, initial horizontal hand pose, responsive scale, and reduced motion.
- **Test-first coverage:** Task 1 adds copy and static hero markup tests, observes them red, then confirms them green after Tasks 1–2.
- **Type consistency:** `getHeadlineWords` accepts the literal `content.hero.headline` shape and returns only string words consumed by the `motion.span` map.
- **Scope:** No changes to routing, dependencies, other landing sections, or unrelated workspace files.
