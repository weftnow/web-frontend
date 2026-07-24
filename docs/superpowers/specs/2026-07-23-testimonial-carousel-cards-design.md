# Testimonial Carousel & Card Redesign

## Goal

Replace the auto-scrolling testimonial marquee with a user-driven carousel (arrow buttons + native drag/swipe), and redesign the testimonial card to a stacked quote-mark / quote / footer layout matching the supplied reference image. Scaffold (but do not populate) video-testimonial support in the data model.

## Scope

- Replace the CSS keyframe marquee (`testimonial-rail-track` animation, duplicated rail sets) with a native horizontally-scrollable, snap-aligned track.
- Add two circular arrow buttons (previous/next) that scroll by one card width, wrapping at the ends.
- Redesign `TestimonialCard`: quote-mark glyph, quote text, footer with small avatar + name + title. White background (not the gray shown in the reference image).
- Extend `content.testimonials.items` to a discriminated union supporting a future `video` variant; all five current entries remain `type: "quote"`.
- Add an optional `controls` prop to `MediaPlaceholder` for click-to-play video (no autoplay/loop/mute), used only by the future video card variant.
- Section stays a client component (arrow click handlers, scroll ref).

## Out of scope

- Populating any testimonial with real video content (no video asset is wired in yet).
- The floating "Use for Free" CTA visible in the reference screenshot — unrelated to this section, not present elsewhere on the site, not added here.
- Changes to the featured-outcome hero card or `OutcomeList` above the rail.

## Card design

`TestimonialCard` becomes a flex-column card (white background, existing `border-ink/12` hairline, rounded corners) with three stacked zones:

1. **Quote-mark glyph** — a small inline SVG double-quote mark, `text-ink/24` or similar muted tone, top-left.
2. **Quote body** — the existing `font-display` quote text, now full-width within the card (no longer sharing a row with the portrait).
3. **Footer** — pinned to the bottom via `mt-auto`: a small circular avatar (roughly 40–48px, down from today's large portrait), then name (bold) and title (existing `font-meta` small caps style) stacked beside it.

Card width keeps roughly today's sizing (`clamp(32rem, 42vw, 46rem)` range, tunable during implementation) so ~2–3 cards are visible at once on desktop, matching the reference's proportions. Height is consistent across cards regardless of quote length (footer always pinned to bottom via flex).

For a future video card (not built now but the shape should accommodate it): the quote-mark + quote-body zone is replaced by a `MediaPlaceholder` with `controls`, same footer below.

## Carousel mechanics

- The viewport (`testimonial-rail-viewport`) becomes a native `overflow-x-auto` scroll container with `scroll-snap-type: x mandatory`; each card gets `scroll-snap-align: start`. This preserves free drag/swipe/trackpad scrolling.
- No duplicated rail set — `testimonials.items` renders once. (The duplicate-set infinite-marquee trick is no longer needed since there's no autoplay to loop seamlessly.)
- Two circular buttons (`aria-label="Previous story"` / `"Next story"`), styled as solid ink-colored circles with a white chevron SVG, positioned absolutely at the left/right edges of the viewport, vertically centered.
- Click handlers call `scrollBy({ left: ±(cardWidth + gap), behavior: "smooth" })` using a ref to measure the first card's width.
- Wrap behavior: if a "next" click would scroll past the last card (i.e., already at/near max scroll), instead `scrollTo({ left: 0, behavior: "smooth" })`. Symmetric wrap for "previous" at the start (`scrollTo({ left: maxScroll })`). Determined by comparing `scrollLeft` against `scrollWidth - clientWidth` with a small epsilon.
- Arrows never disable (always wrap) — no first/last dead-end state.
- The existing left/right fade overlays (`testimonial-rail-viewport--faded`) are kept for visual consistency, layered under the arrow buttons.
- `prefers-reduced-motion`: use `behavior: "auto"` (instant scroll) instead of smooth.
- The rail's `role="region"` / `aria-label="Customer stories"` wrapper stays.

## Data model

`content.testimonials.items` changes from a flat quote-only array to a discriminated union:

```ts
type TestimonialItem =
  | { type: "quote"; quote: string; name: string; title: string }
  | { type: "video"; video: MediaAsset; name: string; title: string };
```

All five current entries become `{ type: "quote", ... }` with their existing values unchanged. `TestimonialCard` branches on `story.type` to render either the quote-mark/quote-body zone or a `MediaPlaceholder` (with `controls`) in its place; the footer rendering is shared.

`MediaPlaceholder` gains an optional `controls?: boolean` prop. When `true`, the rendered `<video>` uses `controls` and omits `autoPlay`/`loop`/`muted`, for click-to-play testimonial clips. Existing callers (hero rail, how-it-works) are unaffected since the prop defaults to the current autoplay/loop/muted behavior.

## Testing

- Update `Testimonials.test.tsx`: remove assertions for the marquee/duplicate-rail markup (`testimonial-rail-track` animation classes, `testimonial-rail-set` duplication, `aria-hidden` duplicate cards, `testimonial-rail-card--wide`) and the explicit assertion that arrow `aria-label`s are absent. Add assertions for the new card structure, `aria-label="Previous story"` / `"Next story"`, and that all five testimonials render exactly once (no duplicate set).
- Add a new `MediaPlaceholder.test.tsx` (no test file exists yet) covering the `controls` prop: `controls` present and `autoPlay`/`loop`/`muted` absent when `controls` is `true`, and today's autoplay/loop/muted behavior unchanged when omitted.
- Run lint, the testimonial/content/media-placeholder unit tests, and a production build.
