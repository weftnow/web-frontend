import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";

test("compatibility-test page renders the quiz shell", () => {
  const html = renderToStaticMarkup(<Page />);
  expect(html).toContain("ctest-shell");
});

test("compatibility-test page sets its own metadata title", () => {
  expect(String(metadata.title)).toContain("Compatibility");
});
