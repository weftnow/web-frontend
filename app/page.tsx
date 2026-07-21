import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Eyebrow";
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
    </main>
  );
}
