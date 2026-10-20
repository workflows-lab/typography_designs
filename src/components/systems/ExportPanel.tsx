"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { CopyButton, DownloadButton } from "@/components/ui/CopyButton";
import styles from "./system.module.css";

export interface ExportFile {
  key: string;
  label: string;
  filename: string;
  mime: string;
  content: string;
  description: string;
}

/** Accessible tabs over the generated implementation files. */
export function ExportPanel({ files }: { files: ExportFile[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (e.key === "Home" || e.key === "End" || delta) {
      e.preventDefault();
      const next =
        e.key === "Home" ? 0 : e.key === "End" ? files.length - 1 : (active + delta + files.length) % files.length;
      setActive(next);
      tabs.current[next]?.focus();
    }
  }

  const file = files[active];

  return (
    <div className={styles.exportPanel}>
      <div role="tablist" aria-label="Implementation files" className={styles.tabs} onKeyDown={onKeyDown}>
        {files.map((f, i) => (
          <button
            key={f.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${f.key}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${file.key}`} className={styles.tabPanel}>
        <div className={styles.fileBar}>
          <p className={styles.fileInfo}>
            <code>{file.filename}</code> — {file.description}
          </p>
          <div className={styles.fileActions}>
            <CopyButton value={file.content} subject={file.filename} />
            <DownloadButton filename={file.filename} content={file.content} mime={file.mime} />
          </div>
        </div>
        <pre className={styles.code} tabIndex={0} aria-label={`${file.filename} source`}>
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
}
