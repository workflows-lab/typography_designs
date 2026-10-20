import { cssVars } from "@/lib/css-vars";
import { LANGUAGES } from "@/typography/data/specimens";
import type { FluidUnit } from "@/typography/engine/fluid";
import type { Language, TypographySystem } from "@/typography/types";
import styles from "./composition.module.css";

interface CompositionProps {
  system: TypographySystem;
  lang: Language;
  unit?: FluidUnit;
}

/**
 * A realistic page built only from semantic elements and the system's `.t-*` classes.
 * Layout lives in the CSS module; every typographic property comes from the system CSS.
 */
export function Composition({ system, lang, unit = "cqi" }: CompositionProps) {
  const c = system.composition.content[lang];
  const { paper, ink, muted, accent, rule } = system.palette;
  return (
    <div
      className={styles.site}
      data-layout={system.composition.layout}
      data-type-system={system.id}
      data-fluid={unit}
      lang={LANGUAGES[lang].htmlLang}
      style={cssVars({ "--c-paper": paper, "--c-ink": ink, "--c-muted": muted, "--c-accent": accent, "--c-rule": rule })}
    >
      <header className={styles.siteHeader}>
        <p className={`t-h5 ${styles.brand}`}>{c.brand}</p>
        <ul className={styles.siteNav} aria-label="Example navigation">
          {c.nav.map((item) => (
            <li key={item} className="t-label">
              {item}
            </li>
          ))}
        </ul>
      </header>

      <section className={styles.hero}>
        <p className={`t-label ${styles.eyebrow}`}>{c.eyebrow}</p>
        {system.composition.layout === "editorial" ? (
          <h1 className={styles.headline}>{c.headline}</h1>
        ) : (
          <h1 className={`t-display ${styles.headline}`}>{c.headline}</h1>
        )}
        <p className={`t-lead ${styles.lead}`}>{c.lead}</p>
        <p className={styles.actions}>
          <span className={`t-label ${styles.cta}`}>{c.cta}</span>
        </p>
      </section>

      <figure className={styles.figure}>
        <div className={styles.image} aria-hidden="true">
          <span className={styles.glyph}>{c.brand.charAt(0)}</span>
        </div>
        <figcaption>{c.caption}</figcaption>
      </figure>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className="t-label">{c.sectionLabel}</p>
          <h2>{c.sectionTitle}</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.bodyText}>
            {c.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote className={styles.quote}>
            <p>{c.quote}</p>
            <footer className="t-caption">— {c.quoteSource}</footer>
          </blockquote>
        </div>
      </section>

      <section className={styles.items}>
        <h3 className={styles.itemsTitle}>{c.itemsTitle}</h3>
        <ol className={styles.itemList}>
          {c.items.map((item) => (
            <li key={item.title} className={styles.item}>
              <p className={`t-caption ${styles.itemMeta}`}>{item.meta}</p>
              <h4>{item.title}</h4>
              <p>
                <small>{item.text}</small>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.siteFooter}>
        <h6>{c.brand}</h6>
        <p>
          <small>{c.footer}</small>
        </p>
      </footer>
    </div>
  );
}
