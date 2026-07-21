"use client";

import { useState } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AnimatePresence, motion } from "motion/react";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { faq } = content;

  return (
    <SectionShell id="faq" act="light">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <RevealText
            as="h2"
            lines={faq.headline}
            className="text-4xl text-ink md:text-5xl"
          />
        </div>

        <div className="flex flex-col">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-t border-ink/10 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display text-lg text-ink md:text-xl">{item.q}</span>
                  <span
                    className={`text-2xl text-ember transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-base leading-relaxed text-ink/60">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
