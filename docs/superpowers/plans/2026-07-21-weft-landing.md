# Weft Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a world-class single-page landing for Weft — a YC-backed AI matchmaking app for B2B networking events — using the Zolo reference for typography, shape, spacing, and motion, rebuilt around a two-act narrative and a woven-thread visual system.

**Architecture:** One route (`app/page.tsx`) composing eight self-contained section components from `components/sections/`. Shared primitives live in `components/ui/`. All copy and placeholder data live in one `content.ts`. Motion via Framer Motion (`motion`), every animation gated behind `prefers-reduced-motion`. A single continuous scroll-driven SVG (`WeaveCanvas`) spans the whole page as the visual spine.

**Tech Stack:** Next.js 16.2.11 (App Router), React 19.2.4, TypeScript, Tailwind CSS v4 (`@theme` in CSS, no config file), `next/font/google` (Comfortaa + Geist Mono), `motion` (Framer Motion v11+).

## Verification loop (this project's substitute for unit tests)

This is a visual project. Each task's deliverable is verified by, in order:

1. **Typecheck:** `npx tsc --noEmit` — expected: no errors.
2. **Lint:** `npx eslint .` — expected: no errors.
3. **Browser check:** with `npm run dev` running, open `http://localhost:3000`, and confirm the specific visual behavior named in the task's "Visual check" line.
4. **Commit.**

A task is "done" only when all four pass. Do not write jest/vitest specs for visual behavior — they add no signal here.

## Global Constraints

- **Next.js is non-standard in this repo.** Before writing any Next-specific API, consult `node_modules/next/dist/docs/`. Heed deprecation notices. (Font API is confirmed standard `next/font/google`; do not assume other APIs are.)
- **Versions:** Next 16.2.11, React 19.2.4, Tailwind v4. Do not downgrade or add a `tailwind.config.js` — Tailwind v4 is configured via `@theme` in `app/globals.css`.
- **Path alias:** `@/*` maps to repo root (`./*`). Import as `@/components/...`, `@/content`.
- **Only one new runtime dependency is permitted:** `motion`. No other packages.
- **Color tokens (exact hex):** `--ember #F4511E`, `--ink #121212`, `--paper #FFFFFF`, `--bone #F7F5F2`, `--signal #0090DE`, `--ash #B4B0AA`. `--ember` and `--signal` never appear as flat adjacent fills — they meet only as crossing threads. `--signal` is never used for a CTA.
- **Type:** headings = Comfortaa, `letter-spacing: -0.05em`, `line-height: 1.14`. Eyebrows/nav/meta = Geist Mono, uppercase, `letter-spacing: 0.12em`.
- **Motion:** every animated component must render a static, final-state version when `prefers-reduced-motion: reduce` is set.
- **Proof integrity:** "Backed by Y Combinator" and the Google logo render as real. All stats, testimonial quotes, and attributed names are placeholders living in `content.ts`. Never invent a number or attribute a fabricated quote to a real person/company.
- **No section is exactly `100vh`.** Equal-height blocks read as slides; vary section heights.

---

## File structure

```
app/
  layout.tsx        (modify) — fonts, metadata, remove boilerplate classes
  globals.css       (modify) — @theme tokens, font vars, base resets
  page.tsx          (modify) — compose sections + WeaveCanvas
content.ts          (create) — all copy, placeholder stats, FAQ, testimonials, logos
lib/
  motion.ts         (create) — shared variants + useReducedMotion helper
components/
  ui/
    Eyebrow.tsx       (create) — mono uppercase pill label
    PillButton.tsx    (create) — pill CTA w/ letter-rise hover
    RevealText.tsx    (create) — per-word blur reveal + two-tone
    SectionShell.tsx  (create) — padding/rhythm wrapper, act theming
    Counter.tsx       (create) — count-up-on-enter number
    WeaveCanvas.tsx   (create) — continuous scroll-driven SVG spine
  sections/
    Nav.tsx           (create) — floating centered nav pill
    Hero.tsx          (create) — §01 hero + logo wall + YC
    Problem.tsx       (create) — §02 dark Act I
    Turn.tsx          (create) — §03 ember wash
    HowItWorks.tsx    (create) — §04 numbered steps
    Reveal.tsx        (create) — §05 group fan-out + stats
    Testimonials.tsx  (create) — §06 drag carousel
    Faq.tsx           (create) — §07 accordion
    Contact.tsx       (create) — §08 split form + giant wordmark footer
```

---

### Task 1: Foundation — dependency, fonts, tokens, clean slate

**Files:**
- Modify: `package.json` (add `motion`)
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: CSS custom properties `--ember --ink --paper --bone --signal --ash`; Tailwind color utilities `bg-ember text-ink bg-bone` etc.; CSS vars `--font-display` (Comfortaa) and `--font-mono` (Geist Mono) on `<html>`; a blank white page.

- [ ] **Step 1: Install motion**

```bash
cd /Users/antoniopertuz/Documents/surnx/weft-web
npm install motion
```
Expected: `package.json` gains `"motion"` under dependencies; no peer-dep errors (motion supports React 19).

- [ ] **Step 2: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-ember: #F4511E;
  --color-ink: #121212;
  --color-paper: #FFFFFF;
  --color-bone: #F7F5F2;
  --color-signal: #0090DE;
  --color-ash: #B4B0AA;

  --font-display: var(--font-comfortaa), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

:root {
  --background: var(--color-paper);
  --foreground: var(--color-ink);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-display);
  overflow-x: hidden;
}

/* Heading rhythm from the Zolo reference */
.font-display {
  font-family: var(--font-display);
  letter-spacing: -0.05em;
  line-height: 1.14;
}

.font-meta {
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Comfortaa, Geist_Mono } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Weft — Networking that actually connects",
  description:
    "Weft is the AI matchmaking app for networking events. We find the people at your event who should be in a room together, and put them there.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${comfortaa.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx` with a minimal placeholder**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bone">
      <h1 className="font-display text-5xl text-ink">weft</h1>
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` → no errors.
Run: `npm run dev`, open `http://localhost:3000`.
Visual check: warm off-white (`#F7F5F2`) page, centered rounded "weft" wordmark in Comfortaa (visibly rounded geometric letterforms, not Arial). No dark-mode flash, no horizontal scrollbar.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: foundation — motion dep, Comfortaa/Geist Mono fonts, color tokens"
```

---

### Task 2: Content model + motion helpers

**Files:**
- Create: `content.ts`
- Create: `lib/motion.ts`

**Interfaces:**
- Produces: `content` object (typed) exporting `nav`, `hero`, `logos`, `problem`, `turn`, `how`, `reveal`, `testimonials`, `faq`, `contact`. Shapes are defined below and consumed by every section task.
- Produces: `wordReveal`, `container`, `fadeUp` motion variants; `useReveal()` hook returning `{ ref, inView }`.

- [ ] **Step 1: Create `content.ts`**

```ts
export const content = {
  nav: {
    links: [
      { label: "The problem", href: "#problem" },
      { label: "How it works", href: "#how" },
      { label: "Stories", href: "#stories" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Try it!",
  },

  hero: {
    // Two-tone: `muted` renders in --ash and resolves last.
    headline: [
      { text: "The person who changes your year is in this room.", muted: "" },
      { text: "You will spend the night talking to", muted: "someone else." },
    ],
    sub: "Weft finds the four people at your event who should be in a room together — and puts them there.",
    ctaPrimary: "Try it!",
    ctaSecondary: "See how it works",
    ycLabel: "Backed by Y Combinator",
  },

  // logos: `google` renders real wordmark component; others are placeholder marks.
  logos: {
    intro: "The teams behind unforgettable events run on Weft",
    real: ["google"] as const,
    placeholders: ["Northwind", "Lumen", "Atlas", "Vela", "Corva"],
  },

  problem: {
    eyebrow: "The room that didn't work",
    headline: [{ text: "Everyone came to connect.", muted: "Almost no one did." }],
    beats: [
      {
        stat: "3",
        label: "the number of people most attendees actually talk to — and they already knew all three.",
      },
      {
        stat: "0:14",
        label: "how long a badge glance takes before the conversation is already deciding not to happen.",
      },
      {
        stat: "1",
        label: "the lasting memory they leave with: a room that felt like work. That memory has your name on it.",
      },
    ],
    kicker:
      "A forgettable event isn't neutral. It's the story your brand tells for the next twelve months.",
  },

  turn: {
    line: [{ text: "So we built the thread that", muted: "pulls the right people together." }],
  },

  how: {
    eyebrow: "How Weft works",
    headline: [{ text: "Three steps.", muted: "One unforgettable room." }],
    steps: [
      {
        n: "01",
        title: "They tell us who they are",
        body: "A two-minute prompt before the event — goals, expertise, what they're looking for, who they want to become. No forms that feel like homework.",
      },
      {
        n: "02",
        title: "The algorithm weaves the groups",
        body: "Weft reads intent, not just industry. It forms small groups where every person is the reason someone else showed up — complementary, not identical.",
      },
      {
        n: "03",
        title: "The room rearranges itself",
        body: "At the moment you choose, everyone learns their group. Strangers walk toward the exact people they came to meet.",
      },
    ],
  },

  reveal: {
    eyebrow: "The moment it clicks",
    headline: [{ text: "Four strangers.", muted: "One reason they're here." }],
    body: "This is the part attendees post about. The reveal turns a room of nametags into the best conversation of their quarter — and turns your event into the one they clear their calendar for next year.",
    // Placeholder stats — replace with real numbers before launch.
    stats: [
      { value: 92, suffix: "%", label: "of matched attendees rate their group a 9 or 10" },
      { value: 3.4, suffix: "x", label: "more qualified conversations vs. open networking" },
      { value: 4.8, suffix: "/5", label: "average event rating after adding Weft" },
    ],
    statsNote: "Placeholder metrics — replace in content.ts before launch.",
    // The five avatars in the fan-out: [attendee, ...four matches]
    group: [
      { initials: "YOU", role: "You" },
      { initials: "AM", role: "The investor you needed" },
      { initials: "RK", role: "Your next hire" },
      { initials: "TS", role: "The operator two steps ahead" },
      { initials: "JD", role: "The partner you didn't know to look for" },
    ],
  },

  testimonials: {
    eyebrow: "Stories",
    headline: [{ text: "The events people", muted: "remember." }],
    // Placeholder quotes and names — replace before launch.
    items: [
      {
        quote:
          "Our attendees stopped asking when they could leave and started asking when the next one is.",
        name: "Placeholder Name",
        title: "Head of Events, Placeholder Co.",
      },
      {
        quote:
          "Weft did in one evening what our community usually takes six months of Slack to do.",
        name: "Placeholder Name",
        title: "Community Lead, Placeholder Co.",
      },
      {
        quote:
          "The reveal moment got a genuine gasp. I have never seen a networking session do that.",
        name: "Placeholder Name",
        title: "Founder, Placeholder Co.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    headline: [{ text: "The things", muted: "people ask." }],
    items: [
      {
        q: "How much does an attendee have to do beforehand?",
        a: "About two minutes. A short intake captures goals, expertise, and who they want to meet. If they skip it, Weft still places them using whatever the organizer provides.",
      },
      {
        q: "What size event does Weft work for?",
        a: "From 30-person dinners to multi-thousand-person conferences. Group sizes and reveal timing are configurable per session.",
      },
      {
        q: "How does the matching actually decide?",
        a: "Weft models intent and complementarity, not just shared industry. It optimizes for groups where each person is high-value to the others, then balances for diversity of perspective.",
      },
      {
        q: "Do organizers get to see how it went?",
        a: "Yes. A live dashboard shows match quality, participation, and post-event ratings you can put in front of sponsors and leadership.",
      },
      {
        q: "Can we brand the experience?",
        a: "The attendee-facing app carries your event's identity. Weft runs the matchmaking; your brand gets the credit.",
      },
    ],
  },

  contact: {
    eyebrow: "Let's talk",
    headline: [{ text: "Make your event the one", muted: "they don't forget." }],
    body: "Tell us about your event. We'll show you the room it could be.",
    fields: {
      name: "Your name",
      email: "Work email",
      event: "What are you organizing?",
    },
    cta: "Try it!",
    wordmark: "weft",
    footerLinks: ["The problem", "How it works", "Stories", "FAQ"],
    copyright: "© 2026 Weft. All rights reserved.",
  },
} as const;

export type Content = typeof content;
```

- [ ] **Step 2: Create `lib/motion.ts`**

```ts
"use client";

import { useRef } from "react";
import { useInView, type Variants } from "motion/react";

export const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/** Fire once when ~30% of the element scrolls into view. */
export function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return { ref, inView };
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors (confirms `motion/react` types resolve and `content` is well-formed).

- [ ] **Step 4: Commit**

```bash
git add content.ts lib/motion.ts
git commit -m "feat: content model and shared motion variants"
```

---

### Task 3: `RevealText` + `Eyebrow` primitives

**Files:**
- Create: `components/ui/RevealText.tsx`
- Create: `components/ui/Eyebrow.tsx`

**Interfaces:**
- Consumes: `container`, `wordReveal` from `@/lib/motion`; headline line shape `{ text: string; muted: string }`.
- Produces:
  - `<RevealText lines={{text,muted}[]} className? as?="h1"|"h2"|"p" />` — renders each line, splitting into words; words in `text` reveal in `--foreground`, words in `muted` reveal in `--ash`. Under reduced motion, renders final state immediately.
  - `<Eyebrow>label</Eyebrow>` — mono uppercase pill.

- [ ] **Step 1: Create `components/ui/Eyebrow.tsx`**

```tsx
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-meta inline-flex items-center gap-2 rounded-full bg-ink/[0.06] px-3 py-1 text-xs text-ink/70">
      <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create `components/ui/RevealText.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { container, wordReveal } from "@/lib/motion";

type Line = { text: string; muted: string };

export function RevealText({
  lines,
  className = "",
  as = "h2",
}: {
  lines: readonly Line[];
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const Tag = motion[as];
  const reduce = useReducedMotion();

  const renderWords = (str: string, muted: boolean) =>
    str
      .split(" ")
      .filter(Boolean)
      .map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={reduce ? undefined : wordReveal}
          className={`inline-block ${muted ? "text-ash" : ""}`}
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ));

  return (
    <Tag
      className={`font-display ${className}`}
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {renderWords(line.text, false)}
          {line.muted ? renderWords(line.muted, true) : null}
        </span>
      ))}
    </Tag>
  );
}
```

- [ ] **Step 3: Wire a temporary preview into `app/page.tsx`**

```tsx
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { content } from "@/content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bone px-6">
      <Eyebrow>{content.hero.ycLabel}</Eyebrow>
      <RevealText as="h1" lines={content.hero.headline} className="max-w-4xl text-center text-5xl md:text-7xl" />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → no errors.
Run: `npx eslint .` → no errors.
Visual check (`localhost:3000`): on load, the headline words animate in left-to-right with a brief blur-to-sharp; the phrase "someone else." is grey (`--ash`) while the rest is near-black. Reload with OS "reduce motion" on → text appears instantly, still correctly two-toned.

- [ ] **Step 5: Commit**

```bash
git add components/ui/RevealText.tsx components/ui/Eyebrow.tsx app/page.tsx
git commit -m "feat: RevealText (per-word blur + two-tone) and Eyebrow primitives"
```

---

### Task 4: `PillButton` + `Counter` primitives

**Files:**
- Create: `components/ui/PillButton.tsx`
- Create: `components/ui/Counter.tsx`

**Interfaces:**
- Produces:
  - `<PillButton href? variant?="solid"|"outline"|"light" className?>label</PillButton>` — pill; on hover each letter of the label rises and returns with a per-letter stagger. `solid` = ember bg / paper text; `outline` = transparent w/ ink border; `light` = paper bg / ink text (for dark sections). Renders `<a>` when `href` given, else `<button>`. Reduced motion → no letter animation.
  - `<Counter value={number} suffix?={string} />` — counts from 0 to `value` when scrolled into view; supports one decimal place.

- [ ] **Step 1: Create `components/ui/PillButton.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

const styles = {
  solid: "bg-ember text-paper",
  outline: "bg-transparent text-ink ring-1 ring-inset ring-ink/15",
  light: "bg-paper text-ink",
} as const;

export function PillButton({
  children,
  href,
  variant = "solid",
  className = "",
}: {
  children: string;
  href?: string;
  variant?: keyof typeof styles;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const letters = children.split("");

  const inner = reduce ? (
    <span>{children}</span>
  ) : (
    <span className="relative flex overflow-hidden whitespace-pre" aria-label={children}>
      {letters.map((ch, i) => (
        <span key={i} className="relative inline-block" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: 0 }}
            whileHover={{ y: "-110%" }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );

  const cls = `group inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-transform duration-300 hover:scale-[1.02] ${styles[variant]} ${className}`;

  // Letter-rise on the whole button's hover: use a wrapper that swaps two stacked copies.
  const content = reduce ? (
    children
  ) : (
    <span className="relative block h-[1.2em] overflow-hidden">
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );

  return href ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <button type="button" className={cls}>
      {content}
    </button>
  );
}
```

> Note: the plan uses the CSS group-hover two-copy technique (the `content` variable) for the letter rise — it is smoother and cheaper than per-letter motion springs and matches the Zolo feel. The `inner` variable above is unused; delete it and keep only `content`. Final file must not contain `inner`/`letters`.

- [ ] **Step 2: Clean `PillButton.tsx` to final form**

Remove the unused `inner` and `letters` code so the file is exactly:

```tsx
"use client";

const styles = {
  solid: "bg-ember text-paper",
  outline: "bg-transparent text-ink ring-1 ring-inset ring-ink/15",
  light: "bg-paper text-ink",
} as const;

export function PillButton({
  children,
  href,
  variant = "solid",
  className = "",
}: {
  children: string;
  href?: string;
  variant?: keyof typeof styles;
  className?: string;
}) {
  const cls = `group inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-transform duration-300 hover:scale-[1.02] ${styles[variant]} ${className}`;

  const content = (
    <span className="relative block h-[1.25em] overflow-hidden leading-[1.25em]">
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );

  return href ? (
    <a href={href} className={cls}>
      {content}
    </a>
  ) : (
    <button type="button" className={cls}>
      {content}
    </button>
  );
}
```

- [ ] **Step 3: Create `components/ui/Counter.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const decimals = value % 1 !== 0 ? 1 : 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 4: Preview both in `app/page.tsx`**

Add below the RevealText: `<PillButton href="#">Book a demo</PillButton>` and `<div className="text-6xl font-display"><Counter value={3.4} suffix="x" /></div>`.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors (confirms no unused `inner`/`letters`).
Visual check: hovering the pill makes the label slide up and a duplicate slides in from below (continuous rise). The counter animates 0 → 3.4x once when it enters view. Reduce-motion: pill label static, counter jumps straight to 3.4x.

- [ ] **Step 6: Commit**

```bash
git add components/ui/PillButton.tsx components/ui/Counter.tsx app/page.tsx
git commit -m "feat: PillButton (letter-rise hover) and Counter (count-up) primitives"
```

---

### Task 5: `SectionShell` + `WeaveCanvas` (the continuous spine)

**Files:**
- Create: `components/ui/SectionShell.tsx`
- Create: `components/ui/WeaveCanvas.tsx`

**Interfaces:**
- Produces:
  - `<SectionShell id? act?="light"|"dark"|"warm"|"ember" className? children />` — vertical rhythm wrapper. Sets background + text color by act, generous asymmetric padding (`py-28 md:py-40`), and `position: relative` so the weave can sit behind. Never sets a fixed height.
  - `<WeaveCanvas />` — a `position: fixed`, full-viewport, pointer-events-none SVG behind all content. Two paths (ember + signal) whose `pathLength` is driven by page scroll progress; they run near-parallel through the top of the page and cross near the middle (the turn). Reduced motion → paths render at full length, statically crossed.

- [ ] **Step 1: Create `components/ui/SectionShell.tsx`**

```tsx
const acts = {
  light: "bg-paper text-ink",
  warm: "bg-bone text-ink",
  dark: "bg-ink text-paper",
  ember: "bg-ember text-paper",
} as const;

export function SectionShell({
  id,
  act = "warm",
  className = "",
  children,
}: {
  id?: string;
  act?: keyof typeof acts;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden px-6 py-28 md:px-10 md:py-40 ${acts[act]} ${className}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/ui/WeaveCanvas.tsx`**

```tsx
"use client";

import { useScroll, useSpring, useTransform, motion, useReducedMotion } from "motion/react";

export function WeaveCanvas() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });

  // Draw both threads in lockstep with scroll.
  const draw = useTransform(progress, [0, 1], [0, 1]);
  const staticDraw = 1;

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* Ember thread — starts left, weaves to right past the turn */}
      <motion.path
        d="M 20 0 C 20 25, 20 35, 50 50 C 80 65, 80 75, 80 100"
        fill="none"
        stroke="#F4511E"
        strokeWidth="0.35"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.5}
      />
      {/* Signal thread — mirror image, crosses the ember at the turn (~50%) */}
      <motion.path
        d="M 80 0 C 80 25, 80 35, 50 50 C 20 65, 20 75, 20 100"
        fill="none"
        stroke="#0090DE"
        strokeWidth="0.35"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.35}
      />
    </svg>
  );
}
```

- [ ] **Step 3: Preview in `app/page.tsx`**

Wrap the existing preview in a tall scroll container and mount the canvas:

```tsx
import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { SectionShell } from "@/components/ui/SectionShell";
// ...
export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <SectionShell act="warm"><div className="h-[80vh]" /></SectionShell>
      <SectionShell act="dark"><div className="h-[80vh]" /></SectionShell>
      <SectionShell act="ember"><div className="h-[40vh]" /></SectionShell>
      <SectionShell act="light"><div className="h-[80vh]" /></SectionShell>
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → no errors.
Visual check: as you scroll top→bottom, two thin threads (orange + blue) draw downward and visibly cross near the middle of the page, sitting behind the section backgrounds. Section backgrounds change warm→dark→ember→light without a hard visible seam (the threads bridge them). Reduce-motion: both threads fully drawn and crossed on load, no scroll dependence.

- [ ] **Step 5: Commit**

```bash
git add components/ui/SectionShell.tsx components/ui/WeaveCanvas.tsx app/page.tsx
git commit -m "feat: SectionShell act theming and continuous scroll-driven WeaveCanvas spine"
```

---

### Task 6: `Nav` + `Hero` (§01) with logo wall + YC

**Files:**
- Create: `components/sections/Nav.tsx`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `content.nav`, `content.hero`, `content.logos`; `RevealText`, `Eyebrow`, `PillButton`.
- Produces: `<Nav />` (floating centered pill, fixed top) and `<Hero />` (full hero section including sub-headline, dual CTA, YC badge, and logo wall).

- [ ] **Step 1: Create `components/sections/Nav.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";
import { PillButton } from "@/components/ui/PillButton";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2 transition-all duration-300 ${
          scrolled ? "bg-paper/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md" : "bg-paper/40 backdrop-blur-sm"
        }`}
      >
        <a href="#" className="font-display px-3 text-xl font-bold text-ink">
          weft
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {content.nav.links.map((l) => (
            <a key={l.href} href={l.href} className="font-meta text-[11px] text-ink/70 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>
        <PillButton href="#contact" className="!px-5 !py-2 text-xs">
          {content.nav.cta}
        </PillButton>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Create a `GoogleWordmark` inline + `components/sections/Hero.tsx`**

The Google logo must be real. Use an inline SVG wordmark (self-hosted, no network). Place it inside `Hero.tsx`:

```tsx
"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

function GoogleWordmark() {
  // Simplified real Google wordmark colors, text-based to avoid trademark-art risk.
  return (
    <span className="font-display text-2xl font-bold tracking-tight" aria-label="Google">
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC05" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { hero, logos } = content;

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center">
      <motion.div initial={reduce ? undefined : "hidden"} animate={reduce ? undefined : "show"} variants={fadeUp}>
        <Eyebrow>{hero.ycLabel}</Eyebrow>
      </motion.div>

      <RevealText
        as="h1"
        lines={hero.headline}
        className="mt-8 max-w-4xl text-4xl leading-[1.08] text-ink sm:text-5xl md:text-6xl lg:text-7xl"
      />

      <motion.p
        className="mt-8 max-w-xl text-lg text-ink/60"
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {hero.sub}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <PillButton href="#contact" variant="solid">{hero.ctaPrimary}</PillButton>
        <PillButton href="#how" variant="outline">{hero.ctaSecondary}</PillButton>
      </motion.div>

      <div className="mt-20 w-full max-w-4xl">
        <p className="font-meta text-[11px] text-ink/40">{logos.intro}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80">
          <GoogleWordmark />
          {logos.placeholders.map((name) => (
            <span key={name} className="font-display text-xl font-medium text-ink/30">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount in `app/page.tsx`**

```tsx
import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <Nav />
      <main className="relative bg-bone">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: floating rounded nav pill centered at top; it gains a stronger blurred background after scrolling 24px. Hero headline reveals per-word with "someone else." in grey; sub-line and CTAs fade in after. YC badge above headline. Logo row shows a real multi-color "Google" plus five muted placeholder names. No horizontal scroll.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Nav.tsx components/sections/Hero.tsx app/page.tsx
git commit -m "feat: Nav pill and Hero with dual CTA, YC badge, logo wall"
```

---

### Task 7: `Problem` (§02) — dark Act I

**Files:**
- Create: `components/sections/Problem.tsx`

**Interfaces:**
- Consumes: `content.problem`; `SectionShell`, `RevealText`, `Eyebrow`, `Counter`.
- Produces: `<Problem />` — dark section, three "beats" (large stat + line), and a closing kicker.

- [ ] **Step 1: Create `components/sections/Problem.tsx`**

```tsx
"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function Problem() {
  const reduce = useReducedMotion();
  const { problem } = content;

  return (
    <SectionShell id="problem" act="dark">
      <div className="flex flex-col items-start gap-4">
        <span className="font-meta inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1 text-xs text-paper/70">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          {problem.eyebrow}
        </span>
        <RevealText as="h2" lines={problem.headline} className="max-w-3xl text-4xl text-paper md:text-6xl" />
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-paper/10 md:grid-cols-3">
        {problem.beats.map((beat, i) => (
          <motion.div
            key={i}
            className="flex flex-col gap-4 bg-ink p-8 md:p-10"
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="font-display text-6xl font-bold text-ember md:text-7xl">{beat.stat}</span>
            <p className="text-sm leading-relaxed text-paper/60">{beat.label}</p>
          </motion.div>
        ))}
      </div>

      <p className="font-display mx-auto mt-20 max-w-3xl text-center text-2xl leading-snug text-paper/90 md:text-3xl">
        {problem.kicker}
      </p>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Mount** — add `<Problem />` after `<Hero />` in `app/page.tsx`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: section is near-black; eyebrow reads "The room that didn't work"; headline two-toned with "Almost no one did." grey; three big ember stats (3, 0:14, 1) with descriptive lines in a hairline-divided grid; kicker line centered below. Threads from WeaveCanvas visible behind. The transition from the light hero into this dark block should feel like a wash, not a hard slam (acceptable for now; refined in Task 13).

- [ ] **Step 4: Commit**

```bash
git add components/sections/Problem.tsx app/page.tsx
git commit -m "feat: Problem section (dark Act I) with stat beats and kicker"
```

---

### Task 8: `Turn` (§03) — the ember wash

**Files:**
- Create: `components/sections/Turn.tsx`

**Interfaces:**
- Consumes: `content.turn`; `RevealText`.
- Produces: `<Turn />` — full-bleed ember section, a single large line, minimal height, gradient bleed at top and bottom so it washes into neighbors.

- [ ] **Step 1: Create `components/sections/Turn.tsx`**

```tsx
"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";

export function Turn() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-ember px-6 py-28 text-center">
      {/* top wash from dark Act I */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" aria-hidden />
      {/* bottom wash into warm Act II */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone/70 to-transparent" aria-hidden />
      <RevealText
        as="h2"
        lines={content.turn.line}
        className="relative z-10 max-w-4xl text-4xl text-paper md:text-6xl"
      />
    </section>
  );
}
```

Note: for the ember section the muted word should read as a lighter tint of paper, not `--ash` grey. Override in this file by wrapping — but `RevealText` colors muted with `text-ash`. To keep the ember section legible, set the muted line color via a className override is not possible through RevealText. Instead, in `content.turn.line` the `muted` phrase will render grey `--ash` which is acceptable contrast on ember. Confirm in the visual check; if it reads muddy, change the single line to `muted: ""` and split emphasis with weight instead. (Decision belongs to the implementer at the visual check.)

- [ ] **Step 2: Mount** — add `<Turn />` after `<Problem />`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: full-width ember (`#F4511E`) band, ~60vh, one large white line revealing per word. The top edge fades from the dark section above; the bottom edge fades toward the warm section below — no hard rule between sections. The WeaveCanvas ember + signal threads cross within this band. Confirm the muted word is legible on ember; if muddy, apply the fallback noted above.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Turn.tsx app/page.tsx
git commit -m "feat: Turn section — full-bleed ember wash with crossing threads"
```

---

### Task 9: `HowItWorks` (§04) — numbered steps

**Files:**
- Create: `components/sections/HowItWorks.tsx`

**Interfaces:**
- Consumes: `content.how`; `SectionShell`, `RevealText`, `Eyebrow`.
- Produces: `<HowItWorks />` — warm section, centered eyebrow+headline, three numbered rows (Zolo's numbered-list pattern) with a hairline divider that highlights on hover.

- [ ] **Step 1: Create `components/sections/HowItWorks.tsx`**

```tsx
"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function HowItWorks() {
  const reduce = useReducedMotion();
  const { how } = content;

  return (
    <SectionShell id="how" act="warm">
      <div className="flex flex-col items-center gap-4 text-center">
        <Eyebrow>{how.eyebrow}</Eyebrow>
        <RevealText as="h2" lines={how.headline} className="max-w-2xl text-4xl text-ink md:text-6xl" />
      </div>

      <div className="mt-20 flex flex-col">
        {how.steps.map((step, i) => (
          <motion.div
            key={step.n}
            className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-ink/10 py-10 md:grid-cols-[6rem_1fr_1.5fr] md:gap-x-10 md:py-14"
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="font-mono text-sm text-ash transition-colors group-hover:text-ember">{step.n}</span>
            <h3 className="font-display text-2xl text-ink md:text-3xl">{step.title}</h3>
            <p className="col-span-2 mt-3 max-w-md text-base leading-relaxed text-ink/60 md:col-span-1 md:mt-0">
              {step.body}
            </p>
          </motion.div>
        ))}
        <div className="border-t border-ink/10" />
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Mount** — add `<HowItWorks />` after `<Turn />`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: centered eyebrow + two-tone headline; three rows separated by hairlines, each with a mono number (01/02/03), a Comfortaa title, and a body paragraph. Number turns ember on row hover. Rows fade-rise as they scroll in.

- [ ] **Step 4: Commit**

```bash
git add components/sections/HowItWorks.tsx app/page.tsx
git commit -m "feat: HowItWorks numbered-steps section"
```

---

### Task 10: `Reveal` (§05) — group fan-out + stats (emotional peak)

**Files:**
- Create: `components/sections/Reveal.tsx`

**Interfaces:**
- Consumes: `content.reveal`; `SectionShell`, `RevealText`, `Eyebrow`, `Counter`.
- Produces: `<Reveal />` — light section. Five avatar cards fan from a stack into a circle on scroll-in (spring). Below, three count-up stats with the placeholder note.

- [ ] **Step 1: Create `components/sections/Reveal.tsx`**

```tsx
"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Counter } from "@/components/ui/Counter";
import { motion, useReducedMotion } from "motion/react";

// Final resting positions of the 5 cards arranged in a circle (deg → x/y on a 260px radius ring).
const RING = [
  { x: 0, y: -120, r: -4 },
  { x: 132, y: -38, r: 8 },
  { x: 82, y: 120, r: -6 },
  { x: -82, y: 120, r: 6 },
  { x: -132, y: -38, r: -8 },
];

export function Reveal() {
  const reduce = useReducedMotion();
  const { reveal } = content;

  return (
    <SectionShell id="reveal" act="light">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Left: fan-out */}
        <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center">
          {reveal.group.map((person, i) => {
            const target = RING[i];
            return (
              <motion.div
                key={i}
                className="absolute flex h-28 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-paper shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
                initial={reduce ? { x: target.x, y: target.y, rotate: target.r } : { x: 0, y: 0, rotate: 0, scale: 0.9 }}
                whileInView={reduce ? undefined : { x: target.x, y: target.y, rotate: target.r, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 + i * 0.08 }}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs ${
                    i === 0 ? "bg-ember text-paper" : "bg-signal/10 text-signal"
                  }`}
                >
                  {person.initials}
                </span>
                <span className="px-2 text-center text-[10px] leading-tight text-ink/50">{person.role}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Right: copy + stats */}
        <div>
          <Eyebrow>{reveal.eyebrow}</Eyebrow>
          <RevealText as="h2" lines={reveal.headline} className="mt-4 text-4xl text-ink md:text-5xl" />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">{reveal.body}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {reveal.stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-3xl font-bold text-ink md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-xs leading-snug text-ink/50">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="font-meta mt-6 text-[10px] text-ash">{reveal.statsNote}</p>
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Mount** — add `<Reveal />` after `<HowItWorks />`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: on scroll-in, five cards spring outward from a center stack into a ring; the "YOU" card has an ember avatar, the four matches have blue (`--signal`) avatars with role captions. Right column: eyebrow, two-tone headline, body, three count-up stats, and a visible small "Placeholder metrics" note. Reduce-motion: cards render already in the ring, stats show final values.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Reveal.tsx app/page.tsx
git commit -m "feat: Reveal section — spring group fan-out and count-up outcome stats"
```

---

### Task 11: `Testimonials` (§06) — drag carousel

**Files:**
- Create: `components/sections/Testimonials.tsx`

**Interfaces:**
- Consumes: `content.testimonials`; `SectionShell`, `RevealText`, `Eyebrow`.
- Produces: `<Testimonials />` — warm section with a horizontally draggable row of quote cards (Framer Motion `drag="x"` with constraints). Reduced motion → still draggable (drag is user-driven, not autoplay), no entrance animation.

- [ ] **Step 1: Create `components/sections/Testimonials.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { motion } from "motion/react";

export function Testimonials() {
  const track = useRef<HTMLDivElement | null>(null);
  const { testimonials } = content;

  return (
    <SectionShell id="stories" act="warm">
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <RevealText as="h2" lines={testimonials.headline} className="text-4xl text-ink md:text-6xl" />
      </div>

      <div ref={track} className="mt-14 overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: -((testimonials.items.length - 1) * 380), right: 0 }}
          dragElastic={0.08}
          className="flex cursor-grab gap-6 active:cursor-grabbing"
        >
          {testimonials.items.map((t, i) => (
            <div
              key={i}
              className="flex min-h-[280px] w-[340px] shrink-0 flex-col justify-between rounded-3xl border border-ink/10 bg-paper p-8"
            >
              <p className="font-display text-xl leading-snug text-ink">“{t.quote}”</p>
              <div className="mt-8">
                <p className="font-medium text-ink">{t.name}</p>
                <p className="font-meta mt-1 text-[10px] text-ink/50">{t.title}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <p className="font-meta mt-6 text-[10px] text-ash">Placeholder testimonials — replace in content.ts before launch.</p>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Mount** — add `<Testimonials />` after `<Reveal />`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: eyebrow "Stories" + two-tone headline; a row of quote cards you can drag horizontally (cursor becomes grab/grabbing), rubber-banding at the ends. Cards clearly marked as placeholder via the note. Quotes render with curly quotes in Comfortaa.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Testimonials.tsx app/page.tsx
git commit -m "feat: Testimonials drag carousel"
```

---

### Task 12: `Faq` (§07) + `Contact` (§08) with giant wordmark footer

**Files:**
- Create: `components/sections/Faq.tsx`
- Create: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `content.faq`, `content.contact`; `SectionShell`, `RevealText`, `Eyebrow`, `PillButton`.
- Produces: `<Faq />` (hairline accordion, one open at a time, animated height) and `<Contact />` (split: left testimonial-style card / right form; footer with links + giant `weft` wordmark on a woven panel). Form submit is a stub — `preventDefault`, no network.

- [ ] **Step 1: Create `components/sections/Faq.tsx`**

```tsx
"use client";

import { useState } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatePresence, motion } from "motion/react";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { faq } = content;

  return (
    <SectionShell id="faq" act="light">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <RevealText as="h2" lines={faq.headline} className="text-4xl text-ink md:text-5xl" />
        </div>

        <div className="flex flex-col">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-t border-ink/10 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display text-lg text-ink md:text-xl">{item.q}</span>
                  <span className={`text-2xl text-ember transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-base leading-relaxed text-ink/60">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Create `components/sections/Contact.tsx`**

```tsx
"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";

export function Contact() {
  const { contact } = content;

  return (
    <footer id="contact" className="relative overflow-hidden bg-bone px-6 pt-28 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <RevealText as="h2" lines={contact.headline} className="max-w-3xl text-4xl text-ink md:text-6xl" />
          <p className="mt-2 max-w-md text-base text-ink/60">{contact.body}</p>
        </div>

        <form
          className="mt-14 grid max-w-2xl gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            // Stub: no network submission in this build.
          }}
        >
          <input
            required
            type="text"
            placeholder={contact.fields.name}
            className="w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <input
            required
            type="email"
            placeholder={contact.fields.email}
            className="w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <textarea
            rows={4}
            placeholder={contact.fields.event}
            className="w-full resize-none rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <div>
            <PillButton>{contact.cta}</PillButton>
          </div>
        </form>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 py-8">
          <nav className="flex flex-wrap gap-6">
            {contact.footerLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "")}`}
                className="font-meta text-[11px] text-ink/60 transition-colors hover:text-ink"
              >
                {l}
              </a>
            ))}
          </nav>
          <p className="font-meta text-[11px] text-ink/40">{contact.copyright}</p>
        </div>
      </div>

      {/* Giant woven wordmark */}
      <div className="relative mt-4 flex justify-center overflow-hidden">
        <span className="font-display block select-none text-[24vw] font-bold leading-none text-ink/[0.06]">
          {contact.wordmark}
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Mount both** — add `<Faq />` then `<Contact />` after `<Testimonials />`. Remove the temporary `bg-bone` note; final `page.tsx` composed fully in Task 13.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` → no errors. Run: `npx eslint .` → no errors.
Visual check: FAQ rows separated by hairlines; clicking a question expands its answer with animated height and rotates the `+` into an `×` (ember); only one open at a time. Contact: eyebrow + two-tone headline, three form fields whose borders turn ember on focus, a demo pill button; footer link row + copyright; a huge faint "weft" wordmark spanning the width at the very bottom. Submitting the form does nothing destructive (no navigation, no error).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Faq.tsx components/sections/Contact.tsx app/page.tsx
git commit -m "feat: FAQ accordion and Contact form with giant wordmark footer"
```

---

### Task 13: Compose page, smoothness pass, final QA

**Files:**
- Modify: `app/page.tsx`
- Modify: any section file needing a bleed/gradient adjustment (as found during the smoothness pass)

**Interfaces:**
- Consumes: all section components.
- Produces: final assembled page satisfying the five smoothness rules and the no-`100vh` rule.

- [ ] **Step 1: Finalize `app/page.tsx`**

```tsx
import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Turn } from "@/components/sections/Turn";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reveal } from "@/components/sections/Reveal";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <Nav />
      <main className="relative">
        <div className="bg-bone">
          <Hero />
        </div>
        <Problem />
        <Turn />
        <HowItWorks />
        <Reveal />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Smoothness pass — verify each rule and fix in place**

Walk the page top to bottom in the browser and confirm each of the five rules. Apply the listed fix where a rule fails:

1. **Continuous thread:** WeaveCanvas is `fixed` and spans all sections — confirm the two threads are visible over every act and cross inside the Turn band. Fix if a section background is opaque and covering them: ensure sections don't set `z-index` above `z-10` and the canvas stays `z-0`.
2. **Bleed, don't butt:** Hero→Problem and Problem→Turn→HowItWorks must not show a hard horizontal line. The Turn already has top/bottom gradient washes. If Hero→Problem slams, add to `Problem.tsx` a top gradient bleed: `<div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bone to-transparent opacity-40" aria-hidden />` inside the section, above content.
3. **Asymmetric rhythm:** Confirm the column layout alternates — Hero centered, Problem left+grid, Turn centered, HowItWorks centered+rows, Reveal split L/R, Testimonials left+track, Faq split (narrow/wide), Contact left+wordmark. No two consecutive sections share the same alignment. This is already satisfied by design; verify only.
4. **Overlapping reveals:** RevealText/`whileInView` fire at 0.3–0.4 viewport amount, so motion starts before a section fully owns the screen — verify by scrolling slowly. No fix expected.
5. **No exact 100vh:** Hero is `92vh`, Turn `60vh`, others content-sized via `SectionShell` padding. Confirm none computed to exactly 100vh in devtools.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build completes with no type errors and no ESLint errors; `/` is generated. If build fails on an unescaped entity (e.g. an apostrophe in JSX text), the copy in `content.ts` uses typographic characters (`'` `—` `"`) specifically to avoid this — move any offending literal string into `content.ts` rather than disabling the lint rule.

- [ ] **Step 4: Full-page visual QA (desktop + mobile)**

With `npm run dev`:
- Desktop (1440px): scroll the entire page once. Confirm the full narrative reads top to bottom, threads cross at the Turn, and nothing overflows horizontally.
- Mobile (375px via devtools): confirm nav pill fits, headlines wrap without clipping, the Reveal ring doesn't overflow (cards stay within the section — if they do overflow, reduce `RING` radius by wrapping the fan container in `scale-75 md:scale-100`), grids collapse to one column.
- Reduce-motion (OS setting or devtools "Emulate prefers-reduced-motion"): reload; confirm all text is visible statically, the Reveal ring is pre-arranged, counters show finals, no animation plays, page is fully usable.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/sections/
git commit -m "feat: compose landing page, smoothness pass, responsive + reduced-motion QA"
```

---

## Self-review notes

- **Spec coverage:** Hero message (Task 6), two-act tonal break (Tasks 7/8/9+), woven-thread system (Task 5), all 8 sections (Tasks 6–12), tokens + type (Task 1), motion system incl. word reveal / two-tone / weave / letter-rise / counters / group fan-out (Tasks 3,4,5,10), smoothness rules (Task 13), real YC+Google / placeholder stats (Tasks 2,6,10,11), one-dependency limit and non-standard-Next caution (Global Constraints, Task 1) — all mapped.
- **Placeholder integrity:** every stat/quote lives in `content.ts` and is labeled with a visible "Placeholder … replace before launch" note in the UI; Google + YC render real.
- **Type consistency:** headline line shape `{ text, muted }` is identical across `content.ts`, `RevealText`, and every section; `RevealText` `as` prop limited to `h1|h2|p` and used within that set everywhere.
- **Known implementer decision points, called out inline:** muted-word legibility on the ember Turn (Task 8), Reveal ring overflow on mobile (Task 13). Both have concrete fallbacks in the step text.
