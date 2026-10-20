import type { Metadata } from "next";
import { FontExplorer } from "@/components/explorer/FontExplorer";
import { Container, PageHeader, Stat } from "@/components/layout/Page";
import { FONT_LIST } from "@/typography/data/fonts";
import { supportsGreek, supportsPolytonic } from "@/typography/engine/font-support";

export const metadata: Metadata = {
  title: "Font Explorer",
  description: "Curated Greek and Latin typefaces with live bilingual specimens.",
};

export default function FontsPage() {
  const greek = FONT_LIST.filter(supportsGreek).length;
  const polytonic = FONT_LIST.filter(supportsPolytonic).length;
  return (
    <>
      <PageHeader
        kicker="Collection A · Font Explorer"
        title="Typefaces, read in two alphabets."
        intro={
          <p>
            A curated set of established and lesser-known families. Every specimen is the real font; Greek
            support comes from verified subsets, and Latin-only faces point to their best Greek alternatives.
          </p>
        }
        aside={
          <>
            <Stat value={String(FONT_LIST.length)} label="Typefaces" />
            <Stat value={String(greek)} label="With Greek" />
            <Stat value={String(polytonic)} label="With polytonic Greek" />
            <Stat value={String(FONT_LIST.length - greek)} label="Latin only" />
          </>
        }
      />
      <Container>
        <FontExplorer />
      </Container>
    </>
  );
}
