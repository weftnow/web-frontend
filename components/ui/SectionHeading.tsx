"use client";

import { motion, useReducedMotion } from "motion/react";

type Line = { readonly text: string; readonly muted: string };

export function SectionHeading({
  lines,
  className = "",
  as = "h2",
}: {
  lines: readonly Line[];
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <div className="section-heading-mask">
      <Tag
        className={`font-display text-balance ${className}`.trim()}
        initial={reduce ? false : { opacity: 0, transform: "translate3d(0, 24px, 0)" }}
        transition={{ duration: 0.52, ease: [0.23, 1, 0.32, 1] }}
        viewport={{ once: true, amount: 0.45 }}
        whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      >
        {lines.map((line, index) => (
          <span className="block" key={`${line.text}-${index}`}>
            {line.text}
            {line.muted ? (
              <span className="text-ash"> {line.muted}</span>
            ) : null}
          </span>
        ))}
      </Tag>
    </div>
  );
}
