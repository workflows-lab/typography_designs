import type {
  Classification,
  FamilyRole,
  FontRole,
  Industry,
  TextStyleKey,
} from "../types";

export const CLASSIFICATIONS: Record<Classification, { label: string; description: string }> = {
  didone: {
    label: "Didone",
    description: "Extreme contrast, vertical stress, hairline serifs. Fashion and luxury at large sizes.",
  },
  "old-style": {
    label: "Old-style",
    description: "Renaissance proportions, diagonal stress, bracketed serifs. Literary and humane.",
  },
  transitional: {
    label: "Transitional",
    description: "Between old-style and didone: sharper contrast, more vertical stress. Dependable text faces.",
  },
  "contemporary-serif": {
    label: "Contemporary serif",
    description: "Serifs drawn for screens and modern production — sturdy, open and even.",
  },
  calligraphic: {
    label: "Calligraphic",
    description: "Visible pen logic and rhythm; warm and personal.",
  },
  humanist: {
    label: "Humanist",
    description: "Proportions and stroke modulation drawn from handwriting; open and readable.",
  },
  grotesk: {
    label: "Grotesk",
    description: "Sans with 19th-century roots: some irregularity, compact apertures, character.",
  },
  "neo-grotesk": {
    label: "Neo-grotesk",
    description: "Rationalised, neutral grotesk. The default voice of interfaces.",
  },
  geometric: {
    label: "Geometric",
    description: "Built from circles and straight lines; clean, modern, sometimes cool.",
  },
  technical: {
    label: "Technical",
    description: "Engineered, squared or constructed forms; precision and systems.",
  },
  display: {
    label: "Display",
    description: "Drawn for large sizes, where detail and personality can carry the page.",
  },
  editorial: {
    label: "Editorial",
    description: "Built for publishing: long reading, hierarchy and headline character.",
  },
  monospace: {
    label: "Monospace",
    description: "Fixed-width glyphs for code, data and technical annotation.",
  },
};

export const INDUSTRIES: Record<Industry, { label: string }> = {
  hospitality: { label: "Hospitality" },
  architecture: { label: "Architecture" },
  luxury: { label: "Luxury" },
  fashion: { label: "Fashion" },
  technology: { label: "Technology" },
  healthcare: { label: "Healthcare" },
  editorial: { label: "Editorial" },
  ecommerce: { label: "E-commerce" },
  culture: { label: "Culture & museums" },
  education: { label: "Education" },
  finance: { label: "Finance" },
  wellness: { label: "Wellness & beauty" },
  professional: { label: "Professional services" },
};

export const FONT_ROLES: Record<FontRole, { label: string }> = {
  display: { label: "Display" },
  heading: { label: "Headings" },
  body: { label: "Body text" },
  ui: { label: "Interface" },
  caption: { label: "Captions" },
  code: { label: "Code & data" },
};

export const FAMILY_ROLES: Record<FamilyRole, { label: string; description: string }> = {
  display: { label: "Display", description: "Hero statements and the largest moments." },
  heading: { label: "Headings", description: "H1–H6 and section titles." },
  body: { label: "Body", description: "Running text, lead paragraphs and quotes." },
  ui: { label: "Interface", description: "Labels, captions, navigation and controls." },
  mono: { label: "Mono", description: "Figures, code and technical annotations." },
};

export const TEXT_STYLES: Record<TextStyleKey, { label: string; element: string; usage: string }> = {
  display: { label: "Display", element: "p.t-display", usage: "Hero statements" },
  h1: { label: "Heading 1", element: "h1", usage: "Page title" },
  h2: { label: "Heading 2", element: "h2", usage: "Section title" },
  h3: { label: "Heading 3", element: "h3", usage: "Sub-section" },
  h4: { label: "Heading 4", element: "h4", usage: "Card or group title" },
  h5: { label: "Heading 5", element: "h5", usage: "Minor title" },
  h6: { label: "Heading 6", element: "h6", usage: "Kicker / run-in title" },
  lead: { label: "Lead", element: "p.t-lead", usage: "Standfirst, intro paragraph" },
  body: { label: "Body", element: "body, p", usage: "Running text" },
  small: { label: "Small", element: "small, .t-small", usage: "Secondary text, footnotes" },
  caption: { label: "Caption", element: "figcaption, .t-caption", usage: "Image captions, metadata" },
  label: { label: "Label", element: ".t-label", usage: "Eyebrows, navigation, buttons" },
  quote: { label: "Quote", element: "blockquote, .t-quote", usage: "Pull quotes" },
};
