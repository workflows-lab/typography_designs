import { TEXT_STYLES } from "../data/taxonomy";
import type { TypographySystem } from "../types";
import { TEXT_STYLE_KEYS } from "../types";
import { getFont, supportsGreek, supportsStyle, supportsWeight } from "./font-support";
import { MAX_ZOOM_SAFE_RATIO, zoomRatio } from "./fluid";
import { RUNNING_TEXT, assignedRoles, familyFor } from "./system-fonts";

export interface AuditCheck {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

/**
 * Automated checks a system must pass. Shown on the system page and included in the
 * exported contract so the receiving project can re-verify.
 */
export function auditSystem(system: TypographySystem): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const styles = TEXT_STYLE_KEYS.map((key) => ({ key, s: system.styles[key] }));

  const overZoom = styles.filter(({ s }) => zoomRatio(s.size) > MAX_ZOOM_SAFE_RATIO);
  checks.push({
    id: "zoom",
    label: "Zoom-safe fluid sizes",
    pass: overZoom.length === 0,
    detail: overZoom.length
      ? `Max/min ratio above ${MAX_ZOOM_SAFE_RATIO} for ${overZoom.map((o) => o.key).join(", ")}.`
      : `Every style keeps max ≤ ${MAX_ZOOM_SAFE_RATIO} × min, so 200% zoom enlarges text (WCAG 1.4.4).`,
  });

  const body = system.styles.body;
  checks.push({
    id: "body-size",
    label: "Body text ≥ 16px",
    pass: body.size.min >= 16,
    detail: `Body is ${body.size.min}–${body.size.max}px.`,
  });

  checks.push({
    id: "body-leading",
    label: "Body line-height ≥ 1.5",
    pass: body.lineHeight >= 1.5,
    detail: `Body line-height is ${body.lineHeight}.`,
  });

  const smallest = styles.reduce((a, b) => (b.s.size.min < a.s.size.min ? b : a));
  checks.push({
    id: "min-size",
    label: "Smallest text ≥ 11px",
    pass: smallest.s.size.min >= 11,
    detail: `Smallest is ${TEXT_STYLES[smallest.key].label} at ${smallest.s.size.min}px on small screens.`,
  });

  const tightCaps = styles.filter(({ s }) => s.transform === "uppercase" && s.tracking < 0.04);
  checks.push({
    id: "caps-tracking",
    label: "Uppercase is letter-spaced",
    pass: tightCaps.length === 0,
    detail: tightCaps.length
      ? `Add ≥ 0.04em tracking to ${tightCaps.map((t) => t.key).join(", ")}.`
      : "All uppercase styles use ≥ 0.04em tracking.",
  });

  const thinText = styles.filter(
    ({ key, s }) => ["body", "small", "caption"].includes(key) && s.weight < 300,
  );
  checks.push({
    id: "thin-text",
    label: "No hairline weights in small text",
    pass: thinText.length === 0,
    detail: thinText.length ? `Too light: ${thinText.map((t) => t.key).join(", ")}.` : "Running and small text are 300 or heavier.",
  });

  const missing: string[] = [];
  for (const { key, s } of styles) {
    const a = familyFor(system, s.family);
    const font = getFont(a.font);
    if (!supportsWeight(font, s.weight)) missing.push(`${key}: ${font.family} ${s.weight}`);
    if (s.style === "italic" && !supportsStyle(font, "italic")) missing.push(`${key}: ${font.family} italic`);
  }
  for (const key of RUNNING_TEXT) {
    const s = system.styles[key];
    const font = getFont(familyFor(system, s.family).font);
    if (!supportsWeight(font, system.emphasis.strongWeight)) {
      missing.push(`<strong> in ${key}: ${font.family} ${system.emphasis.strongWeight}`);
    }
  }
  checks.push({
    id: "availability",
    label: "Weights and styles exist",
    pass: missing.length === 0,
    detail: missing.length
      ? `Not available — ${missing.join("; ")}.`
      : "Every weight and style, including <strong> in running text, exists in the chosen fonts; nothing is synthesised.",
  });

  const latinOnly = assignedRoles(system).filter((role) => {
    const a = familyFor(system, role);
    const primary = supportsGreek(getFont(a.font));
    const companion = a.greekCompanion ? supportsGreek(getFont(a.greekCompanion)) : false;
    return !primary && !companion;
  });
  checks.push({
    id: "greek",
    label: "Greek coverage",
    pass: latinOnly.length === 0,
    detail: latinOnly.length
      ? `No Greek for: ${latinOnly.join(", ")}.`
      : "Every role renders Greek with a real Greek design (directly or via a declared companion).",
  });

  return checks;
}
