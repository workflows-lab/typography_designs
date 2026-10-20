import Link from "next/link";
import { Suspense } from "react";
import { FONT_IDS } from "@/typography/data/font-ids";
import { SYSTEMS } from "@/typography/data/systems";
import { NavLinks, NavList, type NavItem } from "./NavLinks";
import styles from "./SiteHeader.module.css";

const NAV_ITEMS: NavItem[] = [
  { href: "/fonts", label: "Fonts", count: String(FONT_IDS.length) },
  { href: "/systems", label: "Systems", count: String(SYSTEMS.length).padStart(2, "0") },
  { href: "/compare", label: "Compare" },
  { href: "/pairings", label: "Pairings" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            Αa
          </span>
          <span className={styles.wordmark}>
            Type Library
            <span className={styles.subtitle} lang="el">
              Τυπογραφικό εργαστήριο
            </span>
          </span>
        </Link>
        <Suspense fallback={<NavList items={NAV_ITEMS} />}>
          <NavLinks items={NAV_ITEMS} />
        </Suspense>
      </div>
    </header>
  );
}
