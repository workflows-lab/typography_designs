import { TEXT_STYLES } from "../data/taxonomy";
import type { TextStyle, TextStyleKey, TypographySystem } from "../types";
import { TEXT_STYLE_KEYS } from "../types";
import { fontStack } from "./font-support";
import { fluidClamp, type FluidUnit } from "./fluid";
import { assignedRoles, familyFor } from "./system-fonts";

/*
 * The single source of CSS for a typography system.
 *
 * - Exports call it with `scope: null` → `:root` tokens and global element styles.
 * - The app calls it with a scope selector and `unit: "cqi"` so previews inside a
 *   sized container behave exactly like a real viewport of that width.
 */

export interface SystemCssOptions {
  /** `null` = global (`:root`, `body`, elements). Otherwise every rule is nested under it. */
  scope: string | null;
  unit: FluidUnit;
  /** Include explanatory comments (exports) or keep it compact (previews). */
  comments?: boolean;
}

export interface Token {
  name: string;
  value: string;
}

export interface TokenGroup {
  title: string;
  tokens: Token[];
}

function trackingValue(em: number): string {
  return em === 0 ? "0" : `${em}em`;
}

export function styleTokens(system: TypographySystem, key: TextStyleKey, unit: FluidUnit): Token[] {
  const s = system.styles[key];
  return [
    { name: `--text-${key}-family`, value: `var(--font-${s.family})` },
    { name: `--text-${key}-size`, value: fluidClamp(s.size, system.fluid, unit) },
    { name: `--text-${key}-leading`, value: String(s.lineHeight) },
    { name: `--text-${key}-tracking`, value: trackingValue(s.tracking) },
    { name: `--text-${key}-weight`, value: String(s.weight) },
  ];
}

export function systemTokenGroups(system: TypographySystem, unit: FluidUnit): TokenGroup[] {
  const families: Token[] = assignedRoles(system).map((role) => {
    const a = familyFor(system, role);
    return { name: `--font-${role}`, value: fontStack(a.font, a.greekCompanion) };
  });

  const scale: TokenGroup[] = TEXT_STYLE_KEYS.map((key) => ({
    title: TEXT_STYLES[key].label,
    tokens: styleTokens(system, key, unit),
  }));

  return [
    { title: "Families", tokens: families },
    ...scale,
    {
      title: "Emphasis",
      tokens: [{ name: "--text-strong-weight", value: String(system.emphasis.strongWeight) }],
    },
    {
      title: "Measure",
      tokens: [
        { name: "--measure-body", value: `${system.measure.body}ch` },
        { name: "--measure-lead", value: `${system.measure.lead}ch` },
        { name: "--measure-narrow", value: `${system.measure.narrow}ch` },
        { name: "--measure-heading", value: `${system.measure.heading}ch` },
      ],
    },
    {
      title: "Flow",
      tokens: [
        { name: "--flow-paragraph", value: `${system.flow.paragraph}em` },
        { name: "--flow-heading-before", value: `${system.flow.headingBefore}em` },
        { name: "--flow-heading-after", value: `${system.flow.headingAfter}em` },
      ],
    },
  ];
}

function declarationsFor(key: TextStyleKey, s: TextStyle): string[] {
  const d = [
    `font-family: var(--text-${key}-family);`,
    `font-size: var(--text-${key}-size);`,
    `line-height: var(--text-${key}-leading);`,
    `letter-spacing: var(--text-${key}-tracking);`,
    `font-weight: var(--text-${key}-weight);`,
  ];
  if (s.style === "italic") d.push("font-style: italic;");
  if (s.transform === "uppercase") d.push("text-transform: uppercase;");
  if (s.variation) d.push(`font-variation-settings: ${s.variation};`);
  if (s.features) d.push(`font-feature-settings: ${s.features};`);
  return d;
}

/** Element + utility selectors per style. Utilities always exist so markup can opt in. */
const SELECTORS: Record<TextStyleKey, { elements: string[]; utility: string }> = {
  display: { elements: [], utility: ".t-display" },
  h1: { elements: ["h1"], utility: ".t-h1" },
  h2: { elements: ["h2"], utility: ".t-h2" },
  h3: { elements: ["h3"], utility: ".t-h3" },
  h4: { elements: ["h4"], utility: ".t-h4" },
  h5: { elements: ["h5"], utility: ".t-h5" },
  h6: { elements: ["h6"], utility: ".t-h6" },
  lead: { elements: [], utility: ".t-lead" },
  body: { elements: [], utility: ".t-body" },
  small: { elements: ["small"], utility: ".t-small" },
  caption: { elements: ["figcaption"], utility: ".t-caption" },
  label: { elements: [], utility: ".t-label" },
  quote: { elements: ["blockquote"], utility: ".t-quote" },
};

/** Extra layout rules per style: measure and wrapping. */
const STYLE_EXTRAS: Partial<Record<TextStyleKey, string[]>> = {
  display: ["max-width: var(--measure-heading);", "text-wrap: balance;"],
  lead: ["max-width: var(--measure-lead);", "text-wrap: pretty;"],
  caption: ["max-width: var(--measure-narrow);"],
  quote: ["max-width: var(--measure-lead);", "text-wrap: balance;"],
};

export function systemCss(system: TypographySystem, options: SystemCssOptions): string {
  const { scope, unit, comments = false } = options;
  // The scope is wrapped in :where() so scoped rules keep the same (zero/class-level)
  // specificity as the global export, and layout classes can still set margins.
  const within = (selectors: string[]) =>
    selectors.map((sel) => (scope ? `:where(${scope}) ${sel}` : sel)).join(",\n");
  const rule = (selector: string, declarations: string[]) =>
    `${selector} {\n${declarations.map((d) => `  ${d}`).join("\n")}\n}`;
  const note = (text: string) => (comments ? `/* ${text} */\n` : "");

  const blocks: string[] = [];

  // 1. Tokens
  const tokenLines: string[] = [];
  for (const group of systemTokenGroups(system, unit)) {
    if (comments) tokenLines.push(`/* ${group.title} */`);
    for (const t of group.tokens) tokenLines.push(`${t.name}: ${t.value};`);
  }
  blocks.push(
    note(`${system.id} · ${system.name} — tokens. Fluid between ${system.fluid.minViewport}px and ${system.fluid.maxViewport}px.`) +
      rule(scope ?? ":root", tokenLines),
  );

  // 2. Base text (on body, or on the scope root itself)
  blocks.push(
    note("Base text") +
      rule(scope ?? "body", [
        ...declarationsFor("body", system.styles.body),
        "font-optical-sizing: auto;",
        "font-kerning: normal;",
        "text-rendering: optimizeLegibility;",
        "-webkit-text-size-adjust: 100%;",
        "text-size-adjust: 100%;",
      ]),
  );

  // 3. Flow and wrapping
  blocks.push(
    note("Flow, measure and wrapping") +
      rule(within([":where(p, ul, ol, dl)"]), [
        "margin-block: 0 var(--flow-paragraph);",
        "max-width: var(--measure-body);",
        "text-wrap: pretty;",
      ]) +
      "\n" +
      rule(within([":where(h1, h2, h3, h4, h5, h6)"]), [
        "margin-block: var(--flow-heading-before) var(--flow-heading-after);",
        "max-width: var(--measure-heading);",
        "text-wrap: balance;",
        "overflow-wrap: break-word;",
      ]) +
      "\n" +
      rule(within([":where(h1, h2, h3, h4, h5, h6):first-child"]), ["margin-block-start: 0;"]) +
      "\n" +
      rule(within([":where(strong, b)"]), ["font-weight: var(--text-strong-weight);"]) +
      (system.families.mono
        ? "\n" + rule(within([":where(code, kbd, samp, pre)"]), ["font-family: var(--font-mono);"])
        : ""),
  );

  // 4. Styles: elements (zero specificity via :where) + utility classes
  for (const key of TEXT_STYLE_KEYS) {
    const s = system.styles[key];
    const sel = SELECTORS[key];
    const selectors = [
      ...(sel.elements.length ? [`:where(${sel.elements.join(", ")})`] : []),
      sel.utility,
    ];
    blocks.push(
      note(`${TEXT_STYLES[key].label} — ${TEXT_STYLES[key].usage}`) +
        rule(within(selectors), [...declarationsFor(key, s), ...(STYLE_EXTRAS[key] ?? [])]),
    );
  }

  return blocks.join("\n\n") + "\n";
}

/** Compact scoped CSS for in-app previews. */
export function previewCss(system: TypographySystem, unit: FluidUnit): string {
  return systemCss(system, { scope: previewScope(system, unit), unit });
}

export function previewScope(system: TypographySystem, unit: FluidUnit): string {
  return `[data-type-system="${system.id}"][data-fluid="${unit}"]`;
}
