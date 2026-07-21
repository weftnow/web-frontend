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
      {/* Ember thread — starts left, weaves to right past the turn */}
      <motion.path
        d="M 20 0 C 20 25, 20 35, 50 50 C 80 65, 80 75, 80 100"
        fill="none"
        stroke="#F4511E"
        strokeWidth="0.35"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.5}
      />
      {/* Signal thread — mirror image, crosses the ember at the turn (~50%) */}
      <motion.path
        d="M 80 0 C 80 25, 80 35, 50 50 C 20 65, 20 75, 20 100"
        fill="none"
        stroke="#0090DE"
        strokeWidth="0.35"
        strokeLinecap="round"
        style={{ pathLength: reduce ? staticDraw : draw }}
        opacity={0.35}
      />
    </svg>
  );
}
