# Type Library — Greek & Latin typography laboratory

A private design tool for exploring Greek and Latin typefaces, testing pairings and
exporting complete, portable typography systems into future Next.js projects.

- **Font Explorer** (`/fonts`) — 31 curated families (21 with Greek, 10 Latin-only with
  recommended Greek alternatives). Live bilingual specimens, filters by script,
  classification, role and industry, a type tester with variable axes, weight ladders,
  glyph sets and next/font snippets.
- **Typography Systems** (`/systems`) — eight systems, `T001`–`T008`, each with fonts,
  a fluid `clamp()` scale for 13 text styles, rhythm, measure, Greek rules,
  accessibility checks, desktop/mobile page previews and an exportable contract.
- **Compare** (`/compare`) and **Pairings** (`/pairings`) — side-by-side comparison and a
  heading × body pairing lab. Both keep their state in the URL.

## Reusing a system in another project

Open `/systems/t00X`, then **Download contract** (or fetch `/systems/t00X/contract`).
The Markdown contract is self-contained: font references and licences, `next/font`
code, the full CSS, token JSON, the scale table, Greek and accessibility rules and a
verification checklist. Give it to the new project (or to Claude) with the instruction
"implement typography system T00X exactly as specified".

System IDs are permanent. Never renumber or reuse one.

## Development

```bash
pnpm install
pnpm dev        # local development
pnpm lint
pnpm exec tsc --noEmit
pnpm build      # downloads and self-hosts all fonts (needs network access to Google Fonts)
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). In short:

- `src/typography/` — typed domain layer: font registry, pairings, systems, CSS
  generator, audits and exporters. No React.
- `src/fonts/loaders.ts` — one `next/font/google` loader per registry font.
- `src/components/` and `src/app/` — presentation only.

Adding a font: add its id to `src/typography/data/font-ids.ts`, its loader to
`src/fonts/loaders.ts`, and its definition to `src/typography/data/fonts.ts` (TypeScript
enforces all three). Adding a system: create `src/typography/data/systems/tNNN-*.ts`
and register it in `src/typography/data/systems/index.ts`.
