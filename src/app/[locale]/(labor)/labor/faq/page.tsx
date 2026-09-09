import { getAdditionalLaborFaqs } from "@/lib/labor/additional-faqs";
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import { LABOR_SERVICE_COPY, getLaborPlanFaqs } from "@/lib/labor/service-copy";
import { LABOR_ANCILLARY_FEES } from "@/lib/labor/ancillary-fees";
import { srRegParen } from "@/lib/shared/sr-registration";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = LABOR_SERVICE_COPY[locale];
  return buildPageMetadata({ businessKey: "labor", title: `${c.faq}｜四葉社会保険労務士事務所`, description: c.intro, path: "/labor/faq", locale, absoluteTitle: true });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = LABOR_SERVICE_COPY[locale];
  const a = LABOR_ANCILLARY_FEES[locale];
  return <>
    <Breadcrumb items={[{ name: c.home, href: "/labor" }, { name: c.faq }]} />
    <main className="mx-auto max-w-3xl px-4 pb-8">
      <h1 className="font-serif text-3xl font-semibold text-ink">{c.faq}</h1>
      <div className="mt-6"><Faq items={[...getLaborPlanFaqs(locale), ...getAdditionalLaborFaqs(locale)]} bare withJsonLd ariaLabel={c.faq} inLanguage={BCP47_BY_LOCALE[locale]} /></div>
      <p className="mt-4"><Link className="text-primary underline" href={addLocalePrefix("/labor/ryokin",locale)}>{c.fees}</Link></p>
      <aside className="mt-8 text-sm leading-relaxed text-text-muted">{a.authorTitle}: {a.authorBody1}{srRegParen(locale)}{a.authorBody2}</aside>
      <p className="mt-4 text-sm text-text-muted">{c.disclaimer}</p>
      <CtaBand businessKey="labor" />
    </main>
  </>;
}
