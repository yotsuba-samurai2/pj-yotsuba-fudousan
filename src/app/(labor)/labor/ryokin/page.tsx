// /labor/ryokin（型C・料金）＝原稿_社労士 #6（開業後公開・SR_LAUNCHED=falseの間は404）
// JSON-LD＝Service＋PriceSpecification(確定値のみ)。C8（→/legal/ryokin）はSR_LAUNCHEDで自動開通。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";

const SITE = "https://luck428.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "料金｜四葉社会保険労務士事務所",
    description:
      "四葉社会保険労務士事務所の料金を業務ごとに掲載します。顧問契約、処遇改善加算サポート、雇用関係助成金、外国人雇用の労務。事案により変動する場合は個別にお見積りし、ご契約前に書面で明示します。まずはご相談ください。",
    path: "/labor/ryokin",
    locale,
    absoluteTitle: true,
  });
}

type Row = { name: string; unit: string; price: string; value?: number };
type Section = { title: string; note?: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    title: "顧問（松竹梅＋）",
    note: "人数階段式（労務顧問トータル・税込）：〜4名 22,000／5〜9名 27,500／10〜19名 33,000／20〜29名 38,500／30〜49名 44,000／50名〜別途。年度更新・算定基礎届・就業規則・助成金は別途（顧問先割引）。",
    rows: [
      { name: "プレミアム顧問（手続＋給与計算込み）", unit: "月額", price: "44,000円〜（人数階段式）" },
      { name: "労務顧問（トータル・手続込み）※主力", unit: "月額", price: "22,000円〜（人数階段式）" },
      { name: "アドバイザリー顧問（相談のみ）", unit: "月額", price: "11,000円〜（人数階段式）" },
    ],
  },
  {
    title: "手続代行",
    rows: [
      { name: "入社・退社手続", unit: "1件", price: "顧問先：顧問料に含む／非顧問スポット 7,700円" },
      { name: "社会保険・労働保険 新規適用", unit: "一式", price: "27,500円〜" },
      { name: "社会保険 算定基礎届／労働保険 年度更新", unit: "一式", price: "各 16,500円〜" },
    ],
  },
  {
    title: "規程・その他",
    rows: [
      { name: "就業規則 新規作成", unit: "一式", price: "目安 5〜20万円（規模・内容で変動・顧問先割引）" },
      { name: "就業規則 変更", unit: "一式", price: "44,000円〜" },
      { name: "社宅規程 作成", unit: "1件", price: "38,500円", value: 38500 },
      { name: "出張旅費規程 作成", unit: "1件", price: "36,300円", value: 36300 },
      { name: "助成金申請代行（顧問先限定）", unit: "一式", price: "別途お見積り（顧問契約先のみ受任・着手金なし）" },
      { name: "外国人雇用 無料相談（中国語対応）", unit: "—", price: "初回無料" },
      { name: "外国人雇用×募集コンサル（スポット）", unit: "—", price: "年5万円〜／伴走は月額" },
    ],
  },
  {
    title: "障害福祉の労務",
    rows: [
      { name: "障害福祉 労務顧問（〜10名）", unit: "月額", price: "33,000円", value: 33000 },
      { name: "障害福祉 就業規則＋賃金規程（処遇改善加算の賃金要件設計込み）", unit: "一式", price: "220,000円", value: 220000 },
      { name: "障害福祉 処遇改善加算 算定・実績支援（社労士視点）", unit: "1件", price: "44,000〜66,000円 or 顧問内" },
      { name: "障害福祉 算定基礎届／年度更新（〜9名）", unit: "1件", price: "27,500円", value: 27500 },
      { name: "障害福祉 助成金（キャリアアップ等）", unit: "一式", price: "別途お見積り（着手金なし・紹介料なし）" },
      { name: "障害福祉 労基署調査立会・是正対応", unit: "1件", price: "55,000〜110,000円" },
    ],
  },
  {
    title: "障害年金（親なき後・当事者家族向け）※社労士独占（年金裁定請求代理）",
    note: "着手金・成功報酬の額は税込です。診断書料等の実費は別途。障害年金の裁定請求代理は社会保険労務士の独占業務です。",
    rows: [
      { name: "障害年金 裁定請求（新規）", unit: "1件", price: "着手金 3万円 ＋ 成功報酬 年金3ヶ月分" },
      { name: "障害年金 裁定請求（遡及請求あり）", unit: "1件", price: "上記 ＋ 遡及額の15%（加算）" },
      { name: "事務手数料・実費", unit: "—", price: "郵送・診断書料・書類取得等の実費は別途" },
    ],
  },
];

function jsonLd() {
  const offers = SECTIONS.flatMap((s) =>
    s.rows
      .filter((r) => typeof r.value === "number")
      .map((r) => ({
        "@type": "Offer",
        name: r.name,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: r.value,
          priceCurrency: "JPY",
          valueAddedTaxIncluded: true,
        },
      })),
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": SITE + "/labor/ryokin#service",
        name: "四葉社会保険労務士事務所 料金",
        provider: { "@id": SITE + "/labor/#organization" },
        offers,
      },
    ],
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <Breadcrumb items={[{ name: "ホーム", href: "/labor" }, { name: "料金" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">料金</h1>
          <p className="mt-3 leading-relaxed text-text">
            四葉社会保険労務士事務所の料金を業務ごとに掲載します。<strong>事案により変動する場合は、ご契約前に個別のお見積りを書面でご提示</strong>します。
          </p>
        </header>

        <div className="mt-6 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
                {s.title}
              </h2>
              {/* PC＝表 */}
              <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className="border border-border px-3 py-2">サービス</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">単位</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">税込目安</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  {s.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="border border-border px-3 py-2 text-text">{r.name}</td>
                      <td className="border border-border px-3 py-2 whitespace-nowrap">{r.unit}</td>
                      <td className="border border-border px-3 py-2">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* SP＝カード */}
              <ul className="mt-3 space-y-2 sm:hidden">
                {s.rows.map((r, i) => (
                  <li key={i} className="rounded-lg border border-border bg-surface p-3 text-sm">
                    <div className="font-medium text-ink">{r.name}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-text-muted">
                      <span>単位：{r.unit}</span>
                      <span>税込目安：{r.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {s.note && <p className="mt-2 text-xs leading-relaxed text-text-muted">※{s.note}</p>}
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-muted">
          ※金額はすべて税込の目安です。事案により変動する場合は、ご契約前に個別のお見積りを書面でご提示します。確定額のみ構造化データ（PriceSpecification）として出力します。相談は初回無料・以降30分5,500円（オンライン可）。
          <Placeholder reason="Notion＝社労士業務の料金（全業務・開業時最終確認）" />
        </p>

        {/* C8（→/legal/ryokin）＝開業日開通（SR_LAUNCHED） */}
        {getCrossLinks("/labor/ryokin", SR_LAUNCHED).map((c) => (
          <CrossLinkBanner
            key={c.id}
            link={c}
            lead="行政書士業務（指定申請・在留資格・補助金等）の報酬は、四葉行政書士事務所（別事業体・独立受任）のページへ。"
          />
        ))}

        <p className="mt-4 text-sm">
          ご依頼の手順 →{" "}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            ご相談から契約までの流れ
          </Link>
        </p>

        {/* 署名（登録番号＝開業時確定まで非出力） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士
            <Placeholder reason="開業時確定＝社労士登録番号" />
            ・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。
          </p>
        </aside>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
