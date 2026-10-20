import type { FamilyRole, TextStyle } from "../../types";

/** Compact constructor for text styles: sizes in px (min → max viewport). */
export function style(
  family: FamilyRole,
  [min, max]: [number, number],
  weight: number,
  lineHeight: number,
  tracking = 0,
  extra: Pick<TextStyle, "style" | "transform" | "variation" | "features"> = {},
): TextStyle {
  return { family, size: { min, max }, weight, lineHeight, tracking, ...extra };
}

export const FLUID_RANGE = { minViewport: 360, maxViewport: 1440 } as const;

export const GREEK_BASE: string[] = [
  'Declare the language: lang="el" on <html> for Greek-first sites, or on any element containing Greek. It enables Greek hyphenation and language-aware case mapping.',
  'All-caps Greek drops the tonos (ΑΘΗΝΑ, not ΑΘΉΝΑ). With lang="el", Firefox and Chromium remove accents under text-transform: uppercase. Verify in Safari, or author all-caps Greek strings without accents.',
  "Greek typically runs 10–20% longer than English. Size headlines, buttons and navigation against the Greek copy first.",
  "Use « » for quotations and the Greek question mark (;) in Greek copy; never mix Latin-script lookalike characters into Greek words.",
];

export const ACCESSIBILITY_BASE: string[] = [
  "All sizes are rem-based, so the user's browser font-size preference scales the entire system.",
  "Fluid sizes keep max ≤ 2.5 × min, so 200% browser zoom still produces 200% text (WCAG 1.4.4).",
  "Nothing relies on fixed heights: user overrides for line, letter, word and paragraph spacing (WCAG 1.4.12) reflow safely.",
  "Check colour contrast for every text style: 4.5:1 for body text, 3:1 for text ≥ 24px (or ≥ 18.66px bold).",
];

export const WRAPPING_BASE: string[] = [
  "Headings use text-wrap: balance to avoid single-word last lines; paragraphs use text-wrap: pretty to reduce orphans. Both degrade gracefully.",
  "Headings use overflow-wrap: break-word so long Greek compounds never overflow on narrow screens.",
  "Hyphenation is off by default. Enable hyphens: auto only for narrow, justified or multi-column text — and only with a correct lang attribute.",
];
