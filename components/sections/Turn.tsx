"use client";

import { content } from "@/content";
import { motion, useReducedMotion } from "motion/react";

export function Turn() {
  const reduce = Boolean(useReducedMotion());

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-bone px-6 py-36 text-center md:py-52"
      style={{
        backgroundImage:
          "radial-gradient(circle at 42% 50%, rgb(244 81 30 / 66%) 0, rgb(244 81 30 / 28%) 30%, transparent 66%), radial-gradient(circle at 82% 30%, rgb(0 144 222 / 24%) 0, transparent 32%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[43%] h-px w-[140%] -translate-x-1/2 -rotate-[7deg] bg-gradient-to-r from-transparent via-ember/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[57%] h-px w-[140%] -translate-x-1/2 rotate-[7deg] bg-gradient-to-r from-transparent via-signal/65 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-bone to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-bone to-transparent"
      />

      <motion.div
        className="relative z-10 max-w-5xl overflow-hidden pb-2"
        initial={reduce ? false : "hidden"}
        viewport={{ once: true, amount: 0.65 }}
        whileInView={reduce ? undefined : "show"}
      >
        <motion.h2
          className="font-display text-4xl leading-[1.08] text-ink md:text-6xl"
          variants={
            reduce
              ? undefined
              : {
                  hidden: { transform: "translate3d(0, 108%, 0)" },
                  show: {
                    transform: "translate3d(0, 0, 0)",
                    transition: { duration: 0.66, ease: [0.23, 1, 0.32, 1] },
                  },
                }
          }
        >
          {content.turn.line.map((line) => (
            <span className="block" key={line.text}>
              {line.text}{" "}
              <span className="text-ember">{line.muted}</span>
            </span>
          ))}
        </motion.h2>
      </motion.div>
    </section>
  );
}
