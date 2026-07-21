"use client";

import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

export function HowItWorks() {
  const reduce = useReducedMotion();
  const { how } = content;

  return (
    <SectionShell id="how" act="warm">
      <div className="flex flex-col items-center gap-4 text-center">
        <Eyebrow>{how.eyebrow}</Eyebrow>
        <RevealText
          as="h2"
          lines={how.headline}
          className="max-w-2xl text-4xl text-ink md:text-6xl"
        />
      </div>

      <div className="mt-20 flex flex-col">
        {how.steps.map((step, i) => (
          <motion.div
            key={step.n}
            className="group grid grid-cols-[auto_1fr] gap-x-6 border-t border-ink/10 py-10 md:grid-cols-[6rem_1fr_1.5fr] md:gap-x-10 md:py-14"
            variants={reduce ? undefined : fadeUp}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="font-mono text-sm text-ash transition-colors group-hover:text-ember">
              {step.n}
            </span>
            <h3 className="font-display text-2xl text-ink md:text-3xl">{step.title}</h3>
            <p className="col-span-2 mt-3 max-w-md text-base leading-relaxed text-ink/60 md:col-span-1 md:mt-0">
              {step.body}
            </p>
          </motion.div>
        ))}
        <div className="border-t border-ink/10" />
      </div>
    </SectionShell>
  );
}
