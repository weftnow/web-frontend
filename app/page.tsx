import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <Nav />
      <main className="relative bg-bone">
        <Hero />
      </main>
    </>
  );
}
