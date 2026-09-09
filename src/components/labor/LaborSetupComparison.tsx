import type { LangCode } from "@/config/languages";
import { LABOR_SETUP_COPY, FREEE_SUPPORT_URL } from "@/lib/labor/setup-copy";

/** Keep the setup comparison and official destination consistent across both pages. */
export function LaborSetupComparison({ locale, headingLevel = "h2" }: { locale: LangCode; headingLevel?: "h2" | "h3" }) {
  const setup = LABOR_SETUP_COPY[locale];
  const Heading = headingLevel;
  return <section className="space-y-3 rounded-xl border border-border bg-surface p-5">
    <Heading className="font-serif text-xl font-semibold text-ink">{setup.comparisonTitle}</Heading>
    <p className="leading-relaxed text-text">{setup.freeeSupport}</p>
    <p className="leading-relaxed text-text">{setup.comparison}</p>
    <a href={FREEE_SUPPORT_URL} className="inline-block text-primary underline">{setup.freeeLink}</a>
  </section>;
}
