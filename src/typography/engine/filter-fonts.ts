import { FONT_LIST } from "../data/fonts";
import type { Classification, FontDefinition, FontRole, Industry } from "../types";
import { supportsGreek, supportsPolytonic } from "./font-support";

export type ScriptFilter = "all" | "greek" | "polytonic" | "latin-only";

export interface FontFilters {
  query: string;
  script: ScriptFilter;
  classifications: Classification[];
  industries: Industry[];
  roles: FontRole[];
}

export const EMPTY_FILTERS: FontFilters = {
  query: "",
  script: "all",
  classifications: [],
  industries: [],
  roles: [],
};

function matchesScript(font: FontDefinition, script: ScriptFilter): boolean {
  switch (script) {
    case "greek":
      return supportsGreek(font);
    case "polytonic":
      return supportsPolytonic(font);
    case "latin-only":
      return !supportsGreek(font);
    default:
      return true;
  }
}

/** Multi-select facets are OR within a facet and AND across facets. */
export function filterFonts(filters: FontFilters, fonts: FontDefinition[] = FONT_LIST): FontDefinition[] {
  const q = filters.query.trim().toLowerCase();
  return fonts.filter((font) => {
    if (q) {
      const haystack = [font.family, ...font.designers, ...font.traits, ...font.classifications]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (!matchesScript(font, filters.script)) return false;
    if (filters.classifications.length && !filters.classifications.some((c) => font.classifications.includes(c))) return false;
    if (filters.industries.length && !filters.industries.some((i) => font.industries.includes(i))) return false;
    if (filters.roles.length && !filters.roles.some((r) => font.roles.includes(r))) return false;
    return true;
  });
}

export function activeFilterCount(filters: FontFilters): number {
  return (
    (filters.query.trim() ? 1 : 0) +
    (filters.script !== "all" ? 1 : 0) +
    filters.classifications.length +
    filters.industries.length +
    filters.roles.length
  );
}
