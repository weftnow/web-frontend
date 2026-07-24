"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { content } from "@/content";
import { WeaveLoader } from "@/components/ui/WeaveLoader";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  ANALYZING_MS,
  canAdvance,
  isSelected,
  nextQuizState,
  prevQuizState,
  progressDots,
  toggleOption,
  type Answers,
  type Phase,
} from "@/lib/compatibility";

const AUTO_ADVANCE_MS = 460;
const COPIED_MS = 2000;

export function CompatibilityTest() {
  const reduce = Boolean(useReducedMotion());
  const data = content.compatibilityTest;
  const questions = data.questions;

  const [phase, setPhase] = useState<Phase>("intro");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = questions[activeIndex];

  // Analyzing -> result on a mock timer.
  useEffect(() => {
    if (phase !== "analyzing") return;
    const id = setTimeout(() => setPhase("result"), reduce ? 900 : ANALYZING_MS);
    return () => clearTimeout(id);
  }, [phase, reduce]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  function advance() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const nextState = nextQuizState(activeIndex, questions.length);
    setPhase(nextState.phase);
    setActiveIndex(nextState.activeIndex);
  }

  function goBack() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const prev = prevQuizState(activeIndex);
    setPhase(prev.phase);
    setActiveIndex(prev.activeIndex);
  }

  function choose(optionId: string) {
    const nextAnswers = toggleOption(answers, question.id, optionId, question.kind);
    setAnswers(nextAnswers);
    if (question.kind === "single" && (nextAnswers[question.id]?.length ?? 0) > 0) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(advance, reduce ? 120 : AUTO_ADVANCE_MS);
    }
  }

  function reset() {
    setAnswers({});
    setActiveIndex(0);
    setCopied(false);
    setPhase("intro");
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(`https://${data.result.shareUrl}`);
    } catch {
      // Clipboard unavailable — the URL text stays visible on the button.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_MS);
  }

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 18, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -18, filter: "blur(6px)" },
      };
  const transition = {
    duration: reduce ? 0.01 : 0.42,
    ease: [0.23, 1, 0.32, 1] as const,
  };

  return (
    <div className="ctest-shell">
      <span aria-hidden className="ctest-ambient ctest-ambient--ember" />
      <span aria-hidden className="ctest-ambient ctest-ambient--signal" />
      <Link className="ctest-home" href="/">
        <span aria-hidden>&larr;</span> Weft
      </Link>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            {...fade}
            transition={transition}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <span className="ctest-eyebrow">{data.intro.eyebrow}</span>
            <h1 className="ctest-prompt">
              {data.intro.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-ink/60">
              {data.intro.sub}
            </p>
            <div className="mt-8">
              <PremiumButton
                tone="ember"
                onClick={() => {
                  setPhase("quiz");
                  setActiveIndex(0);
                }}
              >
                {data.intro.cta}
              </PremiumButton>
            </div>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key={`q-${activeIndex}`}
            {...fade}
            transition={transition}
            className="relative z-10 flex w-full flex-col items-center text-center"
          >
            <div className="ctest-progress" aria-hidden>
              {progressDots(activeIndex, questions.length).map((on, i) => (
                <span key={i} className={`ctest-dot${on ? " ctest-dot--on" : ""}`} />
              ))}
            </div>
            <span className="ctest-eyebrow">
              Question {activeIndex + 1} of {questions.length}
            </span>
            <h2 className="ctest-prompt">{question.prompt}</h2>
            {question.helper && (
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ink/45">
                {question.helper}
              </p>
            )}
            <div
              className="ctest-grid"
              role={question.kind === "single" ? "radiogroup" : "group"}
              aria-label={question.prompt}
            >
              {question.options.map((option) => {
                const on = isSelected(answers, question.id, option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    role={question.kind === "single" ? "radio" : "checkbox"}
                    aria-checked={on}
                    className={`ctest-option${on ? " ctest-option--on" : ""}`}
                    onClick={() => choose(option.id)}
                  >
                    <span>{option.label}</span>
                    {"hint" in option && option.hint && (
                      <span className="ctest-option-hint">{option.hint}</span>
                    )}
                    <span aria-hidden className="ctest-option-check">
                      &#10003;
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-5">
              <button
                type="button"
                onClick={goBack}
                className="font-mono text-xs uppercase tracking-wider text-ink/50 transition-colors hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal"
              >
                &larr; Back
              </button>
              {question.kind === "multi" && (
                <PremiumButton
                  tone="ink"
                  onClick={advance}
                  disabled={!canAdvance(answers, question.id)}
                >
                  Next
                </PremiumButton>
              )}
            </div>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div
            key="analyzing"
            {...fade}
            transition={transition}
            className="relative z-10 h-64 w-full max-w-md"
          >
            <WeaveLoader
              phrases={data.loaderPhrases}
              intervalMs={Math.round(ANALYZING_MS / data.loaderPhrases.length)}
            />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            {...fade}
            transition={transition}
            className="relative z-10 flex w-full flex-col items-center"
          >
            <span className="ctest-eyebrow">Your networking archetype</span>
            <div className="ctest-card mt-4">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {data.result.archetype}
              </h2>
              <p className="mt-2 text-pretty text-base leading-relaxed text-ink/62">
                {data.result.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {data.result.values.map((value) => (
                  <span key={value} className="ctest-chip">
                    {value}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {data.result.stats.map((stat, i) => (
                  <div key={stat.label}>
                    <div className="mb-1 flex justify-between font-mono text-[0.68rem] uppercase tracking-wider text-ink/55">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="ctest-meter">
                      <motion.span
                        className="ctest-meter-fill"
                        initial={{ width: reduce ? `${stat.value}%` : 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{
                          duration: reduce ? 0.01 : 0.9,
                          delay: reduce ? 0 : 0.15 + i * 0.12,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-ink/8 pt-5 text-left sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-wider text-ink/45">
                    Connection style
                  </dt>
                  <dd className="mt-1 font-display text-sm text-ink">
                    {data.result.connectionStyle}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.64rem] uppercase tracking-wider text-ink/45">
                    Best matched with
                  </dt>
                  <dd className="mt-1 font-display text-sm text-ink">
                    {data.result.matchedWith.join(" · ")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button type="button" className="ctest-share" onClick={share}>
                <span aria-hidden>&#8599;</span>
                {copied ? "Copied ✓" : `Share · ${data.result.shareUrl}`}
              </button>
              <button
                type="button"
                onClick={reset}
                className="font-mono text-xs uppercase tracking-wider text-ink/50 transition-colors hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-signal"
              >
                Retake
              </button>
            </div>
            <p aria-live="polite" className="ctest-copied mt-3 h-4">
              {copied ? "Link copied to clipboard" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
