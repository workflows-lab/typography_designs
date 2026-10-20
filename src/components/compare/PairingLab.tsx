"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubstitutionNote } from "@/components/specimen/ScriptSupport";
import { RangeField, Segmented } from "@/components/ui/controls";
import { cssVars } from "@/lib/css-vars";
import { FONTS } from "@/typography/data/fonts";
import { isFontId } from "@/typography/data/font-ids";
import { PAIRINGS } from "@/typography/data/pairings";
import { LANGUAGES } from "@/typography/data/specimens";
import { nearestWeight, supportsGreek } from "@/typography/engine/font-support";
import { greekSubstitute, specimenFamily } from "@/typography/engine/specimen";
import type { FontId, Language } from "@/typography/types";
import { FontSelect } from "./FontSelect";
import styles from "./compare.module.css";

const ARTICLE: Record<Language, { kicker: string; title: string; lead: string; body: string[]; caption: string }> = {
  en: {
    kicker: "Field notes · Typography",
    title: "A good pairing has one voice and one listener.",
    lead: "The heading face speaks; the text face listens. When both try to speak, the page becomes noise.",
    body: [
      "Look for a shared skeleton — similar proportions, x-height or rhythm — and a clear difference in role: contrast, weight or texture. Two serifs can work together; two characterful faces rarely do.",
      "Test with real copy in every language you publish. Greek words run longer and carry accents above the capitals' height, so check line breaks and leading as well as the overall colour of the page.",
    ],
    caption: "Set at 18px body with 1.6 line-height.",
  },
  el: {
    kicker: "Σημειώσεις · Τυπογραφία",
    title: "Ένας καλός συνδυασμός έχει μία φωνή και έναν ακροατή.",
    lead: "Η γραμματοσειρά των τίτλων μιλά· η γραμματοσειρά του κειμένου ακούει. Όταν μιλούν και οι δύο, η σελίδα γίνεται θόρυβος.",
    body: [
      "Αναζητήστε έναν κοινό σκελετό — παρόμοιες αναλογίες, ύψος πεζών ή ρυθμό — και μια σαφή διαφορά ρόλου: αντίθεση, βάρος ή υφή. Δύο πατούρες μπορούν να συνεργαστούν· δύο γραμματοσειρές με έντονο χαρακτήρα σπάνια.",
      "Δοκιμάστε με πραγματικό κείμενο σε κάθε γλώσσα που δημοσιεύετε. Οι ελληνικές λέξεις είναι μεγαλύτερες και φέρουν τόνους, οπότε ελέγξτε τις αλλαγές γραμμής και το διάστιχο, όπως και το συνολικό χρώμα της σελίδας.",
    ],
    caption: "Κείμενο στα 18px με διάστιχο 1,6.",
  },
};

function pick(param: string | null, fallback: FontId): FontId {
  return param && isFontId(param) ? param : fallback;
}

export function PairingLab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const heading = pick(searchParams.get("heading"), PAIRINGS[0].heading);
  const body = pick(searchParams.get("body"), PAIRINGS[0].body);
  const curated = PAIRINGS.find((p) => p.heading === heading && p.body === body);

  const [lang, setLang] = useState<Language>("en");
  // A manual weight applies only to the pairing it was set on; new pairings start from their default.
  const pairKey = `${heading}/${body}`;
  const [weightOverride, setWeightOverride] = useState<{ key: string; value: number } | null>(null);
  const headingWeight = weightOverride?.key === pairKey ? weightOverride.value : (curated?.headingWeight ?? 500);
  const setHeadingWeight = (value: number) => setWeightOverride({ key: pairKey, value });
  const [bodySize, setBodySize] = useState(18);

  const headingFont = FONTS[heading];
  const bodyFont = FONTS[body];
  const a = ARTICLE[lang];

  function setParam(key: "heading" | "body", value: FontId | "") {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const missingGreek = lang === "el" ? [headingFont, bodyFont].filter((f) => !supportsGreek(f)) : [];

  return (
    <div className={styles.lab}>
      <div className={styles.labControls}>
        <FontSelect label="Heading font" value={heading} onChange={(v) => setParam("heading", v)} />
        <FontSelect label="Body font" value={body} onChange={(v) => setParam("body", v)} />
        <Segmented
          legend="Language"
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "el", label: <span lang="el">Ελληνικά</span> },
          ]}
        />
        <RangeField label="Heading weight (nearest)" value={headingWeight} min={100} max={900} step={100} onChange={setHeadingWeight} />
        <RangeField label="Body size" value={bodySize} min={14} max={24} format={(v) => `${v}px`} onChange={setBodySize} />
        <p className={styles.labLinks}>
          <Link href={`/compare?fonts=${heading},${body}`}>Compare these fonts →</Link>
        </p>
      </div>

      <article
        className={styles.article}
        lang={LANGUAGES[lang].htmlLang}
        style={cssVars({
          "--heading-family": specimenFamily(headingFont),
          "--heading-weight": nearestWeight(headingFont, headingWeight),
          "--body-family": specimenFamily(bodyFont),
          "--body-weight": nearestWeight(bodyFont, 400),
          "--body-size": `${bodySize}px`,
        })}
      >
        <p className={styles.articleKicker}>{a.kicker}</p>
        <h2 className={styles.articleTitle}>{a.title}</h2>
        <p className={styles.articleLead}>{a.lead}</p>
        {a.body.map((p) => (
          <p key={p.slice(0, 20)} className={styles.articleBody}>
            {p}
          </p>
        ))}
        <p className={styles.articleCaption}>
          {headingFont.family} + {bodyFont.family} · {a.caption}
        </p>
        {missingGreek.map((f) => (
          <SubstitutionNote key={f.id} font={f} substitute={greekSubstitute(f)} />
        ))}
      </article>

      <aside className={styles.labNote} aria-label="About this pairing">
        {curated ? (
          <>
            <p className={styles.labNoteTitle}>Curated · {curated.title}</p>
            <p>{curated.rationale}</p>
          </>
        ) : (
          <>
            <p className={styles.labNoteTitle}>Experimental pairing</p>
            <p>
              Not in the curated list. Judge it on contrast of role, shared proportions and how both scripts sit
              together.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
