"use client";

import { useState, type ReactNode } from "react";
import { Segmented } from "@/components/ui/controls";
import type { Language } from "@/typography/types";
import styles from "./lang-switch.module.css";

/**
 * Server-rendered children carry both languages, marked with `data-lang-variant`.
 * This switch only toggles which variant is visible — no re-render of specimens.
 */
export function LangSwitch({ children, legend = "Specimen language" }: { children: ReactNode; legend?: string }) {
  const [lang, setLang] = useState<Language>("en");
  return (
    <div className={styles.scope} data-show={lang}>
      <div className={styles.bar}>
        <Segmented
          legend={legend}
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "el", label: <span lang="el">Ελληνικά</span> },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
