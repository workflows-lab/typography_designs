import Link from "next/link";
import { cssVars } from "@/lib/css-vars";
import { FAMILY_ROLES } from "@/typography/data/taxonomy";
import { fontStack, getFont, scriptSummary, supportsGreek } from "@/typography/engine/font-support";
import { systemFontLoads } from "@/typography/engine/system-fonts";
import type { TypographySystem } from "@/typography/types";
import styles from "./system.module.css";

/** The fonts a system loads, what each one does and exactly which instances it needs. */
export function FontRoles({ system }: { system: TypographySystem }) {
  const loads = systemFontLoads(system);
  return (
    <ul className={styles.roles}>
      {loads.map((load) => {
        const companionFor = load.companionFor.length
          ? load.companionFor
              .map((role) => {
                const primary = system.families[role as keyof typeof system.families];
                return primary ? `${FAMILY_ROLES[role].label} (for ${getFont(primary.font).family})` : null;
              })
              .filter(Boolean)
          : [];
        const sampleWeight = load.weights.includes(400) ? 400 : load.weights[0];
        return (
          <li
            key={load.font.id}
            className={styles.role}
            style={cssVars({ "--specimen-family": fontStack(load.font.id), "--specimen-weight": sampleWeight })}
          >
            <p className={styles.roleTitle}>
              {[...load.roles.map((r) => FAMILY_ROLES[r].label), ...companionFor.map((c) => `Greek companion: ${c}`)].join(" · ")}
            </p>
            <p className={styles.roleGlyphs} aria-hidden="true">
              <span lang="en">Aa</span>
              {supportsGreek(load.font) ? <span lang="el">Αα</span> : null}
            </p>
            <h3 className={styles.roleFamily}>
              <Link href={`/fonts/${load.font.id}`}>{load.font.family}</Link>
            </h3>
            <dl className={styles.roleFacts}>
              <div>
                <dt>Scripts</dt>
                <dd>{scriptSummary(load.font)}</dd>
              </div>
              <div>
                <dt>Weights</dt>
                <dd>{load.weights.join(", ")}</dd>
              </div>
              <div>
                <dt>Styles</dt>
                <dd>{load.styles.join(", ")}</dd>
              </div>
              {load.axes.length ? (
                <div>
                  <dt>Axes</dt>
                  <dd>{load.axes.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        );
      })}
    </ul>
  );
}
