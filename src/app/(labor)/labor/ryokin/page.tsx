// /labor/ryokin（型C・料金）＝開業後公開（SR_LAUNCHED=falseの間は404）
// 2026-08-11 全面改訂：報酬額表 v18（決定済み30件）に差し替え。
//   ・顧問料は相談料。手続はすべてスポット。手続だけの依頼は受けない
//   ・給与計算は顧問契約とセット（〜29人は1人あたり月1,100円・基本料なし／30人〜はお見積り）
//   ・2026-08-12：給与計算も顧問料と同じく30人で区切った。入退社の日割・勤怠の修正・
//     非正規の比率で工数が人数に比例しなくなるため（外部からの指摘を受けての変更）。
//     住民税の年度更新を別建てにした（相場は1人500〜1,500円／年・別途が一般的）。
//   ・障害福祉レーンは廃止し本体へ統合
//   ・顧問先割引という区分はない（手続のみの依頼を受けないため、対象が存在しない）
//   ・★顧問料÷11,000の「ご相談時間の目安」は契約書にのみ記載。本ページには出さない（N-9）
// JSON-LD＝Service＋PriceSpecification（「〜」「お見積り」を含まない確定値のみ）。
// C8（→/legal/ryokin）はSR_LAUNCHEDで自動開通。
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
      "四葉社会保険労務士事務所の料金です。顧問料は労務のご相談に対する対価で、ご相談は回数・時間の制限なく承ります。労働社会保険の手続は届出ごとの料金を都度申し受けます。給与計算は従業員29人までは1人あたり月1,100円、30人以上はお見積りです。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/labor/ryokin",
    locale,
    absoluteTitle: true,
  });
}

type Row = { name: string; unit: string; price: string; value?: number };
type Section = { title: string; lead?: string; note?: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    title: "顧問（ご相談）",
    lead: "顧問料は、労務のご相談に対する対価です。ご相談は回数・時間の制限なく承ります。",
    // 2026-08-12：人数帯は相談量の代理指標にすぎない。顧問料＝相談料という設計上、
    // 実際のご相談の内容と量で帯を決めるのが本来の姿なので、その旨を明記した。
    note: "人数帯は目安です。顧問料はご相談の対価のため、ご相談の内容と量に応じた帯でお見積りします。従業員数は被保険者数を目安に判断します。手続・給与計算・規程の作成は顧問料に含まれません（下記のとおり別途申し受けます）。30人以上の会社は、就業実態と規程の本数を伺ったうえで個別にお見積りします。",
    rows: [
      { name: "〜4人", unit: "月額", price: "22,000円", value: 22000 },
      { name: "5〜9人", unit: "月額", price: "33,000円", value: 33000 },
      { name: "10〜14人", unit: "月額", price: "44,000円", value: 44000 },
      { name: "15〜19人", unit: "月額", price: "55,000円", value: 55000 },
      { name: "20〜24人", unit: "月額", price: "66,000円", value: 66000 },
      { name: "25〜29人", unit: "月額", price: "77,000円", value: 77000 },
      // 2026-08-12 浦松決定：30人以上はお見積りにする。
      // 30人を超えるあたりから、部署ごとの就業実態・非正規の類型・
      // 労使協定の本数が増え、相談1件あたりの工数が人数に比例しなくなるため。
      // 旧ラダー（30〜39人 88,000円 〜 90〜99人 154,000円）は廃止した。
      { name: "30人〜", unit: "月額", price: "お見積り" },
    ],
  },
  {
    title: "ご相談（顧問契約前）",
    note: "顧問契約に至らない場合の2回目以降に申し受けます。顧問契約後のご相談は顧問料に含まれます。",
    rows: [
      { name: "初めてのご相談", unit: "60分まで", price: "無料" },
      { name: "2回目以降のご相談", unit: "1時間", price: "11,000円", value: 11000 },
    ],
  },
  {
    title: "給与計算",
    lead: "顧問契約とセットのオプションです。給与計算だけのご依頼は承っておりません。",
    note: "基本料はありません。賞与の計算は含みます（賞与支払届の提出は別途申し受けます）。勤怠の打刻管理と年末調整は含みません（年末調整は税理士の業務です）。30人以上の会社は、入退社の頻度と勤怠の運用を伺ったうえで個別にお見積りします。",
    rows: [
      { name: "給与計算（〜29人）", unit: "1名／月", price: "1,100円", value: 1100 },
      // 2026-08-12：顧問料と同じく30人で区切る。入退社の日割・勤怠の修正・非正規の比率で
      // 工数が人数に比例しなくなるため。基本料を置かずに済んでいた根拠（顧問契約が
      // 最低料金の役割を果たす）も、顧問料をお見積りにした30人以上では成り立たない。
      { name: "給与計算（30人〜）", unit: "月額", price: "お見積り" },
      // 2026-08-12 新設：6月の特別徴収税額の一斉更新。全員分のバッチ作業で、
      // 人数に比例する。相場は1人500〜1,500円／年・別途が一般的。
      // 550円＝相談レート11,000円/時の3分相当（浦松決定）。
      { name: "住民税 特別徴収税額の年度更新", unit: "1名／年", price: "550円", value: 550 },
      { name: "住民税 特別徴収の異動届", unit: "1件", price: "お見積り" },
    ],
  },
  {
    title: "手続代行（適用）",
    rows: [
      { name: "社会保険 新規適用", unit: "1件", price: "29,700円", value: 29700 },
      { name: "労働保険 新規適用", unit: "1件", price: "29,700円", value: 29700 },
      { name: "事業所 各種変更届", unit: "1件", price: "8,800円", value: 8800 },
    ],
  },
  {
    title: "手続代行（入退社・扶養）",
    note: "届出ごとの料金です。入社1名を社会保険・雇用保険の両方で承る場合は7,920円になります。",
    rows: [
      { name: "社会保険 資格取得届", unit: "1名", price: "3,960円", value: 3960 },
      { name: "雇用保険 資格取得届", unit: "1名", price: "3,960円", value: 3960 },
      { name: "社会保険 資格喪失届", unit: "1名", price: "3,960円", value: 3960 },
      { name: "雇用保険 資格喪失届", unit: "1名", price: "3,960円", value: 3960 },
      { name: "被扶養者（異動）届", unit: "1名", price: "3,960円", value: 3960 },
      { name: "月額変更届", unit: "1件", price: "5,500円", value: 5500 },
    ],
  },
  {
    title: "手続代行（年次・給付）",
    note: "算定基礎届・年度更新は10名を超える場合、10名ごとに加算します。",
    rows: [
      { name: "社会保険 算定基礎届", unit: "一式", price: "23,100円〜" },
      { name: "労働保険 年度更新", unit: "一式", price: "23,100円〜" },
      { name: "賞与支払届", unit: "1回", price: "6,600円〜" },
      { name: "傷病手当金 申請", unit: "1件", price: "22,000円", value: 22000 },
      { name: "出産手当金 申請", unit: "1件", price: "22,000円", value: 22000 },
      { name: "育児休業給付金", unit: "1件", price: "初回 39,600円／2回目以降 9,240円〜" },
    ],
  },
  {
    title: "規程",
    note: "当事務所が作成した規程の法改正対応（該当条文の改定と届出）は、顧問料に含まれます。回数の制限はありません。会社の都合による改定は「就業規則 変更」の料金を申し受けます。",
    rows: [
      { name: "就業規則 新規作成", unit: "一式", price: "88,000〜220,000円（規模・規程の本数で変動）" },
      { name: "就業規則 変更", unit: "一式", price: "44,000円〜" },
      { name: "賃金規程 作成", unit: "1件", price: "49,800円", value: 49800 },
      { name: "育児介護休業規程 作成", unit: "1件", price: "79,800円", value: 79800 },
      { name: "ハラスメント防止規程 作成", unit: "1件", price: "11,000円", value: 11000 },
      { name: "社宅規程 作成", unit: "1件", price: "38,500円", value: 38500 },
      { name: "出張旅費規程 作成", unit: "1件", price: "36,300円", value: 36300 },
    ],
  },
  {
    title: "加算・募集・調査",
    rows: [
      { name: "処遇改善加算 賃金要件の設計・算定支援", unit: "1件", price: "お見積り" },
      { name: "募集・採用コンサルタント", unit: "一式", price: "お見積り" },
      { name: "労基署調査・是正対応", unit: "1件", price: "55,000〜110,000円" },
      { name: "従業員説明会の開催", unit: "1回", price: "55,000円", value: 55000 },
      { name: "労働者代表の選出支援", unit: "—", price: "無料" },
      { name: "外国人雇用のご相談（中国語対応）", unit: "—", price: "顧問料に含む" },
    ],
  },
  {
    title: "助成金",
    note: "着手金はいただきません。紹介料の授受も行いません。",
    rows: [
      { name: "助成金 申請代行（顧問先限定）", unit: "一式", price: "着手金なし ＋ 成功報酬 支給額の20%" },
    ],
  },
  {
    title: "外部監査人（監理支援機関のお客さま）",
    lead: "顧問契約は不要です。監理支援機関から直接お受けします。",
    note: "外部監査人をお引き受けした監理支援機関の関係先とは、労務の顧問契約を結びません。既存の顧問先が加入している監理支援機関の外部監査人も、お引き受けしません。",
    rows: [
      { name: "外部監査人 就任・定期監査", unit: "1回", price: "お見積り" },
      { name: "実地確認への同行", unit: "1回", price: "上記のお見積りに含みます" },
    ],
  },
  {
    title: "障害年金（個人のお客さま）",
    lead: "顧問契約は不要です。ご本人・ご家族から直接お受けします。",
    note: "着手金・成功報酬の額は税込です。診断書料等の実費は別途申し受けます。障害年金の裁定請求の代理は社会保険労務士の業務です。",
    rows: [
      { name: "障害年金 裁定請求（新規）", unit: "1件", price: "着手金 30,000円 ＋ 成功報酬 年金3ヶ月分" },
      { name: "障害年金 裁定請求（遡及請求あり）", unit: "1件", price: "上記 ＋ 遡及額の15%" },
      { name: "事務手数料・実費", unit: "—", price: "郵送・診断書料・書類取得等の実費は別途" },
    ],
  },
];

/** 当事務所では取り扱わない業務。おつなぎ先を明示する（分離受任） */
const NOT_HANDLED: { name: string; to: string }[] = [
  { name: "年末調整、扶養控除・賃貸料相当額・非課税限度額などの税務判断", to: "税理士" },
  { name: "法人登記の変更", to: "司法書士" },
  { name: "離職理由をめぐる争いなど、紛争性が生じた事案", to: "弁護士" },
  {
    name: "在留資格の申請書類の作成・申請取次",
    to: "四葉行政書士事務所（別事業体・別々にご契約いただきます）",
  },
  {
    name: "処遇改善加算の計画書・実績報告書の作成と指定権者への提出",
    to: "四葉行政書士事務所（同上）",
  },
  { name: "補助金の申請", to: "四葉行政書士事務所（同上）" },
  { name: "監理支援機関の許可申請書類の作成", to: "四葉行政書士事務所（同上）" },
  { name: "求職者の紹介・あっせん、応募者の面接代行、求人媒体の運用代行", to: "取り扱っておりません" },
];

function jsonLd() {
  const offers = SECTIONS.flatMap((s) =>
    s.rows
      .filter((r) => typeof r.value === "number")
      .map((r) => ({
        "@type": "Offer",
        name: `${s.title}／${r.name}`,
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
            <strong>顧問料は、労務のご相談に対する対価です。</strong>
            ご相談は回数・時間の制限なく承ります。労働社会保険の手続は、顧問先の方も届出ごとの料金を都度申し受けます。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong>手続だけのご依頼は承っておりません。</strong>
            ご相談を伴わずに手続だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。法人・個人事業主のお客さまは顧問契約を前提としてお受けします。
            <strong>障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）は、顧問契約を前提としません。</strong>
          </p>
        </header>

        <div className="mt-6 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
                {s.title}
              </h2>
              {s.lead && <p className="mt-2 text-sm leading-relaxed text-text">{s.lead}</p>}
              {/* PC＝表 */}
              <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className="border border-border px-3 py-2">サービス</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">単位</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">税込</th>
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
                      <span>税込：{r.price}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {s.note && <p className="mt-2 text-xs leading-relaxed text-text-muted">※{s.note}</p>}
            </div>
          ))}
        </div>

        {/* 取り扱わない業務＝おつなぎ先の明示（分離受任） */}
        <div className="mt-10">
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
            当事務所では取り扱わない業務
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            次の業務は当事務所では承っておりません。その資格をお持ちの方におつなぎします。
            <strong>ご紹介にあたって紹介料の授受は一切行いません。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {NOT_HANDLED.map((n, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface p-3">
                <span className="text-text">{n.name}</span>
                <span className="ml-1 text-text-muted">→ {n.to}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします。ご依頼いただく場合は事務所ごとに別々にご契約いただき、料金・請求も分かれます。当事務所へのご依頼が、他の事務所へのご依頼の条件になることはありません。
          </p>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-text-muted">
          ※金額はすべて税込です。「〜」「お見積り」としている項目は、事案により作業量が変わるため、ご契約前に個別のお見積りを書面でご提示します。確定額のみ構造化データ（PriceSpecification）として出力しています。
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
