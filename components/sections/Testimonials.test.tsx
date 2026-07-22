import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Testimonials } from "./Testimonials";

test("testimonials renders a media-led feature and accessible mobile controls", () => {
  const html = renderToStaticMarkup(<Testimonials />);

  expect(html).toContain("Placeholder portrait for the featured event outcome");
  expect(html).toContain("Placeholder portrait for the first testimonial");
  expect(html).toContain("Placeholder portrait for the second testimonial");
  expect(html).toContain("Placeholder portrait for the third testimonial");
  expect(html).toContain('aria-label="Previous story"');
  expect(html).toContain('aria-label="Next story"');
  expect(html).toContain("Placeholder testimonials");
});
