// C10 → designation support; C13 → property support. Both retain separate engagements.
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { LaborPlanPricing, LaborPlanResponsibility } from "@/components/labor/LaborPlanPricing";
import { GH_SERVICE_COPY } from "@/lib/labor/gh-service-copy";
import { KAIGO_SERVICE_COPY } from "@/lib/labor/kaigo-service-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = KAIGO_SERVICE_COPY[locale];
  return buildPageMetadata({
    businessKey: "labor", title: `${c.title}｜四葉社会保険労務士事務所`,
    description: c.description, path: "/labor/services/kaigo-roumu",
    keywords: ["介護 事業所 社労士 顧問", "障害福祉 労務管理", "人員配置基準 労務", "グループホーム 社労士"],
    locale, absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = KAIGO_SERVICE_COPY[locale];
  const g = GH_SERVICE_COPY[locale];
  return (
    <LaborServicePage
      slug="kaigo-roumu" crumbLabel={c.title} serviceName={c.title} heroAlt={c.heroAlt} h1={c.title}
      lead={<div className="space-y-3"><p>{c.lead}</p><p>{g.qualification}</p><LaborPlanResponsibility locale={locale} /><Placeholder reason="浦松＝対応範囲・顧問形態" /></div>}
      internalLinks={[
        { href: "/labor/ryokin", label: g.planLink },
        { href: "/labor/nagare", label: g.flowLink },
        { href: "/labor/services/shogu-kaizen", label: g.treatmentLink },
        { href: "/labor/services/gaikokujin-koyo", label: g.foreignLink },
      ]}
      crossLinkLead={c.beforeOpening}
    >
      <div className="space-y-4">
        <p className="font-semibold text-primary">{g.sector}</p>
        <p className="leading-relaxed text-text">{g.planIntro}</p>
        <p className="text-sm leading-relaxed text-text">{g.setupDetail}</p>
        <LaborPlanPricing locale={locale} />
        <p className="text-sm leading-relaxed text-text-muted">{g.bandReason}</p>
        <p className="leading-relaxed text-text">{g.routine}</p>
        <p className="leading-relaxed text-text">{g.recruitment}</p>
        <p className="leading-relaxed text-text">{g.excluded}</p>
      </div>
      <div>
        <LaborH2>{c.servicesTitle}</LaborH2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-text">{c.services.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-3 leading-relaxed text-text">{c.specialistScope}</p>
        <p className="mt-3"><Link href={addLocalePrefix("/labor/services/shogu-kaizen", locale)} className="text-primary underline">{g.treatmentLink}</Link></p>
      </div>
      <div>
        <LaborH2>{c.employmentTitle}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.employmentIntro}</p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-text">{c.employmentChecks.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-3"><Link href={addLocalePrefix("/labor/services/jinin-kijun-roumu", locale)} className="text-primary underline">{c.staffingLink}</Link></p>
      </div>
      <div>
        <LaborH2>{c.nightTitle}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.nightIntro}</p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-text">{c.nightItems.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.nightNote}</p>
      </div>
      <div>
        <LaborH2>{c.openingTitle}</LaborH2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr>{c.openingHeadings.map(heading => <th key={heading} scope="col" className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">{heading}</th>)}</tr></thead>
            <tbody>{c.openingRows.map(row => <tr key={row[0]}><th scope="row" className="border border-border px-3 py-2 text-left font-medium text-ink">{row[0]}</th>{row.slice(1).map(cell => <td key={cell} className="border border-border px-3 py-2 text-text">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <Placeholder reason="浦松＝届出期限日数の一次確認（雇用保険・社会保険・労働保険の各届出）。退避した文：『※届出の具体的な期限日数は、本ページ作成時点で個別に一次確認していません（未検証）。』" />
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.deadlineNote}</p>
      </div>
      <div>
        <LaborH2>{c.beforeOpeningTitle}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.beforeOpening}</p>
        <p className="mt-3 leading-relaxed text-text">{g.separate}</p>
      </div>
      <div>
        <LaborH2>{g.sourceHeading}</LaborH2>
        <p className="mt-3"><a href="https://www.mhlw.go.jp/web/t_doc?dataId=73022000" className="text-primary underline">{locale === "en" ? "Labor Standards Act — MHLW (Japanese)" : "労働基準法（厚生労働省）"}</a></p>
        <p className="mt-3 leading-relaxed text-text-muted">{g.judgment}</p>
      </div>
    </LaborServicePage>
  );
}
