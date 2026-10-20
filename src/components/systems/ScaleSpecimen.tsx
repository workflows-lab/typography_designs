import type { ReactNode } from "react";
import { LangSwitch } from "@/components/specimen/LangSwitch";
import { TEXT_STYLES } from "@/typography/data/taxonomy";
import { getFont } from "@/typography/engine/font-support";
import { fluidClamp } from "@/typography/engine/fluid";
import { familyFor } from "@/typography/engine/system-fonts";
import type { CompositionContent, Language, TextStyleKey, TypographySystem } from "@/typography/types";
import { TEXT_STYLE_KEYS } from "@/typography/types";
import styles from "./system.module.css";

function sampleFor(key: TextStyleKey, c: CompositionContent): ReactNode {
  switch (key) {
    case "display":
      return <p className="t-display">{c.headline}</p>;
    case "h1":
      return <h1>{c.sectionTitle}</h1>;
    case "h2":
      return <h2>{c.itemsTitle}</h2>;
    case "h3":
      return <h3>{c.items[0].title}</h3>;
    case "h4":
      return <h4>{c.items[1].title}</h4>;
    case "h5":
      return <h5>{c.brand}</h5>;
    case "h6":
      return <h6>{c.sectionLabel}</h6>;
    case "lead":
      return <p className="t-lead">{c.lead}</p>;
    case "body":
      return <p>{c.body[0]}</p>;
    case "small":
      return (
        <p>
          <small>{c.items[2].text}</small>
        </p>
      );
    case "caption":
      return <p className="t-caption">{c.caption}</p>;
    case "label":
      return <p className="t-label">{c.cta}</p>;
    case "quote":
      return <blockquote>{c.quote}</blockquote>;
  }
}

/**
 * Every text style, live, using the exact system CSS (viewport units — resize the
 * window to watch the scale move), alongside its numeric specification.
 */
export function ScaleSpecimen({ system }: { system: TypographySystem }) {
  const languages: Language[] = ["en", "el"];
  return (
    <LangSwitch>
      <div className={styles.scale} data-type-system={system.id} data-fluid="vw">
        {TEXT_STYLE_KEYS.map((key) => {
          const s = system.styles[key];
          const font = getFont(familyFor(system, s.family).font);
          return (
            <div key={key} className={styles.scaleRow}>
              <dl className={styles.scaleMeta}>
                <div>
                  <dt className="sr-only">Style</dt>
                  <dd className={styles.scaleName}>{TEXT_STYLES[key].label}</dd>
                </div>
                <div>
                  <dt>Selector</dt>
                  <dd>
                    <code>{TEXT_STYLES[key].element}</code> · <code>.t-{key}</code>
                  </dd>
                </div>
                <div>
                  <dt>Font</dt>
                  <dd>
                    {font.family} {s.weight}
                    {s.style === "italic" ? " italic" : ""}
                  </dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>
                    {s.size.min}→{s.size.max}px
                  </dd>
                </div>
                <div>
                  <dt>Leading · Tracking</dt>
                  <dd>
                    {s.lineHeight} · {s.tracking}em
                  </dd>
                </div>
                {s.variation || s.transform || s.features ? (
                  <div>
                    <dt>Extras</dt>
                    <dd>{[s.transform, s.variation, s.features].filter(Boolean).join(" · ")}</dd>
                  </div>
                ) : null}
                <div className={styles.scaleClamp}>
                  <dt className="sr-only">CSS</dt>
                  <dd>
                    <code>{fluidClamp(s.size, system.fluid, "vw")}</code>
                  </dd>
                </div>
              </dl>
              <div className={styles.scaleSample}>
                {languages.map((lang) => (
                  <div key={lang} data-lang-variant={lang} lang={lang}>
                    {sampleFor(key, system.composition.content[lang])}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </LangSwitch>
  );
}
