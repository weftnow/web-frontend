"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function Problem() {
  const reduce = useReducedMotion();
  const { problem } = content;

  return (
    <SectionShell id="problem" act="dark">
      <div className="flex flex-col items-start gap-4">
        <span className="font-meta inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1 text-xs text-paper/70">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          {problem.eyebrow}
        </span>
        <RevealText
          as="h2"
          lines={problem.headline}
          className="max-w-3xl text-4xl text-paper md:text-6xl"
        />
      </div>

      <div className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-paper/10 md:grid-cols-3">
        {problem.beats.map((beat, i) => (
          <motion.div
            key={i}
            className="flex flex-col gap-4 bg-ink p-8 md:p-10"
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="font-display text-6xl font-bold text-ember md:text-7xl">
              {beat.stat}
            </span>
            <p className="text-sm leading-relaxed text-paper/60">{beat.label}</p>
          </motion.div>
        ))}
      </div>

      <p className="font-display mx-auto mt-20 max-w-3xl text-center text-2xl leading-snug text-paper/90 md:text-3xl">
        {problem.kicker}
      </p>
    </SectionShell>
  );
}
