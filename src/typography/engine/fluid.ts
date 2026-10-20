import type { FluidSize } from "../types";

/** `vw` for real pages; `cqi` for previews rendered inside a sized container. */
export type FluidUnit = "vw" | "cqi";

export interface FluidRange {
  minViewport: number;
  maxViewport: number;
}

const ROOT_PX = 16;

function round(value: number, precision = 4): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function pxToRem(px: number): string {
  return `${round(px / ROOT_PX)}rem`;
}

/**
 * Linear interpolation between `min` px (at minViewport) and `max` px (at maxViewport),
 * expressed as `clamp(min, intercept + slope*unit, max)` with rem bounds so user font
 * preferences still apply.
 */
export function fluidClamp(size: FluidSize, range: FluidRange, unit: FluidUnit = "vw"): string {
  if (size.min === size.max) return pxToRem(size.min);
  const slope = (size.max - size.min) / (range.maxViewport - range.minViewport);
  const interceptRem = round((size.min - slope * range.minViewport) / ROOT_PX);
  const slopeUnits = round(slope * 100);
  const preferred =
    interceptRem === 0
      ? `${slopeUnits}${unit}`
      : interceptRem > 0
        ? `${interceptRem}rem + ${slopeUnits}${unit}`
        : `${slopeUnits}${unit} - ${Math.abs(interceptRem)}rem`;
  return `clamp(${pxToRem(size.min)}, ${preferred}, ${pxToRem(size.max)})`;
}

/** Resolved px value at a given viewport/container width. */
export function fluidValueAt(size: FluidSize, range: FluidRange, width: number): number {
  if (width <= range.minViewport) return size.min;
  if (width >= range.maxViewport) return size.max;
  const t = (width - range.minViewport) / (range.maxViewport - range.minViewport);
  return size.min + (size.max - size.min) * t;
}

/**
 * Maximum safe ratio between the largest and smallest size of a fluid value so that
 * 200% browser zoom still produces 200% text (WCAG 1.4.4).
 */
export const MAX_ZOOM_SAFE_RATIO = 2.5;

export function zoomRatio(size: FluidSize): number {
  return size.max / size.min;
}
