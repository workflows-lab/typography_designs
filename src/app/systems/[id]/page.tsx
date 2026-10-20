import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { DetailFallback } from "@/components/layout/DetailFallback";
import { Container, Section } from "@/components/layout/Page";
import { AuditList } from "@/components/systems/AuditList";
import { ExportPanel, type ExportFile } from "@/components/systems/ExportPanel";
import { FontRoles } from "@/components/systems/FontRoles";
import { ScaleSpecimen } from "@/components/systems/ScaleSpecimen";
import { SystemPreview } from "@/components/systems/SystemPreview";
import { SystemStyles } from "@/components/systems/SystemStyles";
import { cssVars } from "@/lib/css-vars";
import { SYSTEMS, getSystem, systemSlug } from "@/typography/data/systems";
import { INDUSTRIES } from "@/typography/data/taxonomy";
import { auditSystem } from "@/typography/engine/audit";
import { systemIsFullyBilingual } from "@/typography/engine/system-fonts";
import { buildSystemExport, contractFilename } from "@/typography/export/contract";
import { TEXT_STYLE_KEYS } from "@/typography/types";
import styles from "./page.module.css";

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ id: systemSlug(s) }));
}

export async function generateMetadata({ params }: PageProps<"/systems/[id]">): Promise<Metadata> {
  const { id } = await params;
  const system = getSystem(id);
  return system ? { title: `${system.id} ${system.name}`, description: system.summary } : {};
}

/*
 * The page stays static; everything that depends on `params` lives under Suspense so a
 * client navigation can show the shell instantly. Every ID is prerendered by
 * generateStaticParams, so full page loads still receive complete HTML.
 */
export default function SystemPage({ params }: PageProps<"/systems/[id]">) {
  return (
    <Suspense fallback={<DetailFallback kicker="Typography system" />}>
      <SystemDetail params={params} />
    </Suspense>
  );
}

async function SystemDetail({ params }: { params: PageProps<"/systems/[id]">["params"] }) {
  const { id } = await params;
  const system = getSystem(id);
  if (!system) notFound();

  const slug = systemSlug(system);
  const files = buildSystemExport(system);
  const audit = auditSystem(system);
  const index = SYSTEMS.indexOf(system);
  const prev = SYSTEMS[(index - 1 + SYSTEMS.length) % SYSTEMS.length];
  const next = SYSTEMS[(index + 1) % SYSTEMS.length];
  const contractName = contractFilename(system);

  const exportFiles: ExportFile[] = [
    {
      key: "contract",
      label: "contract.md",
      filename: contractName,
      mime: "text/markdown",
      content: files.contract,
      description: "Everything below in one self-contained document. Hand this to a new project.",
    },
    {
      key: "fonts",
      label: "fonts.ts",
      filename: "fonts.ts",
      mime: "text/plain",
      content: files.fontsTs,
      description: "next/font/google loaders with exact weights, styles, axes and variable names.",
    },
    {
      key: "layout",
      label: "layout.tsx",
      filename: "layout.tsx",
      mime: "text/plain",
      content: files.layoutTsx,
      description: "Root layout wiring: font variables on <html>, CSS import, lang.",
    },
    {
      key: "css",
      label: "typography.css",
      filename: "typography.css",
      mime: "text/css",
      content: files.css,
      description: "Tokens, base text, flow, element styles and .t-* utilities.",
    },
    {
      key: "tokens",
      label: "tokens.json",
      filename: `${system.id}-tokens.json`,
      mime: "application/json",
      content: files.tokens,
      description: "Platform-neutral tokens: px endpoints, clamp() values, weights, rhythm.",
    },
    {
      key: "link",
      label: "<link> URL",
      filename: "google-fonts-url.txt",
      mime: "text/plain",
      content: files.googleUrl + "\n",
      description: "Google Fonts CSS2 URL for projects that cannot use next/font.",
    },
  ];

  const { paper, ink, muted, accent, rule } = system.palette;

  return (
    <article>
      <SystemStyles system={system} unit="vw" />
      <SystemStyles system={system} unit="cqi" />

      <header
        className={styles.hero}
        style={cssVars({ "--c-paper": paper, "--c-ink": ink, "--c-muted": muted, "--c-accent": accent, "--c-rule": rule })}
      >
        <Container className={styles.heroGrid}>
          <div className={styles.heroType} data-type-system={system.id} data-fluid="vw">
            <p className={`t-label ${styles.heroLabel}`}>{system.id} · Typography system</p>
            <h1 className={`t-display ${styles.heroTitle}`}>{system.name}</h1>
            <p className={`t-lead ${styles.heroLead}`}>{system.tagline}</p>
            <p className={`t-h3 ${styles.heroGreek}`} lang="el">
              {system.composition.content.el.headline}
            </p>
          </div>
          <aside className={styles.heroAside} aria-label="System summary">
            <dl className={styles.heroFacts}>
              <div>
                <dt>ID</dt>
                <dd>{system.id}</dd>
              </div>
              <div>
                <dt>Personality</dt>
                <dd>{system.personality.join(" · ")}</dd>
              </div>
              <div>
                <dt>Industries</dt>
                <dd>{system.industries.map((i) => INDUSTRIES[i].label).join(", ")}</dd>
              </div>
              <div>
                <dt>Scripts</dt>
                <dd>{systemIsFullyBilingual(system) ? "Greek + Latin in every role" : "Partial Greek"}</dd>
              </div>
              <div>
                <dt>Checks</dt>
                <dd>
                  {audit.filter((c) => c.pass).length}/{audit.length} passing
                </dd>
              </div>
            </dl>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href={`/systems/${slug}/contract`} download={contractName}>
                Download contract
              </a>
              <a className={styles.secondaryAction} href="#implementation">
                Implementation
              </a>
            </div>
          </aside>
        </Container>
      </header>

      <Section id="overview" index="01" title="Intent & pairing rationale">
        <div className={styles.overview}>
          <p className={styles.summary}>{system.summary}</p>
          <div className={styles.rationale}>
            {system.rationale.map((r) => (
              <p key={r.slice(0, 32)}>{r}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="fonts" index="02" title="Fonts & roles" description="Exactly what the system loads — nothing more.">
        <FontRoles system={system} />
      </Section>

      <Section
        id="scale"
        index="03"
        title="Type scale"
        description={`${TEXT_STYLE_KEYS.length} styles, fluid between ${system.fluid.minViewport}px and ${system.fluid.maxViewport}px. Resize the window: these samples use the exported CSS with viewport units.`}
      >
        <ScaleSpecimen system={system} />
      </Section>

      <Section
        id="preview"
        index="04"
        title="In a real page"
        description="The same CSS applied to a realistic composition, rendered at true desktop and mobile widths."
      >
        <SystemPreview system={system} />
      </Section>

      <Section id="guidelines" index="05" title="Measure, wrapping & usage">
        <div className={styles.guidelines}>
          <Guidance title="Measure" items={system.guidance.measure}>
            <p className={styles.measureFacts}>
              Body {system.measure.body}ch · Lead {system.measure.lead}ch · Narrow {system.measure.narrow}ch · Headings{" "}
              {system.measure.heading}ch
            </p>
          </Guidance>
          <Guidance title="Wrapping" items={system.guidance.wrapping} />
          <Guidance title="Usage" items={system.guidance.usage} />
        </div>
      </Section>

      <Section id="greek" index="06" title="Greek typesetting">
        <div className={styles.guidelines}>
          <Guidance title="Rules for Greek" items={system.guidance.greek} wide />
        </div>
      </Section>

      <Section id="accessibility" index="07" title="Accessibility">
        <div className={styles.accessibility}>
          <Guidance title="Considerations" items={system.guidance.accessibility} />
          <div>
            <h3 className={styles.guidanceTitle}>Automated checks</h3>
            <AuditList checks={audit} />
          </div>
        </div>
      </Section>

      <Section
        id="implementation"
        index="08"
        title="Implementation"
        description={
          <>
            To reuse {system.id} in another repository, give the contract to that project (or to Claude) and ask it
            to implement <strong>typography system {system.id}</strong> exactly as specified. The contract does not depend
            on this library&apos;s components or styles.
          </>
        }
      >
        <ol className={styles.steps}>
          <li>
            Download or copy <code>contract.md</code>.
          </li>
          <li>
            Create <code>src/app/fonts.ts</code> and <code>src/app/typography.css</code> from it.
          </li>
          <li>
            Apply <code>fontVariables</code> and <code>lang</code> on <code>&lt;html&gt;</code>.
          </li>
          <li>Write semantic HTML; use <code>.t-*</code> classes where an element needs another style.</li>
          <li>Run the verification checklist at the end of the contract.</li>
        </ol>
        <ExportPanel files={exportFiles} />
      </Section>

      <Container>
        <nav className={styles.pager} aria-label="Other systems">
          <Link href={`/systems/${systemSlug(prev)}`} rel="prev">
            ← {prev.id} {prev.name}
          </Link>
          <Link href="/systems">All systems</Link>
          <Link href={`/systems/${systemSlug(next)}`} rel="next">
            {next.id} {next.name} →
          </Link>
        </nav>
      </Container>
    </article>
  );
}

function Guidance({ title, items, wide, children }: { title: string; items: string[]; wide?: boolean; children?: ReactNode }) {
  return (
    <div className={styles.guidance} data-wide={wide || undefined}>
      <h3 className={styles.guidanceTitle}>{title}</h3>
      {children}
      <ul className={styles.guidanceList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
