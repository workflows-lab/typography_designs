/**
 * Canonical font identifiers. The order here is the default display order.
 * Adding an id makes TypeScript require a matching loader and definition.
 */
export const FONT_IDS = [
  // Greek + Latin
  "gfs-didot",
  "gfs-neohellenic",
  "commissioner",
  "literata",
  "eb-garamond",
  "noto-serif-display",
  "inter",
  "manrope",
  "syne",
  "piazzolla",
  "source-serif-4",
  "ibm-plex-sans",
  "geologica",
  "sofia-sans",
  "ysabeau",
  "alegreya",
  "fira-sans",
  "stix-two-text",
  "brygada-1918",
  "advent-pro",
  "jetbrains-mono",
  // Latin only
  "fraunces",
  "playfair-display",
  "cormorant-garamond",
  "instrument-serif",
  "bodoni-moda",
  "newsreader",
  "space-grotesk",
  "dm-sans",
  "bricolage-grotesque",
  "archivo",
] as const;

export type FontId = (typeof FONT_IDS)[number];

export function isFontId(value: string): value is FontId {
  return (FONT_IDS as readonly string[]).includes(value);
}
