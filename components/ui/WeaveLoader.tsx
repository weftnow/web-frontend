"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function WeaveLoader({ phrases }: { phrases: readonly string[] }) {
  const reduce = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="weave-loader">
      <img
        alt=""
        aria-hidden="true"
        className={`weave-loader-mark${reduce ? "" : " weave-loader-mark--spin"}`}
        height={72}
        src="/icon.svg"
        width={72}
      />
      <div aria-live="polite" className="weave-loader-phrase">
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            key={phrases[index]}
            transition={{ duration: reduce ? 0.01 : 0.34, ease: [0.23, 1, 0.32, 1] }}
          >
            {phrases[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
