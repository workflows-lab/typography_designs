"use client";

import { useId, type ReactNode } from "react";
import styles from "./ui.module.css";

/* Segmented control — a styled radio group. ----------------------------- */

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  title?: string;
}

interface SegmentedProps<T extends string> {
  legend: string;
  hideLegend?: boolean;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
}

export function Segmented<T extends string>({ legend, hideLegend, options, value, onChange, size = "md" }: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset className={styles.field}>
      <legend className={hideLegend ? "sr-only" : styles.legend}>{legend}</legend>
      <div className={styles.segmented} data-size={size}>
        {options.map((o) => (
          <label key={o.value} className={styles.segment} title={o.title}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* Range with a live readout. ---------------------------------------------- */

interface RangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (value: number) => void;
}

export function RangeField({ label, value, min, max, step = 1, format = String, onChange }: RangeProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <div className={styles.rangeHead}>
        <label htmlFor={id} className={styles.legend}>
          {label}
        </label>
        <output htmlFor={id} className={styles.readout}>
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/* Checkbox chip for multi-select facets. -------------------------------- */

interface ChipProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  title?: string;
  disabled?: boolean;
}

export function CheckChip({ checked, onChange, children, title, disabled }: ChipProps) {
  return (
    <label className={styles.chip} title={title} data-disabled={disabled || undefined}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

/* Labelled text input / textarea. --------------------------------------- */

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: "text" | "search";
  lang?: string;
}

export function TextField({ label, value, onChange, placeholder, multiline, type = "text", lang }: TextFieldProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.legend}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={styles.input}
          rows={3}
          value={value}
          placeholder={placeholder}
          lang={lang}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className={styles.input}
          type={type}
          value={value}
          placeholder={placeholder}
          lang={lang}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* Select. --------------------------------------------------------------- */

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.legend}>
        {label}
      </label>
      <select id={id} className={styles.select} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
