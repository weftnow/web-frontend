import type { Metadata } from "next";
import { CompatibilityTest } from "@/components/compatibility/CompatibilityTest";

export const metadata: Metadata = {
  title: "Weft: Compatibility Test",
  description:
    "Answer three quick questions and discover your networking archetype — the values, connection style, and stats worth sharing.",
};

export default function CompatibilityTestPage() {
  return (
    <main id="main-content">
      <CompatibilityTest />
    </main>
  );
}
