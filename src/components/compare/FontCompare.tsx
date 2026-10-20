"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ScriptSupport, SubstitutionNote } from "@/components/specimen/ScriptSupport";
import { RangeField, Segmented, TextField } from "@/components/ui/controls";
import { cssVars } from "@/lib/css-vars";
import { FONTS } from "@/typography/data/fonts";
import { isFontId } from "@/typography/data/font-ids";
import { LANGUAGES, SPECIMEN_TEXT } from "@/typography/data/specimens";
import { CLASSIFICATIONS } from "@/typography/data/taxonomy";
import { isVariable, nearestWeight, supportsGreek } from "@/typography/engine/font-support";
import { containsGreek, greekSubstitute, specimenFamily } from "@/typography/engine/specimen";
import type { FontId, Language } from "@/typography/types";
import { FontSelect } from "./FontSelect";
import styles from "./compare.module.css";

const DEFAULT_FONTS: FontId[] = ["gfs-didot", "noto-serif-display", "playfair-display"];
const MAX = 4;

function parseFonts(param: string | null): FontId[] {
  const ids = (param ?? "").split(",").filter(isFontId);
  const unique = [...new Set(ids)].slice(0, MAX);
  return unique.length ? unique : DEFAULT_FONTS;
}

type View = "columns" | "rows";

export function FontCompare() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fonts = parseFonts(searchParams.get("fonts"));

  const [lang, setLang] = useState<Language>("en");
  const [text, setText] = useState("");
  const [size, setSize] = useState(56);
  const [weight, setWeight] = useState(400);
  const [view, setView] = useState<View>("columns");

  const sample = text.trim() || SPECIMEN_TEXT[lang].headline;

  function setFonts(next: FontId[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fonts", next.join(","));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function setSlot(index: number, value: FontId | "") {
    const next = [...fonts];
    if (value) next[index] = value;
    else next.splice(index, 1);
    setFonts([...new Set(next)]);
  }

  return (
    <div className={styles.compare}>
      <div className={styles.controls}>
        <div className={styles.slots}>
          {fonts.map((id, i) => (
            <FontSelect
              key={`${i}-${id}`}
              label={`Font ${i + 1}`}
              value={id}
              allowEmpty={fonts.length > 1}
              onChange={(v) => setSlot(i, v)}
            />
          ))}
          {fonts.length < MAX ? (
            <FontSelect label={`Font ${fonts.length + 1}`} value="" allowEmpty onChange={(v) => v && setFonts([...fonts, v])} />
          ) : null}
        </div>
        <div className={styles.settings}>
          <Segmented
            legend="Language"
            value={lang}
            onChange={setLang}
            options={[
              { value: "en", label: "English" },
              { value: "el", label: <span lang="el">Ελληνικά</span> },
            ]}
          />
          <TextField label="Preview text" placeholder={SPECIMEN_TEXT[lang].headline} value={text} onChange={setText} />
          <RangeField label="Size" value={size} min={16} max={140} format={(v) => `${v}px`} onChange={setSize} />
          <RangeField label="Weight (nearest available)" value={weight} min={100} max={900} step={100} onChange={setWeight} />
          <Segmented
            legend="Layout"
            value={view}
            onChange={setView}
            options={[
              { value: "columns", label: "Columns" },
              { value: "rows", label: "Rows" },
            ]}
          />
        </div>
      </div>

      <div className={styles.results} data-view={view} style={cssVars({ "--cols": fonts.length })}>
        {fonts.map((id) => {
          const font = FONTS[id];
          const w = nearestWeight(font, weight);
          const greek = supportsGreek(font);
          const showNote = !greek && containsGreek(sample);
          return (
            <section
              key={id}
              className={styles.column}
              aria-label={font.family}
              style={cssVars({ "--specimen-family": specimenFamily(font), "--specimen-weight": w, "--specimen-size": `${size}px` })}
            >
              <header className={styles.columnHead}>
                <h2 className={styles.columnName}>
                  <Link href={`/fonts/${id}`}>{font.family}</Link>
                </h2>
                <ScriptSupport font={font} compact />
              </header>
              <p className={styles.sample} lang={LANGUAGES[lang].htmlLang}>
                {sample}
              </p>
              {showNote ? <SubstitutionNote font={font} substitute={greekSubstitute(font)} /> : null}
              {view === "columns" ? (
                <>
                  <p className={styles.paragraph} lang={greek ? LANGUAGES[lang].htmlLang : "en"}>
                    {greek ? SPECIMEN_TEXT[lang].paragraph : SPECIMEN_TEXT.en.paragraph}
                  </p>
                  <p className={styles.glyphs} aria-hidden="true">
                    <span lang="en">Aa Gg Rr Qq &amp; 0123</span>
                    {greek ? <span lang="el">Αα Γγ Ξξ Ψψ Ωω ς</span> : null}
                  </p>
                  <dl className={styles.facts}>
                    <div>
                      <dt>Class</dt>
                      <dd>{font.classifications.map((c) => CLASSIFICATIONS[c].label).join(", ")}</dd>
                    </div>
                    <div>
                      <dt>Weights</dt>
                      <dd>
                        {isVariable(font) ? "Variable · " : ""}
                        {font.weights[0]}–{font.weights[font.weights.length - 1]}
                        {w !== weight ? ` (showing ${w})` : ""}
                      </dd>
                    </div>
                    <div>
                      <dt>Italic</dt>
                      <dd>{font.styles.includes("italic") ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt>Design</dt>
                      <dd>{font.designers.join(", ")}</dd>
                    </div>
                  </dl>
                </>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
