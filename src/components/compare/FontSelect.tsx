"use client";

import { useId } from "react";
import uiStyles from "@/components/ui/ui.module.css";
import { FONT_LIST } from "@/typography/data/fonts";
import { supportsGreek } from "@/typography/engine/font-support";
import type { FontId } from "@/typography/types";

const GREEK = FONT_LIST.filter(supportsGreek);
const LATIN = FONT_LIST.filter((f) => !supportsGreek(f));

interface FontSelectProps {
  label: string;
  value: FontId | "";
  onChange: (value: FontId | "") => void;
  allowEmpty?: boolean;
}

export function FontSelect({ label, value, onChange, allowEmpty }: FontSelectProps) {
  const id = useId();
  return (
    <div className={uiStyles.field}>
      <label htmlFor={id} className={uiStyles.legend}>
        {label}
      </label>
      <select id={id} className={uiStyles.select} value={value} onChange={(e) => onChange(e.target.value as FontId | "")}>
        {allowEmpty ? <option value="">— None —</option> : null}
        <optgroup label="Greek + Latin">
          {GREEK.map((f) => (
            <option key={f.id} value={f.id}>
              {f.family}
            </option>
          ))}
        </optgroup>
        <optgroup label="Latin only">
          {LATIN.map((f) => (
            <option key={f.id} value={f.id}>
              {f.family}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
