import { FONTS } from "../data/fonts";
import { SPECIMEN_TEXT } from "../data/specimens";
import type { FontDefinition, Language } from "../types";
import { fontStack, supportsGreek } from "./font-support";

const GREEK_RANGE = /[Ͱ-Ͽἀ-῿]/;

export function containsGreek(text: string): boolean {
  return GREEK_RANGE.test(text);
}

/** The recommended Greek substitute for a Latin-only font (first alternative). */
export function greekSubstitute(font: FontDefinition): FontDefinition | null {
  if (supportsGreek(font)) return null;
  const alt = font.greekAlternatives?.[0];
  return alt ? FONTS[alt.font] : null;
}

/**
 * font-family for specimens. Latin-only fonts get their recommended Greek alternative
 * second in the stack, so any Greek glyph renders in a real Greek design rather than a
 * system fallback — and the UI always labels that substitution.
 */
export function specimenFamily(font: FontDefinition): string {
  const substitute = greekSubstitute(font);
  return fontStack(font.id, substitute?.id);
}

/** Whether rendering `text` in `font` will substitute Greek glyphs. */
export function substitutionFor(font: FontDefinition, text: string): FontDefinition | null {
  if (supportsGreek(font) || !containsGreek(text)) return null;
  return greekSubstitute(font);
}

export function defaultSpecimen(lang: Language, kind: keyof (typeof SPECIMEN_TEXT)["en"] = "headline"): string {
  return SPECIMEN_TEXT[lang][kind];
}

export const WEIGHT_NAMES: Record<number, string> = {
  1: "Hairline",
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
  1000: "Ultra",
};
