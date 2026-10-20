import type { SystemId, TypographySystem } from "../../types";
import { T001 } from "./t001-didot-atelier";
import { T002 } from "./t002-modernist-index";
import { T003 } from "./t003-warm-table";
import { T004 } from "./t004-clear-care";
import { T005 } from "./t005-broadsheet";
import { T006 } from "./t006-gallery-shop";
import { T007 } from "./t007-museum-catalogue";
import { T008 } from "./t008-soft-modern";

/** Every system, in ID order. IDs are permanent: never renumber or reuse them. */
export const SYSTEMS: TypographySystem[] = [T001, T002, T003, T004, T005, T006, T007, T008];

export function getSystem(id: string): TypographySystem | undefined {
  const normalised = id.toUpperCase() as SystemId;
  return SYSTEMS.find((s) => s.id === normalised);
}

export function systemSlug(system: TypographySystem): string {
  return system.id.toLowerCase();
}
