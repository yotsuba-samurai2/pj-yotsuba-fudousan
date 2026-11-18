import { SchoolEventsTeaser } from "@/components/gakku/SchoolEventsTeaser";
import { HomeTopicPanels } from "@/components/shared/HomeTopicPanels";
import { HomeEditorialHero } from "@/components/shared/HomeEditorialHero";
import { HomeSchoolFinder } from "@/components/gakku/HomeSchoolFinder";
import styles from "@/components/shared/HomeEditorial.module.css";
import { CustomerVoicesPreview } from "@/components/shared/CustomerVoices";
import Image from "next/image";
// Local consultation home: human LINE and purpose-based routes first; retain existing specialist resources and four locales.
import Link from "next/link";
import { LazyLinkaWidget } from "@/components/linka/LazyLinkaWidget";
import { CtaBand } from "@/components/shared/CtaBand";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { fetchTranslations } from "@/lib/getTranslationData";
import { getNestedValue } from "@/lib/seo";
import { getLatestColumns, getLocalizedColumn } from "@/lib/columns";
import type { LangCode } from "@/config/languages";

const HOME_COLUMNS_HEADING: Record<LangCode, { title: string; all: string }> = {
  ja: { title: "お役立ちコラム", all: "コラム一覧へ" },
  en: { title: "Helpful Columns", all: "View all columns" },
  "zh-tw": { title: "實用專欄", all: "查看所有專欄" },
  zh: { title: "实用专栏", all: "查看所有专栏" },
};

type QaCopy = { q: string; a: string; anchor: string };
type TopCopy = {
  heroAlt: string;
  diagnosisH2: string;
  diagnosisChips: { href: string; label: string }[];
  diagnosisNote: string;
  repAlt: string;
  repName: string;
  repBio: string;
  profileLabel: string;
  qa: QaCopy[];
  qaHrefs: string[];
  nav: { href: string; label: string }[];
  // CTA帯の文言（ctaHeading/ctaLead/lineBtn/contactBtn/telBtn/accessLine）は2026-07-24 v2.1で削除
  // ＝共通CtaBand（variant="property-general"・4ロケール）へ一本化。
};

// 2026-07-22：GHのトップ導線を開設ピラー /group-home（物件＋指定申請の完全ガイド）へ。物件 spoke /toushi/group-home は他ページから継続被リンク。
const QA_HREFS = ["/souzoku", "/group-home", "/global", "/about"];
// 2026-09-05 月次点検（INIT-06/NEW-SALE-1）：5問目＝売主向け入口（相続以外・海外在住も）。
// /nagare は ja 先行（sitemap.ts locales:["ja"]）のため ja だけ /nagare、en/zh-tw/zh は4ロケール実在の /leaving-japan へ。
const QA_HREFS_JA = [...QA_HREFS, "/nagare"];
const QA_HREFS_INTL = [...QA_HREFS, "/leaving-japan"];

const COPY: Record<LangCode, TopCopy> = {
  ja: {
    heroAlt: "文京区・播磨坂の桜並木のイメージ",
    diagnosisH2: "相談の前に、希望条件を整理する（LINKA）",
    diagnosisChips: [
      { href: "/souzoku", label: "相続の相談" },
      { href: "/toushi", label: "投資・事業用を探す" },
      { href: "/global", label: "お部屋探し" },
      { href: "/toushi", label: "物件の希望条件を伝える" },
    ],
    diagnosisNote:
      "こんにちは、四葉不動産のLINKAです。相続・投資や事業用・お部屋探しなど、お困りごとを匿名でどうぞ。物件をお探しの方は、駅・賃料・広さなど希望条件だけでも大丈夫——条件を整理して、そのままLINEで送れる形にします。",
    repAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    repName: "浦松 丈二（うらまつ・じょうじ）",
    repBio: "文京区小日向で不動産の相談をお受けしている宅地建物取引士です。お部屋探し、事業用物件、相続した家の活用まで、まずはご事情を伺います。",
    profileLabel: "プロフィール：",
    qa: [
      {
        q: "文京区で不動産を相続したら、まず何をすればいいですか？",
        a: "まず相続登記の期限を確認します（2024年4月から義務化・原則3年以内）。進め方の全体は完全ガイドへ。",
        anchor: "相続不動産の完全ガイド",
      },
      {
        q: "グループホームに使える物件はどう探せばいいですか？",
        a: "指定基準（立地・構造・面積・消防）を見据えて、契約前に確認するのが鉄則です。",
        anchor: "グループホーム物件",
      },
      {
        q: "外国人でも日本で部屋を借りられますか？",
        a: "必要な書類や審査・保証の条件は物件ごとに異なります。日本語・英語・中国語でご案内します。",
        anchor: "多言語のお部屋探し",
      },
      {
        q: "四葉不動産はどんな会社ですか？",
        a: "文京区小日向の宅地建物取引業者です。学区からの住まい探し、事業用物件、相続不動産の管理・賃貸・売却を扱います。",
        anchor: "わたしたち",
      },
      {
        // 2026-09-05 月次点検（INIT-06/NEW-SALE-1）：売主向け入口。ja は /nagare（QA_HREFS_JA）へ。
        q: "相続以外でも、不動産の売却を相談できますか？",
        a: "ご相談いただけます。査定は無料で、海外在住の方のご相談にも対応しています。ご依頼から引渡しまでの手続き・書類・費用の時期は流れのページへ。",
        anchor: "ご依頼から引渡しまでの流れ",
      },
    ],
    qaHrefs: QA_HREFS_JA,
    nav: [
      { href: "/services", label: "サービス一覧" },
      { href: "/column", label: "コラム" },
      { href: "/faq", label: "よくある質問" },
      { href: "/access", label: "アクセス・料金" },
    ],
  },
  en: {
    heroAlt: "Cherry blossoms along Harimazaka in Bunkyo, Tokyo",
    diagnosisH2: "Organize your preferences before getting in touch (LINKA)",
    diagnosisChips: [
      { href: "/souzoku", label: "Inheritance" },
      { href: "/toushi", label: "Investment & business use" },
      { href: "/global", label: "Room hunting" },
      { href: "/toushi", label: "Share my property conditions" },
    ],
    diagnosisNote:
      "Hi, I'm LINKA, Yotsuba Real Estate's AI concierge. Tell me your situation anonymously—inheritance, investment or business-use property, or room hunting. Looking for a property? Just your conditions—station, rent, size—are enough: I'll organize them into a message you can send us on LINE as-is.",
    repAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    repName: "Joji Uramatsu",
    // 2026-09-05 月次点検（INIT-06）：開業予定の直書きを SR_BIO.en に（ja/zh-tw/zh と同方式・開業後は資格名のみ）
    repBio: "Joji Uramatsu is a licensed real estate transaction specialist based in Kohinata. He helps families find a home, businesses find premises and owners weigh their choices for inherited property.",
    profileLabel: "Profile: ",
    qa: [
      {
        q: "I inherited a property in Bunkyo—what should I do first?",
        a: "First, check the inheritance registration deadline (mandatory since April 2024; within three years in principle). See the complete guide for the full picture.",
        anchor: "Complete guide to inherited property",
      },
      {
        q: "How do I find a property that can be used as a group home?",
        a: "The golden rule is to check it against the designation standards (location, structure, floor area, fire safety) before signing a contract.",
        anchor: "Group-home properties",
      },
      {
        q: "Can foreign residents rent a home in Japan?",
        a: "Yes. Yotsuba Real Estate supports you in your own language—through screening, guarantors, and paperwork.",
        anchor: "Multilingual room hunting",
      },
      {
        q: "What kind of company is Yotsuba Real Estate?",
        a: "We are a licensed brokerage in Kohinata, Bunkyo. We help with housing by school district, business premises and inherited property.",
        anchor: "About us",
      },
      {
        // 2026-09-05 月次点検（INIT-06/NEW-SALE-1）：売主向け入口。/nagare は ja 限定のため /leaving-japan（QA_HREFS_INTL）へ。監修前ドラフト。
        q: "Can you help me sell a property that isn't inherited—for example, before I leave Japan?",
        a: "Yes. Appraisal is free, and we also work with owners living overseas. If you are still in Japan and leaving soon, start with our feature on selling even with only 30 days left.",
        anchor: "Selling before leaving Japan",
      },
    ],
    qaHrefs: QA_HREFS_INTL,
    nav: [
      { href: "/services", label: "Services" },
      { href: "/column", label: "Column" },
      { href: "/faq", label: "FAQ" },
      { href: "/access", label: "Access & Fees" },
    ],
  },
  "zh-tw": {
    heroAlt: "東京文京區・播磨坂的櫻花並木",
    diagnosisH2: "諮詢前先整理需求（LINKA）",
    diagnosisChips: [
      { href: "/souzoku", label: "繼承諮詢" },
      { href: "/toushi", label: "尋找投資・事業用物件" },
      { href: "/global", label: "找房" },
      { href: "/toushi", label: "告知希望條件" },
    ],
    diagnosisNote:
      "您好，我是四葉不動産的AI禮賓LINKA。繼承、投資・事業用物件、找房等，請以匿名方式告訴我您的狀況。若您正在找物件，只要告訴我車站・租金・面積等希望條件即可——我會為您整理成可直接用LINE傳送的內容。",
    repAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio: "浦松丈二是位於文京區小日向的宅地建物取引士，受理家庭找房、營業場所及繼承房產的諮詢。",
    profileLabel: "個人檔案：",
    qa: [
      {
        q: "在文京區繼承了不動產，首先該做什麼？",
        a: "首先確認繼承登記的期限（2024年4月起義務化・原則上3年內）。整體流程請見完整指南。",
        anchor: "繼承不動產完整指南",
      },
      {
        q: "可用於團體家屋的物件該如何尋找？",
        a: "鐵則是在簽約前，先對照指定基準（地點・結構・面積・消防）進行確認。",
        anchor: "團體家屋物件",
      },
      {
        q: "外國人也能在日本租屋嗎？",
        a: "可以。審查、保證、語言的門檻，四葉不動産以您的母語協助您跨過。",
        anchor: "多語言找房服務",
      },
      {
        q: "四葉不動産是什麼樣的公司？",
        a: "四葉不動産是位於文京區小日向的不動產仲介公司，提供學區找房、營業場所及繼承房產的服務。",
        anchor: "關於我們",
      },
      {
        // 2026-09-05 月次点検（INIT-06/NEW-SALE-1）：売主向け入口。/leaving-japan（QA_HREFS_INTL）へ。監修前ドラフト。
        q: "不是繼承的不動產，也能委託出售嗎？人在海外或即將出境也可以嗎？",
        a: "可以。估價免費，人在海外的屋主也能諮詢。若您人尚在日本且即將出境，請先參考「距離出境只剩30天也能賣」的專題。",
        anchor: "出國前的不動產出售",
      },
    ],
    qaHrefs: QA_HREFS_INTL,
    nav: [
      { href: "/services", label: "服務總覽" },
      { href: "/column", label: "專欄" },
      { href: "/faq", label: "常見問題" },
      { href: "/access", label: "交通與費用" },
    ],
  },
  zh: {
    heroAlt: "东京文京区・播磨坂的樱花街道",
    diagnosisH2: "咨询前先整理需求（LINKA）",
    diagnosisChips: [
      { href: "/souzoku", label: "继承咨询" },
      { href: "/toushi", label: "寻找投资・事业用物件" },
      { href: "/global", label: "找房" },
      { href: "/toushi", label: "告知希望条件" },
    ],
    diagnosisNote:
      "您好，我是四葉不動産的AI礼宾LINKA。继承、投资・事业用物件、找房等，请以匿名方式告诉我您的情况。若您正在找物件，只要告诉我车站・租金・面积等希望条件即可——我会为您整理成可直接用LINE发送的内容。",
    repAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio: "浦松丈二是位于文京区小日向的宅地建物取引士，受理家庭找房、经营场所及继承房产的咨询。",
    profileLabel: "个人简介：",
    qa: [
      {
        q: "在文京区继承了不动产，首先该做什么？",
        a: "首先确认继承登记的期限（2024年4月起义务化・原则上3年内）。整体流程请见完整指南。",
        anchor: "继承不动产完整指南",
      },
      {
        q: "可用于团体家屋的物件该如何寻找？",
        a: "铁则是在签约前，先对照指定基准（地点・结构・面积・消防）进行确认。",
        anchor: "团体家屋物件",
      },
      {
        q: "外国人也能在日本租房吗？",
        a: "可以。审查、担保、语言的门槛，四葉不動産以您的母语协助您跨过。",
        anchor: "多语言找房服务",
      },
      {
        q: "四葉不動産是什么样的公司？",
        a: "四葉不動産是位于文京区小日向的房地产经纪公司，提供学区找房、经营场所及继承房产服务。",
        anchor: "关于我们",
      },
      {
        // 2026-09-05 月次点検（INIT-06/NEW-SALE-1）：売主向け入口。/leaving-japan（QA_HREFS_INTL）へ。監修前ドラフト。
        q: "不是继承的不动产，也能委托出售吗？人在海外或即将出境也可以吗？",
        a: "可以。估价免费，人在海外的业主也能咨询。若您人尚在日本且即将出境，请先参考“距离出境只剩30天也能卖”的专题。",
        anchor: "出国前的不动产出售",
      },
    ],
    qaHrefs: QA_HREFS_INTL,
    nav: [
      { href: "/services", label: "服务总览" },
      { href: "/column", label: "专栏" },
      { href: "/faq", label: "常见问题" },
      { href: "/access", label: "交通与费用" },
    ],
  },
};

export default async function HomePageContent() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  // トップの内部リンク＝最新コラム3本（現在ロケール）。0件なら節ごと非表示。
  const latestColumns = (await getLatestColumns(3, locale)).map((col) =>
    getLocalizedColumn(col, locale),
  );
  const columnsCopy = HOME_COLUMNS_HEADING[locale] ?? HOME_COLUMNS_HEADING.ja;

  // 既存タグライン（Firestore翻訳・各locale値あり）＝サブコピーへ移設。取得不能時は非表示（退行なし）。
  let tagline = "";
  try {
    const t = await fetchTranslations(locale);
    tagline = [
      getNestedValue(t, "realestate.home.heroTitle1"),
      getNestedValue(t, "realestate.home.heroTitle2"),
      getNestedValue(t, "realestate.home.heroTitle3"),
    ]
      .filter(Boolean)
      .join("");
  } catch {
    tagline = "";
  }

  return (
    <div className={styles.page}>
      <HomeEditorialHero locale={locale} heroAlt={c.heroAlt} />
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <div id="home-school"><HomeSchoolFinder locale={locale}/></div>
          <div id="home-calendar"><SchoolEventsTeaser locale={locale}/></div>
        </div>
        <div className={styles.rest}>
        <HomeTopicPanels locale={locale} />
        {/* 代表紹介（E-E-A-T） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <Image
            src="/staff/uramatsu.webp"
            alt={c.repAlt}
            width={160}
            height={213}
            sizes="(min-width: 640px) 160px, 128px"
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            {tagline && <p className="mb-1 text-xs font-semibold tracking-wide text-primary-dark">{tagline}</p>}
            <h2 className="font-serif text-lg font-semibold text-ink">{c.repName}</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{c.repBio}</p>
            <p className="mt-2 text-xs">
              {c.profileLabel} <Link href={addLocalePrefix("/about/uramatsu",locale)} className="text-primary-dark underline">{c.repName}</Link> ／
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noreferrer"
                className="text-primary-dark underline"
              >
                士業ドットコム
              </a>
              ／
              <a
                href="https://www.wikidata.org/wiki/Q139738129"
                target="_blank"
                rel="noreferrer"
                className="text-primary-dark underline"
              >
                Wikidata
              </a>
            </p>
          </div>
        </section>

        {/* 疑問文H2直答（AIクエリ形・FAQPage JSON-LDは/faq専用＝表示のみ） */}
        <section aria-label="direct answers" className="mt-10 space-y-6">
          {c.qa.map((item, i) => (
            <div key={item.q}>
              <h2 className="font-serif text-lg font-semibold text-ink">{item.q}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text">
                {item.a}{" "}
                <Link href={addLocalePrefix(c.qaHrefs[i], locale)} className="text-primary-dark underline">
                  {item.anchor}
                </Link>
              </p>
            </div>
          ))}
        </section>

        <CustomerVoicesPreview businessKey="realestate" locale={locale} />

        {/* 導線 */}
        <nav aria-label="site links" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-dark">
          {c.nav.map((n) => (
            <Link key={n.href} href={addLocalePrefix(n.href, locale)} className="underline">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 最新コラム（内部リンク・SSR） */}
        {latestColumns.length > 0 && (
          <section
            aria-label="columns"
            className="mt-10 rounded-2xl border border-border bg-surface p-5 sm:p-6"
          >
            <h2 className="font-serif text-xl font-semibold text-ink">
              {columnsCopy.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {latestColumns.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={addLocalePrefix(`/column/${col.slug}`, locale)}
                    className="group block"
                  >
                    <span className="text-xs text-text-muted">
                      {col.date.replace(/-/g, ".")}
                    </span>
                    <p className="mt-0.5 text-sm font-medium text-ink group-hover:text-primary-dark">
                      {col.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={addLocalePrefix("/column", locale)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-primary-dark"
            >
              {columnsCopy.all}
            </Link>
          </section>
        )}

        {/* 60秒診断＝LINKAインライン本体（フェーズK接続済み・1ページ1LINKA＝右下FABはこのページ非表示のまま） */}
        <details className="mt-10 rounded-2xl bg-primary-tint p-4 sm:p-6">
          <summary className="cursor-pointer font-serif text-lg font-semibold text-ink">{c.diagnosisH2}</summary>
          <div className="mx-auto mt-4 h-[520px] max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface">
            <LazyLinkaWidget
              deferUntilVisible
              site="realestate"
              mode="concierge"
              greeting={c.diagnosisNote}
              chips={c.diagnosisChips.map((chip) => chip.label)}
              className="h-full"
            />
          </div>
        </details>

        {/* CTA帯＝共通CtaBand（2026-07-24 v2.1）。variant="property-general"＝住まい・事業用の両対応の
            物件条件インテーク（テンプレコピー・信頼行・GA計測・contactの?intent=bukken込み・4ロケール）。
            旧インライン版は「共通CtaBandがja固定」時代の産物のため撤去・一本化。 */}
        <div className="my-4">
          <CtaBand businessKey="realestate" variant="property-general" />
        </div>
        </div>
      </div>
    </div>
  );
}
