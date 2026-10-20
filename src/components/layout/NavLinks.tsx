"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

export interface NavItem {
  href: string;
  label: string;
  count?: string;
}

export function NavList({ items, activeHref }: { items: NavItem[]; activeHref?: string }) {
  return (
    <nav aria-label="Primary" className={styles.nav}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={styles.link}
              aria-current={item.href === activeHref ? "page" : undefined}
            >
              {item.label}
              {item.count ? <span className={styles.count}>{item.count}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const active = items.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  return <NavList items={items} activeHref={active?.href} />;
}
