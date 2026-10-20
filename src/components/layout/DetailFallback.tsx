import { PageHeader } from "./Page";
import styles from "./Page.module.css";

/** Shell shown while a detail route resolves its URL params on client navigation. */
export function DetailFallback({ kicker }: { kicker: string }) {
  return (
    <div aria-busy="true">
      <PageHeader kicker={kicker} title={<span className={styles.placeholder}>Loading…</span>} />
    </div>
  );
}
