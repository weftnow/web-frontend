# Hero Gliding Media Rail Design

## Goal

Present the hero imagery as a broad, tilted, continuously gliding gallery inspired by the supplied reference. Hovering a card returns that card to an upright, neutral position while the gallery continues moving.

## Scope

- Update the existing `Hero` media rail and its styles only.
- Preserve the existing hero assets, copy, CTA, and entrance choreography.
- Use the existing CSS and Motion dependencies; add no packages.

## Interaction Design

The visible gallery is a clipped viewport containing a track with the five supplied cards followed by an identical, decorative copy. The duplicate is hidden from assistive technology. A linear CSS animation moves the track horizontally by exactly one source-set width, creating a seamless loop when it restarts.

Each source card retains its current deliberate rotation and slight vertical offset. On a fine pointer hover, the hovered card transitions to `rotate(0deg)` and a zero vertical offset. The track animation does not pause or change speed. Keyboard focus follows the same neutral-card treatment where applicable.

At narrow viewports, the rail remains oversized and cropped at the edges, with card sizing and spacing reduced proportionally. The carousel does not require manual controls because the requested behavior is decorative, not a browseable content carousel.

## Accessibility and Motion

- The duplicate cards are `aria-hidden` so media is not announced twice.
- Existing image semantics remain on the source card set.
- In `prefers-reduced-motion`, the loop animation is removed and the original static, centered rail remains visible.
- Hover enhancements apply only to devices reporting a fine hover-capable pointer.

## Implementation Boundaries

`Hero.tsx` owns rendering the duplicated track and exposes stable data attributes/classes for tests. `app/globals.css` owns the keyframes, the rail offset calculation, responsive sizing, card transforms, and reduced-motion fallback. No routing, content, or dependency changes are needed.

## Verification

- Add a static markup test that verifies one accessible source set and one hidden duplicate set are rendered.
- Run the focused Hero test, full Bun test suite, lint, and production build.
- Visually check desktop and mobile: no gap at the loop seam, continuous movement on hover, upright hovered card, and static rail with reduced motion.

## Design Review

This is a single focused visual enhancement. It makes no assumptions beyond the supplied reference and confirmed requirement that hovering must not pause the glide.
