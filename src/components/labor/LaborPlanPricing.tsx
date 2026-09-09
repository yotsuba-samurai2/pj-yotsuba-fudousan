import type { LangCode } from "@/config/languages";
import { LABOR_PRICING, formatLaborYen } from "@/lib/labor/pricing";
export { formatLaborYen } from "@/lib/labor/pricing";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";

/** Visible responsibility boundary immediately below the Hero. */
export function LaborPlanResponsibility({ locale }: { locale: LangCode }) {
  return <p className="text-base leading-relaxed text-text">{LABOR_PLAN_COPY[locale].responsibility}</p>;
}

/** Server-rendered: both fees remain visible without tabs or disclosure controls. */
export function LaborPlanPriceSummary({ locale }: { locale: LangCode }) {
  const c = LABOR_PLAN_COPY[locale];
  const from = (amount: number) => locale === "en"
    ? `${c.from}${formatLaborYen(amount, locale)}`
    : `${formatLaborYen(amount, locale)}${c.from}`;
  return (
    <dl className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
      <div>
        <dt className="text-sm text-text">{c.monthly} · {c.people} 1–3</dt>
        <dd className="mt-1 text-lg font-semibold text-ink">{from(LABOR_PRICING.bands[0].monthly)} <span className="text-sm font-normal">({c.tax})</span></dd>
      </div>
      <div>
        <dt className="text-sm text-text">{c.setup}</dt>
        <dd className="mt-1 text-lg font-semibold text-ink">{from(LABOR_PRICING.initialSetupFrom)} <span className="text-sm font-normal">({c.tax})</span></dd>
      </div>
    </dl>
  );
}

/** V10 fee table and responsibility boundary shared by the pricing page. */
export function LaborPlanPricing({ locale }: { locale: LangCode }) {
  const c = LABOR_PLAN_COPY[locale];
  const lastBand = LABOR_PRICING.bands[LABOR_PRICING.bands.length - 1];
  return (
    <section className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-ink">{c.name}</h2>
      <LaborPlanPriceSummary locale={locale} />
      <p className="leading-relaxed text-text">{c.system}</p>
      <div>
        <h3 className="font-semibold text-ink">{c.setupHeading}</h3>
        <ul className="mt-2 grid list-inside list-disc gap-2 text-text sm:grid-cols-2">
          {c.setupItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
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
            <th scope="row" className="border border-border p-3 font-normal">{lastBand.max + 1}–{LABOR_PRICING.individualQuoteFrom - 1}</th>
            <td className="border border-border p-3">{formatLaborYen(lastBand.monthly, locale)} + {c.additional(lastBand.max, formatLaborYen(LABOR_PRICING.additionalRecipientFee, locale))}</td>
          </tr>
          <tr>
            <th scope="row" className="border border-border p-3 font-normal">{LABOR_PRICING.individualQuoteFrom}+</th>
            <td className="border border-border p-3">{c.individualQuote}</td>
          </tr>
        </tbody>
      </table>
      <div className="grid gap-3 md:grid-cols-3">
        {c.scopeHeadings.map((heading, column) => <section key={heading} className="rounded-xl border border-border p-4">
          <h3 className="font-semibold text-ink">{heading}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {c.scopeRows.map((row, index) => row[column] === "—" ? null : <li key={index}>{row[column]}</li>)}
          </ul>
        </section>)}
      </div>
      <LaborPlanResponsibility locale={locale} />
      <p className="text-sm leading-relaxed text-text">{c.separate}</p>
    </section>
  );
}
