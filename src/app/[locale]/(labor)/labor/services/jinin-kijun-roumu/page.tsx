// /labor/services/jinin-kijun-roumu（型A）＝指示書11「3. 障害福祉事業所の人員基準と労務」
// 正本＝Drive「四葉_社労士開業2026_サイト切替設計」設計書 §2-A-5・第4章B（B1〜B4）
//
// 【役割分担・カニバリ防止（luck428-column-seo 第3条／指示書11の役割分担表）】
//   ・/toushi/shitei-shinsei ＝指定申請（行政書士）。申請要件の解説はそちら
//   ・/legal/column/group-home-sewanin-seikatsushienin-haichi ＝人員配置基準を
//     「指定基準の側から」解説した既存記事。本ページは「雇用・労務の側から」書き、
//     指定基準の要件解説を繰り返さず既存記事へリンクする
//   ・/labor/services/kaigo-roumu ＝労務全般。本ページは人員基準との接続に絞る
//
// 【表示コンプライアンス】yotsuba-sharoushi-kaigyo 第6条／shigyo-compliance-gate
//   ・一体提供を示唆する語を使わない（婉曲表現を含む）
//   ・断定的な法的判断を書かない。「判断材料」「一般的な取り扱い」の形にする
//   ・報酬額を書かない（別契約・別料金／要見積り）
//   ・実績・事例・口コミ・評価を作成しない
//
// 【SR_LAUNCHED】本ページはゲートの内側（LaborServicePage が判定）。2026年9月1日まで非公開。
//
// 2026-09-22 多言語化：本文を JININ_KIJUN_ROUMU_COPY（src/lib/labor/jinin-kijun-roumu-copy.ts）へ移し、
//   en / zh-tw / zh を追加した（方式＝手本B・kaigo-roumu と同型）。日本語の文言は1字も変えていない。
//   日本語版にしか存在しない2つのリンク先（世話人・生活支援員のコラム＝locales:["ja"] のため
//   ロケール接頭辞つきURLは404／`/reasons`＝availableLocales:["ja"]）だけは接頭辞を付けず
//   日本語版URLへ送り、ラベルに「日文」を添える。ja では addLocalePrefix が恒等なので出力は不変。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { JININ_KIJUN_ROUMU_COPY } from "@/lib/labor/jinin-kijun-roumu-copy";

/** 日本語版にしか存在しないページ。ロケール接頭辞を付けない（付けると404または日本語本文の重複URLになる） */
const JA_ONLY_COLUMN = "/legal/column/group-home-sewanin-seikatsushienin-haichi";
const JA_ONLY_REASONS = "/reasons";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = JININ_KIJUN_ROUMU_COPY[locale] ?? JININ_KIJUN_ROUMU_COPY.ja;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/services/jinin-kijun-roumu",
    keywords: [
      "常勤換算 就業規則 所定労働時間",
      "障害福祉 人員基準 労務",
      "人員配置基準 雇用契約",
      "管理者 サービス管理責任者 兼務 労務",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "en", "zh-tw", "zh"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = JININ_KIJUN_ROUMU_COPY[locale] ?? JININ_KIJUN_ROUMU_COPY.ja;

  return (
    <LaborServicePage
      slug="jinin-kijun-roumu"
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
          <strong>{c.lead[5]}</strong>
          {c.lead[6]}
          <strong>{c.lead[7]}</strong>
          {c.lead[8]}
        </p>
      }
      internalLinks={[...c.internalLinks]}
      crossLinkLead={c.crossLinkLead}
    >
      <div>
        <LaborH2>{c.s1H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s1P1[0]}
          <strong>{c.s1P1[1]}</strong>
          {c.s1P1[2]}
          <strong>{c.s1P1[3]}</strong>
          {c.s1P1[4]}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {c.s1P2[0]}
          <strong>{c.s1P2[1]}</strong>
          {c.s1P2[2]}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          {c.s1Note[0]}
          <Link href={JA_ONLY_COLUMN} className="text-primary underline">
            {c.s1Note[1]}
          </Link>
          {c.s1Note[2]}
        </p>
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
        <p className="mt-3 leading-relaxed text-text">{c.s2P2}</p>
      </div>

      <div>
        <LaborH2>{c.s3H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s3P1[0]}
          <strong>{c.s3P1[1]}</strong>
          {c.s3P1[2]}
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          {c.s3Items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s3Note}</p>
      </div>

      <div>
        <LaborH2>{c.s4H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s4P1[0]}
          <strong>{c.s4P1[1]}</strong>
          {c.s4P1[2]}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {c.s4TableHead.map((h) => (
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
              {c.s4Rows.map((r) => (
                <tr key={r.when}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                    {r.when}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">{r.shitei}</td>
                  <td className="border border-border px-3 py-2 text-text">{r.roumu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.s4Note}</p>
      </div>

      <div>
        <LaborH2>{c.s5H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">{c.s5P1}</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          {c.s5Items.map((it) => (
            <li key={it.strong}>
              <strong>{it.strong}</strong>
              {it.rest}
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          {c.s5P2[0]}
          <strong>{c.s5P2[1]}</strong>
          {c.s5P2[2]}
        </p>
        <p className="mt-3 text-sm">
          <Link href={JA_ONLY_REASONS} className="text-primary underline">
            {c.s5LinkLabel}
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>{c.s6H2}</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          {c.s6P1[0]}
          <strong>{c.s6P1[1]}</strong>
          {c.s6P1[2]}
        </p>
        <p className="mt-3 text-sm">
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            {c.s6LinkLabel}
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>{c.s7H2}</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          {c.s7Items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          {c.s7Note[0]}
          <strong>{c.s7Note[1]}</strong>
          {c.s7Note[2]}
        </p>
      </div>

      <div>
        <p className="text-xs leading-relaxed text-text-muted">{c.disclaimer}</p>
        <p className="mt-2 text-xs text-text-muted">
          {c.lastUpdatedLabel}
          {c.lastUpdated}
        </p>
      </div>
    </LaborServicePage>
  );
}
