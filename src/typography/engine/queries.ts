import { FONTS } from "../data/fonts";
import { isFontId } from "../data/font-ids";
import { PAIRINGS } from "../data/pairings";
import { SYSTEMS } from "../data/systems";
import type { FontDefinition, FontId, Pairing, TypographySystem } from "../types";
import { systemFontIds } from "./system-fonts";

/* Server-side lookups. Client components should import from ./filter-fonts instead. */

export function getFontBySlug(slug: string): FontDefinition | undefined {
  return isFontId(slug) ? FONTS[slug] : undefined;
}

export function pairingsForFont(id: FontId): Pairing[] {
  return PAIRINGS.filter((p) => p.heading === id || p.body === id);
}

export function systemsUsingFont(id: FontId): TypographySystem[] {
  return SYSTEMS.filter((s) => systemFontIds(s).includes(id));
}
