import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PremiumButton } from "./PremiumButton";

test("premium CTA keeps one accessible label while rendering rolling glyphs", () => {
  const html = renderToStaticMarkup(
    <PremiumButton href="#contact">Book a demo</PremiumButton>,
  );

  expect(html).toContain('href="#contact"');
  expect(html).toContain('aria-label="Book a demo"');
  expect(html).toContain('class="premium-cta');
  expect(html).toContain('aria-hidden="true"');
});
