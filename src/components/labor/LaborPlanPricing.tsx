import type { LangCode } from "@/config/languages";
import { LABOR_PRICING, formatLaborYen } from "@/lib/labor/pricing";
export { formatLaborYen } from "@/lib/labor/pricing";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { LABOR_SETUP_COPY } from "@/lib/labor/setup-copy";

/** Visible responsibility boundary immediately below the Hero. */
export function LaborPlanResponsibility({ locale }: { locale: LangCode }) {
  return <p className="text-base leading-relaxed text-text">{LABOR_PLAN_COPY[locale].responsibility}</p>;
}

/** Server-rendered: recurring and both setup fees remain visible together. */
export function LaborPlanPriceSummary({ locale, emphasizePayroll = false }: { locale: LangCode; emphasizePayroll?: boolean }) {
  const c = LABOR_PLAN_COPY[locale];
  const setup = LABOR_SETUP_COPY[locale];
  const from = (amount: number) => locale === "en"
    ? `${c.from}${formatLaborYen(amount, locale)}`
    : `${formatLaborYen(amount, locale)}${c.from}`;
  return (
    <div className="space-y-4">
      {emphasizePayroll && <div className="space-y-3 rounded-xl border border-primary/30 bg-surface p-5 sm:p-6">
        <p className="font-serif text-2xl font-bold leading-snug text-primary sm:text-4xl">
          {c.payrollHeadline(formatLaborYen(LABOR_PRICING.bands[0].monthly, locale)).map((part, index) => <span key={index} className={`inline-block max-w-full${locale === "en" && index === 0 ? " mr-2" : ""}`}>{part}</span>)}
        </p>
        <p className="text-sm font-medium text-ink">{c.payrollEligibility}</p>
        <p className="text-base font-semibold leading-relaxed text-ink sm:text-lg">{c.payrollIncluded}</p>
        <p className="text-base font-medium leading-relaxed text-primary">{c.lineClockBenefit}</p>
      </div>}
      <dl className="grid gap-4 rounded-xl border border-border bg-surface p-4 md:grid-cols-3">
        <div>
          <dt className="text-sm text-text">{c.monthly} · {c.people} 1–3</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">{from(LABOR_PRICING.bands[0].monthly)} <span className="text-sm font-normal">({c.tax})</span></dd>
        </div>
        <div>
          <dt className="text-sm text-text">{c.setup} · {setup.standardTitle}</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">{formatLaborYen(LABOR_PRICING.initialSetupStandard, locale)} <span className="text-sm font-normal">({c.tax})</span></dd>
          <dd className="mt-2 text-sm leading-relaxed text-text">{setup.standardCondition}</dd>
        </div>
        <div>
          <dt className="text-sm text-text">{c.setup} · {setup.migrationTitle}</dt>
          <dd className="mt-1 text-lg font-semibold text-ink">{from(LABOR_PRICING.initialSetupWithMigrationFrom)} <span className="text-sm font-normal">({c.tax})</span></dd>
          <dd className="mt-2 text-sm leading-relaxed text-text">{setup.migrationCondition}</dd>
        </div>
      </dl>
    </div>
  );
}

export function LaborPlanResponsibilities({ locale }: { locale: LangCode }) {
  const c = LABOR_PLAN_COPY[locale];
  return <div className="grid gap-3 md:grid-cols-3">
    {c.scopeHeadings.map((heading, column) => <section key={heading} className="rounded-xl border border-border p-4">
      <h3 className="font-semibold text-ink">{heading}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
        {c.scopeRows.map((row, index) => row[column] === "—" ? null : <li key={index}>{row[column]}</li>)}
      </ul>
    </section>)}
  </div>;
}

/** Shared by the pricing page and service landing pages. */
export function LaborPlanPricing({ locale }: { locale: LangCode }) {
  const c = LABOR_PLAN_COPY[locale];
  const setup = LABOR_SETUP_COPY[locale];
  const lastBand = LABOR_PRICING.bands[LABOR_PRICING.bands.length - 1];
  return (
    <section className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-ink">{c.name}</h2>
      <LaborPlanPriceSummary locale={locale} />
      <p className="leading-relaxed text-text">{c.system}</p>
      <div>
        <h3 className="font-semibold text-ink">{setup.heading}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {[{ title: setup.standardTitle, items: setup.standardItems }, { title: setup.migrationTitle, items: setup.migrationItems }].map(tier => <section key={tier.title} className="rounded-xl border border-border p-4">
            <h4 className="font-semibold text-ink">{tier.title}</h4>
            <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-text">
              {tier.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </section>)}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text">{setup.quoteNote}</p>
      </div>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="mb-2 text-left font-semibold text-ink">{c.monthly} ({c.tax})</caption>
        <thead><tr>
          <th scope="col" className="border border-border p-3">{c.people}</th>
          <th scope="col" className="border border-border p-3">{c.monthly}</th>
        </tr></thead>
        <tbody>
          {LABOR_PRICING.bands.map((band) => <tr key={band.min}>
            <th scope="row" className="border border-border p-3 font-normal">{band.min}–{band.max}</th>
            <td className="border border-border p-3">{formatLaborYen(band.monthly, locale)}</td>
          </tr>)}
          <tr>
            <th scope="row" className="border border-border p-3 font-normal">{lastBand.max + 1}+</th>
            <td className="border border-border p-3">{formatLaborYen(lastBand.monthly, locale)} + {c.additional(lastBand.max, formatLaborYen(LABOR_PRICING.additionalRecipientFee, locale))}</td>
          </tr>
        </tbody>
      </table>
      <LaborPlanResponsibilities locale={locale} />
      <LaborPlanResponsibility locale={locale} />
      <p className="text-sm leading-relaxed text-text">{c.separate}</p>
    </section>
  );
}
