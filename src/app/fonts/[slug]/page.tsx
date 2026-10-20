import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { DetailFallback } from "@/components/layout/DetailFallback";
import { Container, Section } from "@/components/layout/Page";
import { GlyphSet } from "@/components/specimen/GlyphSet";
import { ScriptSupport } from "@/components/specimen/ScriptSupport";
import { TypeTester } from "@/components/specimen/TypeTester";
import { WeightLadder } from "@/components/specimen/WeightLadder";
import { CopyButton } from "@/components/ui/CopyButton";
import { cssVars } from "@/lib/css-vars";
import { FONT_IDS } from "@/typography/data/font-ids";
import { FONTS } from "@/typography/data/fonts";
import { SPECIMEN_TEXT } from "@/typography/data/specimens";
import { systemSlug } from "@/typography/data/systems";
import { CLASSIFICATIONS, FONT_ROLES, INDUSTRIES } from "@/typography/data/taxonomy";
import { fontStack, isVariable, scriptSummary, supportsGreek } from "@/typography/engine/font-support";
import { getFontBySlug, pairingsForFont, systemsUsingFont } from "@/typography/engine/queries";
import { specimenFamily } from "@/typography/engine/specimen";
import { fontLoaderSnippet } from "@/typography/export/next-font";
import styles from "./page.module.css";

export function generateStaticParams() {
  return FONT_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/fonts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const font = getFontBySlug(slug);
  return font ? { title: font.family, description: font.summary } : {};
}

/* Static page; params-dependent content under Suspense (see systems/[id]/page.tsx). */
export default function FontPage({ params }: PageProps<"/fonts/[slug]">) {
  return (
    <Suspense fallback={<DetailFallback kicker="Typeface" />}>
      <FontDetail params={params} />
    </Suspense>
  );
}

async function FontDetail({ params }: { params: PageProps<"/fonts/[slug]">["params"] }) {
  const { slug } = await params;
  const font = getFontBySlug(slug);
  if (!font) notFound();

  const index = FONT_IDS.indexOf(font.id);
  const prev = FONTS[FONT_IDS[(index - 1 + FONT_IDS.length) % FONT_IDS.length]];
  const next = FONTS[FONT_IDS[(index + 1) % FONT_IDS.length]];
  const greek = supportsGreek(font);
  const pairings = pairingsForFont(font.id);
  const systems = systemsUsingFont(font.id);
  const snippet = fontLoaderSnippet(font);
  let section = 0;
  const n = () => String(++section).padStart(2, "0");

  return (
    <article style={cssVars({ "--specimen-family": specimenFamily(font) })}>
      <header className={styles.hero}>
        <Container className={styles.heroGrid}>
          <p className={styles.kicker}>
            Typeface {String(index + 1).padStart(2, "0")} / {FONT_IDS.length} ·{" "}
            {font.classifications.map((c) => CLASSIFICATIONS[c].label).join(" · ")}
          </p>
          <h1 className={styles.name}>{font.family}</h1>
          <p className={styles.heroGlyphs} aria-hidden="true">
            <span lang="en">Aa Gg Rr</span>
            {greek ? <span lang="el">Αα Γγ Ωω</span> : null}
          </p>
          <div className={styles.heroText}>
            <p className={styles.summary}>{font.summary}</p>
            <ScriptSupport font={font} />
            {!greek ? (
              <p className={styles.latinOnly}>
                Latin only. For Greek, use{" "}
                {font.greekAlternatives?.map((a, i) => (
                  <span key={a.font}>
                    {i > 0 ? " or " : ""}
                    <Link href={`/fonts/${a.font}`}>{FONTS[a.font].family}</Link>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </div>
          <dl className={styles.facts}>
            <Fact label="Design">{font.designers.join(", ")}</Fact>
            <Fact label="Scripts">{scriptSummary(font)}</Fact>
            <Fact label="Subsets">{font.subsets.join(", ")}</Fact>
            <Fact label="Weights">
              {isVariable(font) ? `Variable ${font.axes?.find((a) => a.tag === "wght")?.min}–${font.axes?.find((a) => a.tag === "wght")?.max}` : font.weights.join(", ")}
            </Fact>
            <Fact label="Styles">{font.styles.join(", ")}</Fact>
            {font.axes ? (
              <Fact label="Axes">
                {font.axes.map((a) => `${a.tag} ${a.min}–${a.max}`).join(" · ")}
                {font.loadedAxes.length ? ` (loaded: wght, ${font.loadedAxes.join(", ")})` : " (loaded: wght)"}
              </Fact>
            ) : null}
            <Fact label="Licence">
              <a href={font.license.url} rel="noreferrer">
                {font.license.name}
              </a>
            </Fact>
            <Fact label="Source">
              <a href={font.provider.specimenUrl} rel="noreferrer">
                Google Fonts
              </a>{" "}
              · self-hosted via next/font
            </Fact>
            <Fact label="Best for">{font.roles.map((r) => FONT_ROLES[r].label).join(", ")}</Fact>
            <Fact label="Industries">{font.industries.map((i) => INDUSTRIES[i].label).join(", ")}</Fact>
          </dl>
        </Container>
      </header>

      <Section id="tester" index={n()} title="Type tester" description="Switch script, edit the text and adjust weight, size, tracking, leading and variable axes.">
        <TypeTester font={font} />
      </Section>

      <Section id="notes" index={n()} title="Notes">
        <ul className={styles.notes}>
          {font.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <ul className={styles.traits} aria-label="Traits">
          {font.traits.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section id="weights" index={n()} title="Weights & styles" description={`${font.weights.length} named weights${font.styles.includes("italic") ? " with italics" : ""}, shown in English and Greek.`}>
        <WeightLadder font={font} />
      </Section>

      <Section id="text" index={n()} title="Running text" description="The same paragraph in both languages at three reading sizes.">
        <div className={styles.paragraphs}>
          {[22, 18, 15].map((size) => (
            <div key={size} className={styles.paragraphRow} style={cssVars({ "--p-size": `${size}px` })}>
              <span className={styles.paragraphSize}>{size}px</span>
              <p lang="en">{SPECIMEN_TEXT.en.paragraph}</p>
              {greek ? (
                <p lang="el">{SPECIMEN_TEXT.el.paragraph}</p>
              ) : (
                <p className={styles.unsupported}>No Greek glyphs in {font.family}.</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section id="glyphs" index={n()} title="Character set" description="Rendered with the web font only. Groups the font does not cover are listed, not faked.">
        <GlyphSet font={font} />
      </Section>

      {!greek && font.greekAlternatives?.length ? (
        <Section id="greek-alternatives" index={n()} title="Greek alternatives" description={`${font.family} has no Greek. These keep its voice in Greek text.`}>
          <ul className={styles.alternatives}>
            {font.greekAlternatives.map((alt) => (
              <li key={alt.font} className={styles.alternative}>
                <p className={styles.altPair}>
                  <span style={cssVars({ "--alt-family": fontStack(font.id) })} lang="en">
                    {SPECIMEN_TEXT.en.short}
                  </span>
                  <span style={cssVars({ "--alt-family": fontStack(alt.font) })} lang="el">
                    {SPECIMEN_TEXT.el.short}
                  </span>
                </p>
                <h3 className={styles.altName}>
                  <Link href={`/fonts/${alt.font}`}>{FONTS[alt.font].family}</Link>
                </h3>
                <p className={styles.altReason}>{alt.reason}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section
        id="pairings"
        index={n()}
        title="Pairings"
        description={pairings.length ? "Curated combinations. Open any in the pairing lab." : "No curated pairing yet — try one in the pairing lab."}
        actions={
          <Link className={styles.action} href={`/pairings?heading=${font.id}`}>
            Pairing lab →
          </Link>
        }
      >
        {pairings.length ? (
          <ul className={styles.pairings}>
            {pairings.map((p) => (
              <li key={p.id} className={styles.pairing}>
                <Link href={`/pairings?heading=${p.heading}&body=${p.body}`} className={styles.pairingLink}>
                  <span className={styles.pairingMeta}>
                    {p.title} · {FONTS[p.heading].family} + {FONTS[p.body].family}
                  </span>
                  <span
                    className={styles.pairingHeading}
                    style={cssVars({ "--pair-family": specimenFamily(FONTS[p.heading]), "--pair-weight": p.headingWeight })}
                  >
                    {SPECIMEN_TEXT.en.headline}
                  </span>
                  <span
                    className={styles.pairingBody}
                    style={cssVars({ "--pair-family": specimenFamily(FONTS[p.body]), "--pair-weight": p.bodyWeight })}
                  >
                    {p.rationale}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      {systems.length ? (
        <Section id="systems" index={n()} title="Used in systems">
          <ul className={styles.systems}>
            {systems.map((s) => (
              <li key={s.id}>
                <Link href={`/systems/${systemSlug(s)}`}>
                  <span className={styles.systemId}>{s.id}</span> {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section id="implementation" index={n()} title="Implementation" description="next/font configuration matching what this library loads." actions={<CopyButton value={snippet} subject={`${font.family} next/font snippet`} />}>
        <pre className={styles.code} tabIndex={0}>
          <code>{snippet}</code>
        </pre>
      </Section>

      <Container>
        <nav className={styles.pager} aria-label="Other typefaces">
          <Link href={`/fonts/${prev.id}`} rel="prev">
            ← {prev.family}
          </Link>
          <Link href="/fonts">All typefaces</Link>
          <Link href={`/fonts/${next.id}`} rel="next">
            {next.family} →
          </Link>
        </nav>
      </Container>
    </article>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.fact}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
