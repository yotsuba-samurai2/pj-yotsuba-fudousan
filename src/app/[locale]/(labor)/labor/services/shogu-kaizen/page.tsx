// C10 links to the separate administrative scrivener engagement.
// Add-on rates and unconfirmed service categories are not estimated here.
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { LaborPlanPriceSummary, LaborPlanResponsibility } from "@/components/labor/LaborPlanPricing";
import { GH_SERVICE_COPY } from "@/lib/labor/gh-service-copy";
import { SHOGU_SERVICE_COPY } from "@/lib/labor/shogu-service-copy";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = SHOGU_SERVICE_COPY[locale];
  return buildPageMetadata({
    businessKey: "labor", title: `${c.title}｜四葉社会保険労務士事務所`, description: c.description,
    path: "/labor/services/shogu-kaizen", keywords: ["処遇改善加算 社労士", "処遇改善加算 届出 依頼", "障害福祉 処遇改善加算"],
    locale, absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = SHOGU_SERVICE_COPY[locale];
  const g = GH_SERVICE_COPY[locale];
  return (
    <LaborServicePage
      slug="shogu-kaizen" crumbLabel={c.title} serviceName={c.title} heroAlt={c.heroAlt} h1={c.title}
      lead={<div className="space-y-3"><p>{c.lead}</p><LaborPlanResponsibility locale={locale} /><Placeholder reason="浦松＝対応する加算区分・サービス種別" /></div>}
      internalLinks={[
        { href: "/labor/ryokin", label: g.planLink },
        { href: "/labor/nagare", label: g.flowLink },
        { href: "/labor/services/kaigo-roumu", label: g.careLink },
      ]}
      crossLinkLead={g.separate}
    >
      <div>
        <LaborH2>{c.flowTitle}</LaborH2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.flowIntro}</p>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-relaxed text-text">{c.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <Placeholder reason="浦松＝実務の対応範囲（どこまで代行し、どこを事業所側が行うか）" />
      </div>
      <div>
        <LaborH2>{c.boundaryTitle}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.boundaryIntro}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr>{c.headings.map(heading => <th key={heading} scope="col" className="border border-border bg-primary-tint px-3 py-2 text-left">{heading}</th>)}</tr></thead>
            <tbody>{c.rows.map(row => <tr key={row[0]}><th scope="row" className="border border-border px-3 py-2 text-left font-medium text-ink">{row[0]}</th>{row.slice(1).map(cell => <td key={cell} className="border border-border px-3 py-2 text-text">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-text">{c.contracts}</p>
        <p className="mt-3"><Link href={addLocalePrefix("/labor/column/shogu-kaizen-sharoushi-gyoseishoshi-dochira", locale)} className="text-primary underline">{c.articleLink}</Link></p>
        {/* Preserve the pending professional-boundary review; V10 expresses our engagement policy, not universal exclusivity. */}
        <Placeholder reason="石井弁護士＝業際の整理について確認継続中（2026-08-13：コラムの断定に合わせて記載。確認後に見直す）" />
      </div>
      <div>
        <LaborH2>{c.feesTitle}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.fees}</p>
        <p className="mt-3 leading-relaxed text-text">{c.data}</p>
        <p className="mt-3"><Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">{g.planLink}</Link></p>
      </div>
      <div className="space-y-4">
        <LaborH2>{c.ongoingTitle}</LaborH2>
        <p className="leading-relaxed text-text">{g.planIntro}</p>
        <p className="leading-relaxed text-text">{c.ongoing}</p>
        <LaborPlanPriceSummary locale={locale} />
        <p className="leading-relaxed text-text">{LABOR_PLAN_COPY[locale].system}</p>
        <p className="text-sm leading-relaxed text-text">{g.excluded}</p>
        <p><Link href={addLocalePrefix("/labor/services/kaigo-roumu", locale)} className="text-primary underline">{g.careLink}</Link></p>
      </div>
      <div>
        <LaborH2>{g.sourceHeading}</LaborH2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><a href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/shougaishahukushi/minaoshi/index_00007.html" className="text-primary underline">{locale === "en" ? "MHLW: treatment improvement for disability-welfare staff (Japanese)" : "福祉・介護職員の処遇改善（厚生労働省）"}</a></li>
          <li><a href="https://www.mhlw.go.jp/shogu-kaizen/apply.html" className="text-primary underline">{locale === "en" ? "MHLW: care staff add-on application forms (Japanese)" : "介護職員の処遇改善：加算の申請方法・申請様式（厚生労働省）"}</a></li>
        </ul>
        <p className="mt-3 leading-relaxed text-text-muted">{g.judgment}</p>
      </div>
    </LaborServicePage>
  );
}
