import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Problem } from "./Problem";

test("problem marks the section for full-bleed tonal edge transitions", () => {
  const html = renderToStaticMarkup(<Problem />);

  expect(html).toContain("problem-tonal-transition");
});
