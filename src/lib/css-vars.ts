import type { CSSProperties } from "react";

type CustomProperties = Record<`--${string}`, string | number | undefined>;

/**
 * Typed helper for passing dynamic CSS custom properties to specimens.
 * Layout styling stays in CSS Modules; only specimen parameters travel this way.
 */
export function cssVars(vars: CustomProperties): CSSProperties {
  return vars as CSSProperties;
}
