import { describe, expect, test } from "bun:test";
import { content } from "./content";

describe("placeholder media catalog", () => {
  test("contains the approved image-led page inventory", () => {
    expect(content.media.heroRail).toHaveLength(7);
    expect(content.media.portraits).toHaveLength(3);
    expect(content.media.how).toHaveLength(3);
  });

  test("ships only local, replaceable assets with intrinsic sizes", () => {
    const media = [
      ...content.media.heroRail,
      ...content.media.portraits,
      ...content.media.how,
      content.media.problem,
      content.media.outcome,
      ...content.media.testimonialAvatars,
      content.media.contact,
    ];

    for (const item of media) {
      expect(item.src.startsWith("/placeholders/weft/")).toBe(true);
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
      expect(item.alt.length).toBeGreaterThan(8);
      expect(item.placeholder).toBe(true);
    }
  });
});

test("uses the approved hero message", () => {
  expect(content.hero.headline).toEqual([
    {
      text: "Matched on what matters, not your badge.",
      muted: "",
      accent: "your badge",
    },
  ]);
  expect(content.hero.sub).toBe(
    "Weft matches attendees on their goals, expertise, and values, not small talk. Finding the right people becomes the best part of the night.",
  );
});
