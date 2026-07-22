import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HowItWorks } from "./HowItWorks";

test("How section keeps its row media until the desktop preview breakpoint", () => {
  const html = renderToStaticMarkup(<HowItWorks />);

  expect(html).toContain("xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]");
  expect(html).toContain("xl:hidden");
  expect(html).toContain("hidden xl:block");
  expect(html).toContain('loading="eager"');
});
