"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Counter } from "@/components/ui/Counter";
import { motion, useReducedMotion } from "motion/react";

// Final resting positions of the 5 cards arranged in a ring.
const RING = [
  { x: 0, y: -120, r: -4 },
  { x: 132, y: -38, r: 8 },
  { x: 82, y: 120, r: -6 },
  { x: -82, y: 120, r: 6 },
  { x: -132, y: -38, r: -8 },
];

export function Reveal() {
  const reduce = useReducedMotion();
  const { reveal } = content;

  return (
    <SectionShell id="reveal" act="light">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        {/* Left: fan-out */}
        <div className="relative mx-auto flex h-[420px] w-full max-w-md scale-90 items-center justify-center md:scale-100">
          {reveal.group.map((person, i) => {
            const target = RING[i];
            return (
              <motion.div
                key={i}
                className="absolute flex h-28 w-24 flex-col items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-paper shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
                initial={
                  reduce
                    ? { x: target.x, y: target.y, rotate: target.r }
                    : { x: 0, y: 0, rotate: 0, scale: 0.9 }
                }
                whileInView={
                  reduce
                    ? undefined
                    : { x: target.x, y: target.y, rotate: target.r, scale: 1 }
                }
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 + i * 0.08 }}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs ${
                    i === 0 ? "bg-ember text-paper" : "bg-signal/10 text-signal"
                  }`}
                >
                  {person.initials}
                </span>
                <span className="px-2 text-center text-[10px] leading-tight text-ink/50">
                  {person.role}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right: copy + stats */}
        <div>
          <Eyebrow>{reveal.eyebrow}</Eyebrow>
          <RevealText
            as="h2"
            lines={reveal.headline}
            className="mt-4 text-4xl text-ink md:text-5xl"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">{reveal.body}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            {reveal.stats.map((s, i) => (
              <div key={i}>
                <div className="font-display text-3xl font-bold text-ink md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2 text-xs leading-snug text-ink/50">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="font-meta mt-6 text-[10px] text-ash">{reveal.statsNote}</p>
        </div>
      </div>
    </SectionShell>
  );
}
