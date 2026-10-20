import type {
  FamilyRole,
  FontDefinition,
  FontId,
  FontStyle,
  TextStyleKey,
  TypographySystem,
} from "../types";
import { TEXT_STYLE_KEYS } from "../types";
import { getFont, hasItalic, supportsGreek, supportsWeight } from "./font-support";

export interface SystemFontLoad {
  font: FontDefinition;
  /** Roles this font fills directly. */
  roles: FamilyRole[];
  /** Roles this font covers only as a Greek companion. */
  companionFor: FamilyRole[];
  weights: number[];
  styles: FontStyle[];
  axes: string[];
}

export const FAMILY_ROLE_ORDER: FamilyRole[] = ["display", "heading", "body", "ui", "mono"];

/** Styles that hold running text, so <strong>/<em> may occur inside them. */
export const RUNNING_TEXT: TextStyleKey[] = ["body", "lead", "small", "caption"];

export function assignedRoles(system: TypographySystem): FamilyRole[] {
  return FAMILY_ROLE_ORDER.filter((role) => system.families[role as keyof typeof system.families]);
}

export function familyFor(system: TypographySystem, role: FamilyRole) {
  const assignment = system.families[role as keyof typeof system.families];
  if (!assignment) throw new Error(`${system.id} has no "${role}" family`);
  return assignment;
}

/**
 * Exactly which fonts, weights, styles and axes a system needs. Drives the export
 * (next/font config, Google Fonts URL) and the font table on the system page.
 */
export function systemFontLoads(system: TypographySystem): SystemFontLoad[] {
  const loads = new Map<FontId, { roles: Set<FamilyRole>; companionFor: Set<FamilyRole>; weights: Set<number>; styles: Set<FontStyle>; axes: Set<string> }>();

  const entry = (id: FontId) => {
    let current = loads.get(id);
    if (!current) {
      current = { roles: new Set(), companionFor: new Set(), weights: new Set(), styles: new Set(), axes: new Set() };
      loads.set(id, current);
    }
    return current;
  };

  for (const role of assignedRoles(system)) {
    const assignment = familyFor(system, role);
    const primary = entry(assignment.font);
    primary.roles.add(role);
    assignment.axes?.forEach((a) => primary.axes.add(a));
    if (assignment.greekCompanion) {
      const companion = entry(assignment.greekCompanion);
      companion.companionFor.add(role);
      assignment.axes?.forEach((a) => {
        if (getFont(assignment.greekCompanion!).loadedAxes.includes(a)) companion.axes.add(a);
      });
    }
  }

  const addUsage = (role: FamilyRole, weight: number, style: FontStyle) => {
    const assignment = familyFor(system, role);
    const ids = [assignment.font, assignment.greekCompanion].filter(Boolean) as FontId[];
    for (const id of ids) {
      const font = getFont(id);
      const target = entry(id);
      // Never request an instance that does not exist (next/font would fail the build);
      // missing weights are reported by the audit instead.
      if (supportsWeight(font, weight)) target.weights.add(weight);
      if (style === "normal" || hasItalic(font)) target.styles.add(style);
    }
  };

  for (const key of TEXT_STYLE_KEYS) {
    const s = system.styles[key];
    addUsage(s.family, s.weight, s.style ?? "normal");
    if (RUNNING_TEXT.includes(key)) {
      addUsage(s.family, system.emphasis.strongWeight, s.style ?? "normal");
      if (system.emphasis.italic) addUsage(s.family, s.weight, "italic");
    }
  }

  return [...loads.entries()].map(([id, v]) => ({
    font: getFont(id),
    roles: FAMILY_ROLE_ORDER.filter((r) => v.roles.has(r)),
    companionFor: FAMILY_ROLE_ORDER.filter((r) => v.companionFor.has(r)),
    weights: [...v.weights].sort((a, b) => a - b),
    styles: (["normal", "italic"] as FontStyle[]).filter((s) => v.styles.has(s)),
    axes: [...v.axes].sort(),
  }));
}

export function systemFontIds(system: TypographySystem): FontId[] {
  return systemFontLoads(system).map((l) => l.font.id);
}

export function systemIsFullyBilingual(system: TypographySystem): boolean {
  return assignedRoles(system).every((role) => {
    const a = familyFor(system, role);
    return supportsGreek(getFont(a.font)) || (a.greekCompanion && supportsGreek(getFont(a.greekCompanion)));
  });
}
