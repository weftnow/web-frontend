import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Hero } from "./Hero";

test("hero renders CTA-first markup with separately addressable headline words", () => {
  const html = renderToStaticMarkup(<Hero />);

  expect(html).toContain('class="hero-actions hero-actions--initial"');
  expect(html).toContain('aria-label="Try it!"');
  expect(html).toContain('data-hero-word="Matched"');
  expect(html).toContain('data-hero-word="on"');
  expect(html).toContain('data-hero-word="what"');
  expect(html).toContain('data-hero-word="matters,"');
  expect(html).toContain('data-hero-word="your"');
  expect(html).toContain('data-hero-word="badge."');
  expect(html).toContain('class="hero-title-word hero-title-accent"');
  expect(html).toContain('class="hero-title-character"');
  expect(html).toContain(
    "Weft matches attendees on their goals, expertise, and values, not small talk. Finding the right people becomes the best part of the night.",
  );
  expect(html).not.toContain("hero-secondary-link");
});
