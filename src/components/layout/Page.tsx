import type { ReactNode } from "react";
import styles from "./Page.module.css";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[styles.container, className].filter(Boolean).join(" ")}>{children}</div>;
}

interface PageHeaderProps {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}

export function PageHeader({ kicker, title, intro, aside }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <Container className={styles.pageHeaderGrid}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        {intro ? <div className={styles.intro}>{intro}</div> : null}
        {aside ? <div className={styles.aside}>{aside}</div> : null}
      </Container>
    </header>
  );
}

interface SectionProps {
  id?: string;
  index?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function Section({ id, index, title, description, actions, children }: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <Container>
        <div className={styles.sectionHead}>
          {index ? <span className={styles.sectionIndex}>{index}</span> : null}
          <h2 id={headingId} className={styles.sectionTitle}>
            {title}
          </h2>
          {description ? <div className={styles.sectionDescription}>{description}</div> : null}
          {actions ? <div className={styles.sectionActions}>{actions}</div> : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}
