import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { GH_SERVICE_COPY } from "@/lib/labor/gh-service-copy";

/** Server component: labor links and the office's offer are hidden before launch. */
export function GhOpeningSupport({ locale, srLaunched }: { locale: LangCode; srLaunched: boolean }) {
  const c = GH_SERVICE_COPY[locale];
  return (
    <section className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-primary">{c.sector}</p>
      <h2 className="font-serif text-xl font-semibold text-ink">{c.stagesTitle}</h2>
      <div className="space-y-2">
        <h3 className="font-semibold text-ink">{c.beforeTitle}</h3>
        <p className="leading-relaxed text-text">{c.before}</p>
      </div>
      {srLaunched ? <div className="space-y-3 border-t border-border pt-4">
        <h3 className="font-semibold text-ink">{c.afterTitle}</h3>
        <p className="leading-relaxed text-text">{c.after}</p>
        <ul className="space-y-2 text-sm">
          <li><Link href={addLocalePrefix("/labor/services/kaigo-roumu", locale)} className="text-primary underline">{c.careLink}</Link></li>
          <li><Link href={addLocalePrefix("/labor/services/shogu-kaizen", locale)} className="text-primary underline">{c.treatmentLink}</Link></li>
        </ul>
        <p className="text-sm leading-relaxed text-text">{c.separate}</p>
      </div> : null}
      <p className="text-sm leading-relaxed text-text-muted">{c.judgment}</p>
    </section>
  );
}
