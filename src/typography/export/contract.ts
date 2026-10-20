import { FAMILY_ROLES, INDUSTRIES, TEXT_STYLES } from "../data/taxonomy";
import { auditSystem } from "../engine/audit";
import { getFont, scriptSummary, supportsGreek } from "../engine/font-support";
import { fluidClamp } from "../engine/fluid";
import { systemCss } from "../engine/system-css";
import { assignedRoles, familyFor, systemFontLoads } from "../engine/system-fonts";
import type { TypographySystem } from "../types";
import { TEXT_STYLE_KEYS } from "../types";
import { googleFontsUrl } from "./google-css-url";
import { fontsNeedingFamilyOnly, nextFontModule, nextLayoutSnippet } from "./next-font";
import { tokensJson } from "./tokens-json";

export const CONTRACT_VERSION = 1;

export function contractFilename(system: TypographySystem): string {
  return `${system.id}-${system.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
}

export interface SystemExportFiles {
  contract: string;
  fontsTs: string;
  layoutTsx: string;
  css: string;
  tokens: string;
  googleUrl: string;
}

export function systemCssExport(system: TypographySystem): string {
  return (
    `/*\n * ${system.id} · ${system.name} — typography.css\n` +
    ` * Requires the --font-<id> variables from fonts.ts (next/font) on <html>.\n` +
    ` * Import after your CSS reset. Element styles use :where() (zero specificity);\n` +
    ` * .t-* utility classes apply any style to any element.\n */\n\n` +
    systemCss(system, { scope: null, unit: "vw", comments: true })
  );
}

function bullets(items: string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function fence(lang: string, body: string): string {
  return "```" + lang + "\n" + body.trimEnd() + "\n```";
}

export function buildSystemExport(system: TypographySystem): SystemExportFiles {
  const loads = systemFontLoads(system);
  const fontsTs = nextFontModule(system);
  const layoutTsx = nextLayoutSnippet(system);
  const css = systemCssExport(system);
  const tokens = tokensJson(system);
  const googleUrl = googleFontsUrl(system);
  const audit = auditSystem(system);

  const fontTable = [
    "| Font | Role | Scripts | Weights used | Styles | Axes | Licence | Source |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...loads.map((l) => {
      const role = [...l.roles, ...l.companionFor.map((r) => `${r} (Greek companion)`)].join(", ");
      return `| ${l.font.family} | ${role} | ${scriptSummary(l.font)} | ${l.weights.join(", ")} | ${l.styles.join(", ")} | ${l.axes.join(", ") || "—"} | ${l.font.license.spdx} | [Google Fonts](${l.font.provider.specimenUrl}) |`;
    }),
  ].join("\n");

  const roleTable = [
    "| Role | Font stack (CSS) |",
    "| --- | --- |",
    ...assignedRoles(system).map((role) => {
      const a = familyFor(system, role);
      const font = getFont(a.font);
      const companion = a.greekCompanion ? ` + Greek: ${getFont(a.greekCompanion).family}` : "";
      return `| ${FAMILY_ROLES[role].label} (\`--font-${role}\`) | ${font.family}${companion} |`;
    }),
  ].join("\n");

  const scaleTable = [
    `| Style | Selector | Family | Size @${system.fluid.minViewport}px | Size @${system.fluid.maxViewport}px | CSS size | Weight | Line-height | Tracking | Extras |`,
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...TEXT_STYLE_KEYS.map((key) => {
      const s = system.styles[key];
      const extras = [
        s.style === "italic" ? "italic" : "",
        s.transform === "uppercase" ? "uppercase" : "",
        s.variation ? `variation ${s.variation}` : "",
        s.features ? `features ${s.features}` : "",
      ]
        .filter(Boolean)
        .join("; ");
      return `| ${TEXT_STYLES[key].label} | \`${TEXT_STYLES[key].element}\` / \`.t-${key}\` | ${s.family} | ${s.size.min}px | ${s.size.max}px | \`${fluidClamp(s.size, system.fluid, "vw")}\` | ${s.weight} | ${s.lineHeight} | ${s.tracking}em | ${extras || "—"} |`;
    }),
  ].join("\n");

  const latinOnly = loads.filter((l) => !supportsGreek(l.font));

  const contract = `# ${system.id} — ${system.name}

> Typography system contract · version ${CONTRACT_VERSION}
> ${system.tagline}

This document is self-contained. It specifies everything needed to reproduce the
${system.id} typography in a new Next.js (App Router) project without access to the
Typography Design Library. Follow it literally; do not substitute fonts, weights or values.

## 1. Intent

${system.summary}

**Personality:** ${system.personality.join(" · ")}
**Industries:** ${system.industries.map((i) => INDUSTRIES[i].label).join(", ")}

### Pairing rationale

${system.rationale.map((r) => r).join("\n\n")}

## 2. Fonts

${fontTable}

All fonts are served by Google Fonts and self-hosted at build time by \`next/font/google\`.
Licence details: SIL Open Font License 1.1 — https://openfontlicense.org (free for commercial use, embedding and self-hosting).

### Roles

${roleTable}
${
  latinOnly.length
    ? `
### Latin-only fonts

${latinOnly.map((l) => `- **${l.font.family}** has no Greek glyphs. Greek text is rendered by its declared companion, placed second in the font stack.`).join("\n")}
- next/font always generates a metric-adjusted fallback face (local Times New Roman / Arial) inside \`--font-<id>\`. It has no \`unicode-range\`, so it would render Greek before the companion is reached. Stacks with a companion therefore start from \`--font-<id>-only\` — the bare family name, defined by \`fontOnlyCss\` in \`fonts.ts\` and rendered in the root layout. Do not replace it with \`--font-<id>\`.
`
    : ""
}
## 3. Implementation (Next.js App Router)

1. Create \`src/app/fonts.ts\`:

${fence("ts", fontsTs)}

2. Apply the font variables and import the CSS in the root layout:

${fence("tsx", layoutTsx)}

3. Create \`src/app/typography.css\` with the CSS in section 4. Import it after any reset.

4. Use semantic HTML (\`h1\`–\`h6\`, \`p\`, \`blockquote\`, \`figcaption\`, \`small\`). Apply
   \`.t-display\`, \`.t-lead\`, \`.t-label\`, \`.t-caption\` (and any \`.t-<style>\`) where an element
   needs a style other than its default.

### Without next/font

Load the same fonts from Google Fonts and define the variables yourself:

${fence("html", `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${googleUrl}">`)}

${fence(
  "css",
  `:root {\n${[
    ...loads.map((l) => `  --font-${l.font.id}: "${l.font.family}";`),
    ...fontsNeedingFamilyOnly(system).map((id) => `  --font-${id}-only: "${getFont(id).family}";`),
  ].join("\n")}\n}`,
)}

## 4. CSS (tokens, base, styles)

${fence("css", css)}

## 5. Type scale

Fluid between ${system.fluid.minViewport}px and ${system.fluid.maxViewport}px viewport width (root 16px).

${scaleTable}

**Emphasis:** \`strong\` = ${system.emphasis.strongWeight}; italic emphasis ${system.emphasis.italic ? "available" : "not available — use weight"}.
**Measure:** body ${system.measure.body}ch · lead ${system.measure.lead}ch · narrow ${system.measure.narrow}ch · headings ${system.measure.heading}ch.
**Flow:** paragraph spacing ${system.flow.paragraph}em · heading spacing ${system.flow.headingBefore}em before / ${system.flow.headingAfter}em after.

## 6. Guidelines

### Measure

${bullets(system.guidance.measure)}

### Wrapping

${bullets(system.guidance.wrapping)}

### Greek

${bullets(system.guidance.greek)}

### Usage

${bullets(system.guidance.usage)}

## 7. Accessibility

${bullets(system.guidance.accessibility)}

Automated checks (as verified in the library):

${audit.map((c) => `- [${c.pass ? "x" : " "}] **${c.label}** — ${c.detail}`).join("\n")}

## 8. Verification checklist

- [ ] \`fonts.ts\` matches section 3 exactly (families, axes, styles, variable names).
- [ ] \`<html>\` carries \`fontVariables\` and the correct \`lang\`.
- [ ] DevTools → computed \`font-family\` of an \`h1\` resolves to ${getFont(familyFor(system, system.styles.h1.family).font).family}.
- [ ] Greek text renders in a Greek design (check a word like «Αθήνα» in every role) — never in Times/Arial.
- [ ] At ${system.fluid.minViewport}px width, \`h1\` computes to ${system.styles.h1.size.min}px; at ≥ ${system.fluid.maxViewport}px, to ${system.styles.h1.size.max}px.
- [ ] Body paragraphs stop at ${system.measure.body}ch.
- [ ] Uppercase Greek labels show no tonos.

## 9. Tokens (JSON)

${fence("json", tokens)}
`;

  return { contract, fontsTs, layoutTsx, css, tokens, googleUrl };
}
