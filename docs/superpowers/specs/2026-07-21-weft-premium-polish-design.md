# Weft Premium Landing Polish — Design Spec

Date: 2026-07-21  
Status: Approved  
Reference: https://zolo.framer.website/

## Objective

Polish the existing Weft landing page until it feels as considered as the Zolo reference while
preserving Weft's own orange/blue identity, product narrative, content, and Next.js stack. The
reference supplies the craft standard—spacing, surface treatment, image density, interaction
feedback, and motion grammar—not a brand or layout to copy literally.

The redesign must make every section feel intentionally composed, add replaceable image slots,
and replace the current repeated word-writing effect with varied, purposeful micro-interactions.

## Constraints

- Preserve the current single-page narrative, existing anchors, and contact form behavior.
- Preserve `--ember` (`#F4511E`) and `--signal` (`#0090DE`) as Weft's identity colors.
- Keep the existing Next.js 16, React 19, Tailwind CSS 4, and `motion` stack.
- Use Bun for project commands.
- Read the relevant `node_modules/next/dist/docs/` guidance before changing Next.js code.
- Do not generate new images. Use assets from `/Users/antoniopertuz/Downloads/zolo-framer-website/images`
  as temporary local placeholders and isolate them under `public/placeholders/` for easy replacement.
- Do not add a new animation or component library.
- Preserve complete keyboard usability, reduced-motion behavior, and mobile readability.
- No production form submission or external network behavior is added.

## Chosen approach

Use a **craft transfer** rather than a close clone or a motion-only pass. Existing sections remain
recognizable, but their compositions, imagery, surfaces, and interaction states are upgraded as one
cohesive system. Zolo's techniques are translated into Weft concepts such as matched attendees,
event rooms, group reveals, and organizer outcomes.

## Visual system

### Palette

- `paper`: warm near-white for the main canvas.
- `bone`: slightly warmer section surface for depth without hard theme jumps.
- `ink`: off-black for type and the single dark narrative act.
- `ash`: cool neutral for secondary words and supporting copy.
- `ember`: primary action, active state, and warm thread.
- `signal`: matchmaking/data accents and the cool thread; never a competing CTA color.

Orange and blue should meet through lines, small indicators, imagery treatments, or woven overlays.
Large flat orange/blue blocks should remain rare so both colors retain meaning.

### Typography

- Keep Comfortaa for expressive display copy and Geist Mono for labels and metadata.
- Hero display size: `clamp(3.4rem, 7vw, 7.4rem)` with balanced wrapping and tight tracking.
- Section display size: `clamp(2.75rem, 5vw, 5.75rem)`.
- Body copy is limited to approximately 58–65 characters per line.
- Muted headline words use `ash`, but must retain accessible contrast against their surface.
- Tabular figures are enabled for statistics.

### Surfaces and shadows

- Major shells use 24–36px radii; media frames use 28–32px; controls use 18–999px as appropriate.
- Premium shadows use layered, low-opacity steps rather than one generic blur.
- White media frames use an 8px edge and a broad `0 16px 80px rgb(18 18 18 / 10%)` terminal shadow,
  with smaller intermediate layers for definition.
- Light floating surfaces receive a white inner edge plus a low-contrast outer border so they remain
  visible over both paper and imagery.
- Borders are used only to clarify edges or state, not around every card.

## Page structure

### 1. Floating navigation

- Centered, fixed container with a desktop maximum width near 920px and a 64px visual height.
- Rounded 22–24px shell instead of a generic full pill.
- Resting state: translucent paper, subtle white inner highlight, `ink/8` outer border, light blur.
- Scrolled state: slightly more opaque paper, 18px backdrop blur, and a restrained layered shadow.
- Logo, links, and CTA receive optical rather than mathematically equal spacing.
- Nav labels use a two-line rolling hover treatment. Active section receives a small ember indicator.
- Mobile keeps the logo and compact CTA visible; navigation links open in a small origin-aware panel.

### 2. Hero and proof

- Keep the approved headline and copy, but increase breathing room above and below it.
- Replace the two generic pills with one dominant hand-travel CTA and one quiet text link.
- Add an image-led proof rail at the bottom edge of the hero. It contains five replaceable media slots:
  attendee portrait, event room, matching interface, organizer dashboard, and group reveal.
- Cards use mixed widths and slight rotations, bleed beyond the viewport, and drift by small opposing
  amounts with scroll. They are not a uniform carousel.
- Logo proof remains, but is reduced to one clean credibility row below the main CTA.

### 3. Problem / the room that did not work

- Retain the off-black narrative act, softened at both boundaries with long tonal gradients.
- Use an asymmetric two-column composition: one large event-room media placeholder and one editorial
  stack of the three existing problem statistics.
- Statistics are separated by hairlines rather than boxed into three equal cards.
- Hover/focus on a statistic moves its orange marker and reveals one short supporting phrase.

### 4. The turn

- Keep the orange/blue woven transition, but reduce the flat orange block feeling.
- Use a warm bone base with an oversized ember wash, a smaller signal wash, and crossing thread masks.
- The approved line reveals through a single horizontal mask, not word-by-word typing.

### 5. How Weft works

- Desktop uses a wide Zolo-inspired service-row composition: numbered rows occupy the left two-thirds,
  while one large media preview occupies the right third.
- Hover or keyboard focus updates the active preview using a clipped crossfade and 2px blur bridge.
- Each of the three previews is a replaceable local asset: attendee intake, group computation, reveal.
- Mobile displays each row with its corresponding preview inline; no hover dependency.

### 6. Match reveal

- Replace the current initials-only orbit with a three-person portrait stack plus the existing outcome
  copy and statistics.
- The portraits are temporary local assets from the supplied Zolo export and are explicitly isolated
  as placeholders.
- The stack sits above a small mono label and a gesture icon. It communicates matched people, not team
  members or a generic about-us block.
- Statistics remain visible beside or below the interaction and keep their placeholder disclosure.

### 7. Outcomes and testimonials

- Replace the equal quote-card strip with one media-led feature testimonial and two supporting stories.
- The feature item pairs a large portrait/event placeholder with the quote and outcome figures.
- Supporting stories retain drag on small screens, but desktop uses an asymmetric editorial grid.
- Every quote and attribution remains clearly marked as placeholder content.

### 8. FAQ

- Use a generous split layout: sticky label/headline column at roughly 35%, questions at roughly 65%.
- Rows span the available width, use large 20–24px question type, mono indexes, and ample vertical space.
- One answer is open at a time. Opening another row closes the previous row.
- The answer appears beneath the question without placing the accordion inside a card.
- The plus icon rotates and changes color; the whole row gains a subtle background wash on hover.

### 9. Contact and footer

- Compose the contact area as a large rounded editorial panel with a replaceable event image, outcome
  proof, and the existing form rather than a loose vertical field stack.
- Inputs use visible labels, generous hit areas, focus rings, inline validation space, and consistent
  radii.
- The footer is simplified to primary navigation, legal links, copyright, and the oversized Weft
  wordmark over a woven image treatment.

## Interaction specification

### Premium CTA

- Default: solid ember or ink pill, 52–56px high, 28–32px horizontal padding, four-step layered shadow.
- Hover (fine pointers only): letters roll upward by one line with 18ms stagger; a pointing hand travels
  from the left edge to the right edge and crossfades through a 2px blur into a peace hand.
- Hover duration: 280–340ms with a strong ease-out. The text and hand remain interruptible.
- Press: `scale(.97)` for 120–160ms.
- Keyboard focus: show a clear two-color focus ring without playing the hover animation.
- Reduced motion: keep a simple color/opacity change and press feedback; remove travel and rolling text.

### Portrait stack

The behavior mirrors the measured Zolo interaction:

- Three cards are 180×180px on desktop, framed by 8px paper edges with 32px corners.
- Spread positions use an 8px gap in a 564px-wide interaction area.
- Resting left card: pulled 90px toward center, translated 20px down, rotated `-15deg`.
- Resting center card: no transform and sits above the overlap.
- Resting right card: pulled 90px toward center, translated 20px down, rotated `15deg`.
- Hover: all cards spring to the spread row with zero rotation.
- Spring target: approximately 420ms, bounce near `0.1`, with a tiny interruptible overshoot.
- Gesture icon crossfades from pointing hand to peace hand as the cards spread.
- Keyboard focus reveals the spread state immediately without positional animation.
- Touch: a tap toggles stacked/spread. The control exposes `aria-expanded` and a descriptive label.
- Reduced motion: render the cards in the readable spread state without travel.

### Section and media motion

- Replace page-wide per-word typing with three reveal families: heading mask, media clip, and small stagger.
- Heading masks: 420–600ms and used once per section.
- Media clips: bottom-to-top or side-to-side depending on composition; never all in one direction.
- Decorative item stagger: 30–60ms between items.
- Media hover: at most `scale(1.015)` plus a small crop shift.
- FAQ state change: 220–260ms ease-out; exit is slightly faster than enter.
- Predetermined motion prefers CSS transforms/opacity; `motion` springs are reserved for the portrait
  stack, drag, and other interruptible interactions.
- No animation uses `transition: all`, `top`, `left`, or layout-affecting dimensions for pointer effects.

## Component boundaries

- `Nav`: floating shell, active section state, desktop links, mobile panel.
- `PremiumButton`: rolling label, hand traversal, press and focus feedback.
- `MediaPlaceholder`: semantic image wrapper with slot label, replacement note, aspect ratio, and alt text.
- `PortraitStack`: measured stack/spread interaction and touch state.
- `SectionHeading`: eyebrow plus masked two-tone heading, replacing the current universal word splitter.
- `HowPreview`: active step media and clipped transition.
- `Faq`: one-open state, accessible disclosure buttons, and refined layout.
- Existing section files keep responsibility for their own content composition.
- `content.ts` remains the only source for copy, placeholder disclosures, and media-slot metadata.

## Content and asset flow

1. Select temporary portrait and editorial assets from the supplied local Zolo export.
2. Copy only used assets into `public/placeholders/weft/` with semantic names.
3. Add their paths, alt text, and `placeholder: true` metadata to `content.ts`.
4. Render images through `next/image` where appropriate, with exact `sizes` and stable aspect ratios.
5. Real assets can later replace files and content paths without changing component composition.

No component reads from the Downloads directory at runtime, and no remote Framer image URL is shipped.

## Responsive behavior

- Desktop review widths: 1440px and 1280px.
- Tablet review widths: 1024px and 768px.
- Mobile review widths: 430px and 375px.
- The navigation never exceeds viewport width and keeps a minimum 12px outer gutter.
- Hero copy remains visible on a small laptop without forcing the media rail above the fold.
- Multi-column editorial layouts collapse to a single intentional sequence, not a squeezed grid.
- The portrait stack scales proportionally below 640px and switches to tap behavior.
- Touch targets are at least 44×44px; no content or information requires hover.
- No horizontal scrollbar is allowed at any review width.

## Accessibility and performance

- Preserve semantic landmarks and add a skip-to-content link.
- Every control has visible focus and a stable accessible name.
- FAQ buttons expose `aria-expanded` and answer relationships.
- Decorative hand and thread graphics are hidden from assistive technology.
- Meaningful placeholder media has descriptive alt text; purely atmospheric media is empty-alt.
- `prefers-reduced-motion` removes position travel, parallax, and spring motion.
- Hover effects are gated behind `@media (hover: hover) and (pointer: fine)`.
- Animate only `transform`, `opacity`, `clip-path`, and occasional low-radius blur.
- Avoid remote media, layout shifts, and unbounded image sizes.

## Verification strategy

- Add Bun tests first for deterministic interaction helpers and accessible state transitions.
- Test portrait stacked/spread transforms, FAQ toggle behavior, and premium-button markup/state contracts.
- Run `bun test`, `bun run lint`, and `bun run build` after implementation.
- Visually inspect desktop, tablet, and mobile widths in the running local site.
- Verify CTA hover, portrait hover/tap, active How preview, FAQ disclosure, mobile navigation, focus order,
  and reduced-motion behavior.
- Check the browser console for runtime errors and warnings.

## Acceptance criteria

- The page clearly retains Weft's orange/blue identity and does not read as a Zolo clone.
- The navigation has premium spacing, edge definition, scroll treatment, and responsive behavior.
- The CTA hand traversal and portrait stack match the measured interaction grammar.
- At least ten replaceable local image slots appear across the page without remote dependencies.
- Repeated word-typing is no longer the dominant page animation.
- FAQ and How sections make materially better use of desktop width.
- All interactions work with mouse, keyboard, touch, reduced motion, and narrow screens.
- Bun tests, lint, type/build checks, and browser verification pass without errors.

## Out of scope

- Rewriting approved marketing copy beyond small line-break or label adjustments.
- Connecting the contact form to a backend or analytics service.
- Generating final photography, product mockups, logos, or customer proof.
- Adding pricing, authentication, dashboards, or routes not present in the current landing page.
