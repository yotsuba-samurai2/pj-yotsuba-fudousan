// /labor/services/shogai-nenkin（型A）＝原稿_社労士_障害年金ページ_v0.1.md（2026-07-10作成）の実装。
// 個人のお客さま（ご本人・ご家族）から直接お受けする。
// 料金の正本＝/labor/ryokin の「障害年金（個人のお客さま）」セクション（着手金30,000円＋成功報酬 年金3ヶ月分）。
// 法令＝社会保険労務士法（昭和43年法律第89号）第2条第1項第1号・第1号の2、第27条。
//   2026-09-02 e-Gov法令検索API（法令ID 343AC1000000089）でXMLを直接取得し条文を確認。
//   表記は /labor/ryokin と揃えて「社会保険労務士の業務です」とし、業務独占を断定する語は用いない
//   （石井弁護士の確認前。断定表現を避ける＝shigyo-compliance-gate 第1条）。
// 年金額・等級表・遡及請求の時効は書かない（改定・未検証のため。原稿の【未検証】3件に対応）。
// 2026-09-22 多言語化：本文を SHOGAI_NENKIN_COPY（src/lib/labor/shogai-nenkin-copy.ts）へ移し、
//   en / zh-tw / zh を追加した（方式＝手本B・kaigo-roumu と同型）。日本語の文言は1字も変えていない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { Placeholder } from "@/components/shared/Placeholder";
import { SHOGAI_NENKIN_COPY } from "@/lib/labor/shogai-nenkin-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = SHOGAI_NENKIN_COPY[locale] ?? SHOGAI_NENKIN_COPY.ja;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/shogai-nenkin",
    keywords: [
      "障害年金 申請 社労士",
      "障害年金 裁定請求 代行",
      "障害年金 文京区",
      "親なき後 障害年金",
      "障害年金 中国語 相談",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "en", "zh-tw", "zh"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = SHOGAI_NENKIN_COPY[locale] ?? SHOGAI_NENKIN_COPY.ja;
  return (
    <LaborServicePage
      slug="shogai-nenkin"
      crumbLabel={c.crumbLabel}
      serviceName={c.serviceName}
      heroAlt={c.heroAlt}
      h1={c.h1}
      lead={
        <p>
          {c.lead[0]}
          <strong>{c.lead[1]}</strong>
          {c.lead[2]}
          <strong>{c.lead[3]}</strong>
          {c.lead[4]}
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
          {c.s4Note}
          <Placeholder reason="浦松＝親なき後の訴求の濃度" />
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
          <Placeholder reason="浦松＝面談回数・標準期間・不支給時の受任範囲（再請求／審査請求）" />
        </p>
      </div>
    </LaborServicePage>
  );
}
