# Typography Design Library — Architecture

A private laboratory for exploring Greek and Latin typefaces and for shipping
complete, portable typography systems into future projects.

## 1. Information architecture

```
/                     Index — the two collections, recent systems, a bilingual specimen strip
/fonts                Font Explorer — search, filters, live bilingual specimens
/fonts/[slug]         Font detail — type tester, weights, glyph sets, pairings, loading snippet
/compare              Side-by-side comparison of up to four fonts (state lives in the URL)
/pairings             Pairing lab (heading × body) + curated pairings (state lives in the URL)
/systems              Typography Systems — every system, set in its own type
/systems/[id]         System detail — scale, specimens, responsive previews, guidelines, export
/systems/[id]/contract  Download: the self-contained implementation contract (Markdown)
```

## 2. Layers

```
src/typography/            Domain layer (no React, no CSS). Importable from server and client.
  types.ts                 Every shared type.
  data/
    font-ids.ts            Canonical list of FontId values (union type source).
    taxonomy.ts            Classifications, industries, roles — labels and descriptions.
    fonts.ts               Font registry: Record<FontId, FontDefinition>. Verified metadata.
    pairings.ts            Curated pairings referencing FontIds.
    specimens.ts           Greek and English specimen copy.
    systems/               One file per typography system (T001 …), plus index.ts.
  engine/
    fluid.ts               clamp() maths (px → rem, viewport or container units).
    font-support.ts        Script support helpers derived from verified subsets.
    system-fonts.ts        Which fonts/weights/styles/axes a system actually needs.
    system-css.ts          The single CSS generator used by the app *and* the exports.
    queries.ts             Lookups and filtering.
  export/
    next-font.ts           next/font/google code for a system.
    google-css-url.ts      Google Fonts CSS2 URL (non-Next projects).
    tokens-json.ts         Design-token JSON.
    contract.ts            The full Markdown contract that bundles everything above.

src/fonts/loaders.ts       next/font/google instances for every FontId (static literals,
                           as next/font requires). Applied once as CSS variables on <html>.

src/components/            Presentation. Grouped by concern: layout, ui, specimen,
                           explorer, compare, systems.
src/app/                   Routes. Thin: fetch from the registry, compose components.
```

### Separation rules

* **Font data** (`data/fonts.ts`) knows nothing about systems or presentation.
* **Typography configuration** (`data/systems/*`) references fonts only by `FontId`.
* **Presentation** never hardcodes a font family — it resolves `var(--font-<id>)`.
* The **CSS generator** (`engine/system-css.ts`) is the only place a system becomes CSS.
  In-app previews render that same CSS (scoped, with container units instead of
  viewport units), so what you see is exactly what the contract exports.

## 3. Font loading

* Every family is self-hosted at build time through `next/font/google`.
* Each loader sets `variable: '--font-<id>'`; all variables are attached to `<html>`.
* `preload: false` for specimen fonts. `@font-face` rules carry `unicode-range`, so a
  browser downloads a Greek file only when Greek glyphs are rendered and only the
  weights actually used. The two interface fonts (Commissioner, JetBrains Mono) are
  preloaded.
* next/font always emits a metric-adjusted local fallback face (Times New Roman /
  Arial) inside `--font-<id>`, with no `unicode-range` — and under Turbopack
  `adjustFontFallback: false` does not remove it. A stack such as
  `var(--font-fraunces), var(--font-literata)` would therefore render Greek in Times.
  `src/fonts/loaders.ts` also emits `--font-<id>-only` (the bare family name, read from
  next/font's `style.fontFamily`), and every stack that routes Greek glyphs to a
  companion starts from it. Exports reproduce the same mechanism (`fontOnlyCss`).
* Greek support is **derived** from the verified Google Fonts subsets — never asserted
  by hand. A Latin-only font is never rendered with Greek text without an explicit
  "shown in <alternative>" annotation.

## 4. Adding things

**A font:** add its id to `font-ids.ts`, its loader to `src/fonts/loaders.ts`, and its
definition to `data/fonts.ts`. TypeScript fails until all three agree.

**A system:** create `data/systems/tNNN-name.ts` exporting a `TypographySystem`, and
add it to `data/systems/index.ts`. Pages, previews and exports are generated.

**A pairing:** append to `data/pairings.ts`.

## 5. Portable contract

`/systems/[id]/contract` returns a Markdown document that another project (or another
Claude session) can follow without access to this repository. It contains: intent,
exact font references and licences, `next/font` code, a `<link>` alternative, the full
CSS (tokens, base element styles, utility classes), the scale table, token JSON,
measure/wrapping/Greek rules, accessibility notes and a verification checklist.
