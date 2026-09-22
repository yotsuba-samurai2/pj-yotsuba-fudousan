// /labor/services/joseikin（型A）＝原稿_社労士 #4
// 【業際】雇用関係助成金＝社労士独占。事業の補助金＝行政書士（C12で分界を明示・launchFlag=SR_LAUNCHED）。
// 2026-09-22 多言語化：本文を JOSEIKIN_COPY（src/lib/labor/joseikin-copy.ts）へ移し、
//   en / zh-tw / zh を追加した（方式＝手本B・kaigo-roumu と同型）。日本語の文言は1字も変えていない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { JOSEIKIN_COPY } from "@/lib/labor/joseikin-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = JOSEIKIN_COPY[locale] ?? JOSEIKIN_COPY.ja;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/joseikin",
    keywords: ["助成金 申請 社労士", "キャリアアップ助成金 代行"],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "en", "zh-tw", "zh"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = JOSEIKIN_COPY[locale] ?? JOSEIKIN_COPY.ja;
  return (
    <LaborServicePage
      slug="joseikin"
      crumbLabel={c.crumbLabel}
      serviceName={c.serviceName}
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <>
          <p>
            {c.lead1[0]}
            <strong>{c.lead1[1]}</strong>
            {c.lead1[2]}
            <strong>{c.lead1[3]}</strong>
            {c.lead1[4]}
            <strong>{c.lead1[5]}</strong>
            {c.lead1[6]}
          </p>
          <p className="mt-3">
            <strong>{c.lead2[0]}</strong>
            {c.lead2[1]}
            <strong>{c.lead2[2]}</strong>
          </p>
        </>
      }
      internalLinks={[...c.internalLinks]}
      crossLinkLead={c.crossLinkLead}
    >
      <div>
        <LaborH2>{c.s1H2}</LaborH2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2 w-20"></th>
                {c.s1TableHead.map((h) => (
                  <th key={h} className="border border-border px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {c.s1Rows.map((r) => (
                <tr key={r.label}>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left text-ink">
                    {r.label}
                  </th>
                  <td className="border border-border px-3 py-2">
                    {r.aStrong ? <strong className="text-text">{r.aStrong}</strong> : null}
                    {r.a}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {r.bStrong ? <strong className="text-text">{r.bStrong}</strong> : null}
                    {r.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          {c.s1LinkLead}{" "}
          <Link
            href={addLocalePrefix("/legal/services/subsidy", locale)}
            className="text-primary underline"
          >
            {c.s1LinkLabel}
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">{c.s1Note}</p>
      </div>

      <div>
        <LaborH2>{c.s2H2}</LaborH2>
        <p className="mt-3">
          <strong>{c.s2P1[0]}</strong>
          {c.s2P1[1]}
        </p>
        <p className="mt-3">
          {c.s2P2[0]}
          <strong>{c.s2P2[1]}</strong>
          {c.s2P2[2]}
        </p>
        <p className="mt-3">
          {c.s2P3[0]}
          <strong>{c.s2P3[1]}</strong>
          {c.s2P3[2]}
          <strong>{c.s2P3[3]}</strong>
        </p>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3">{c.s3P1}</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          {c.s3Items.map((it) => (
            <li key={it.strong}>
              <strong>{it.strong}</strong>
              {it.mid}
              {it.strong2 ? <strong>{it.strong2}</strong> : null}
              {it.rest}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-text-muted">{c.s3Note}</p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3">
          <strong>{c.s4P1[0]}</strong>
          {c.s4P1[1]}
        </p>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s4FeeLink}
          </Link>
          ／
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            {c.s4FlowLink}
          </Link>
        </p>
      </div>
    </LaborServicePage>
  );
}
