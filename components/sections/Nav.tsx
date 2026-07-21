"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";
import { PillButton } from "@/components/ui/PillButton";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        className={`flex w-full max-w-3xl items-center justify-between rounded-full px-4 py-2 transition-all duration-300 ${
          scrolled
            ? "bg-paper/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md"
            : "bg-paper/40 backdrop-blur-sm"
        }`}
      >
        <a href="#" className="font-display px-3 text-xl font-bold text-ink">
          weft
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {content.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-meta text-[11px] text-ink/70 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <PillButton href="#contact" className="!px-5 !py-2 text-xs">
          {content.nav.cta}
        </PillButton>
      </nav>
    </header>
  );
}
