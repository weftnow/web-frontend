# Testimonial Marquee Design

## Goal

Turn the supporting testimonial area into a continuously left-moving rail of five reviews, while aligning each review to the left-side reference layout in the supplied design.

## Scope

- Keep the testimonial heading and the existing featured outcome cards.
- Render five distinct placeholder reviews from `content.ts`.
- Give every review the same horizontal composition: square portrait, then a compact text column containing quote, name, and title.
- Limit the quote column width so long reviews retain a concise, readable measure.
- Replace the static supporting reviews on desktop and the separate mobile-only carousel controls with one responsive rail.

## Marquee behavior

The review rail will use the same mechanism as `Turn`'s media gallery:

1. Render the review collection twice in adjacent flex sets. The duplicate set is hidden from assistive technologies.
2. Animate a `max-content` track linearly to the left by one set's width. Because the second set immediately follows the first, the animation loops without a visible jump.
3. Clip the moving track with an overflow-hidden viewport.
4. Pause the track whenever the viewport is hovered or contains keyboard focus. This preserves time to read a review and supports keyboard users.
5. Disable automatic movement under `prefers-reduced-motion`; the first set remains visible and users can still read it.

## Data and accessibility

`content.testimonials.items` will contain five placeholder testimonials. Each card is a semantic article; duplicated cards are `aria-hidden`. The rail retains an accessible label. The pause behavior is CSS-based, so it needs no timer state, event listeners, or focus-management code.

## Verification

- Update the testimonial unit test to assert five source reviews, duplicated rail semantics, and the compact quote styling hook.
- Run the focused testimonial/content tests, lint, and a production build if the environment permits.

## Visual refinement

The entire Stories section uses `#f4f4f5` rather than the warm section background. Each moving testimonial is a white, rounded card with a subtle light border and generous padding. Neither the card nor its portrait uses a drop shadow.
