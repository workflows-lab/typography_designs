import {
  Advent_Pro,
  Alegreya,
  Archivo,
  Bodoni_Moda,
  Bricolage_Grotesque,
  Brygada_1918,
  Commissioner,
  Cormorant_Garamond,
  DM_Sans,
  EB_Garamond,
  Fira_Sans,
  Fraunces,
  Geologica,
  GFS_Didot,
  GFS_Neohellenic,
  IBM_Plex_Sans,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
  Literata,
  Manrope,
  Newsreader,
  Noto_Serif_Display,
  Piazzolla,
  Playfair_Display,
  Sofia_Sans,
  Source_Serif_4,
  Space_Grotesk,
  STIX_Two_Text,
  Syne,
  Ysabeau,
} from "next/font/google";
import type { FontId } from "@/typography/types";

/*
 * Self-hosted font loaders (downloaded at build time by next/font).
 *
 * next/font requires literal options, so each family is declared explicitly.
 * Keep `loadedAxes`, weights and styles in sync with src/typography/data/fonts.ts.
 *
 * - `variable` is always `--font-<FontId>`; the registry resolves families through it.
 * - `preload: false` for specimen fonts: @font-face rules carry unicode-range, so files
 *   (including Greek) are fetched only when glyphs are actually rendered.
 * - Stacks that route Greek glyphs to a companion font use `--font-<id>-only` (see
 *   `fontOnlyCss` below) rather than `--font-<id>`.
 */

/* Interface fonts — preloaded on every route. */
const commissioner = Commissioner({
  subsets: ["latin"],
  axes: ["FLAR", "VOLM"],
  display: "swap",
  variable: "--font-commissioner",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/* Greek + Latin */
const gfsDidot = GFS_Didot({
  weight: "400",
  subsets: ["greek", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-gfs-didot",
});

const gfsNeohellenic = GFS_Neohellenic({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["greek", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-gfs-neohellenic",
});

const literata = Literata({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-literata",
});

const ebGaramond = EB_Garamond({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-eb-garamond",
});

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-display",
});

const inter = Inter({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["greek", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-manrope",
});

const syne = Syne({
  subsets: ["greek", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-syne",
});

const piazzolla = Piazzolla({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-piazzolla",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-source-serif-4",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
  variable: "--font-ibm-plex-sans",
});

const geologica = Geologica({
  subsets: ["greek", "latin"],
  axes: ["SHRP"],
  display: "swap",
  preload: false,
  variable: "--font-geologica",
});

const sofiaSans = Sofia_Sans({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-sofia-sans",
});

const ysabeau = Ysabeau({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-ysabeau",
});

const alegreya = Alegreya({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-alegreya",
});

const firaSans = Fira_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["greek", "latin"],
  display: "swap",
  preload: false,
  variable: "--font-fira-sans",
});

const stixTwoText = STIX_Two_Text({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-stix-two-text",
});

const brygada1918 = Brygada_1918({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-brygada-1918",
});

const adventPro = Advent_Pro({
  subsets: ["greek", "latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
  variable: "--font-advent-pro",
});

/* Latin only */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
  preload: false,
  variable: "--font-fraunces",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-playfair-display",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-cormorant-garamond",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-instrument-serif",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-bodoni-moda",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-newsreader",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
  variable: "--font-dm-sans",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
  preload: false,
  variable: "--font-bricolage-grotesque",
});

const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
  preload: false,
  variable: "--font-archivo",
});

const LOADERS: Record<FontId, { variable: string; style: { fontFamily: string } }> = {
  "gfs-didot": gfsDidot,
  "gfs-neohellenic": gfsNeohellenic,
  commissioner,
  literata,
  "eb-garamond": ebGaramond,
  "noto-serif-display": notoSerifDisplay,
  inter,
  manrope,
  syne,
  piazzolla,
  "source-serif-4": sourceSerif4,
  "ibm-plex-sans": ibmPlexSans,
  geologica,
  "sofia-sans": sofiaSans,
  ysabeau,
  alegreya,
  "fira-sans": firaSans,
  "stix-two-text": stixTwoText,
  "brygada-1918": brygada1918,
  "advent-pro": adventPro,
  "jetbrains-mono": jetbrainsMono,
  fraunces,
  "playfair-display": playfairDisplay,
  "cormorant-garamond": cormorantGaramond,
  "instrument-serif": instrumentSerif,
  "bodoni-moda": bodoniModa,
  newsreader,
  "space-grotesk": spaceGrotesk,
  "dm-sans": dmSans,
  "bricolage-grotesque": bricolageGrotesque,
  archivo,
};

/** Class names that define every `--font-<id>` variable. Apply once on <html>. */
export const fontVariableClassNames = Object.values(LOADERS)
  .map((loader) => loader.variable)
  .join(" ");

/**
 * `--font-<id>-only`: the web font's family name without next/font's metric-adjusted
 * fallback face. That fallback (local Times New Roman / Arial, no unicode-range) would
 * render Greek glyphs before a Greek companion later in the stack, so stacks that rely
 * on per-glyph fallback start from this variable instead.
 */
export const fontOnlyCss = `:root{${(Object.entries(LOADERS) as [FontId, (typeof LOADERS)[FontId]][])
  .map(([id, loader]) => `--font-${id}-only:${loader.style.fontFamily.split(",")[0].trim()};`)
  .join("")}}`;
