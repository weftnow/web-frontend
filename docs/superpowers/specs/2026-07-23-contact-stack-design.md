# Contact stack redesign

## Goal

Reshape the contact section to follow the supplied reference: a compact left contact column beside a visually dominant contact form. Preserve the existing Weft heading, supporting copy, labels, and CTA.

## Layout

- On large screens, render the section in two columns: a narrow left column and a wider right form panel, with the form receiving roughly 60% of the available width.
- Replace the current contact artwork and outcome-stat overlay with four vertically stacked, individually rounded contact rows.
- The rows represent WhatsApp, email, Instagram, and LinkedIn. Each row contains an accessible icon and a readable contact label or value.
- Preserve the existing pale background, rounded corners, input treatment, spacing scale, and Weft typography.
- On small screens, show the contact rows above the form without horizontal overflow.

## Content and destinations

- Do not change `contact.eyebrow`, `contact.headline`, `contact.body`, field labels, or `contact.cta`.
- Instagram links to `https://www.instagram.com/_weftnow/`.
- LinkedIn links to `https://www.linkedin.com/company/weftnow/`.
- WhatsApp uses an explicitly labeled temporary URL that can be replaced when the final number is available.
- Add only the contact metadata needed by the redesigned section; keep it centralized in `content.ts`.

## Accessibility and behavior

- Contact rows are real links with clear accessible names.
- Use inline SVG icons with `aria-hidden` so each link's textual label remains the accessible name.
- Existing form labels, required fields, and client-side submit prevention remain unchanged.

## Verification

- Extend the contact component test to assert all four contact rows and the two supplied social destinations render.
- Run the targeted Bun test, lint, and production build after implementation.
