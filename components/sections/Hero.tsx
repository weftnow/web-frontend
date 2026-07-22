"use client";

import { motion, useReducedMotion } from "motion/react";
import { content } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

const railClasses = [
  "hero-media-card hero-media-card--one",
  "hero-media-card hero-media-card--two",
  "hero-media-card hero-media-card--three",
  "hero-media-card hero-media-card--four",
  "hero-media-card hero-media-card--five",
] as const;

function GoogleWordmark() {
  return (
    <span aria-label="Google" className="font-display text-lg font-bold tracking-tight">
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
  const reduce = Boolean(useReducedMotion());
  const { hero, logos, media } = content;

  return (
    <section className="hero-premium">
      <div aria-hidden="true" className="hero-ambient hero-ambient--ember" />
      <div aria-hidden="true" className="hero-ambient hero-ambient--signal" />

      <div className="hero-copy">
        <motion.div
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          initial={reduce ? false : { opacity: 0, transform: "translate3d(0, 10px, 0)" }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Eyebrow>{hero.ycLabel}</Eyebrow>
        </motion.div>

        <SectionHeading
          as="h1"
          className="hero-title"
          lines={hero.headline}
        />

        <motion.p
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          className="hero-subtitle"
          initial={reduce ? false : { opacity: 0, transform: "translate3d(0, 16px, 0)" }}
          transition={{ delay: reduce ? 0 : 0.18, duration: 0.48, ease: [0.23, 1, 0.32, 1] }}
        >
          {hero.sub}
        </motion.p>

        <motion.div
          animate={{ opacity: 1 }}
          className="hero-actions"
          initial={reduce ? false : { opacity: 0 }}
          transition={{ delay: reduce ? 0 : 0.28, duration: 0.4 }}
        >
          <PremiumButton href="#contact" tone="ink">
            {hero.ctaPrimary}
          </PremiumButton>
          <a className="hero-secondary-link" href="#how">
            <span>{hero.ctaSecondary}</span>
            <span aria-hidden="true">↘</span>
          </a>
        </motion.div>

        <div className="hero-proof">
          <p className="font-meta text-[9px] text-ink/38">{logos.intro}</p>
          <div className="hero-proof-logos">
            <GoogleWordmark />
            {logos.placeholders.slice(0, 4).map((name) => (
              <span className="font-display text-sm font-medium text-ink/28" key={name}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        aria-label="Replaceable Weft experience imagery"
        animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
        className="hero-media-rail"
        initial={reduce ? false : { opacity: 0, transform: "translate3d(0, 48px, 0)" }}
        transition={{ delay: 0.22, duration: 0.68, ease: [0.23, 1, 0.32, 1] }}
      >
        {media.heroRail.map((item, index) => (
          <div className={railClasses[index]} key={item.src}>
            <MediaPlaceholder
              className="h-full w-full"
              media={item}
              priority={index < 3}
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 28vw"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
