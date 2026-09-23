import { LaborEngagementLink } from "./LaborEngagementLink";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { LABOR_ENGAGEMENT_COPY } from "@/lib/labor/engagement-copy";

export function LaborEngagementCtas({ locale, showAdvisory = false }: { locale: LangCode; showAdvisory?: boolean }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  const contact = `${addLocalePrefix("/labor/contact", locale)}?intent=labor`;
  const placement = showAdvisory ? "hero" : "faq_end";
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    <LaborEngagementLink href={contact} locale={locale} serviceType="procedure" placement={placement} className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{c.procedureCta}</LaborEngagementLink>
    <LaborEngagementLink href={contact} locale={locale} serviceType="payroll_only" placement={placement} className="rounded-lg border border-primary bg-surface px-4 py-3 text-center text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{c.payrollCta}</LaborEngagementLink>
    {showAdvisory && <LaborEngagementLink href="#advisory-plan" locale={locale} serviceType="advisory" placement={placement} className="self-center px-1 py-2 text-sm font-medium text-primary-dark underline underline-offset-4">{c.advisoryCta}</LaborEngagementLink>}
  </div>;
}

export function LaborStandaloneServices({ locale }: { locale: LangCode }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  return <section id="standalone-services" className="scroll-mt-24 space-y-6">
    <div className="border-l-4 border-primary pl-4">
      <h2 className="font-serif text-2xl font-semibold leading-snug text-ink">{c.procedureTitle}</h2>
      <p className="mt-3 leading-relaxed text-text">{c.procedureBody}</p>
    </div>
    <div id="payroll" className="scroll-mt-24 rounded-2xl border border-primary/25 bg-primary-tint p-5 sm:p-6">
      <h3 className="font-serif text-xl font-semibold text-ink">{c.payrollTitle}</h3>
      <p className="mt-3 leading-relaxed text-text">{c.payrollBody}</p>
      <p className="mt-3 font-semibold text-primary-dark">{c.quoted}</p>
      <LaborEngagementLink href={`${addLocalePrefix("/labor/contact", locale)}?intent=labor`} locale={locale} serviceType="payroll_only" placement="standalone" className="mt-4 inline-block text-primary-dark underline underline-offset-4">{c.payrollCta}</LaborEngagementLink>
    </div>
  </section>;
}

export function LaborSharedWorkflow({ locale }: { locale: LangCode }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  return <section className="space-y-5">
    <h2 className="font-serif text-2xl font-semibold leading-snug text-ink">{c.workflowTitle}</h2>
    <p className="leading-relaxed text-text">{c.workflowBody}</p>
    <ol className="grid gap-4 md:grid-cols-3">
      {c.steps.map((step, index) => <li key={step.title} className="rounded-xl border border-border bg-surface p-5">
        <span aria-hidden="true" className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-sm font-semibold text-primary-dark">{index + 1}</span>
        <h3 className="font-semibold leading-relaxed text-ink">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text">{step.body}</p>
      </li>)}
    </ol>
    <p className="text-sm leading-relaxed text-text">{c.procedureWorkflow}</p>
  </section>;
}
