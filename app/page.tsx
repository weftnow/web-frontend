import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";

export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <Nav />
      <main className="relative">
        <div className="bg-bone">
          <Hero />
        </div>
        <Problem />
      </main>
    </>
  );
}
