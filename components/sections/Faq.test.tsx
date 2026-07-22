import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Faq } from "./Faq";

test("FAQ renders indexed accessible disclosure controls", () => {
  const html = renderToStaticMarkup(<Faq />);
  expect(html).toContain('aria-expanded="true"');
  expect(html).toContain('aria-controls="faq-answer-0"');
  expect(html).toContain('id="faq-answer-0"');
  expect(html).toContain("01");
});
