import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Nav } from "./Nav";

test("navigation exposes the premium shell and accessible mobile disclosure", () => {
  const html = renderToStaticMarkup(<Nav />);

  expect(html).toContain('aria-label="Primary navigation"');
  expect(html).toContain('aria-label="Open navigation"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain("nav-premium-shell");
});
