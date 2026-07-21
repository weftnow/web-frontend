"use client";

import { motion, useReducedMotion } from "motion/react";
import { container, wordReveal } from "@/lib/motion";

type Line = { text: string; muted: string };

export function RevealText({
  lines,
  className = "",
  as = "h2",
}: {
  lines: readonly Line[];
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const Tag = motion[as];
  const reduce = useReducedMotion();

  const renderWords = (str: string, muted: boolean) =>
    str
      .split(" ")
      .filter(Boolean)
      .map((word, i) => (
        <motion.span
          key={`${muted ? "m" : "t"}-${word}-${i}`}
          variants={reduce ? undefined : wordReveal}
          className={`inline-block ${muted ? "text-ash" : ""}`}
          style={{ marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ));

  return (
    <Tag
      className={`font-display ${className}`}
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {renderWords(line.text, false)}
          {line.muted ? renderWords(line.muted, true) : null}
        </span>
      ))}
    </Tag>
  );
}
