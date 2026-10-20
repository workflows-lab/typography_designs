import type { FluidUnit } from "@/typography/engine/fluid";
import { previewCss } from "@/typography/engine/system-css";
import type { TypographySystem } from "@/typography/types";

/**
 * Injects the system's generated CSS, scoped to `[data-type-system][data-fluid]`.
 * It is the same generator that produces the exported typography.css — previews are
 * the contract, not an approximation of it. React hoists and de-duplicates by href.
 */
export function SystemStyles({ system, unit }: { system: TypographySystem; unit: FluidUnit }) {
  return (
    <style href={`type-system-${system.id}-${unit}`} precedence="default">
      {previewCss(system, unit)}
    </style>
  );
}
