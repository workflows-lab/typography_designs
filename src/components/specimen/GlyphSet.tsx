import { cssVars } from "@/lib/css-vars";
import { GLYPH_SETS } from "@/typography/data/specimens";
import { fontFamilyValue, supportsGreek, supportsPolytonic } from "@/typography/engine/font-support";
import type { FontDefinition } from "@/typography/types";
import styles from "./specimen.module.css";

interface Group {
  label: string;
  glyphs: string;
  lang: "en" | "el";
  supported: boolean;
  reason?: string;
}

/**
 * Character sets. Unsupported groups are not rendered at all — the font family has no
 * fallback here (only the web font itself), so nothing can be faked.
 */
export function GlyphSet({ font }: { font: FontDefinition }) {
  const greek = supportsGreek(font);
  const groups: Group[] = [
    { label: "Latin capitals", glyphs: GLYPH_SETS.latinUpper, lang: "en", supported: true },
    { label: "Latin lowercase", glyphs: GLYPH_SETS.latinLower, lang: "en", supported: true },
    { label: "Figures", glyphs: GLYPH_SETS.figures, lang: "en", supported: true },
    { label: "Punctuation", glyphs: GLYPH_SETS.punctuation, lang: "en", supported: true },
    { label: "Greek capitals", glyphs: GLYPH_SETS.greekUpper, lang: "el", supported: greek, reason: "No Greek subset" },
    { label: "Greek lowercase", glyphs: GLYPH_SETS.greekLower, lang: "el", supported: greek, reason: "No Greek subset" },
    { label: "Greek accents (tonos, dialytika)", glyphs: GLYPH_SETS.greekTonos, lang: "el", supported: greek, reason: "No Greek subset" },
    {
      label: "Polytonic",
      glyphs: GLYPH_SETS.greekPolytonic,
      lang: "el",
      supported: supportsPolytonic(font),
      reason: greek ? "Monotonic Greek only — no greek-ext subset" : "No Greek subset",
    },
  ];

  return (
    <div className={styles.glyphs} style={cssVars({ "--specimen-family": fontFamilyValue(font.id) })}>
      {groups.map((g) => (
        <section key={g.label} className={styles.glyphGroup} aria-label={g.label}>
          <h3 className={styles.glyphLabel}>{g.label}</h3>
          {g.supported ? (
            <p className={styles.glyphRow} lang={g.lang}>
              {g.glyphs}
            </p>
          ) : (
            <p className={styles.glyphMissing}>{g.reason}</p>
          )}
        </section>
      ))}
    </div>
  );
}
