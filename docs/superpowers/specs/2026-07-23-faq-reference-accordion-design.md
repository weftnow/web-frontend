# FAQ Reference Accordion Design

## Goal

Restyle Weft's FAQ to mirror the supplied reference while retaining every existing question, answer, and accessible accordion interaction.

## Visual design

- Use a quiet paper-gray section background with a centered `FAQ` eyebrow and two-tone heading.
- Present each question as a compact white pill with restrained padding and a small, plain black plus icon.
- Keep the layout in a centered `max-w-3xl` column at desktop widths, while allowing it to fill the available width on small screens.
- Use the site’s standard section-heading scale while keeping question rows compact; the FAQ must not read as a hero section.
- Layer the solid FAQ surface above the decorative weave canvas so the reference's quiet background remains uninterrupted.

## Interaction and accessibility

- All six rows are collapsed on first render.
- Selecting a question opens its answer and closes any previously open answer.
- Buttons retain their accessible name, `aria-expanded`, and `aria-controls`; answers retain labelled `region` semantics.
- The plus rotates to communicate the expanded state. Existing reduced-motion-safe motion behavior remains in place.

## Verification

- Extend the FAQ server-render test to confirm the first item is initially collapsed while the accessible disclosure wiring remains present.
- Run the focused test, full Bun test suite, ESLint, and production build.
