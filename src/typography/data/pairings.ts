import type { Pairing } from "../types";

/**
 * Curated pairings. Font detail pages derive their pairing suggestions from this list,
 * so a pairing is written once and appears on both fonts.
 */
export const PAIRINGS: Pairing[] = [
  {
    id: "didot-ysabeau",
    heading: "gfs-didot",
    body: "ysabeau",
    headingWeight: 400,
    bodyWeight: 400,
    title: "Hellenic couture",
    rationale:
      "Ysabeau's Garamond-derived proportions share a Renaissance skeleton with the Didot model, so the sans feels related rather than imported. High contrast above, calm humanist texture below — fully bilingual.",
    industries: ["luxury", "fashion", "hospitality"],
  },
  {
    id: "noto-display-literata",
    heading: "noto-serif-display",
    body: "literata",
    headingWeight: 500,
    bodyWeight: 400,
    title: "Bilingual broadsheet",
    rationale:
      "A condensed, high-contrast headline serif over a robust reading serif with optical sizes. Two serifs work because their roles are unmistakable: one is sharp and tall, the other sturdy and open.",
    industries: ["editorial", "culture", "education"],
  },
  {
    id: "geologica-plex",
    heading: "geologica",
    body: "ibm-plex-sans",
    headingWeight: 300,
    bodyWeight: 400,
    title: "Drafting table",
    rationale:
      "Geologica's constructed light weights read as architectural lettering; IBM Plex Sans brings engineered, slightly idiosyncratic text. Both are rational, but at different temperatures.",
    industries: ["architecture", "technology", "professional"],
  },
  {
    id: "alegreya-commissioner",
    heading: "alegreya",
    body: "commissioner",
    headingWeight: 500,
    bodyWeight: 400,
    title: "Warm table",
    rationale:
      "Alegreya's calligraphic italic gives headings a handwritten warmth; Commissioner — drawn by a Greek designer — keeps menus and practical text clear in both scripts.",
    industries: ["hospitality", "wellness", "culture"],
  },
  {
    id: "manrope-fira",
    heading: "manrope",
    body: "fira-sans",
    headingWeight: 600,
    bodyWeight: 400,
    title: "Clear care",
    rationale:
      "Manrope's geometric friendliness for headings, Fira Sans' open apertures and distinct letterforms for text. Reassuring, legible, and fully Greek-capable — including polytonic in the body face.",
    industries: ["healthcare", "education", "professional"],
  },
  {
    id: "syne-plex",
    heading: "syne",
    body: "ibm-plex-sans",
    headingWeight: 800,
    bodyWeight: 400,
    title: "Gallery shop",
    rationale:
      "Syne's extra-bold weights widen into graphic shapes; Plex is disciplined enough to hold product information steady underneath.",
    industries: ["ecommerce", "fashion", "culture"],
  },
  {
    id: "garamond-sofia",
    heading: "eb-garamond",
    body: "sofia-sans",
    headingWeight: 500,
    bodyWeight: 400,
    title: "Museum label",
    rationale:
      "Garamond for scholarship and voice; Sofia Sans' compact widths for captions, credits and wayfinding, where Greek's longer words need space.",
    industries: ["culture", "education", "professional"],
  },
  {
    id: "piazzolla-inter",
    heading: "piazzolla",
    body: "inter",
    headingWeight: 700,
    bodyWeight: 400,
    title: "Sharp report",
    rationale:
      "A compact, angular serif headline above a neutral interface sans. The serif adds editorial bite to data-heavy products without compromising UI clarity.",
    industries: ["finance", "editorial", "technology"],
  },
  {
    id: "neohellenic-stix",
    heading: "gfs-neohellenic",
    body: "stix-two-text",
    headingWeight: 700,
    bodyWeight: 400,
    title: "Academy",
    rationale:
      "A distinctly Greek scholarly headline face with a scientific text serif. Suited to universities, journals and research institutes publishing in both languages.",
    industries: ["education", "culture", "healthcare"],
  },
  {
    id: "brygada-sofia",
    heading: "brygada-1918",
    body: "sofia-sans",
    headingWeight: 600,
    bodyWeight: 400,
    title: "Heritage house",
    rationale:
      "A bookish revival serif with a compact modern sans: heritage without nostalgia, for wineries, publishers and family businesses.",
    industries: ["hospitality", "culture", "professional"],
  },
  {
    id: "fraunces-dmsans",
    heading: "fraunces",
    body: "dm-sans",
    headingWeight: 500,
    bodyWeight: 400,
    title: "Soft modern (Latin)",
    rationale:
      "Fraunces' soft, wonky serif over DM Sans' low-contrast geometry. Latin only — for Greek, route glyphs to Literata and Manrope through the font stack (see T008).",
    industries: ["wellness", "ecommerce", "hospitality"],
  },
  {
    id: "instrument-inter",
    heading: "instrument-serif",
    body: "inter",
    headingWeight: 400,
    bodyWeight: 400,
    title: "Product editorial (Latin heading)",
    rationale:
      "The contemporary product-site pairing: a condensed serif with italics over a neutral grotesk. Inter covers Greek; for Greek headlines use Noto Serif Display at width ≈75.",
    industries: ["technology", "editorial"],
  },
  {
    id: "bodoni-ysabeau",
    heading: "bodoni-moda",
    body: "ysabeau",
    headingWeight: 500,
    bodyWeight: 400,
    title: "Atelier (Latin heading)",
    rationale:
      "Razor-sharp Bodoni hairlines with a humanist sans. Swap the heading for GFS Didot on Greek pages to keep the didone voice.",
    industries: ["fashion", "luxury"],
  },
  {
    id: "archivo-sofia",
    heading: "archivo",
    body: "sofia-sans",
    headingWeight: 700,
    bodyWeight: 400,
    title: "Poster grid (Latin heading)",
    rationale:
      "Compressed Archivo for monumental headlines with Sofia Sans for text. Sofia Sans also substitutes for Archivo in Greek headlines.",
    industries: ["architecture", "ecommerce"],
  },
];
