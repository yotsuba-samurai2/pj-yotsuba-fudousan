import { LaborEngagementLink } from "./LaborEngagementLink";
import type { ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { LABOR_ENGAGEMENT_COPY } from "@/lib/labor/engagement-copy";
import { LABOR_ENGAGEMENT_EXAMPLE as example, LABOR_ENGAGEMENT_ITEMS } from "@/lib/labor/engagement-pricing";
import { LABOR_PRICING, formatLaborYen } from "@/lib/labor/pricing";
import { LABOR_SETUP_COPY } from "@/lib/labor/setup-copy";

export function LaborEngagementCtas({ locale, showAdvisory = false }: { locale: LangCode; showAdvisory?: boolean }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  const contact = `${addLocalePrefix("/labor/contact", locale)}?intent=labor`;
  const placement = showAdvisory ? "hero" : "faq_end";
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    <LaborEngagementLink href={contact} locale={locale} serviceType="procedure" placement={placement} className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{c.procedureCta}</LaborEngagementLink>
    <LaborEngagementLink href={contact} locale={locale} serviceType="payroll_only" placement={placement} className="rounded-lg border border-primary bg-surface px-4 py-3 text-center text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{c.payrollCta}</LaborEngagementLink>
    {showAdvisory && <LaborEngagementLink href="#engagement-comparison" locale={locale} serviceType="advisory" placement={placement} className="self-center px-1 py-2 text-sm font-medium text-primary-dark underline underline-offset-4">{c.advisoryCta}</LaborEngagementLink>}
  </div>;
}

export function LaborStandaloneServices({ locale }: { locale: LangCode }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  return <section id="standalone-services" className="scroll-mt-24 space-y-6">
    <div className="border-l-4 border-primary pl-4">
      <h2 className="font-serif text-2xl font-semibold leading-snug text-ink">{c.procedureTitle}</h2>
      <p className="mt-3 leading-relaxed text-text">{c.procedureBody}</p>
    </div>
    <div className="rounded-2xl border border-primary/25 bg-primary-tint p-5 sm:p-6">
      <h3 className="font-serif text-xl font-semibold text-ink">{c.payrollTitle}</h3>
      <p className="mt-3 leading-relaxed text-text">{c.payrollBody}</p>
      <p className="mt-3 font-semibold text-primary-dark">{c.quoted}</p>
      <LaborEngagementLink href={`${addLocalePrefix("/labor/contact", locale)}?intent=labor`} locale={locale} serviceType="payroll_only" placement="standalone" className="mt-4 inline-block text-primary-dark underline underline-offset-4">{c.payrollCta}</LaborEngagementLink>
    </div>
  </section>;
}

type ComparisonRow = { key: string; label: string; standalone: ReactNode; advisory: ReactNode; emphasized?: boolean };

/** One server-rendered table. On narrow screens each row label sits above its two values. */
function ComparisonTable({ locale, id, caption, rows }: { locale: LangCode; id: string; caption: string; rows: ComparisonRow[] }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  return <table role="table" className="block w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-border text-left text-sm md:table md:table-fixed">
    <caption className="sr-only">{caption}</caption>
    <thead role="rowgroup" className="block md:table-header-group">
      <tr role="row" className="grid grid-cols-2 bg-primary-tint md:table-row">
        <th role="columnheader" scope="col" className="sr-only p-4 md:not-sr-only md:table-cell md:w-[34%]">{c.item}</th>
        <th role="columnheader" scope="col" id={`${id}-standalone`} className="p-3 font-semibold text-ink sm:p-4">{c.standalone}</th>
        <th role="columnheader" scope="col" id={`${id}-advisory`} className="border-l border-border p-3 font-semibold text-ink sm:p-4">{c.advisory}</th>
      </tr>
    </thead>
    <tbody role="rowgroup" className="block md:table-row-group">
      {rows.map(row => <tr role="row" key={row.key} className={`grid grid-cols-2 border-t border-border md:table-row ${row.emphasized ? "bg-primary-tint" : "bg-surface"}`}>
        <th role="rowheader" id={`${id}-${row.key}`} scope="row" className="col-span-2 border-border px-3 pt-3 font-medium leading-relaxed text-ink sm:px-4 md:border-t md:p-4">{row.label}</th>
        <td role="cell" headers={`${id}-${row.key} ${id}-standalone`} className={`min-w-0 border-border p-3 leading-relaxed sm:p-4 md:border-t ${row.emphasized ? "font-semibold text-primary-dark" : "text-text"}`}>{row.standalone}</td>
        <td role="cell" headers={`${id}-${row.key} ${id}-advisory`} className={`min-w-0 border-l border-border p-3 leading-relaxed sm:p-4 md:border-t ${row.emphasized ? "font-semibold text-primary-dark" : "text-text"}`}>{row.advisory}</td>
      </tr>)}
    </tbody>
  </table>;
}

export function LaborEngagementComparison({ locale }: { locale: LangCode }) {
  const c = LABOR_ENGAGEMENT_COPY[locale];
  const money = (amount: number) => formatLaborYen(amount, locale);
  const rows: ComparisonRow[] = [
    { key: "contract", label: c.contract, standalone: c.noContract, advisory: c.ongoingContract },
    { key: "work", label: c.initialWork, standalone: money(example.standalone), advisory: <>{money(example.advisoryWork)}<span className="mt-1 block text-xs leading-relaxed">{c.enrollmentNote}</span></> },
    { key: "setup", label: c.setup, standalone: c.notOrdered, advisory: <>{money(example.setup)}<span className="mt-2 block text-sm leading-relaxed">{LABOR_SETUP_COPY[locale].standardWaiverNote}</span></> },
    { key: "initial", label: c.initial, standalone: money(example.standalone), advisory: <><span className="inline-block">{money(example.advisoryInitial)}</span><span className="inline-block">{locale === "en" ? " (" : "（"}{money(example.conditionalInitial)}{locale === "en" ? ")" : "）"}</span><span className="mt-2 block text-xs font-normal leading-relaxed">{c.conditionalInitialNote}</span></>, emphasized: true },
    { key: "monthly", label: c.monthly, standalone: c.noMonthly, advisory: money(example.monthly), emphasized: true },
    { key: "payroll", label: c.payroll, standalone: c.payrollSeparate, advisory: c.payrollIncluded },
    { key: "procedures", label: c.procedures, standalone: c.perRequest, advisory: c.included },
    { key: "consultation", label: c.consultation, standalone: c.consultationSeparate, advisory: c.included },
    { key: "software", label: c.software, standalone: c.notIncluded, advisory: c.included },
  ];
  const breakdown: ComparisonRow[] = LABOR_ENGAGEMENT_ITEMS.map(item => ({ key: item.key, label: c.items[item.key], standalone: money(item.standalone), advisory: item.advisory === 0 ? c.included : money(item.advisory) }));
  breakdown.push(rows[2], rows[3]);
  return <section id="engagement-comparison" className="scroll-mt-24 space-y-6">
    <div>
      <p className="text-sm font-semibold text-primary-dark">{c.standard}</p>
      <h2 className="mt-2 font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">{c.comparisonTitle}</h2>
      <p className="mt-4 leading-relaxed text-text">{c.comparisonIntro}</p>
      <p className="mt-4 rounded-xl bg-primary-tint p-4 text-sm leading-relaxed text-text">{c.assumptions}</p>
    </div>
    <ComparisonTable locale={locale} id="engagement-standard" caption={c.standard} rows={rows} />
    <div className="space-y-3 text-sm leading-relaxed text-text">
      <p>{c.billingNote(money(example.advisoryWithOneMonth))}</p>
      <p>{c.setupNote(money(example.setup), money(LABOR_PRICING.initialSetupWithMigrationFrom))}</p>
      <p>{c.scopeNote}</p>
    </div>
    <details className="group space-y-4 rounded-xl border border-border p-4 sm:p-5">
      <summary className="cursor-pointer font-serif text-xl font-semibold text-ink">{c.breakdown}</summary>
      <ComparisonTable locale={locale} id="engagement-breakdown" caption={c.breakdown} rows={breakdown} />
      <p className="text-sm leading-relaxed text-text">{c.optionalDocuments}</p>
    </details>
    <div className="rounded-xl border-l-4 border-primary bg-primary-tint p-5">
      <h3 className="font-semibold text-ink">{c.minimalTitle}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text">{c.minimal(money(example.insuranceOnly), money(example.documents))}</p>
    </div>
    <aside className="space-y-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-text" aria-label={c.discountTitle}>
      <h3 className="font-semibold text-ink">{c.discountTitle}</h3>
      <p>{c.discount(money(example.setup), money(example.conditionalInitial), money(example.monthly), money(example.conditionalWithOneMonth))}</p>
      <p>{c.discountNote}</p>
    </aside>
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
