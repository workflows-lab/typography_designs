import type { AuditCheck } from "@/typography/engine/audit";
import styles from "./system.module.css";

export function AuditList({ checks }: { checks: AuditCheck[] }) {
  return (
    <ul className={styles.audit}>
      {checks.map((c) => (
        <li key={c.id} className={styles.auditItem} data-pass={c.pass}>
          <span className={styles.auditMark} aria-hidden="true">
            {c.pass ? "✓" : "✕"}
          </span>
          <span>
            <strong>{c.label}</strong>
            <span className="sr-only">{c.pass ? " — passes" : " — fails"}</span>
            <span className={styles.auditDetail}>{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
