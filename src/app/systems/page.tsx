import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, Stat } from "@/components/layout/Page";
import { cssVars } from "@/lib/css-vars";
import { SYSTEMS, systemSlug } from "@/typography/data/systems";
import { INDUSTRIES } from "@/typography/data/taxonomy";
import { fontStack } from "@/typography/engine/font-support";
import { systemFontLoads, systemIsFullyBilingual } from "@/typography/engine/system-fonts";
import { TEXT_STYLE_KEYS } from "@/typography/types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Typography Systems",
  description: "Complete, portable typography systems with stable IDs.",
};

export default function SystemsPage() {
  return (
    <>
      <PageHeader
        kicker="Collection B · Typography Systems"
        title="Systems you can lift into a new site."
        intro={
          <p>
            Each system is a complete typographic contract — fonts, fluid scale, rhythm, Greek rules and
            accessibility — with a permanent ID. Reference the ID in a future project and export its contract.
          </p>
        }
        aside={
          <>
            <Stat value={String(SYSTEMS.length).padStart(2, "0")} label="Systems" />
            <Stat value={String(SYSTEMS.filter(systemIsFullyBilingual).length).padStart(2, "0")} label="Fully bilingual" />
            <Stat value={String(TEXT_STYLE_KEYS.length)} label="Text styles each" />
          </>
        }
      />
      <Container>
        <ol className={styles.list}>
          {SYSTEMS.map((system) => {
            const display = system.families.display;
            const h = system.styles.display;
            const fonts = systemFontLoads(system);
            return (
              <li key={system.id} className={styles.entry}>
                <Link href={`/systems/${systemSlug(system)}`} className={styles.link}>
                  <span className={styles.id}>{system.id}</span>
                  <span
                    className={styles.name}
                    style={cssVars({
                      "--sys-family": fontStack(display.font, display.greekCompanion),
                      "--sys-weight": h.weight,
                      "--sys-style": h.style ?? "normal",
                      "--sys-tracking": `${h.tracking}em`,
                      "--sys-variation": h.variation ?? "normal",
                    })}
                  >
                    <span lang="en">{system.name}</span>
                    <span lang="el" className={styles.nameEl}>
                      {system.composition.content.el.headline}
                    </span>
                  </span>
                  <span className={styles.tagline}>{system.tagline}</span>
                  <span className={styles.meta}>
                    <span>{fonts.map((l) => l.font.family).join(" + ")}</span>
                    <span>{system.industries.map((i) => INDUSTRIES[i].label).join(", ")}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
