"use client";

import { useState } from "react";
import { content } from "@/content";
import { SectionShell } from "@/components/ui/SectionShell";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getNextOpenIndex } from "@/lib/interactions";
import { AnimatePresence, motion } from "motion/react";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { faq } = content;

  return (
    <SectionShell id="faq" act="light">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,0.54fr)_minmax(0,1fr)] lg:gap-20">
        <div className="flex flex-col items-start gap-4 lg:sticky lg:top-36 lg:self-start">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <RevealText
            as="h2"
            lines={faq.headline}
            className="max-w-sm text-4xl text-ink md:text-5xl"
          />
        </div>

        <div className="flex flex-col border-b border-ink/12">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const answerId = `faq-answer-${i}`;
            const questionId = `faq-question-${i}`;

            return (
              <div key={item.q} className="border-t border-ink/12">
                <button
                  aria-controls={answerId}
                  aria-expanded={isOpen}
                  id={questionId}
                  type="button"
                  onClick={() => setOpen((current) => getNextOpenIndex(current, i))}
                  className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 py-8 text-left transition-colors duration-200 focus-visible:relative focus-visible:z-10 focus-visible:rounded-2xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-signal md:grid-cols-[3.5rem_minmax(0,1fr)_3rem] md:gap-5 md:py-10 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink/[0.025]"
                >
                  <span className="font-meta self-start pt-1 text-[11px] tabular-nums text-ink/42">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-pretty font-display text-xl leading-snug text-ink md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid h-11 w-11 place-items-center justify-self-end rounded-full border border-ink/12 text-2xl leading-none text-ember transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      aria-labelledby={questionId}
                      id={answerId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                      }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-8 pl-[3.25rem] pr-14 text-base leading-relaxed text-ink/62 md:pb-10 md:pl-[5rem] md:pr-20">
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
