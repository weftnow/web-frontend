# Hero reveal refinement

## Goal

Refine the landing-page hero to lead with the primary conversion action, present the new networking-focused message at a smaller scale, and reveal the supporting content in a deliberate sequence.

## Content

- Headline: `Real matches at neworking events.`
- Subheadline: `In that networking event there's someone you align with, somoene you need. Weft helps you find them`
- The secondary “See how it works” control remains in source as commented JSX rather than rendering in the hero.

The supplied spelling is intentional for this change and will be preserved exactly.

## Layout

- Reduce the desktop headline clamp from the current oversized presentation while retaining a responsive mobile clamp.
- Keep the primary “Book a demo” control centered beneath the copy.
- Place its hand marker to the button’s left, matching the supplied reference’s initial, horizontal pointing pose. Hover behavior may still transition the marker afterward.

## Entrance choreography

1. On a normal-motion page load, the primary CTA cluster is visible first.
2. The headline follows with each word rising and fading in sequentially, preserving normal heading semantics for screen readers.
3. The eyebrow, subheadline, social proof, and media rail follow as smooth grouped fades with small upward movement.
4. Users with `prefers-reduced-motion: reduce` receive all content immediately, without entrance animation.

## Implementation boundaries

- Keep hero content in `content.ts`.
- Add only hero-scoped animation helpers or markup necessary for word sequencing.
- Use the existing Motion library and project easing tokens; do not add dependencies.
- Preserve the CTA’s link target, focus behavior, and accessible label.

## Verification

- Extend the component/content tests to assert the new hero copy and ensure the secondary-link markup is absent from rendered output.
- Run the focused test, the complete Bun test suite, lint, and a production build.
