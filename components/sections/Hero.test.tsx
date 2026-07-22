import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "./Hero";

test("hero renders CTA-first markup with separately addressable headline words", () => {
  const html = renderToStaticMarkup(<Hero />);

  expect(html).toContain('class="hero-actions hero-actions--initial"');
  expect(html).toContain('aria-label="Book a demo"');
  expect(html).toContain('data-hero-word="Real"');
  expect(html).toContain('data-hero-word="matches"');
  expect(html).toContain('data-hero-word="at"');
  expect(html).toContain('data-hero-word="networking"');
  expect(html).toContain('data-hero-word="events."');
  expect(html).toContain('class="hero-title-word hero-title-accent"');
  expect(html).toContain('class="hero-title-character"');
  expect(html).toContain(
    "In that networking event there&#x27;s someone you align with, somoene you need. Weft helps you find them",
  );
  expect(html).not.toContain("hero-secondary-link");
});
