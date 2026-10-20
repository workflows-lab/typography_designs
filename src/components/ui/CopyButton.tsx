"use client";

import { useRef, useState } from "react";
import styles from "./ui.module.css";

type Status = "idle" | "copied" | "failed";

interface CopyButtonProps {
  value: string;
  label?: string;
  /** Describes what is copied, for screen readers (e.g. "CSS tokens"). */
  subject?: string;
}

export function CopyButton({ value, label = "Copy", subject }: CopyButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <button type="button" className={styles.button} data-status={status} onClick={copy}>
      <span aria-hidden={status !== "idle"}>{label}</span>
      {subject ? <span className="sr-only"> {subject}</span> : null}
      <span className={styles.status} role="status" aria-live="polite">
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : ""}
      </span>
    </button>
  );
}

interface DownloadButtonProps {
  filename: string;
  content: string;
  mime?: string;
  label?: string;
}

export function DownloadButton({ filename, content, mime = "text/plain", label = "Download" }: DownloadButtonProps) {
  function download() {
    const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" className={styles.button} onClick={download}>
      {label} <span className={styles.buttonMeta}>{filename}</span>
    </button>
  );
}
