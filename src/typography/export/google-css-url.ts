import { isVariable } from "../engine/font-support";
import { systemFontLoads, type SystemFontLoad } from "../engine/system-fonts";
import type { TypographySystem } from "../types";

/** Google Fonts CSS2 sorts axes: lowercase tags alphabetically, then uppercase tags. */
function sortAxes(tags: string[]): string[] {
  const lower = tags.filter((t) => t === t.toLowerCase()).sort();
  const upper = tags.filter((t) => t !== t.toLowerCase()).sort();
  return [...lower, ...upper];
}

function familyParam(load: SystemFontLoad): string {
  const { font } = load;
  const name = font.family.replace(/ /g, "+");
  const italic = load.styles.includes("italic");
  const ital = italic ? [0, 1] : [0];

  if (!isVariable(font)) {
    const hasMultipleWeights = load.weights.length > 1 || load.weights[0] !== 400;
    if (!italic && !hasMultipleWeights) return name;
    if (!hasMultipleWeights) return `${name}:ital@0;1`;
    const tuples = ital.flatMap((i) => load.weights.map((w) => (italic ? `${i},${w}` : `${w}`)));
    return `${name}:${italic ? "ital,wght" : "wght"}@${tuples.join(";")}`;
  }

  // Variable: request the full range of each requested axis.
  const axes = font.axes ?? [];
  const tags = sortAxes(["wght", ...load.axes.filter((t) => t !== "wght")]);
  const ranges = tags.map((tag) => {
    const a = axes.find((x) => x.tag === tag);
    if (!a) throw new Error(`${font.family} has no ${tag} axis`);
    return a.min === a.max ? `${a.min}` : `${a.min}..${a.max}`;
  });
  const header = (italic ? ["ital", ...tags] : tags).join(",");
  const tuples = ital.map((i) => (italic ? [String(i), ...ranges] : ranges).join(","));
  return `${name}:${header}@${tuples.join(";")}`;
}

/** A single CSS2 API URL — for projects that cannot use next/font. */
export function googleFontsUrl(system: TypographySystem): string {
  const families = systemFontLoads(system).map((l) => `family=${familyParam(l)}`);
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
