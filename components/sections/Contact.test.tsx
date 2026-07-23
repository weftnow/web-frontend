import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Contact } from "./Contact";

test("contact panel labels fields and avoids dead legal links", () => {
  const html = renderToStaticMarkup(<Contact />);

  expect(html).toContain('for="contact-name"');
  expect(html).toContain('id="contact-name"');
  expect(html).toContain('for="contact-email"');
  expect(html).toContain('id="contact-email"');
  expect(html).toContain('for="contact-event"');
  expect(html).toContain('id="contact-event"');
  expect(html).toContain(contentImageAlt);
  expect(html).toContain('aria-label="Try it!"');
  expect(html).toContain("Privacy");
  expect(html).toContain("Terms");
  expect(html.includes('href="#"')).toBe(false);
});

const contentImageAlt = "Placeholder artwork for the Weft contact panel";
