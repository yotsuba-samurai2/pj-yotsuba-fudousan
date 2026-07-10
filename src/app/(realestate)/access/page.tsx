// /access（型C系・アクセス・料金）＝原稿_不動産 #7
// JSON-LD＝Organization(@id=/#organization)はlayoutが出力済み＝重複出力しない。geoは出力しない（URL構造設計v1 §8-5）。
// PriceSpecification＝確定値のみの規則：本表は法定上限・範囲（3〜5%）・石井確認中（相談料）のため出力なし。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";
import { OFFICE } from "@/lib/shared/office";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "アクセス・料金｜茗荷谷駅徒歩5分の四葉不動産株式会社",
    description:
      "四葉不動産株式会社（東京都文京区小日向・東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分）へのアクセスと料金のご案内です。売買仲介・賃貸仲介の手数料は宅地建物取引業法の法定上限、賃貸管理は月額賃料の3〜5%。相談は媒介前提なら無料・オンライン対応。TEL 03-6161-9428。",
    path: "/access",
    keywords: ["四葉不動産 アクセス", "文京区 不動産 仲介手数料", "茗荷谷 不動産会社 料金"],
    locale,
    absoluteTitle: true,
  });
}

const ACCESS_ROWS = [
  { k: "住所", v: "東京都文京区小日向４丁目２−５ 小日向安田ビル ２０３" },
  { k: "最寄駅", v: "東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分" },
  { k: "TEL", v: "03-6161-9428" },
  { k: "営業時間", v: "10:00〜18:00" },
  { k: "定休日", v: "火・水" },
];

const FEE_ROWS = [
  {
    item: "売買仲介 手数料",
    fee: "法定上限：（売買価格×3%＋6万円）＋消費税 ※売買価格200万円以下・200〜400万円は別料率／2024年改正で800万円以下は33万円＋税を上限に設定可",
    note: "宅建業法46条・国交省告示",
  },
  {
    item: "賃貸仲介 手数料",
    fee: "法定上限：賃料1ヶ月分＋消費税（居住用は原則貸主・借主で折半）",
    note: "宅建業法",
  },
  {
    item: "賃貸管理料",
    fee: "月額賃料の3〜5%（物件・管理内容に応じて個別見積り）",
    note: "当社基準",
  },
  {
    item: "相談料",
    fee: "媒介をご依頼いただく前提の相談は無料／媒介を伴わない不動産コンサルは別途合意のうえ原則30分5,500円（税込）・オンライン可",
    note: "媒介以外の関連業務は明確区分・事前設定・別合意で受領（国交省 解釈・運用の考え方）",
  },
];

export default function Page() {
  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: "アクセス・料金" }]} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">アクセス・料金</h1>
          <p className="mt-4 leading-relaxed text-text">
            四葉不動産株式会社は、<strong>東京都文京区小日向４丁目２−５ 小日向安田ビル ２０３</strong>にあります。東京メトロ丸ノ内線「茗荷谷」駅から徒歩5分。TEL 03-6161-9428。営業時間は10:00〜18:00（定休：火・水）。ご来店前にLINEか電話でご連絡いただくとスムーズです。
          </p>
        </header>

        <section className="mt-6">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {ACCESS_ROWS.map((r) => (
                <tr key={r.k}>
                  <th className="w-28 border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    {r.k}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs">
            <a href={OFFICE.mapUrl} target="_blank" rel="noreferrer" className="text-primary underline">
              Googleマップで見る
            </a>
            <Placeholder reason="浦松＝地図/緯度経度(geo出力可否)・来店予約/駐車場" />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">料金はいくらですか？</h2>
          <p className="mt-3 leading-relaxed text-text">
            四葉不動産株式会社の主な料金は次のとおりです。売買・賃貸の仲介手数料は<strong>宅地建物取引業法の法定上限</strong>の範囲で、管理料は物件・管理内容に応じて個別にお見積りします。
          </p>
          {/* PC＝表 */}
          <table className="mt-4 hidden w-full border-collapse text-sm sm:table">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">項目</th>
                <th className="border border-border px-3 py-2">料金</th>
                <th className="border border-border px-3 py-2">根拠・備考</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {FEE_ROWS.map((r) => (
                <tr key={r.item}>
                  <td className="border border-border px-3 py-2 whitespace-nowrap text-text">{r.item}</td>
                  <td className="border border-border px-3 py-2">{r.fee}</td>
                  <td className="border border-border px-3 py-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* SP＝カード */}
          <ul className="mt-4 space-y-2 sm:hidden">
            {FEE_ROWS.map((r) => (
              <li key={r.item} className="rounded-lg border border-border bg-surface p-3 text-sm">
                <div className="font-medium text-ink">{r.item}</div>
                <p className="mt-1 text-text-muted">{r.fee}</p>
                <p className="mt-1 text-xs text-text-muted">{r.note}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-text-muted">
            ※売買価格に応じた具体的な手数料額は、物件ごとに算出してご提示します。
          </p>
          <Placeholder reason="石井弁護士＝宅建業法上の相談料の切り分け（A案の最終確認）／Notion＝料金の掲載範囲" />
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            相談は無料ですか？オンラインでもできますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            当社に売買・賃貸の媒介をご依頼いただく前提のご相談は無料です。媒介を伴わない不動産コンサルティング（他社物件のセカンドオピニオン、資産全体の活用・保有方針の助言など）は、別途の合意のうえ原則30分5,500円（税込）で、オンラインにも対応します。まずはLINEか電話で一言からどうぞ。
          </p>
        </section>

        <nav aria-label="関連リンク" className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">このページの関連リンク</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            <li><Link href="/toushi" className="underline">投資用・事業用不動産</Link></li>
            <li><Link href="/souzoku" className="underline">文京区で不動産を相続したら</Link></li>
            <li><Link href="/global" className="underline">外国人・多言語のお部屋探し</Link></li>
          </ul>
        </nav>

        {/* 署名（E-E-A-T・原稿_不動産サイト共通） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉不動産株式会社 代表取締役 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）・海外4カ国在住経験。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
