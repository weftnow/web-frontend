"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";

export function Turn() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-ember px-6 py-28 text-center">
      {/* top wash from dark Act I */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent"
        aria-hidden
      />
      {/* bottom wash into warm Act II */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone/70 to-transparent"
        aria-hidden
      />
      <RevealText
        as="h2"
        lines={content.turn.line}
        className="relative z-10 max-w-4xl text-4xl text-paper md:text-6xl"
      />
    </section>
  );
}
