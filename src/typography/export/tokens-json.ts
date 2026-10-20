import { fontStack } from "../engine/font-support";
import { fluidClamp } from "../engine/fluid";
import { assignedRoles, familyFor } from "../engine/system-fonts";
import type { TypographySystem } from "../types";
import { TEXT_STYLE_KEYS } from "../types";

/**
 * Platform-neutral token JSON. Sizes are given both as raw px endpoints (for design
 * tools and other platforms) and as the resolved CSS clamp() expression.
 */
export function tokensJson(system: TypographySystem): string {
  const families = Object.fromEntries(
    assignedRoles(system).map((role) => {
      const a = familyFor(system, role);
      return [
        role,
        {
          font: a.font,
          greekCompanion: a.greekCompanion ?? null,
          axes: a.axes ?? [],
          cssStack: fontStack(a.font, a.greekCompanion),
        },
      ];
    }),
  );

  const text = Object.fromEntries(
    TEXT_STYLE_KEYS.map((key) => {
      const s = system.styles[key];
      return [
        key,
        {
          family: s.family,
          sizePx: { min: s.size.min, max: s.size.max },
          sizeCss: fluidClamp(s.size, system.fluid, "vw"),
          weight: s.weight,
          lineHeight: s.lineHeight,
          letterSpacingEm: s.tracking,
          fontStyle: s.style ?? "normal",
          textTransform: s.transform ?? "none",
          fontVariationSettings: s.variation ?? null,
          fontFeatureSettings: s.features ?? null,
        },
      ];
    }),
  );

  return (
    JSON.stringify(
      {
        id: system.id,
        name: system.name,
        version: 1,
        fluid: { ...system.fluid, rootFontSizePx: 16, unit: "vw" },
        families,
        text,
        emphasis: system.emphasis,
        measureCh: system.measure,
        flowEm: system.flow,
      },
      null,
      2,
    ) + "\n"
  );
}
