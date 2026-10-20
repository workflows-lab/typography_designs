import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.statement}>
          Every specimen is set in the real typeface, self-hosted from Google Fonts. Greek support is read
          from verified font subsets — a Latin-only font is never shown with borrowed Greek unless labelled.
        </p>
        <ul className={styles.links}>
          <li>
            <Link href="/fonts">Font Explorer</Link>
          </li>
          <li>
            <Link href="/systems">Typography Systems</Link>
          </li>
          <li>
            <Link href="/compare">Compare</Link>
          </li>
          <li>
            <Link href="/pairings">Pairings</Link>
          </li>
        </ul>
        <p className={styles.meta}>Internal design tool · Fonts under SIL OFL 1.1</p>
      </div>
    </footer>
  );
}
