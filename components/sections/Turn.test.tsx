import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Turn } from "./Turn";

test("turn renders one accessible media set and one hidden looping duplicate", () => {
  const html = renderToStaticMarkup(<Turn />);

  expect(html).toMatch(/<div[^>]*data-turn-media-set="source"[^>]*>/);
  expect(html).toMatch(
    /<div[^>]*aria-hidden="true"[^>]*data-turn-media-set="duplicate"[^>]*>/,
  );
  expect(html.match(/class="turn-media-card turn-media-card--/g)).toHaveLength(10);
});
