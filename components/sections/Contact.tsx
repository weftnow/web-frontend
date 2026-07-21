"use client";

import { content } from "@/content";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";

export function Contact() {
  const { contact, nav } = content;

  return (
    <footer id="contact" className="relative overflow-hidden bg-bone px-6 pt-28 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-start gap-4">
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <RevealText
            as="h2"
            lines={contact.headline}
            className="max-w-3xl text-4xl text-ink md:text-6xl"
          />
          <p className="mt-2 max-w-md text-base text-ink/60">{contact.body}</p>
        </div>

        <form
          className="mt-14 grid max-w-2xl gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            // Stub: no network submission in this build.
          }}
        >
          <input
            required
            type="text"
            placeholder={contact.fields.name}
            className="w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <input
            required
            type="email"
            placeholder={contact.fields.email}
            className="w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <textarea
            rows={4}
            placeholder={contact.fields.event}
            className="w-full resize-none rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ember"
          />
          <div>
            <PillButton>{contact.cta}</PillButton>
          </div>
        </form>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-ink/10 py-8">
          <nav className="flex flex-wrap gap-6">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-meta text-[11px] text-ink/60 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <p className="font-meta text-[11px] text-ink/40">{contact.copyright}</p>
        </div>
      </div>

      {/* Giant woven wordmark */}
      <div className="relative mt-4 flex justify-center overflow-hidden">
        <span className="font-display block select-none text-[24vw] font-bold leading-none text-ink/[0.06]">
          {contact.wordmark}
        </span>
      </div>
    </footer>
  );
}
