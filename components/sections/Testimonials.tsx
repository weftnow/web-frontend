"use client";

import { useRef } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { motion } from "motion/react";

export function Testimonials() {
  const track = useRef<HTMLDivElement | null>(null);
  const { testimonials } = content;

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

      <div ref={track} className="mt-14 overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: -((testimonials.items.length - 1) * 380), right: 0 }}
          dragElastic={0.08}
          className="flex cursor-grab gap-6 active:cursor-grabbing"
        >
          {testimonials.items.map((t, i) => (
            <div
              key={i}
              className="flex min-h-[280px] w-[340px] shrink-0 flex-col justify-between rounded-3xl border border-ink/10 bg-paper p-8"
            >
              <p className="font-display text-xl leading-snug text-ink">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-8">
                <p className="font-medium text-ink">{t.name}</p>
                <p className="font-meta mt-1 text-[10px] text-ink/50">{t.title}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <p className="font-meta mt-6 text-[10px] text-ash">
        Placeholder testimonials — replace in content.ts before launch.
      </p>
    </SectionShell>
  );
}
