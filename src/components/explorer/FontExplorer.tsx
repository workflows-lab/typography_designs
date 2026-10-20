"use client";

import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";
import { ScriptSupport } from "@/components/specimen/ScriptSupport";
import { CheckChip, RangeField, Segmented, TextField } from "@/components/ui/controls";
import { cssVars } from "@/lib/css-vars";
import { FONT_LIST } from "@/typography/data/fonts";
import { LANGUAGES, SPECIMEN_TEXT } from "@/typography/data/specimens";
import { CLASSIFICATIONS, FONT_ROLES, INDUSTRIES } from "@/typography/data/taxonomy";
import {
  activeFilterCount,
  EMPTY_FILTERS,
  filterFonts,
  type FontFilters,
  type ScriptFilter,
} from "@/typography/engine/filter-fonts";
import { nearestWeight, supportsGreek } from "@/typography/engine/font-support";
import { containsGreek, greekSubstitute, specimenFamily } from "@/typography/engine/specimen";
import type { Classification, FontDefinition, FontId, FontRole, Industry, Language } from "@/typography/types";
import styles from "./explorer.module.css";

type View = "list" | "grid";

const MAX_COMPARE = 4;

function toggle<T>(list: T[], value: T, on: boolean): T[] {
  return on ? [...list, value] : list.filter((v) => v !== value);
}

export function FontExplorer() {
  const [filters, setFilters] = useState<FontFilters>(EMPTY_FILTERS);
  const [lang, setLang] = useState<Language>("en");
  const [customText, setCustomText] = useState("");
  const [size, setSize] = useState(44);
  const [weight, setWeight] = useState(400);
  const [view, setView] = useState<View>("list");
  const [compare, setCompare] = useState<FontId[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelId = useId();

  const deferredFilters = useDeferredValue(filters);
  const results = filterFonts(deferredFilters);
  const active = activeFilterCount(filters);
  const text = customText.trim() ? customText : SPECIMEN_TEXT[lang].headline;

  const update = (patch: Partial<FontFilters>) => setFilters((f) => ({ ...f, ...patch }));

  function setCompared(id: FontId, on: boolean) {
    setCompare((list) => (on ? (list.length >= MAX_COMPARE ? list : [...list, id]) : list.filter((x) => x !== id)));
  }

  return (
    <div className={styles.explorer}>
      <aside className={styles.filters} aria-label="Filters">
        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          Filters {active ? <span className={styles.badge}>{active}</span> : null}
        </button>
        <div id={panelId} className={styles.filterPanel} data-open={filtersOpen}>
          <TextField
            type="search"
            label="Search"
            placeholder="Family, designer, trait…"
            value={filters.query}
            onChange={(query) => update({ query })}
          />

          <fieldset className={styles.facet}>
            <legend className={styles.facetTitle}>Script support</legend>
            <div className={styles.radioList}>
              {(
                [
                  ["all", "All typefaces"],
                  ["greek", "Greek + Latin"],
                  ["polytonic", "Polytonic Greek"],
                  ["latin-only", "Latin only"],
                ] as [ScriptFilter, string][]
              ).map(([value, label]) => (
                <label key={value} className={styles.radio}>
                  <input
                    type="radio"
                    name={`${panelId}-script`}
                    value={value}
                    checked={filters.script === value}
                    onChange={() => update({ script: value })}
                  />
                  <span>{label}</span>
                  <span className={styles.facetCount}>{filterFonts({ ...EMPTY_FILTERS, script: value }).length}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Facet<Classification>
            title="Classification"
            options={Object.entries(CLASSIFICATIONS).map(([value, c]) => ({ value: value as Classification, label: c.label, title: c.description }))}
            selected={filters.classifications}
            onChange={(classifications) => update({ classifications })}
          />
          <Facet<FontRole>
            title="Best for"
            options={Object.entries(FONT_ROLES).map(([value, r]) => ({ value: value as FontRole, label: r.label }))}
            selected={filters.roles}
            onChange={(roles) => update({ roles })}
          />
          <Facet<Industry>
            title="Industry"
            options={Object.entries(INDUSTRIES).map(([value, i]) => ({ value: value as Industry, label: i.label }))}
            selected={filters.industries}
            onChange={(industries) => update({ industries })}
          />

          {active ? (
            <button type="button" className={styles.clear} onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear all filters
            </button>
          ) : null}
        </div>
      </aside>

      <div className={styles.results}>
        <div className={styles.toolbar}>
          <Segmented
            legend="Specimen language"
            value={lang}
            onChange={setLang}
            options={[
              { value: "en", label: "EN" , title: "English" },
              { value: "el", label: <span lang="el">ΕΛ</span>, title: "Ελληνικά" },
            ]}
          />
          <div className={styles.toolbarText}>
            <TextField
              label="Preview text"
              placeholder={SPECIMEN_TEXT[lang].headline}
              value={customText}
              lang={containsGreek(customText) ? "el" : undefined}
              onChange={setCustomText}
            />
          </div>
          <RangeField label="Size" value={size} min={16} max={120} format={(v) => `${v}px`} onChange={setSize} />
          <RangeField label="Weight" value={weight} min={100} max={900} step={100} onChange={setWeight} />
          <Segmented
            legend="View"
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
            ]}
          />
        </div>

        <p className={styles.count} role="status" aria-live="polite">
          <strong>{results.length}</strong> of {FONT_LIST.length} typefaces
          {lang === "el" ? " · Latin-only fonts show their recommended Greek alternative, labelled" : ""}
        </p>

        {results.length === 0 ? (
          <p className={styles.empty}>No typeface matches these filters.</p>
        ) : view === "list" ? (
          <ol className={styles.list}>
            {results.map((font) => (
              <FontRow
                key={font.id}
                font={font}
                index={FONT_LIST.indexOf(font) + 1}
                text={text}
                lang={lang}
                size={size}
                weight={weight}
                compared={compare.includes(font.id)}
                compareDisabled={compare.length >= MAX_COMPARE && !compare.includes(font.id)}
                onCompare={(on) => setCompared(font.id, on)}
              />
            ))}
          </ol>
        ) : (
          <ol className={styles.grid}>
            {results.map((font) => (
              <FontTile key={font.id} font={font} lang={lang} weight={weight} />
            ))}
          </ol>
        )}

        {compare.length ? (
          <div className={styles.tray} role="region" aria-label="Comparison selection">
            <p>
              <span className={styles.trayCount}>
                {compare.length}/{MAX_COMPARE}
              </span>{" "}
              {compare.map((id) => FONT_LIST.find((f) => f.id === id)?.family).join(", ")}
            </p>
            <div className={styles.trayActions}>
              <button type="button" className={styles.clear} onClick={() => setCompare([])}>
                Clear
              </button>
              <Link className={styles.trayLink} href={`/compare?fonts=${compare.join(",")}`}>
                Compare side by side →
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

interface FacetProps<T extends string> {
  title: string;
  options: { value: T; label: string; title?: string }[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

function Facet<T extends string>({ title, options, selected, onChange }: FacetProps<T>) {
  return (
    <fieldset className={styles.facet}>
      <legend className={styles.facetTitle}>{title}</legend>
      <div className={styles.chips}>
        {options.map((o) => (
          <CheckChip
            key={o.value}
            title={o.title}
            checked={selected.includes(o.value)}
            onChange={(on) => onChange(toggle(selected, o.value, on))}
          >
            {o.label}
          </CheckChip>
        ))}
      </div>
    </fieldset>
  );
}

interface RowProps {
  font: FontDefinition;
  index: number;
  text: string;
  lang: Language;
  size: number;
  weight: number;
  compared: boolean;
  compareDisabled: boolean;
  onCompare: (on: boolean) => void;
}

function FontRow({ font, index, text, lang, size, weight, compared, compareDisabled, onCompare }: RowProps) {
  const shownWeight = nearestWeight(font, weight);
  const substitute = !supportsGreek(font) && containsGreek(text) ? greekSubstitute(font) : null;
  return (
    <li
      className={styles.row}
      style={cssVars({
        "--specimen-family": specimenFamily(font),
        "--specimen-size": `${size}px`,
        "--specimen-weight": shownWeight,
      })}
    >
      <div className={styles.rowMeta}>
        <span className={styles.index}>{String(index).padStart(2, "0")}</span>
        <h2 className={styles.family}>
          <Link href={`/fonts/${font.id}`} className={styles.familyLink}>
            {font.family}
          </Link>
        </h2>
        <p className={styles.classes}>{font.classifications.map((c) => CLASSIFICATIONS[c].label).join(" · ")}</p>
        <ScriptSupport font={font} compact />
        <p className={styles.designer}>
          {font.designers[0]}
          {font.designers.length > 1 ? ` +${font.designers.length - 1}` : ""}
          {" · "}
          {font.axes ? "Variable" : `${font.weights.length} weights`}
          {shownWeight !== weight ? ` · showing ${shownWeight}` : ""}
        </p>
      </div>
      <div className={styles.rowSample}>
        <p className={styles.sample} lang={LANGUAGES[lang].htmlLang}>
          {text}
        </p>
        {substitute ? (
          <p className={styles.subNote}>
            No Greek in {font.family} — Greek set in {substitute.family}
          </p>
        ) : null}
      </div>
      <div className={styles.rowActions}>
        <CheckChip
          checked={compared}
          onChange={onCompare}
          disabled={compareDisabled}
          title={compareDisabled ? "Compare holds up to four fonts" : `Add ${font.family} to comparison`}
        >
          {compared ? "Comparing" : "Compare"}
        </CheckChip>
      </div>
    </li>
  );
}

function FontTile({ font, lang, weight }: { font: FontDefinition; lang: Language; weight: number }) {
  const greek = supportsGreek(font);
  const showGreek = lang === "el" && greek;
  return (
    <li
      className={styles.tile}
      style={cssVars({
        "--specimen-family": specimenFamily(font),
        "--specimen-weight": nearestWeight(font, weight),
      })}
    >
      <Link href={`/fonts/${font.id}`} className={styles.tileLink}>
        <span className={styles.tileGlyphs} lang={showGreek ? "el" : "en"} aria-hidden="true">
          {showGreek ? "Αα" : "Aa"}
        </span>
        <span className={styles.tileName}>{font.family}</span>
        <span className={styles.tileMeta}>
          {lang === "el" && !greek ? "Latin only" : font.classifications.slice(0, 2).map((c) => CLASSIFICATIONS[c].label).join(" · ")}
        </span>
      </Link>
    </li>
  );
}
