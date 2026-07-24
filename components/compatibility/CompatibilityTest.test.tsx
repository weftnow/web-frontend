import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CompatibilityTest } from "./CompatibilityTest";
import { content } from "@/content";

test("compatibility test renders the intro phase by default", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).toContain(content.compatibilityTest.intro.cta);
  expect(html).toContain("ctest-shell");
});

test("compatibility test exposes a home link back to Weft", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).toContain('href="/"');
  expect(html).toContain("ctest-home");
});

test("compatibility intro does not leak later phases into static markup", () => {
  const html = renderToStaticMarkup(<CompatibilityTest />);
  expect(html).not.toContain(content.compatibilityTest.result.archetype);
  expect(html).not.toContain("ctest-option");
});
