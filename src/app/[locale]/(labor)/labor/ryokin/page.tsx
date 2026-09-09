import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Faq } from "@/components/shared/Faq";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { srRegParen } from "@/lib/shared/sr-registration";
import { LaborPlanPricing } from "@/components/labor/LaborPlanPricing";
import { LABOR_PRICING, formatLaborYen } from "@/lib/labor/pricing";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { LABOR_SERVICE_COPY, getLaborPlanFaqs } from "@/lib/labor/service-copy";
import { LABOR_ANCILLARY_FEES, type AncillarySection } from "@/lib/labor/ancillary-fees";
import { LABOR_SETUP_COPY, FREEE_SUPPORT_URL } from "@/lib/labor/setup-copy";
import { getLaborPriceStructuredData } from "@/lib/labor/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = LABOR_SERVICE_COPY[locale];
  return buildPageMetadata({ businessKey: "labor", title: `${c.pricingHeading}｜四葉社会保険労務士事務所`, description: c.intro, path: "/labor/ryokin", locale, absoluteTitle: true });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = LABOR_SERVICE_COPY[locale];
  const p = LABOR_PLAN_COPY[locale];
  const setup = LABOR_SETUP_COPY[locale];
  const a = LABOR_ANCILLARY_FEES[locale];
  const extra = formatLaborYen(LABOR_PRICING.recruitmentSupportFrom, locale);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLaborPriceStructuredData(locale)) }} />
    <Breadcrumb items={[{ name: c.home, href: "/labor" }, { name: c.fees }]} />
    <div className="mx-auto max-w-3xl px-4 pb-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">{c.pricingHeading}</h1>
      <p className="mt-3 leading-relaxed text-text">{c.intro}</p>
      <div className="mt-6"><LaborPlanPricing locale={locale} /></div>
      <p className="mt-3 text-sm leading-relaxed text-text">{c.units}</p>
      <p className="mt-3 text-sm leading-relaxed text-text">{c.setupDetail}</p>
      <section className="mt-8 space-y-3 rounded-xl border border-border bg-surface p-5">
        <h2 className="font-serif text-xl font-semibold text-ink">{setup.comparisonTitle}</h2>
        <p className="leading-relaxed text-text">{setup.freeeSupport}</p>
        <p className="leading-relaxed text-text">{setup.comparison}</p>
        <a href={FREEE_SUPPORT_URL} className="inline-block text-primary underline">{setup.freeeLink}</a>
      </section>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {[{ title: c.includedTitle, items: c.included }, { title: c.excludedTitle, items: c.excluded }].map(group => <section key={group.title}>
          <h2 className="font-serif text-xl font-semibold text-ink">{group.title}</h2>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-text">{group.items.map(item => <li key={item}>{item}</li>)}</ul>
        </section>)}
      </div>
      <section className="mt-10 rounded-xl border border-border p-5">
        <h2 className="font-serif text-xl font-semibold text-ink">{c.recruitmentTitle}</h2>
        <p className="mt-2 font-semibold">+{locale === "en" ? p.from : ""}{extra}{locale === "en" ? "" : p.from} ({p.tax})</p>
        <p className="mt-3 leading-relaxed text-text">{c.recruitment}</p>
        <p className="mt-3 leading-relaxed text-text">{c.recruitmentBoundary}</p>
      </section>
      <p className="mt-6 leading-relaxed text-text">{c.quote}</p>
      <div className="mt-10 space-y-8">
        {(a.sections as AncillarySection[]).map(section => <section key={section.title}>
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">{section.title}</h2>
          {section.lead && <p className="mt-2 text-sm leading-relaxed text-text">{section.lead}</p>}
          <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
            {section.rows.map(row => <div key={row.name} className="grid gap-2 p-3 text-sm sm:grid-cols-2">
              <dt className="text-text">{row.name} <span className="text-text-muted">({row.unit})</span></dt>
              <dd className="font-medium text-ink">{row.price} ({p.tax})</dd>
            </div>)}
          </dl>
          {section.note && <p className="mt-2 text-sm leading-relaxed text-text-muted">{section.note}</p>}
        </section>)}
      </div>
      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-ink">{a.notTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed">{a.notLead} {a.notLeadStrong}</p>
        <ul className="mt-3 space-y-3 text-sm leading-relaxed">{a.notRows.map(row => <li key={row.name}>{row.name} → {row.to}</li>)}</ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{a.notNote}</p>
      </section>
      <div className="mt-10"><Faq bare items={getLaborPlanFaqs(locale)} heading={c.faq} ariaLabel={c.faq} withJsonLd inLanguage={BCP47_BY_LOCALE[locale]} /></div>
      <p className="mt-6 text-sm leading-relaxed text-text-muted">{a.taxNote}</p>
      {getCrossLinks("/labor/ryokin", SR_LAUNCHED).map(cl => <CrossLinkBanner key={cl.id} link={cl} lead={a.crossLead} />)}
      <p className="mt-4"><Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">{c.flow}</Link></p>
      <aside className="mt-8 text-sm leading-relaxed text-text-muted">{a.authorTitle}: {a.authorBody1}{srRegParen(locale)}{a.authorBody2}</aside>
      <p className="mt-4 text-sm leading-relaxed text-text-muted">{c.disclaimer}</p>
    </div>
    <div className="mx-auto max-w-3xl px-4"><CtaBand businessKey="labor" /></div>
  </>;
}
