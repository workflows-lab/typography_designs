import Link from "next/link";
import { PageHeader } from "@/components/layout/Page";

export default function NotFound() {
  return (
    <PageHeader
      kicker="404 · Not found"
      title="No such specimen."
      intro={
        <p>
          The typeface or system you asked for is not in the library. Browse the <Link href="/fonts">fonts</Link>{" "}
          or the <Link href="/systems">systems</Link>.
        </p>
      }
    />
  );
}
