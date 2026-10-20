"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/controls";
import type { Language, TypographySystem } from "@/typography/types";
import { Composition } from "./Composition";
import { ScaledFrame } from "./ScaledFrame";
import styles from "./preview.module.css";

type Device = "both" | "desktop" | "tablet" | "mobile";

const DEVICES = {
  desktop: { label: "Desktop", width: 1280, height: 820 },
  tablet: { label: "Tablet", width: 834, height: 1112 },
  mobile: { label: "Mobile", width: 390, height: 844 },
} as const;

export function SystemPreview({ system }: { system: TypographySystem }) {
  const [lang, setLang] = useState<Language>("en");
  const [device, setDevice] = useState<Device>("both");

  const frame = (key: keyof typeof DEVICES) => (
    <ScaledFrame key={key} label={DEVICES[key].label} width={DEVICES[key].width} height={DEVICES[key].height}>
      <Composition system={system} lang={lang} />
    </ScaledFrame>
  );

  return (
    <div className={styles.preview}>
      <div className={styles.controls}>
        <Segmented
          legend="Content language"
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "English" },
            { value: "el", label: <span lang="el">Ελληνικά</span> },
          ]}
        />
        <Segmented
          legend="Device"
          value={device}
          onChange={setDevice}
          options={[
            { value: "both", label: "Desktop + Mobile" },
            { value: "desktop", label: "Desktop" },
            { value: "tablet", label: "Tablet" },
            { value: "mobile", label: "Mobile" },
          ]}
        />
        <p className={styles.note}>
          Frames render at true device width; fluid sizes resolve against the frame, exactly as against a viewport.
        </p>
      </div>
      {device === "both" ? (
        <div className={styles.both}>
          {frame("desktop")}
          {frame("mobile")}
        </div>
      ) : (
        <div className={styles.single} data-device={device}>
          {frame(device)}
        </div>
      )}
    </div>
  );
}
