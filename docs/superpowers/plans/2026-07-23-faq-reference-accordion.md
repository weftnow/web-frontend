# FAQ Reference Accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing FAQ accordion to match the supplied reference while preserving all content and accessible behavior.

**Architecture:** Keep `Faq` as a small client component because it owns accordion state and event handlers. Modify only its layout and utility classes; the content remains sourced from `content.ts`, and the existing Motion height transition remains the disclosure animation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Motion, Bun test.

## Global Constraints

- Keep the six FAQ questions and answers in `content.ts` unchanged.
- Start all accordion rows collapsed; opening one closes the previously open row.
- Preserve `button`, `aria-expanded`, `aria-controls`, and labelled `region` semantics.
- Use the project’s `rtk` command wrapper for terminal commands.

---

### Task 1: FAQ reference-layout accordion

**Files:**
- Modify: `components/sections/Faq.test.tsx`
- Modify: `components/sections/Faq.tsx`

**Interfaces:**
- Consumes: `content.faq.items`, `getNextOpenIndex`, `SectionShell`, `Eyebrow`, `SectionHeading`, and Motion's `AnimatePresence`/`motion` APIs.
- Produces: `Faq`, an interactive FAQ section that initially renders all button controls with `aria-expanded="false"`.

- [ ] **Step 1: Write the failing test**

```tsx
test("FAQ starts collapsed with accessible disclosure controls", () => {
  const html = renderToStaticMarkup(<Faq />);
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain('aria-expanded="true"');
  expect(html).toContain('aria-controls="faq-answer-0"');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `rtk bun test components/sections/Faq.test.tsx`

Expected: the assertion that no item is expanded fails because `Faq` currently initializes its state with `0`.

- [ ] **Step 3: Write minimal implementation**

```tsx
const [open, setOpen] = useState<number | null>(null);

<SectionShell id="faq" act="light" className="z-[3] bg-[#f5f5f5] !py-16 md:!py-20">
  <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
    {/* centered eyebrow and heading */}
    <div className="mt-8 flex w-full flex-col gap-2.5 md:mt-10 md:gap-3">
      {/* compact white question rows with a small plain plus icon */}
    </div>
  </div>
</SectionShell>
```

Update the existing item markup to remove its index and circular plus treatment, use a padded white rounded row, and retain the answer region directly below its button inside that row.

- [ ] **Step 4: Run focused test to verify it passes**

Run: `rtk bun test components/sections/Faq.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run complete verification**

Run: `rtk bun test && rtk bun run lint && rtk bun run build`

Expected: all tests pass, ESLint reports no errors, and the production build completes successfully.

- [ ] **Step 6: Commit**

```bash
rtk git add components/sections/Faq.tsx components/sections/Faq.test.tsx docs/superpowers/specs/2026-07-23-faq-reference-accordion-design.md docs/superpowers/plans/2026-07-23-faq-reference-accordion.md
rtk git commit -m "feat: restyle FAQ accordion"
```
