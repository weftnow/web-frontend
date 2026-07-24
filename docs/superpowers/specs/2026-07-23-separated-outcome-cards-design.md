# Separated Outcome Cards Design

## Goal

Replace the desktop featured testimonial's single split card with two visually separate cards that fit the landing page's warm, editorial visual system.

## Layout

- Desktop uses a two-column grid with a modest, visible gap between cards.
- The left card preserves the existing featured-outcome photograph and its lower image gradient. It has its own rounded corners and contains only the updated quote overlay.
- The right card is an independently rounded, near-square panel in the page's warm stone-grey palette. It is not black and does not visually merge with the image card.
- Mobile stacks the two cards vertically, retaining a clear gap and their independent rounded silhouettes.

## Content

The left overlay quote is exactly: “The best part was seeing people stay do not want to leave even after the event ended”.

The right panel contains these three messages:

1. Turn random networking into real connection
2. Make your event impossible to forget
3. Prove your event created real value

The existing outcome heading, reveal statistic values, statistic labels, and divider are removed from this panel.

## Visual Treatment

- Use the existing display and metadata typography, subdued ink tones, and generous whitespace.
- Present the three messages as a restrained, vertically spaced editorial list so the panel reads as a considered outcome summary rather than a metrics card.
- Preserve the existing page's responsive behavior, image accessibility, and reduced-motion behavior; this redesign adds no new animation or interaction.

## Files and Verification

- Update the featured testimonial rendering in `components/sections/Testimonials.tsx`.
- Update the featured quote in `content.ts` so the source data and rendering agree.
- Run the existing test suite, lint, and production build after the implementation.
