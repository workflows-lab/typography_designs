import { supportsGreek, supportsLatinExtended, supportsPolytonic } from "@/typography/engine/font-support";
import type { FontDefinition } from "@/typography/types";
import styles from "./specimen.module.css";

/** Script coverage derived from verified subsets. */
export function ScriptSupport({ font, compact = false }: { font: FontDefinition; compact?: boolean }) {
  const items = [
    { key: "latin", label: compact ? "Lat" : "Latin", ok: true, title: "Basic Latin" },
    { key: "latin-ext", label: compact ? "Lat+" : "Latin Ext.", ok: supportsLatinExtended(font), title: "Latin Extended (Central European, Turkish…)" },
    { key: "greek", label: compact ? "Ελ" : "Greek", ok: supportsGreek(font), title: "Modern (monotonic) Greek" },
    { key: "greek-ext", label: compact ? "Πολ" : "Polytonic", ok: supportsPolytonic(font), title: "Greek Extended (polytonic)" },
  ];
  return (
    <ul className={styles.scripts} data-compact={compact || undefined} aria-label={`Script support for ${font.family}`}>
      {items.map((item) => (
        <li key={item.key} className={styles.script} data-supported={item.ok} title={item.title}>
          <span aria-hidden="true" className={styles.scriptDot} />
          <span lang={item.key.startsWith("greek") && compact ? "el" : undefined}>{item.label}</span>
          <span className="sr-only">{item.ok ? "supported" : "not supported"}</span>
        </li>
      ))}
    </ul>
  );
}

export function SubstitutionNote({ font, substitute }: { font: FontDefinition; substitute: FontDefinition | null }) {
  return (
    <p className={styles.substitution} role="note">
      <span className={styles.substitutionMark} aria-hidden="true">
        ⚠
      </span>
      {font.family} has no Greek.{" "}
      {substitute ? (
        <>
          Greek shown in <strong>{substitute.family}</strong>, its recommended Greek alternative.
        </>
      ) : (
        "Greek glyphs would fall back to a system font."
      )}
    </p>
  );
}
