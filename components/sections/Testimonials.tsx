"use client";

import { useRef } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { useReducedMotion } from "motion/react";

export function Testimonials() {
  const track = useRef<HTMLDivElement | null>(null);
  const reduce = Boolean(useReducedMotion());
  const { media, reveal, testimonials } = content;
  const [feature, ...supporting] = testimonials.items;

  function moveStory(direction: -1 | 1) {
    const node = track.current;
    if (!node) return;

    const cards = Array.from(
      node.querySelectorAll<HTMLElement>("[data-story-card]"),
    );
    const firstOffset = cards[0]?.offsetLeft ?? 0;
    const current = cards.reduce((closest, card, index) => {
      const cardPosition = card.offsetLeft - firstOffset;
      const closestPosition = cards[closest].offsetLeft - firstOffset;
      return Math.abs(cardPosition - node.scrollLeft) <
        Math.abs(closestPosition - node.scrollLeft)
        ? index
        : closest;
    }, 0);
    const next = Math.min(Math.max(current + direction, 0), cards.length - 1);

    node.scrollTo({
      behavior: reduce ? "auto" : "smooth",
      left: cards[next].offsetLeft - firstOffset,
    });
  }

  return (
    <SectionShell id="stories" act="warm">
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <RevealText
          as="h2"
          lines={testimonials.headline}
          className="text-4xl text-ink md:text-6xl"
        />
      </div>

      <div className="mt-14 hidden md:block">
        <div className="grid overflow-hidden rounded-[2rem] bg-ink md:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="relative min-h-[460px]">
            <MediaPlaceholder
              className="absolute inset-0 h-full w-full"
              media={media.outcome}
              sizes="(max-width: 1023px) 58vw, 650px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(18,18,18,0.86)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-paper lg:p-10">
              <p className="max-w-xl font-display text-2xl leading-snug lg:text-3xl">
                &ldquo;{feature.quote}&rdquo;
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-medium">{feature.name}</p>
                <p className="font-meta text-[10px] text-paper/62">{feature.title}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between px-8 py-10 text-paper lg:px-10 lg:py-12">
            <div>
              <p className="font-meta text-[10px] text-paper/52">The outcome</p>
              <p className="mt-5 max-w-sm font-display text-3xl leading-tight lg:text-4xl">
                {reveal.headline[0].text}{" "}
                <span className="text-paper/42">{reveal.headline[0].muted}</span>
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-paper/18 pt-7">
              {reveal.stats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-bold tabular-nums lg:text-4xl">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-paper/52">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-5 gap-8 border-t border-ink/12 pt-10">
          <article className="col-span-3 grid grid-cols-[176px_1fr] items-center gap-8">
            <MediaPlaceholder
              className="aspect-square w-full rounded-[2rem] shadow-[var(--shadow-media)]"
              media={media.testimonialAvatars[1]}
              sizes="176px"
            />
            <StoryCopy story={supporting[0]} />
          </article>

          <article className="col-span-2 border-l border-ink/12 pl-8">
            <div className="grid grid-cols-[112px_1fr] items-end gap-5">
              <MediaPlaceholder
                className="aspect-square w-full rounded-[1.5rem] shadow-[var(--shadow-media)]"
                media={media.testimonialAvatars[2]}
                sizes="112px"
              />
              <div className="pb-1">
                <p className="font-medium text-ink">{supporting[1].name}</p>
                <p className="font-meta mt-1 text-[10px] leading-relaxed text-ink/48">
                  {supporting[1].title}
                </p>
              </div>
            </div>
            <p className="mt-7 font-display text-xl leading-snug text-ink">
              &ldquo;{supporting[1].quote}&rdquo;
            </p>
          </article>
        </div>
      </div>

      <div className="mt-12 md:hidden">
        <div
          aria-label="Event outcome stories"
          aria-roledescription="carousel"
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={track}
          role="region"
        >
          {testimonials.items.map((story, index) => (
            <article
              className="w-[82vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-paper"
              data-story-card
              key={story.quote}
            >
              <MediaPlaceholder
                className="aspect-square w-full"
                media={media.testimonialAvatars[index]}
                sizes="82vw"
              />
              <div className="p-6">
                <StoryCopy story={story} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            aria-label="Previous story"
            className="grid h-12 w-12 place-items-center rounded-full border border-ink/14 bg-paper text-xl text-ink transition-transform active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal"
            onClick={() => moveStory(-1)}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            aria-label="Next story"
            className="grid h-12 w-12 place-items-center rounded-full bg-ink text-xl text-paper transition-transform active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal"
            onClick={() => moveStory(1)}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <p className="font-meta mt-6 text-[10px] text-ash">
        Placeholder testimonials — replace in content.ts before launch.
      </p>
    </SectionShell>
  );
}

function StoryCopy({
  story,
}: {
  story: (typeof content.testimonials.items)[number];
}) {
  return (
    <div>
      <p className="font-display text-xl leading-snug text-ink">
        &ldquo;{story.quote}&rdquo;
      </p>
      <div className="mt-7">
        <p className="font-medium text-ink">{story.name}</p>
        <p className="font-meta mt-1 text-[10px] leading-relaxed text-ink/48">
          {story.title}
        </p>
      </div>
    </div>
  );
}
