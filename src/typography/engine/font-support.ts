import { FONTS } from "../data/fonts";
import type { FontDefinition, FontId, FontStyle } from "../types";

export function getFont(id: FontId): FontDefinition {
  return FONTS[id];
}

export function supportsGreek(font: FontDefinition): boolean {
  return font.subsets.includes("greek");
}

/** Polytonic Greek requires the Greek Extended block. */
export function supportsPolytonic(font: FontDefinition): boolean {
  return font.subsets.includes("greek-ext");
}

export function supportsLatinExtended(font: FontDefinition): boolean {
  return font.subsets.includes("latin-ext");
}

export function isVariable(font: FontDefinition): boolean {
  return font.axes !== null;
}

export function hasItalic(font: FontDefinition): boolean {
  return font.styles.includes("italic");
}

export function weightRange(font: FontDefinition): [number, number] {
  const wght = font.axes?.find((a) => a.tag === "wght");
  if (wght) return [wght.min, wght.max];
  return [Math.min(...font.weights), Math.max(...font.weights)];
}

export function supportsWeight(font: FontDefinition, weight: number): boolean {
  if (isVariable(font)) {
    const [min, max] = weightRange(font);
    return weight >= min && weight <= max;
  }
  return font.weights.includes(weight);
}

export function supportsStyle(font: FontDefinition, style: FontStyle): boolean {
  return font.styles.includes(style);
}

/** Closest available named weight — used when a global control drives many fonts. */
export function nearestWeight(font: FontDefinition, target: number): number {
  return font.weights.reduce((best, w) => (Math.abs(w - target) < Math.abs(best - target) ? w : best));
}

/** Custom (non-wght) axes that are loaded in this library and can be adjusted. */
export function adjustableAxes(font: FontDefinition) {
  return (font.axes ?? []).filter((a) => font.loadedAxes.includes(a.tag));
}

/** CSS variable that next/font defines for a family (same name in exports). */
export function fontVariable(id: FontId): string {
  return `--font-${id}`;
}

/** `var(--font-<id>)`: the web font plus next/font's metric-adjusted fallback face. */
export function fontFamilyValue(id: FontId): string {
  return `var(${fontVariable(id)})`;
}

/**
 * `var(--font-<id>-only)`: the web font's family name alone. next/font's fallback face
 * (local Times New Roman / Arial) has no unicode-range, so anything placed after it in a
 * stack — such as a Greek companion — would never be reached.
 */
export function fontOnlyValue(id: FontId): string {
  return `var(${fontVariable(id)}-only)`;
}

/**
 * Full font-family stack: web font, optional Greek companion, then system fallbacks.
 * With a companion, the primary uses its bare family so Greek glyphs fall through to the
 * companion (which keeps its own metric-adjusted fallback).
 */
export function fontStack(id: FontId, greekCompanion?: FontId): string {
  const font = getFont(id);
  if (greekCompanion && greekCompanion !== id) {
    return [fontOnlyValue(id), fontFamilyValue(greekCompanion), font.fallback].join(", ");
  }
  return [fontFamilyValue(id), font.fallback].join(", ");
}

export function scriptSummary(font: FontDefinition): string {
  if (!supportsGreek(font)) return "Latin only";
  return supportsPolytonic(font) ? "Greek (polytonic) + Latin" : "Greek + Latin";
}
