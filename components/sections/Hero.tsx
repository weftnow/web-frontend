"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp } from "@/lib/motion";

function GoogleWordmark() {
  // Real Google wordmark built from text with the brand's letter colors.
  return (
    <span className="font-display text-2xl font-bold tracking-tight" aria-label="Google">
      <span style={{ color: "#4285F4" }}>G</span>
      <span style={{ color: "#EA4335" }}>o</span>
      <span style={{ color: "#FBBC05" }}>o</span>
      <span style={{ color: "#4285F4" }}>g</span>
      <span style={{ color: "#34A853" }}>l</span>
      <span style={{ color: "#EA4335" }}>e</span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { hero, logos } = content;

  return (
    <section className="relative z-10 flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-16 text-center">
      <motion.div
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        variants={fadeUp}
      >
        <Eyebrow>{hero.ycLabel}</Eyebrow>
      </motion.div>

      <RevealText
        as="h1"
        lines={hero.headline}
        className="mt-8 max-w-4xl text-4xl leading-[1.08] text-ink sm:text-5xl md:text-6xl lg:text-7xl"
      />

      <motion.p
        className="mt-8 max-w-xl text-lg text-ink/60"
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {hero.sub}
      </motion.p>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <PillButton href="#contact" variant="solid">
          {hero.ctaPrimary}
        </PillButton>
        <PillButton href="#how" variant="outline">
          {hero.ctaSecondary}
        </PillButton>
      </motion.div>

      <div className="mt-20 w-full max-w-4xl">
        <p className="font-meta text-[11px] text-ink/40">{logos.intro}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80">
          <GoogleWordmark />
          {logos.placeholders.map((name) => (
            <span key={name} className="font-display text-xl font-medium text-ink/30">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
