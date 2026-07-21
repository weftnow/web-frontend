import { WeaveCanvas } from "@/components/ui/WeaveCanvas";
import { SectionShell } from "@/components/ui/SectionShell";

export default function Home() {
  return (
    <>
      <WeaveCanvas />
      <main className="relative">
        <SectionShell act="warm">
          <div className="h-[80vh]" />
        </SectionShell>
        <SectionShell act="dark">
          <div className="h-[80vh]" />
        </SectionShell>
        <SectionShell act="ember">
          <div className="h-[40vh]" />
        </SectionShell>
        <SectionShell act="light">
          <div className="h-[80vh]" />
        </SectionShell>
      </main>
    </>
  );
}
