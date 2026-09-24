// ★参考ページ（型E・ハブ）＝ /legal/services　※原稿_行政書士 #6
// 配置＝src/app/(legal)/legal/services/page.tsx。JSON-LD＝CollectionPage＋BreadcrumbList。
// 2026-09-24：en/zh-tw/zh が日本語のまま配信され、hreflang だけ4言語を宣言していた（全ページ点検 2026-09-24 #1）。
//   4言語化した。業務名は各業務ページの既存の訳（タイトル）に揃える。
//   ja のみ公開の業務（gaikokujin-shain・ikuseishuro-gaibu-kansa・oyanakiato）は、非日本語では
//   日本語版へリンクし「日本語のみ」と明示する（ロケール接頭辞つきURLは日本語本文を返すため）。
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata, canonicalUrl } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

type Copy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  h1: string;
  lead: ReactNode;
  who: string;
  more: string;
  jaOnly: string;
  feeBefore: string;
  feeLink: string;
  flowBefore: string;
  flowLink: string;
  after: string;
};

const COPY: Record<LangCode, Copy> = {
  ja: {
    metaTitle: "業務案内｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所（文京区小日向）の取扱業務の一覧です。障害福祉サービスの指定申請、在留資格・ビザ、相続・遺言、会社設立・許認可、補助金申請サポート。各業務の内容・報酬・受任の流れをご案内します。",
    crumbHome: "ホーム",
    h1: "業務案内",
    lead: (
      <>
        <strong>四葉行政書士事務所の取扱業務の一覧です。</strong>各業務の詳しい内容・費用・流れは、それぞれのページをご覧ください。
      </>
    ),
    who: "こんな方に：",
    more: "詳しく見る →",
    jaOnly: "",
    feeBefore: "料金は ",
    feeLink: "報酬額表",
    flowBefore: "、依頼の手順は ",
    flowLink: "受任の流れ",
    after: " をご覧ください。",
  },
  en: {
    metaTitle: "Services｜四葉行政書士事務所",
    metaDesc:
      "Services of Yotsuba Gyoseishoshi Office (Kohinata, Bunkyo, Tokyo): disability-welfare service designation, residence status and visas, inheritance and wills, company formation and licensing, and subsidy application support. Each page explains the scope, fees and how engagement works.",
    crumbHome: "Home",
    h1: "Services",
    lead: (
      <>
        <strong>The services handled by 四葉行政書士事務所.</strong> See each page for details, fees and the process.
      </>
    ),
    who: "Who it is for: ",
    more: "Read more →",
    jaOnly: "Japanese only",
    feeBefore: "For fees, see the ",
    feeLink: "Fee Schedule",
    flowBefore: "; for how to engage us, see ",
    flowLink: "How Engagement Works",
    after: ".",
  },
  "zh-tw": {
    metaTitle: "業務介紹｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所（東京都文京區小日向）的承辦業務一覽：障礙福祉服務指定申請、在留資格（簽證）、繼承・遺囑、公司設立・各類許可、補助金申請支援。各頁說明業務內容、報酬與受任流程。",
    crumbHome: "首頁",
    h1: "業務介紹",
    lead: (
      <>
        <strong>四葉行政書士事務所的承辦業務一覽。</strong>各業務的詳細內容、費用與流程，請參閱各頁面。
      </>
    ),
    who: "適合對象：",
    more: "查看詳情 →",
    jaOnly: "僅日文",
    feeBefore: "費用請參閱",
    feeLink: "報酬額表",
    flowBefore: "，委託流程請參閱",
    flowLink: "從諮詢到完成的受任流程",
    after: "。",
  },
  zh: {
    metaTitle: "业务介绍｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所（东京都文京区小日向）的承办业务一览：残障福祉服务指定申请、在留资格（签证）、继承・遗嘱、公司设立・各类许可、补助金申请支援。各页说明业务内容、报酬与受任流程。",
    crumbHome: "首页",
    h1: "业务介绍",
    lead: (
      <>
        <strong>四葉行政書士事務所的承办业务一览。</strong>各业务的详细内容、费用与流程，请参阅各页面。
      </>
    ),
    who: "适合对象：",
    more: "查看详情 →",
    jaOnly: "仅日文",
    feeBefore: "费用请参阅",
    feeLink: "报酬额表",
    flowBefore: "，委托流程请参阅",
    flowLink: "从咨询到完成的受任流程",
    after: "。",
  },
};

type Service = {
  href: string;
  /** ja のみ公開の業務ページ（availableLocales: ["ja"]） */
  jaOnly?: boolean;
  name: Record<LangCode, string>;
  who: Record<LangCode, string>;
};

const SERVICES: Service[] = [
  {
    href: "/legal/services/shogai-fukushi",
    name: { ja: "障害福祉サービスの指定申請", en: "Disability-Welfare Service Designation", "zh-tw": "障礙福祉服務指定申請", zh: "残障福祉服务指定申请" },
    who: {
      ja: "グループホーム・放課後等デイ等を開設したい事業者",
      en: "Operators planning to open a group home, an after-school day service or a similar facility",
      "zh-tw": "計劃開設共同生活援助（團體家屋）、放學後等日間服務等設施的事業者",
      zh: "计划开设共同生活援助（集体住宅）、放学后等日间服务等设施的事业者",
    },
  },
  {
    href: "/legal/services/visa",
    name: { ja: "在留資格・ビザ申請", en: "Visa & Residence Status Applications", "zh-tw": "在留資格（簽證）申請", zh: "在留资格（签证）申请" },
    who: {
      ja: "在留資格の取得・変更・更新をしたい外国人・受入企業",
      en: "Foreign nationals and host companies seeking to obtain, change or renew a residence status",
      "zh-tw": "欲取得、變更或更新在留資格的外國人及受理企業",
      zh: "希望取得、变更或更新在留资格的外国人及接收企业",
    },
  },
  // 2026-07-25追加＝企業向け（B2B）。上の visa は本人視点で読者が異なる
  {
    href: "/legal/services/gaikokujin-shain",
    jaOnly: true,
    name: { ja: "外国人社員の受け入れ", en: "Bringing in Foreign Employees", "zh-tw": "接納外國員工", zh: "接收外国员工" },
    who: {
      ja: "海外から社員を迎える企業（手続きの期限管理・帯同家族・書類の認証）",
      en: "Companies bringing employees from overseas (deadline management, accompanying family, document authentication)",
      "zh-tw": "從海外迎接員工的企業（手續期限管理、隨行家屬、文件認證）",
      zh: "从海外迎接员工的企业（手续期限管理、随行家属、文件认证）",
    },
  },
  // 2026-08-06追加＝監理支援機関の側（B2B）。上の2つは受入企業・本人の視点で読者が異なる
  {
    href: "/legal/services/ikuseishuro-gaibu-kansa",
    jaOnly: true,
    name: { ja: "育成就労の外部監査人", en: "External Auditor under the Employment for Skill Development System", "zh-tw": "育成就勞的外部監查人", zh: "育成就劳的外部监查人" },
    who: {
      ja: "監理支援機関の許可を検討する事業者（2027年4月施行に向けた外部監査の体制）",
      en: "Organizations considering a license as a supervising and support organization (external audit arrangements ahead of the April 2027 start)",
      "zh-tw": "考慮取得監理支援機關許可的事業者（因應2027年4月施行的外部監查體制）",
      zh: "考虑取得监理支援机构许可的事业者（面向2027年4月施行的外部监查体制）",
    },
  },
  {
    href: "/legal/services/inheritance",
    name: { ja: "相続・遺言・信託", en: "Inheritance, Wills & Trusts", "zh-tw": "繼承・遺囑・信託", zh: "继承・遗嘱・信托" },
    who: {
      ja: "遺産分割協議書・遺言書を整えたい方",
      en: "Anyone who wants to put an estate division agreement or a will in order",
      "zh-tw": "希望備妥遺產分割協議書或遺囑的人",
      zh: "希望备妥遗产分割协议书或遗嘱的人",
    },
  },
  // 2026-07-25追加＝家族向け（B2C）。上の shogai-fukushi は事業者向けで読者が異なる
  {
    href: "/legal/services/oyanakiato",
    jaOnly: true,
    name: { ja: "親なき後の備え", en: "Preparing for Life After Parents Are Gone", "zh-tw": "為「父母身後」預作準備", zh: "为“父母身后”提前准备" },
    who: {
      ja: "障害のあるお子さんの暮らしと実家に備えたいご家族",
      en: "Families preparing for the future life and family home of a child with a disability",
      "zh-tw": "希望為身心障礙子女的生活與老家預作準備的家庭",
      zh: "希望为残障子女的生活与老家提前准备的家庭",
    },
  },
  {
    href: "/legal/services/company",
    name: { ja: "会社設立・各種許認可", en: "Company Formation & Licensing", "zh-tw": "公司設立・各類許可", zh: "公司设立・各类许可" },
    who: {
      ja: "起業・許認可が必要な事業者（外国人の起業含む）",
      en: "Businesses that need to incorporate or obtain licenses (including foreign founders)",
      "zh-tw": "需要設立公司或取得許可的事業者（含外國人創業）",
      zh: "需要设立公司或取得许可的事业者（含外国人创业）",
    },
  },
  {
    href: "/legal/services/subsidy",
    name: { ja: "補助金申請サポート", en: "Subsidy Application Support", "zh-tw": "補助金申請支援", zh: "补助金申请支援" },
    who: {
      ja: "伝わる事業計画書で補助金に挑みたい事業者",
      en: "Businesses aiming for a subsidy with a business plan that gets its point across",
      "zh-tw": "希望以清楚傳達的事業計畫書挑戰補助金的事業者",
      zh: "希望以清晰传达的事业计划书挑战补助金的事业者",
    },
  },
];

/** リンク先のロケール。ja のみ公開の業務は日本語版へ送る */
function linkLocale(s: Service, locale: LangCode): LangCode {
  return s.jaOnly ? "ja" : locale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services",
    locale,
    absoluteTitle: true,
  });
}

function jsonLd(locale: LangCode) {
  const c = COPY[locale] ?? COPY.ja;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": canonicalUrl("legal", "/legal/services", locale) + "#collection",
        name: c.metaTitle,
        url: canonicalUrl("legal", "/legal/services", locale),
        hasPart: SERVICES.map((s) => ({
          "@type": "Service",
          name: s.name[locale] ?? s.name.ja,
          url: canonicalUrl("legal", s.href, linkLocale(s, locale)),
        })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale)) }} />
      <Breadcrumb items={[{ name: c.crumbHome, href: "/legal" }, { name: c.h1 }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-3 leading-relaxed text-text">{c.lead}</p>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={addLocalePrefix(s.href, linkLocale(s, locale))}
              hrefLang={s.jaOnly && locale !== "ja" ? "ja" : undefined}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">
                {s.name[locale] ?? s.name.ja}
                {s.jaOnly && c.jaOnly && (
                  <span className="ml-2 rounded-full bg-surface-dim px-2 py-0.5 align-middle font-sans text-xs font-normal text-text-muted">
                    {c.jaOnly}
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-text-muted">
                {c.who}
                {s.who[locale] ?? s.who.ja}
              </div>
              <div className="mt-2 text-sm font-medium text-primary underline">{c.more}</div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm text-text-muted">
          {c.feeBefore}
          <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">{c.feeLink}</Link>
          {c.flowBefore}
          <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">{c.flowLink}</Link>
          {c.after}
        </p>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
