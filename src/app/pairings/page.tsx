import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PairingLab } from "@/components/compare/PairingLab";
import compareStyles from "@/components/compare/compare.module.css";
import { Container, PageHeader, Section } from "@/components/layout/Page";
import { cssVars } from "@/lib/css-vars";
import { FONTS } from "@/typography/data/fonts";
import { PAIRINGS } from "@/typography/data/pairings";
import { SPECIMEN_TEXT } from "@/typography/data/specimens";
import { INDUSTRIES } from "@/typography/data/taxonomy";
import { supportsGreek } from "@/typography/engine/font-support";
import { specimenFamily } from "@/typography/engine/specimen";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Pairings",
  description: "A pairing lab and curated heading/body combinations for Greek and Latin.",
};

export default function PairingsPage() {
  return (
    <>
      <PageHeader
        kicker="Tool · Pairings"
        title="One voice, one listener."
        intro={
          <p>
            Try any heading and body combination in a short article, in either language — or start from a
            curated pairing below.
          </p>
        }
      />
      <Container>
        <Suspense fallback={<p className={styles.loading}>Loading pairing lab…</p>}>
          <PairingLab />
        </Suspense>
      </Container>

      <Section id="curated" title="Curated pairings" description="Each opens in the lab above.">
        <ul className={compareStyles.curated}>
          {PAIRINGS.map((p) => {
            const heading = FONTS[p.heading];
            const body = FONTS[p.body];
            const bilingual = supportsGreek(heading) && supportsGreek(body);
            return (
              <li key={p.id} className={compareStyles.curatedItem}>
                <Link
                  href={`/pairings?heading=${p.heading}&body=${p.body}`}
                  className={compareStyles.curatedLink}
                  style={cssVars({
                    "--heading-family": specimenFamily(heading),
                    "--heading-weight": p.headingWeight,
                    "--body-family": specimenFamily(body),
                  })}
                >
                  <span className={compareStyles.curatedMeta}>
                    <span>{p.title}</span>
                    <span>{bilingual ? "Greek + Latin" : "Latin heading"}</span>
                  </span>
                  <span className={compareStyles.curatedHeading} lang="en">
                    {SPECIMEN_TEXT.en.headline}
                  </span>
                  {supportsGreek(heading) ? (
                    <span className={compareStyles.curatedGreek} lang="el">
                      {SPECIMEN_TEXT.el.headline}
                    </span>
                  ) : null}
                  <span className={compareStyles.curatedFonts}>
                    {heading.family} + {body.family}
                  </span>
                  <span className={compareStyles.curatedBody}>{p.rationale}</span>
                  <span className={compareStyles.curatedMeta}>
                    <span>{p.industries.map((i) => INDUSTRIES[i].label).join(", ")}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
