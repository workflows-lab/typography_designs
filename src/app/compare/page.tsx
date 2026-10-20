import type { Metadata } from "next";
import { Suspense } from "react";
import { FontCompare } from "@/components/compare/FontCompare";
import { Container, PageHeader } from "@/components/layout/Page";
import styles from "../tools.module.css";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare up to four typefaces side by side in Greek and English.",
};

export default function ComparePage() {
  return (
    <>
      <PageHeader
        kicker="Tool · Compare"
        title="Side by side, same words."
        intro={
          <p>
            Up to four typefaces with identical text, size and weight. The selection lives in the URL, so a
            comparison can be bookmarked or shared.
          </p>
        }
      />
      <Container>
        <Suspense fallback={<p className={styles.loading}>Loading comparison…</p>}>
          <FontCompare />
        </Suspense>
      </Container>
    </>
  );
}
