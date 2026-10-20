import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { fontOnlyCss, fontVariableClassNames } from "@/fonts/loaders";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Type Library — Greek & Latin typography laboratory",
    template: "%s — Type Library",
  },
  description:
    "A private laboratory of curated Greek and Latin typefaces, pairings and portable typography systems.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariableClassNames}>
      <body>
        <style href="font-family-only" precedence="default">
          {fontOnlyCss}
        </style>
        <a className="sr-only" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
