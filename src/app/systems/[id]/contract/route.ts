import { SYSTEMS, getSystem, systemSlug } from "@/typography/data/systems";
import { buildSystemExport, contractFilename } from "@/typography/export/contract";

/** The portable implementation contract for a system, as a Markdown download. */

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ id: systemSlug(s) }));
}

export async function GET(_request: Request, { params }: RouteContext<"/systems/[id]/contract">) {
  const { id } = await params;
  const system = getSystem(id);
  if (!system) return new Response("Unknown typography system", { status: 404 });

  return new Response(buildSystemExport(system).contract, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `inline; filename="${contractFilename(system)}"`,
    },
  });
}
