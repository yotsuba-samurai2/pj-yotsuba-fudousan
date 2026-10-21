// /labor/services/dattai-ichijikin（脱退一時金の請求）＝2026-10-21 新設（浦松指示）。
// 外国籍の個人のお客さま（帰国する本人・帰国後の本人）から直接お受けする。顧問契約は不要。
// 料金の正本＝/labor/ryokin の「脱退一時金（帰国する外国人のお客さま）」（1人44,000円・税込）。
// 文言は DATTAI_ICHIJIKIN_COPY（src/lib/labor/dattai-ichijikin-copy.ts）＝方式は手本B（shogai-nenkin と同型）。
// 法令＝社会保険労務士法第2条第1項第1号・第1号の2。業務独占を断定する語は用いない（shogai-nenkin と同じ強さ）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { DATTAI_ICHIJIKIN_COPY, DATTAI_ICHIJIKIN_COL1 } from "@/lib/labor/dattai-ichijikin-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = DATTAI_ICHIJIKIN_COPY[locale] ?? DATTAI_ICHIJIKIN_COPY.ja;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/dattai-ichijikin",
    keywords: [...c.keywords],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "en", "zh-tw", "zh"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = DATTAI_ICHIJIKIN_COPY[locale] ?? DATTAI_ICHIJIKIN_COPY.ja;
  return (
    <LaborServicePage
      slug="dattai-ichijikin"
      crumbLabel={c.crumbLabel}
      serviceName={c.serviceName}
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead[0]}
          <strong>{c.lead[1]}</strong>
          {c.lead[2]}
        </p>
      }
      internalLinks={[...c.internalLinks]}
      crossLinkLead={c.crossLinkLead}
    >
      <div>
        <LaborH2>{c.s1H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.s1P1}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {c.s1TableHead.map((h) => (
                  <th
                    key={h}
                    className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.s1Rows.map((r) => (
                <tr key={r.name}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                    {r.name}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">{r.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s1Note}</p>
      </div>

      <div>
        <LaborH2>{c.s2H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.s2P1}</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          {c.s2Items.map((it) => (
            <li key={it.strong}>
              <strong>{it.strong}</strong>
              {it.rest}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.s2Note[0]}
          <strong>{c.s2Note[1]}</strong>
          {c.s2Note[2]}
        </p>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3P1[0]}
          <strong>{c.s3P1[1]}</strong>
          {c.s3P1[2]}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.s3Note[0]}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s3Note[1]}
          </Link>
          {c.s3Note[2]}
        </p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.s4P1}</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          {c.s4Items.map((it) => (
            <li key={it.strong}>
              <strong>{it.strong}</strong>
              {it.rest}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.s4Note[0]}
          <Link href={addLocalePrefix(DATTAI_ICHIJIKIN_COL1, locale)} className="text-primary underline">
            {c.s4Note[1]}
          </Link>
          {c.s4Note[2]}
        </p>
      </div>

      <div>
        <LaborH2>{c.s5H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.s5P1}</p>
      </div>

      <div>
        <LaborH2>{c.s6H2}</LaborH2>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          {c.s6Steps.map((s, i) => (
            <li key={s}>{`${i + 1}. ${s}`}</li>
          ))}
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.s6Note[0]}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            {c.s6Note[1]}
          </Link>
          {c.s6Note[2]}
        </p>
      </div>
    </LaborServicePage>
  );
}
