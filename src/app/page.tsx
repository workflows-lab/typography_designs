import Link from "next/link";
import { Container } from "@/components/layout/Page";
import { cssVars } from "@/lib/css-vars";
import { FONTS, FONT_LIST } from "@/typography/data/fonts";
import { SPECIMEN_TEXT } from "@/typography/data/specimens";
import { SYSTEMS, systemSlug } from "@/typography/data/systems";
import { CLASSIFICATIONS } from "@/typography/data/taxonomy";
import { fontStack, supportsGreek } from "@/typography/engine/font-support";
import type { FontId } from "@/typography/types";
import styles from "./page.module.css";

const STRIP: FontId[] = ["gfs-didot", "commissioner", "literata", "syne", "alegreya", "geologica", "noto-serif-display", "ysabeau"];

export default function Home() {
  const greekCount = FONT_LIST.filter(supportsGreek).length;
  return (
    <>
      <section className={styles.masthead} aria-labelledby="home-title">
        <Container className={styles.mastGrid}>
          <p className={styles.kicker}>Private typography laboratory · Ελληνικά &amp; English</p>
          <h1 id="home-title" className={styles.title}>
            Type for two alphabets, ready to ship.
          </h1>
          <p className={styles.intro}>
            A curated library of Greek and Latin typefaces, tested in real specimens, and a set of complete
            typography systems with stable IDs — each exportable as a contract a new project can implement exactly.
          </p>
          <p className={styles.bigGlyph} aria-hidden="true" lang="el">
            Αα
          </p>
        </Container>
      </section>

      <section aria-label="Specimen strip" className={styles.stripSection}>
        <Container>
          <ul className={styles.strip}>
            {STRIP.map((id) => {
              const font = FONTS[id];
              return (
                <li key={id} style={cssVars({ "--specimen-family": fontStack(id) })}>
                  <Link href={`/fonts/${id}`} className={styles.stripLink}>
                    <span className={styles.stripGlyph} lang="el" aria-hidden="true">
                      Ωω
                    </span>
                    <span className={styles.stripName}>{font.family}</span>
                    <span className={styles.stripMeta}>{CLASSIFICATIONS[font.classifications[0]].label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section aria-label="Collections" className={styles.collections}>
        <Container className={styles.collectionGrid}>
          <Link href="/fonts" className={styles.collection}>
            <span className={styles.collectionIndex}>A</span>
            <span className={styles.collectionTitle}>Font Explorer</span>
            <span className={styles.collectionText}>
              {FONT_LIST.length} typefaces — {greekCount} with Greek, {FONT_LIST.length - greekCount} Latin-only with
              recommended Greek alternatives. Filter by classification, script, role and industry; test every weight.
            </span>
            <span className={styles.collectionCta}>Browse typefaces →</span>
          </Link>
          <Link href="/systems" className={styles.collection}>
            <span className={styles.collectionIndex}>B</span>
            <span className={styles.collectionTitle}>Typography Systems</span>
            <span className={styles.collectionText}>
              {SYSTEMS.length} complete systems, {SYSTEMS[0].id}–{SYSTEMS[SYSTEMS.length - 1].id}: fonts, fluid scale,
              rhythm, Greek rules and accessibility, previewed in real page compositions and exported as contracts.
            </span>
            <span className={styles.collectionCta}>Open systems →</span>
          </Link>
          <div className={styles.tools}>
            <Link href="/compare">Compare fonts →</Link>
            <Link href="/pairings">Pairing lab →</Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="systems-title" className={styles.systemsSection}>
        <Container>
          <h2 id="systems-title" className={styles.sectionTitle}>
            Systems index
          </h2>
          <ol className={styles.systems}>
            {SYSTEMS.map((s) => {
              const d = s.families.display;
              const st = s.styles.display;
              return (
                <li key={s.id}>
                  <Link
                    href={`/systems/${systemSlug(s)}`}
                    className={styles.systemLink}
                    style={cssVars({
                      "--sys-family": fontStack(d.font, d.greekCompanion),
                      "--sys-weight": st.weight,
                      "--sys-style": st.style ?? "normal",
                      "--sys-variation": st.variation ?? "normal",
                    })}
                  >
                    <span className={styles.systemId}>{s.id}</span>
                    <span className={styles.systemName}>{s.name}</span>
                    <span className={styles.systemTag}>{s.personality.slice(0, 3).join(" · ")}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="reuse-title" className={styles.reuse}>
        <Container className={styles.reuseGrid}>
          <h2 id="reuse-title" className={styles.sectionTitle}>
            Reuse in three steps
          </h2>
          <ol className={styles.steps}>
            <li>
              <strong>Choose a system ID.</strong> IDs are permanent — “T005” will always mean Bilingual Broadsheet.
            </li>
            <li>
              <strong>Export its contract.</strong> One Markdown file with fonts, next/font code, CSS, tokens and rules.
            </li>
            <li>
              <strong>Implement anywhere.</strong> Hand the contract to the new repository (or to Claude) and run its
              verification checklist.
            </li>
          </ol>
          <p className={styles.reuseSample} lang="el">
            {SPECIMEN_TEXT.el.pangram}
          </p>
        </Container>
      </section>
    </>
  );
}
