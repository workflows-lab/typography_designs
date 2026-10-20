"use client";

import { useState } from "react";
import { CheckChip, RangeField, Segmented, TextField } from "@/components/ui/controls";
import { cssVars } from "@/lib/css-vars";
import { LANGUAGES, SPECIMEN_TEXT } from "@/typography/data/specimens";
import { adjustableAxes, hasItalic, isVariable, supportsGreek, weightRange } from "@/typography/engine/font-support";
import { WEIGHT_NAMES, containsGreek, specimenFamily, substitutionFor } from "@/typography/engine/specimen";
import type { FontDefinition, Language } from "@/typography/types";
import { SubstitutionNote } from "./ScriptSupport";
import styles from "./specimen.module.css";

type Mode = "line" | "paragraph" | "waterfall";
type Tone = "light" | "dark";

const WATERFALL = [12, 14, 16, 20, 24, 32, 48, 72];

const DEFAULTS = { size: 72, tracking: 0, leading: 1.15, paragraphSize: 20, paragraphLeading: 1.55 };

export function TypeTester({ font }: { font: FontDefinition }) {
  const [lang, setLang] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("line");
  const [texts, setTexts] = useState<Record<Language, string>>({
    en: SPECIMEN_TEXT.en.headline,
    el: SPECIMEN_TEXT.el.headline,
  });
  const [size, setSize] = useState(DEFAULTS.size);
  const [weight, setWeight] = useState(font.weights.includes(400) ? 400 : font.weights[0]);
  const [italic, setItalic] = useState(false);
  const [tracking, setTracking] = useState(DEFAULTS.tracking);
  const [leading, setLeading] = useState(DEFAULTS.leading);
  const [axes, setAxes] = useState<Record<string, number>>({});
  const [tone, setTone] = useState<Tone>("light");

  const variable = isVariable(font);
  const [wMin, wMax] = weightRange(font);
  const customAxes = adjustableAxes(font);
  const text = mode === "paragraph" ? texts[lang] || SPECIMEN_TEXT[lang].paragraph : texts[lang];
  const substitute = substitutionFor(font, text);
  const variation = Object.entries(axes)
    .map(([tag, value]) => `"${tag}" ${value}`)
    .join(", ");

  function reset() {
    setSize(mode === "paragraph" ? DEFAULTS.paragraphSize : DEFAULTS.size);
    setTracking(DEFAULTS.tracking);
    setLeading(mode === "paragraph" ? DEFAULTS.paragraphLeading : DEFAULTS.leading);
    setWeight(font.weights.includes(400) ? 400 : font.weights[0]);
    setItalic(false);
    setAxes({});
    setTexts({ en: SPECIMEN_TEXT.en.headline, el: SPECIMEN_TEXT.el.headline });
  }

  function changeMode(next: Mode) {
    setMode(next);
    if (next === "paragraph") {
      setSize(DEFAULTS.paragraphSize);
      setLeading(DEFAULTS.paragraphLeading);
      setTexts({ en: SPECIMEN_TEXT.en.paragraph, el: SPECIMEN_TEXT.el.paragraph });
    } else if (mode === "paragraph") {
      setSize(DEFAULTS.size);
      setLeading(DEFAULTS.leading);
      setTexts({ en: SPECIMEN_TEXT.en.headline, el: SPECIMEN_TEXT.el.headline });
    }
  }

  const previewVars = cssVars({
    "--specimen-family": specimenFamily(font),
    "--tt-size": `${size}px`,
    "--tt-weight": weight,
    "--tt-style": italic ? "italic" : "normal",
    "--tt-tracking": `${tracking}em`,
    "--tt-leading": leading,
    "--tt-variation": variation || "normal",
  });

  return (
    <div className={styles.tester}>
      <div className={styles.testerControls}>
        <Segmented
          legend="Language"
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "el", label: <span lang="el">Ελληνικά</span> },
          ]}
        />
        <Segmented
          legend="Specimen"
          value={mode}
          onChange={changeMode}
          options={[
            { value: "line", label: "Line" },
            { value: "paragraph", label: "Paragraph" },
            { value: "waterfall", label: "Waterfall" },
          ]}
        />
        <TextField
          label={`Preview text (${LANGUAGES[lang].label})`}
          value={texts[lang]}
          lang={LANGUAGES[lang].htmlLang}
          multiline
          onChange={(v) => setTexts((t) => ({ ...t, [lang]: v }))}
        />
        {mode !== "waterfall" ? (
          <RangeField label="Size" value={size} min={10} max={200} format={(v) => `${v}px`} onChange={setSize} />
        ) : null}
        {variable ? (
          <RangeField
            label="Weight"
            value={weight}
            min={wMin}
            max={wMax}
            onChange={setWeight}
            format={(v) => `${v}${WEIGHT_NAMES[v] ? ` · ${WEIGHT_NAMES[v]}` : ""}`}
          />
        ) : (
          <Segmented
            legend="Weight"
            size="sm"
            value={String(weight)}
            onChange={(v) => setWeight(Number(v))}
            options={font.weights.map((w) => ({ value: String(w), label: String(w), title: WEIGHT_NAMES[w] }))}
          />
        )}
        <RangeField
          label="Tracking"
          value={tracking}
          min={-0.1}
          max={0.3}
          step={0.005}
          format={(v) => `${v.toFixed(3)}em`}
          onChange={setTracking}
        />
        <RangeField
          label="Line height"
          value={leading}
          min={0.8}
          max={2.2}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={setLeading}
        />
        {customAxes.map((axis) => (
          <RangeField
            key={axis.tag}
            label={`${axis.name} (${axis.tag})`}
            value={axes[axis.tag] ?? axis.default}
            min={axis.min}
            max={axis.max}
            step={axis.max - axis.min <= 1 ? 1 : axis.max - axis.min <= 40 ? 0.5 : 1}
            format={(v) => (axes[axis.tag] === undefined && axis.tag === "opsz" ? "auto" : String(v))}
            onChange={(v) => setAxes((a) => ({ ...a, [axis.tag]: v }))}
          />
        ))}
        <div className={styles.testerRow}>
          {hasItalic(font) ? (
            <CheckChip checked={italic} onChange={setItalic}>
              Italic
            </CheckChip>
          ) : (
            <span className={styles.muted}>No italic</span>
          )}
          <Segmented
            legend="Tone"
            hideLegend
            size="sm"
            value={tone}
            onChange={setTone}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
          <button type="button" className={styles.textButton} onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className={styles.testerStage} data-tone={tone} style={previewVars}>
        {mode === "waterfall" ? (
          <ol className={styles.waterfall}>
            {WATERFALL.map((px) => (
              <li key={px} style={cssVars({ "--wf-size": `${px}px` })}>
                <span className={styles.waterfallSize}>{px}</span>
                <span className={styles.waterfallText} lang={LANGUAGES[lang].htmlLang}>
                  {text}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p
            className={mode === "paragraph" ? styles.testerParagraph : styles.testerLine}
            lang={LANGUAGES[lang].htmlLang}
          >
            {text}
          </p>
        )}
        {!supportsGreek(font) && containsGreek(text) ? <SubstitutionNote font={font} substitute={substitute} /> : null}
      </div>
    </div>
  );
}
