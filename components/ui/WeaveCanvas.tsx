"use client";

import { useScroll, useSpring, useTransform, motion, useReducedMotion } from "motion/react";

export function WeaveCanvas() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });

  // Draw both threads in lockstep with scroll.
  const draw = useTransform(progress, [0, 1], [0, 1]);
  const staticDraw = 1;

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* Ember thread — starts near the left edge, weaves to right past the turn */}
      <motion.path
        d="M 4 0 C 4 35, 4 49, 50 70 C 96 79, 96 85, 96 100"
        fill="none"
        stroke="#F4511E"
        strokeWidth="0.28"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.32}
      />
      {/* Signal thread — mirror image, crosses the ember later (~70%) */}
      <motion.path
        d="M 96 0 C 96 35, 96 49, 50 70 C 4 79, 4 85, 4 100"
        fill="none"
        stroke="#0090DE"
        strokeWidth="0.28"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.22}
      />
    </svg>
  );
}
