import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { Counter } from "@/components/ui/Counter";
import { content } from "@/content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bone px-6">
      <Eyebrow>{content.hero.ycLabel}</Eyebrow>
      <RevealText
        as="h1"
        lines={content.hero.headline}
        className="max-w-4xl text-center text-5xl md:text-7xl"
      />
      <div className="flex gap-3">
        <PillButton href="#">Book a demo</PillButton>
        <PillButton href="#" variant="outline">
          See how it works
        </PillButton>
      </div>
      <div className="font-display text-6xl text-ink">
        <Counter value={3.4} suffix="x" />
      </div>
    </main>
  );
}
