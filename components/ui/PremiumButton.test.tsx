import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PremiumButton } from "./PremiumButton";

test("premium CTA keeps one accessible label while rendering rolling glyphs", () => {
  const html = renderToStaticMarkup(
    <PremiumButton href="#contact">Try it!</PremiumButton>,
  );

  expect(html).toContain('href="#contact"');
  expect(html).toContain('aria-label="Try it!"');
  expect(html).toContain('class="premium-cta');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain("M 14.619 6.75");
  expect(html).toContain("M 14.185 2.395");
});
