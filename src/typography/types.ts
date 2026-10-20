import type { FontId } from "./data/font-ids";

export type { FontId };

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

export type Language = "en" | "el";

export type Subset =
  | "latin"
  | "latin-ext"
  | "greek"
  | "greek-ext"
  | "cyrillic"
  | "cyrillic-ext"
  | "vietnamese"
  | "math"
  | "symbols";

export type FontStyle = "normal" | "italic";

/** Generic family used for fallbacks and broad grouping. */
export type FontCategory = "serif" | "sans-serif" | "monospace";

export type Classification =
  | "didone"
  | "old-style"
  | "transitional"
  | "contemporary-serif"
  | "calligraphic"
  | "humanist"
  | "grotesk"
  | "neo-grotesk"
  | "geometric"
  | "technical"
  | "display"
  | "editorial"
  | "monospace";

export type Industry =
  | "hospitality"
  | "architecture"
  | "luxury"
  | "fashion"
  | "technology"
  | "healthcare"
  | "editorial"
  | "ecommerce"
  | "culture"
  | "education"
  | "finance"
  | "wellness"
  | "professional";

export type FontRole = "display" | "heading" | "body" | "ui" | "caption" | "code";

export interface VariableAxis {
  /** OpenType axis tag, e.g. `wght`, `opsz`, `SOFT`. */
  tag: string;
  name: string;
  min: number;
  max: number;
  default: number;
}

export interface GreekAlternative {
  font: FontId;
  reason: string;
}

export interface FontDefinition {
  id: FontId;
  family: string;
  provider: {
    kind: "google";
    /** Named export from `next/font/google`. */
    importName: string;
    specimenUrl: string;
  };
  designers: string[];
  category: FontCategory;
  classifications: Classification[];
  /** Verified against the Google Fonts metadata bundled with next/font. */
  subsets: Subset[];
  /** Named weight stops that exist (static instances, or steps for variable fonts). */
  weights: number[];
  styles: FontStyle[];
  /** All axes of the variable font, including `wght`. `null` for static families. */
  axes: VariableAxis[] | null;
  /** Non-weight axes loaded in this library (must match `src/fonts/loaders.ts`). */
  loadedAxes: string[];
  license: { name: string; spdx: string; url: string };
  roles: FontRole[];
  industries: Industry[];
  traits: string[];
  summary: string;
  notes: string[];
  /** Recommended Greek-capable substitutes. Only for fonts without Greek. */
  greekAlternatives?: GreekAlternative[];
  /** System fallback stack appended after the web font. */
  fallback: string;
}

/* ------------------------------------------------------------------ */
/* Pairings                                                            */
/* ------------------------------------------------------------------ */

export interface Pairing {
  id: string;
  heading: FontId;
  body: FontId;
  headingWeight: number;
  bodyWeight: number;
  title: string;
  rationale: string;
  industries: Industry[];
}

/* ------------------------------------------------------------------ */
/* Typography systems                                                  */
/* ------------------------------------------------------------------ */

export type SystemId = `T${number}`;

export type FamilyRole = "display" | "heading" | "body" | "ui" | "mono";

export const TEXT_STYLE_KEYS = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "lead",
  "body",
  "small",
  "caption",
  "label",
  "quote",
] as const;

export type TextStyleKey = (typeof TEXT_STYLE_KEYS)[number];

export interface FamilyAssignment {
  font: FontId;
  /**
   * For Latin-only fonts: the font that renders Greek glyphs.
   * Placed second in the stack so the browser falls back per glyph.
   */
  greekCompanion?: FontId;
  /** Non-weight variable axes this role relies on (e.g. `opsz`, `wdth`). */
  axes?: string[];
}

export interface FluidSize {
  /** px at the minimum viewport. */
  min: number;
  /** px at the maximum viewport. */
  max: number;
}

export interface TextStyle {
  family: FamilyRole;
  size: FluidSize;
  weight: number;
  /** Unitless line-height. */
  lineHeight: number;
  /** Letter-spacing in em. */
  tracking: number;
  style?: FontStyle;
  transform?: "uppercase";
  /** Value for `font-variation-settings` (custom axes only). */
  variation?: string;
  /** Value for `font-feature-settings`. */
  features?: string;
}

export interface CompositionItem {
  meta: string;
  title: string;
  text: string;
}

export interface CompositionContent {
  brand: string;
  nav: string[];
  eyebrow: string;
  headline: string;
  lead: string;
  cta: string;
  sectionLabel: string;
  sectionTitle: string;
  body: string[];
  quote: string;
  quoteSource: string;
  itemsTitle: string;
  items: CompositionItem[];
  caption: string;
  footer: string;
}

export type CompositionLayout = "showcase" | "editorial" | "structured";

export interface TypographySystem {
  id: SystemId;
  name: string;
  tagline: string;
  summary: string;
  personality: string[];
  industries: Industry[];
  rationale: string[];
  families: {
    display: FamilyAssignment;
    heading: FamilyAssignment;
    body: FamilyAssignment;
    ui: FamilyAssignment;
    mono?: FamilyAssignment;
  };
  fluid: { minViewport: number; maxViewport: number };
  styles: Record<TextStyleKey, TextStyle>;
  emphasis: { strongWeight: number; italic: boolean };
  /** Measures in `ch`. */
  measure: { body: number; lead: number; narrow: number; heading: number };
  /** Vertical rhythm in em of the element's own size. */
  flow: { paragraph: number; headingBefore: number; headingAfter: number };
  guidance: {
    measure: string[];
    wrapping: string[];
    greek: string[];
    accessibility: string[];
    usage: string[];
  };
  /** Preview palette only — not part of the typographic contract. */
  palette: { paper: string; ink: string; muted: string; accent: string; rule: string };
  composition: {
    layout: CompositionLayout;
    content: Record<Language, CompositionContent>;
  };
}
