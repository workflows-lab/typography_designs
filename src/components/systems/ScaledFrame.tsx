"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cssVars } from "@/lib/css-vars";
import styles from "./preview.module.css";

interface ScaledFrameProps {
  label: string;
  /** Logical device width in px — the container width the composition responds to. */
  width: number;
  height: number;
  children: ReactNode;
}

/**
 * Renders children in a container of the exact logical width (so container-unit fluid
 * type resolves as it would on that device), then scales it down visually to fit.
 */
export function ScaledFrame({ label, width, height, children }: ScaledFrameProps) {
  const outer = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<number | null>(null);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = available ? Math.min(1, available / width) : 1;

  return (
    <figure className={styles.frame}>
      <figcaption className={styles.frameCaption}>
        <span>{label}</span>
        <span>
          {width} × {height}
          {scale < 1 ? ` · shown at ${Math.round(scale * 100)}%` : ""}
        </span>
      </figcaption>
      <div
        ref={outer}
        className={styles.viewport}
        data-ready={available !== null}
        style={cssVars({ "--frame-w": `${width}px`, "--frame-h": `${height}px`, "--frame-scale": scale })}
      >
        <div className={styles.device}>
          <div className={styles.screen} tabIndex={0} role="region" aria-label={`${label} preview, scrollable`}>
            {children}
          </div>
        </div>
      </div>
    </figure>
  );
}
