"use client";

import { content } from "@/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contact() {
  const { contact, media, nav, reveal } = content;
  const proof = reveal.stats[0];

  return (
    <footer
      id="contact"
      className="relative z-10 overflow-hidden bg-bone px-6 pt-28 md:px-10 md:pt-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-[2rem] bg-paper shadow-[var(--shadow-media)] lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:rounded-[2.5rem]">
          <div className="relative min-h-[380px] overflow-hidden lg:min-h-[720px]">
            <MediaPlaceholder
              className="absolute inset-0 h-full w-full"
              media={media.contact}
              sizes="(max-width: 1023px) 100vw, 480px"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,18,0.04)_20%,rgba(18,18,18,0.88)_100%)]"
            />
            <div className="absolute inset-x-0 bottom-0 p-7 text-paper sm:p-9 lg:p-10">
              <p className="font-meta text-[10px] text-paper/58">Outcome proof</p>
              <p className="mt-5 font-display text-5xl font-bold tabular-nums sm:text-6xl">
                {proof.value}
                {proof.suffix}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/76">
                {proof.label}
              </p>
              <p className="font-meta mt-6 max-w-xs text-[9px] leading-relaxed text-paper/48">
                {reveal.statsNote}
              </p>
            </div>
          </div>

          <div className="px-7 py-12 sm:px-10 lg:px-14 lg:py-16 xl:px-16">
            <div className="flex flex-col items-start gap-4">
              <Eyebrow>{contact.eyebrow}</Eyebrow>
              <SectionHeading
                as="h2"
                lines={contact.headline}
                className="max-w-2xl text-4xl text-ink md:text-5xl"
              />
              <p className="mt-1 max-w-md text-base leading-relaxed text-ink/62">
                {contact.body}
              </p>
            </div>

            <form
              className="mt-10 grid gap-6"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <ContactField
                autoComplete="name"
                id="contact-name"
                label={contact.fields.name}
                placeholder={contact.fields.name}
                required
                type="text"
              />
              <ContactField
                autoComplete="email"
                id="contact-email"
                label={contact.fields.email}
                placeholder={contact.fields.email}
                required
                type="email"
              />

              <div className="grid gap-2">
                <label className="text-sm font-medium text-ink" htmlFor="contact-event">
                  {contact.fields.event}
                </label>
                <textarea
                  className="min-h-32 w-full resize-y rounded-2xl border border-ink/14 bg-bone/50 px-5 py-4 text-base leading-relaxed text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-ink/32 focus:border-signal focus:bg-paper focus:shadow-[0_0_0_3px_rgba(0,144,222,0.14)]"
                  id="contact-event"
                  name="event"
                  placeholder={contact.fields.event}
                  rows={4}
                />
              </div>

              <div className="mt-2">
                <PremiumButton tone="ember" type="submit">
                  {contact.cta}
                </PremiumButton>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-ink/12 py-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="grid gap-5">
            <a aria-label="Weft home" className="inline-flex items-center gap-2" href="#main-content">
              <img alt="" className="footer-brand-mark" height={28} src="/icon.svg" width={28} />
              <span className="font-display text-sm font-bold text-ink">weft</span>
            </a>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
              {nav.links.map((link) => (
                <a
                  className="font-meta rounded-sm text-[10px] text-ink/62 transition-colors duration-200 hover:text-ink focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-signal"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <span aria-disabled="true" className="font-meta text-[9px] text-ink/32">
                Privacy
              </span>
              <span aria-disabled="true" className="font-meta text-[9px] text-ink/32">
                Terms
              </span>
              <span className="font-meta text-[9px] text-ink/32">Routes coming soon</span>
            </div>
          </div>
          <p className="font-meta text-[9px] text-ink/42 md:text-right">
            {contact.copyright}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex max-w-[100rem] justify-center overflow-hidden pt-10">
        <span className="font-display relative block select-none text-[24vw] font-bold leading-[0.72] text-ink/[0.07]">
          {contact.wordmark}
        </span>
      </div>
    </footer>
  );
}

function ContactField({
  autoComplete,
  id,
  label,
  placeholder,
  required,
  type,
}: {
  autoComplete: string;
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type: "email" | "text";
}) {
  return (
    <div className="grid gap-2">
      <label className="flex items-baseline justify-between gap-4 text-sm font-medium text-ink" htmlFor={id}>
        <span>{label}</span>
        {required ? <span className="font-meta text-[9px] text-ink/38">Required</span> : null}
      </label>
      <input
        autoComplete={autoComplete}
        className="min-h-14 w-full rounded-2xl border border-ink/14 bg-bone/50 px-5 py-4 text-base text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-ink/32 focus:border-signal focus:bg-paper focus:shadow-[0_0_0_3px_rgba(0,144,222,0.14)]"
        id={id}
        name={id.replace("contact-", "")}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  );
}
