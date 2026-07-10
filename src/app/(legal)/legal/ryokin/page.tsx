// /legal/ryokin（型C・報酬額表）＝原稿_行政書士 #7（全8区分転記済み・公開用列のみ）
// フェーズI多言語化（2026-07-10・浦松承認）：サービス名（rows.name）・金額は日本語のまま＝見出し・列ラベル・免責・導線のみ4ロケール化。
// en/zh-tw/zh=監修前ドラフト。JSON-LD＝Service＋PriceSpecification(確定値のみ)＋BreadcrumbList（Breadcrumb部品が出力）＝ja固定で不変。
// 【重要】公開用列のみ／確定値のみ／SPはカード化。金額は「税込の目安」＋実費別＋事案により見積り。
// C7（→/labor/ryokin）は SR_LAUNCHED=false の間 getCrossLinks が返さない＝非表示（開業日に自動開通・リード文はja固定）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import type { LangCode } from "@/config/languages";

const SITE = "https://luck428.com";

type RyokinCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbCurrent: string;
  h1: string;
  lead: React.ReactNode;
  colService: string;
  colUnit: string;
  colPrice: string;
  colJitsuhi: string;
  toService: string;
  sectionTitles: [string, string, string, string, string, string, string];
  footnote: string;
  procedureLead: string;
  procedureLink: string;
};

const COPY: Record<LangCode, RyokinCopy> = {
  ja: {
    metaTitle: "報酬額表｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所の報酬額を業務ごとに掲載します。障害福祉サービス指定申請、在留資格・ビザ、相続、会社設立・許認可、補助金申請サポートの料金の目安。事案により変動する場合は個別にお見積りし、ご契約前に書面で明示します。",
    crumbHome: "ホーム",
    crumbCurrent: "報酬額表",
    h1: "報酬額表",
    lead: (
      <>
        四葉行政書士事務所の報酬額を、業務ごとに掲載します。金額は目安であり、<strong>事案の内容により変動する場合は、ご契約前に個別のお見積りを書面でご提示</strong>します。別途、登録免許税・自治体手数料・印紙代・戸籍取得費等の実費が発生します。
      </>
    ),
    colService: "サービス",
    colUnit: "単位",
    colPrice: "税込目安",
    colJitsuhi: "実費",
    toService: "→ 業務内容",
    sectionTitles: [
      "障害福祉サービス（主力）",
      "国際業務（在留資格・帰化・認証／中国語対応）",
      "会社設立・法人",
      "建設業・宅建業",
      "許認可（産廃・飲食・古物 等）",
      "相続・遺言・信託",
      "その他（契約書・補助金）",
    ],
    footnote:
      "※金額はすべて税込の目安です。事案により変動する場合は、ご契約前に書面でお見積りを明示します。確定値のみ構造化データ（PriceSpecification）として出力しています。",
    procedureLead: "ご依頼の手順 → ",
    procedureLink: "ご相談から完了までの受任の流れ",
  },
  en: {
    metaTitle: "Fee Schedule｜四葉行政書士事務所",
    metaDesc:
      "Fee schedule of Yotsuba Gyoseishoshi Office by service area: disability-welfare service designation, residence status and visas, inheritance, company formation and licensing, and subsidy application support. Where fees vary by case, we provide a written estimate before you sign.",
    crumbHome: "Home",
    crumbCurrent: "Fee Schedule",
    h1: "Fee Schedule",
    lead: (
      <>
        Our fees are listed by service area. Amounts are indicative; <strong>where a fee varies with the specifics of your case, we present an individual written estimate before any engagement</strong>. Disbursements such as registration and license tax, municipal fees, revenue stamps, and family-register retrieval costs are charged separately. Service names are shown in Japanese as they appear in official procedures.
      </>
    ),
    colService: "Service",
    colUnit: "Unit",
    colPrice: "Approx. fee (tax incl.)",
    colJitsuhi: "Disbursements",
    toService: "→ Service details",
    sectionTitles: [
      "Disability-Welfare Services (Core Practice)",
      "International Services (Residence Status, Naturalization, Authentication / Chinese Support)",
      "Company & Corporation Formation",
      "Construction & Real-Estate Business Licensing",
      "Licenses & Permits (Industrial Waste, Restaurants, Secondhand Goods, etc.)",
      "Inheritance, Wills & Trusts",
      "Other (Contracts & Subsidies)",
    ],
    footnote:
      "* All amounts are indicative and include consumption tax. Where fees vary by case, a written estimate is provided before engagement. Only fixed amounts are output as structured data (PriceSpecification).",
    procedureLead: "How to engage us → ",
    procedureLink: "How engagement works, from consultation to completion",
  },
  "zh-tw": {
    metaTitle: "報酬額表｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所依業務類別刊載報酬額：障礙福祉服務指定申請、在留資格（簽證）、繼承、公司設立・許認可、補助金申請支援的費用參考。若因案件內容而變動，將於簽約前以書面提出個別估價。",
    crumbHome: "首頁",
    crumbCurrent: "報酬額表",
    h1: "報酬額表",
    lead: (
      <>
        依業務類別刊載本事務所的報酬額。金額為參考值，<strong>若因案件內容而變動，將於簽約前以書面提出個別估價</strong>。另需負擔登錄免許稅、自治體手續費、印紙代、戶籍取得費等實費。服務名稱依日本官方手續原文（日文）表示。
      </>
    ),
    colService: "服務",
    colUnit: "單位",
    colPrice: "含稅參考價",
    colJitsuhi: "實費",
    toService: "→ 業務內容",
    sectionTitles: [
      "障礙福祉服務（主力業務）",
      "國際業務（在留資格・歸化・認證／中文對應）",
      "公司設立・法人",
      "建設業・宅建業（不動產業）",
      "許認可（產業廢棄物・餐飲・古物等）",
      "繼承・遺囑・信託",
      "其他（契約書・補助金）",
    ],
    footnote:
      "※金額皆為含稅參考值。若因案件而變動，將於簽約前以書面明示估價。僅確定金額輸出為結構化資料（PriceSpecification）。",
    procedureLead: "委託流程 → ",
    procedureLink: "從諮詢到完成的受任流程",
  },
  zh: {
    metaTitle: "报酬额表｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所按业务类别刊载报酬额：残障福祉服务指定申请、在留资格（签证）、继承、公司设立・许认可、补助金申请支援的费用参考。若因案件内容而变动，将于签约前以书面提出个别估价。",
    crumbHome: "首页",
    crumbCurrent: "报酬额表",
    h1: "报酬额表",
    lead: (
      <>
        按业务类别刊载本事务所的报酬额。金额为参考值，<strong>若因案件内容而变动，将于签约前以书面提出个别估价</strong>。另需承担登录免许税、自治体手续费、印纸代、户籍取得费等实费。服务名称按日本官方手续原文（日文）表示。
      </>
    ),
    colService: "服务",
    colUnit: "单位",
    colPrice: "含税参考价",
    colJitsuhi: "实费",
    toService: "→ 业务内容",
    sectionTitles: [
      "残障福祉服务（主力业务）",
      "国际业务（在留资格・归化・认证／中文对应）",
      "公司设立・法人",
      "建设业・宅建业（不动产业）",
      "许认可（产业废弃物・餐饮・古物等）",
      "继承・遗嘱・信托",
      "其他（合同・补助金）",
    ],
    footnote:
      "※金额均为含税参考值。若因案件而变动，将于签约前以书面明示估价。仅确定金额输出为结构化数据（PriceSpecification）。",
    procedureLead: "委托流程 → ",
    procedureLink: "从咨询到完成的受任流程",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/ryokin",
    locale,
    absoluteTitle: true,
  });
}

type Row = { name: string; unit: string; price: string; jitsuhi?: string; value?: number };
type Section = { title: string; href?: string; rows: Row[]; hasJitsuhi?: boolean };

const SECTIONS: Section[] = [
  {
    title: "障害福祉サービス（主力）",
    href: "/legal/services/shogai-fukushi",
    rows: [
      { name: "指定申請（通所系）フルサポート〔協議〜開業伴走〕", unit: "一式", price: "605,000円", value: 605000 },
      { name: "指定申請（就労継続支援A型・B型）", unit: "1件", price: "440,000円", value: 440000 },
      { name: "指定申請（共同生活援助・グループホーム）", unit: "1件", price: "418,000円", value: 418000 },
      { name: "指定申請（通所系）スタンダード〔単独・顧問不要〕", unit: "1件", price: "385,000円", value: 385000 },
      { name: "指定申請（通所系）ライト〔書類作成中心〕", unit: "1件", price: "220,000円", value: 220000 },
      { name: "指定申請（訪問系：居宅介護・重度訪問介護）", unit: "1件", price: "198,000円", value: 198000 },
      { name: "運営指導（実地指導）フルサポート", unit: "一式", price: "275,000円", value: 275000 },
      { name: "事業計画書（融資用）", unit: "1件", price: "110,000円", value: 110000 },
      { name: "処遇改善加算 計画書（届出）", unit: "1件", price: "66,000円", value: 66000 },
      { name: "処遇改善加算 実績報告", unit: "1件", price: "55,000円", value: 55000 },
      { name: "指定更新", unit: "1件", price: "66,000円（早期割引対象）", value: 66000 },
      { name: "変更届（軽微〜サビ管変更）", unit: "1件", price: "33,000円〜" },
      { name: "月額顧問（松：運営指導同行・優先）", unit: "月額", price: "88,000円", value: 88000 },
      { name: "月額顧問（竹：届出代行込）", unit: "月額", price: "55,000円", value: 55000 },
      { name: "月額顧問（梅：期限管理・相談）", unit: "月額", price: "33,000円", value: 33000 },
    ],
  },
  {
    title: "国際業務（在留資格・帰化・認証／中国語対応）",
    href: "/legal/services/visa",
    hasJitsuhi: true,
    rows: [
      { name: "経営・管理ビザ申請", unit: "1件", price: "別途お見積り", jitsuhi: "—" },
      { name: "永住許可申請", unit: "1件", price: "275,000円〜", jitsuhi: "8,000円" },
      { name: "帰化許可申請", unit: "1件", price: "275,000円〜", jitsuhi: "手数料無料" },
      { name: "在留資格認定（就労ビザ等）", unit: "1件", price: "176,000円〜（着手金50%）", jitsuhi: "—" },
      { name: "在留資格認定（特定技能）", unit: "1件", price: "165,000円〜", jitsuhi: "—" },
      { name: "在留資格変更（特定技能除く）", unit: "1件", price: "121,000円〜", jitsuhi: "—" },
      { name: "配偶者・結婚ビザ（日本人の配偶者等）", unit: "1件", price: "110,000円〜", jitsuhi: "—" },
      { name: "在留期間更新（雇用会社変更なし）", unit: "1件", price: "60,500円", jitsuhi: "4,000円", value: 60500 },
      { name: "　同（雇用会社変更あり）", unit: "1件", price: "99,000円〜", jitsuhi: "—" },
      { name: "在留資格認定（家族滞在）", unit: "1件", price: "55,000円（2人目以降 33,000円/人）", jitsuhi: "—", value: 55000 },
      { name: "就労資格証明書", unit: "1件", price: "66,000円〜", jitsuhi: "—" },
      { name: "アポスティーユ取得代行（1通）", unit: "1件", price: "16,500円", jitsuhi: "外務省手数料無料", value: 16500 },
      { name: "公印確認＋領事認証 取得代行（非ハーグ国向け）", unit: "1件", price: "50,000円", jitsuhi: "認証手数料は国により別途", value: 50000 },
      { name: "資格外活動許可", unit: "1件", price: "16,500円", jitsuhi: "—", value: 16500 },
      { name: "登録支援機関 支援委託", unit: "月額", price: "33,000円/人", jitsuhi: "—", value: 33000 },
      { name: "緊急加算（期限2週間前）／再申請加算", unit: "1件", price: "各44,000円", jitsuhi: "—", value: 44000 },
      { name: "〔予約・準備中〕育成就労 外部監査人／監理支援機関許可", unit: "月額/件", price: "別途お見積り（2027年4月施行・予約受付）", jitsuhi: "—" },
    ],
  },
  {
    title: "会社設立・法人",
    href: "/legal/services/company",
    rows: [
      { name: "医療法人設立", unit: "一式", price: "880,000円〜" },
      { name: "事業協同組合 設立", unit: "一式", price: "770,000円〜" },
      { name: "NPO法人設立（認証〜登記完了）", unit: "一式", price: "275,000円（登記は提携司法書士）", value: 275000 },
      { name: "会社設立（定款作成等）", unit: "一式", price: "165,000円（定款認証・登免税15万〜・司法書士報酬別途）", value: 165000 },
      { name: "合同会社（LLC）設立", unit: "一式", price: "165,000円（登録免許税60,000円・電子定款で印紙不要）", value: 165000 },
      { name: "一般社団法人設立", unit: "一式", price: "165,000円（認証手数料・登免税・司法書士報酬別途）", value: 165000 },
    ],
  },
  {
    title: "建設業・宅建業",
    rows: [
      { name: "建設業許可（法人・新規）大臣", unit: "1件", price: "220,000円（登録免許税15万円）", value: 220000 },
      { name: "建設業許可（法人・新規）知事", unit: "1件", price: "165,000円（許可手数料9万円）", value: 165000 },
      { name: "建設業許可（個人・新規）知事", unit: "1件", price: "110,000円（許可手数料9万円）", value: 110000 },
      { name: "業種追加", unit: "1件", price: "88,000円（手数料5万円）", value: 88000 },
      { name: "決算変更届（事業年度終了届）", unit: "1件", price: "33,000円", value: 33000 },
      { name: "経営事項審査", unit: "1件", price: "55,000円（分析・評価手数料別途）", value: 55000 },
      { name: "建設業許可（法人・更新）知事", unit: "1件", price: "55,000円（更新手数料5万円）", value: 55000 },
      { name: "入札参加資格審査", unit: "1件", price: "33,000円", value: 33000 },
      { name: "CCUS 事業者登録代行", unit: "1件", price: "41,250円〜（資本金連動）" },
      { name: "宅地建物取引業免許（新規）知事", unit: "1件", price: "165,000円（申請手数料33,000円・保証協会加入金別途）", value: 165000 },
      { name: "宅地建物取引業免許（更新）知事", unit: "1件", price: "55,000円（手数料33,000円）", value: 55000 },
    ],
  },
  {
    title: "許認可（産廃・飲食・古物 等）",
    rows: [
      { name: "産業廃棄物収集運搬業許可（積替保管除く）", unit: "1件", price: "110,000円（手数料81,000円）", value: 110000 },
      { name: "深夜酒類提供飲食店 営業開始届", unit: "1件", price: "110,000円", value: 110000 },
      { name: "飲食店営業許可", unit: "1件", price: "55,000円（保健所手数料 約16,000〜18,300円）", value: 55000 },
      { name: "古物商許可", unit: "1件", price: "55,000円（手数料19,000円）", value: 55000 },
    ],
  },
  {
    title: "相続・遺言・信託",
    href: "/legal/services/inheritance",
    rows: [
      { name: "遺言執行手続", unit: "一式", price: "330,000円〜（遺産額により変動する場合あり）" },
      { name: "遺言書案作成", unit: "1件", price: "165,000円（証人費用・公証人手数料別途）", value: 165000 },
      { name: "信託（家族信託）契約書作成", unit: "一式", price: "別途お見積り（財産評価額連動・登記は提携司法書士）" },
      { name: "遺産分割協議書の作成", unit: "一式", price: "99,000円〜（遺産総額連動）" },
      { name: "改葬許可申請（墓じまい）", unit: "1件", price: "88,000円〜" },
      { name: "金融機関 解約・名義変更", unit: "1件", price: "55,000円/1行", value: 55000 },
      { name: "戸籍収集（代行）", unit: "1件", price: "33,000円（3名まで／追加1名11,000円）", value: 33000 },
      { name: "相続関係説明図／財産目録", unit: "1件", price: "各33,000円", value: 33000 },
      { name: "法定相続情報一覧図", unit: "1件", price: "22,000円", value: 22000 },
    ],
  },
  {
    title: "その他（契約書・補助金）",
    href: "/legal/services/subsidy",
    rows: [
      { name: "内容証明郵便作成", unit: "1件", price: "33,000円（郵便料別途）", value: 33000 },
      { name: "離婚協議書作成", unit: "1件", price: "50,000円（公正証書は加算・公証人手数料別途）", value: 50000 },
      { name: "補助金申請サポート（相談・申請代行）", unit: "—", price: "相談は初回無料・以降30分5,500円／申請代行は別途お見積り" },
    ],
  },
];

function FeeTable({ s, title, c }: { s: Section; title: string; c: RyokinCopy }) {
  return (
    <div>
      <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
        {title}
        {s.href && (
          <>
            {" "}
            <Link href={s.href} className="text-sm font-normal text-primary underline">{c.toService}</Link>
          </>
        )}
      </h2>
      {/* PC＝表 */}
      <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
        <thead>
          <tr className="bg-primary-tint text-left">
            <th className="border border-border px-3 py-2">{c.colService}</th>
            <th className="border border-border px-3 py-2 whitespace-nowrap">{c.colUnit}</th>
            <th className="border border-border px-3 py-2 whitespace-nowrap">{c.colPrice}</th>
            {s.hasJitsuhi && <th className="border border-border px-3 py-2 whitespace-nowrap">{c.colJitsuhi}</th>}
          </tr>
        </thead>
        <tbody className="text-text-muted">
          {s.rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-border px-3 py-2 text-text">{r.name}</td>
              <td className="border border-border px-3 py-2 whitespace-nowrap">{r.unit}</td>
              <td className="border border-border px-3 py-2 whitespace-nowrap">{r.price}</td>
              {s.hasJitsuhi && <td className="border border-border px-3 py-2 whitespace-nowrap">{r.jitsuhi ?? "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {/* SP＝カード化 */}
      <ul className="mt-3 space-y-2 sm:hidden">
        {s.rows.map((r, i) => (
          <li key={i} className="rounded-lg border border-border bg-surface p-3 text-sm">
            <div className="font-medium text-ink">{r.name}</div>
            <div className="mt-1 flex flex-wrap gap-x-3 text-text-muted">
              <span>{c.colUnit}：{r.unit}</span>
              <span>{c.colPrice}：{r.price}</span>
              {s.hasJitsuhi && <span>{c.colJitsuhi}：{r.jitsuhi ?? "—"}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function jsonLd() {
  const offers = SECTIONS.flatMap((s) =>
    s.rows
      .filter((r) => typeof r.value === "number")
      .map((r) => ({
        "@type": "Offer",
        name: r.name,
        priceSpecification: { "@type": "PriceSpecification", price: r.value, priceCurrency: "JPY", valueAddedTaxIncluded: true },
      })),
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": SITE + "/legal/ryokin#service",
        name: "四葉行政書士事務所 報酬額",
        provider: { "@id": SITE + "/legal/#organization" },
        offers, // 確定値のみ（〜・別途お見積りは除外）
      },
      // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）
    ],
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <Breadcrumb items={[{ name: c.crumbHome, href: "/legal" }, { name: c.crumbCurrent }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-3 leading-relaxed text-text">{c.lead}</p>
        </header>

        <div className="mt-6 space-y-8">
          {SECTIONS.map((s, i) => (
            <FeeTable key={s.title} s={s} title={c.sectionTitles[i] ?? s.title} c={c} />
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-muted">{c.footnote}</p>

        <p className="mt-4 text-sm">
          {c.procedureLead}
          <Link href="/legal/nagare" className="text-primary underline">
            {c.procedureLink}
          </Link>
        </p>

        {/* C7（→/labor/ryokin）＝開業日開通（SR_LAUNCHED・リード文はja固定＝開業時に多言語化判断） */}
        {getCrossLinks("/legal/ryokin", SR_LAUNCHED).map((cl) => (
          <CrossLinkBanner
            key={cl.id}
            link={cl}
            lead="労務・処遇改善加算・雇用関係助成金の料金は、四葉社会保険労務士事務所（別事業体）のページへ。"
          />
        ))}

        {/* 署名（E-E-A-T・原稿サイト共通・ja固定＝著者情報の訳はフェーズI後半で統一判断） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉行政書士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
