import { cssVars } from "@/lib/css-vars";
import { SPECIMEN_TEXT } from "@/typography/data/specimens";
import { hasItalic, supportsGreek } from "@/typography/engine/font-support";
import { WEIGHT_NAMES, specimenFamily } from "@/typography/engine/specimen";
import type { FontDefinition } from "@/typography/types";
import styles from "./specimen.module.css";

/** Every named weight, upright and italic, in both scripts. */
export function WeightLadder({ font }: { font: FontDefinition }) {
  const greek = supportsGreek(font);
  const italic = hasItalic(font);
  return (
    <ol className={styles.ladder} style={cssVars({ "--specimen-family": specimenFamily(font) })}>
      {font.weights.map((weight) => (
        <li key={weight} className={styles.ladderRow} style={cssVars({ "--specimen-weight": weight })}>
          <span className={styles.ladderMeta}>
            <span>{weight}</span>
            <span>{WEIGHT_NAMES[weight] ?? ""}</span>
          </span>
          <span className={styles.ladderSample} lang="en">
            {SPECIMEN_TEXT.en.short}
            {italic ? <em className={styles.ladderItalic}> {SPECIMEN_TEXT.en.short}</em> : null}
          </span>
          <span className={styles.ladderSample} lang="el" data-unsupported={!greek || undefined}>
            {greek ? SPECIMEN_TEXT.el.short : "—"}
            {greek && italic ? <em className={styles.ladderItalic}> {SPECIMEN_TEXT.el.short}</em> : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
