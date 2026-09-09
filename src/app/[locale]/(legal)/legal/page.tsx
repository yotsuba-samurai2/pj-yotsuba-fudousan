// /legal（型F・士業トップ）＝原稿_行政書士 #10（D-4改修）＋フェーズI多言語化（2026-07-10）
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=HomePageContent b68871d）。Firestoreは書き換えない。
// V10: 在留資格を主軸に再構成。事務所名はHero内に維持し、社労士訴求は既存の公開フラグで制御。
// 業際：全ロケールで社労士側の金銭支援用語を書かない（「補助金」のみ）。JSON-LDはlayout出力＝ここでは出さない。
import type { Metadata } from "next";
import { BCP47_BY_LOCALE, buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";
import { SR_BIO } from "@/lib/shared/sr-label";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { LEGAL_TOP_V10_COPY } from "@/lib/legal/top-copy";
import { getCrossLinks } from "@/lib/cross-links";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Faq } from "@/components/shared/Faq";

type LegalTopCopy = {
  heroAlt: string;
  services: { href: string; label: string; sub: string }[];
  repName: string;
  repBio: string;
  profileLabel: string;
  membershipsHeading: string;
  nav: { href: string; label: string }[];
};

const MEMBERSHIPS = [
  { name: "日本行政書士会連合会", url: "https://www.gyosei.or.jp/" },
  { name: "東京都行政書士会", url: "https://www.tokyo-gyosei.or.jp/" },
  { name: "東京都行政書士会 文京支部", url: "https://gyosei-bunkyo.org/" },
];

const COPY: Record<LangCode, LegalTopCopy> = {
  ja: {
    heroAlt: "四葉行政書士事務所のイメージ（文京区の事務所）",
    services: [
      { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの指定申請", sub: "グループホーム開設を法人設立から運営まで" },
      { href: "/legal/services/visa", label: "在留資格・ビザ申請", sub: "中国語・英語で相談できる申請取次" },
      { href: "/legal/services/gaikokujin-shain", label: "外国人社員の受け入れ", sub: "企業の人事・総務へ。認定証明書から入国後の届出まで" },
      { href: "/legal/services/inheritance", label: "相続・遺言・信託", sub: "遺産分割協議書・遺言書の作成" },
      { href: "/legal/services/oyanakiato", label: "親なき後の備え", sub: "障害のあるお子さんの暮らしと実家に備えるご家族へ" },
      { href: "/legal/services/company", label: "会社設立・各種許認可", sub: "外国人の起業・経営管理ビザにも対応" },
      { href: "/legal/services/subsidy", label: "補助金申請サポート", sub: "元記者が書く「伝わる事業計画書」" },
    ],
    repName: "浦松 丈二（うらまつ・じょうじ）",
    repBio:
      `元毎日新聞中国総局長（記者歴34年）。行政書士（登録番号 第25087022号）・宅地建物取引士。${SR_BIO.ja}。「事実を整理して、伝わる形にする」——記者として34年続けた仕事を、いまは行政書士の書類と申請に注いでいます。`,
    profileLabel: "プロフィール：",
    membershipsHeading: "所属団体",
    nav: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/faq", label: "よくある質問" },
      { href: "/legal/column", label: "コラム" },
      { href: "/legal/about", label: "事務所概要" },
    ],
  },
  en: {
    heroAlt: "Yotsuba Gyoseishoshi Office in Bunkyo, Tokyo",
    services: [
      { href: "/legal/services/shogai-fukushi", label: "Disability-Welfare Service Designation", sub: "From incorporation to opening and running a group home" },
      { href: "/legal/services/visa", label: "Visa & Residence Status", sub: "Certified application agent—consultations in Chinese and English" },
      { href: "/legal/services/gaikokujin-shain", label: "Bringing Employees from Overseas", sub: "For HR and admin teams—from the certificate of eligibility to post-arrival filings" },
      { href: "/legal/services/inheritance", label: "Inheritance, Wills & Trusts", sub: "Estate-division agreements and will drafting" },
      { href: "/legal/services/company", label: "Company Formation & Licensing", sub: "Also for foreign founders and business-manager visas" },
      { href: "/legal/services/subsidy", label: "Subsidy Application Support", sub: "Business plans that persuade, written by a former journalist" },
    ],
    repName: "Joji Uramatsu",
    // 2026-09-05 月次点検（NEW-SR-3）：社労士表記は SR_BIO.en（SR_LAUNCHED 連動）。12c8022 で en だけ取りこぼしていた
    repBio:
      `Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Gyoseishoshi (Reg. No. 25087022) and Licensed Real Estate Transaction Specialist. ${SR_BIO.en}. Thirty-four years of turning facts into clear writing now go into every application we file.`,
    profileLabel: "Profile: ",
    membershipsHeading: "Memberships",
    nav: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/faq", label: "FAQ" },
      { href: "/legal/column", label: "Column" },
      { href: "/legal/about", label: "About the Office" },
    ],
  },
  "zh-tw": {
    heroAlt: "四葉行政書士事務所（東京文京區）",
    services: [
      { href: "/legal/services/shogai-fukushi", label: "障礙福祉服務指定申請", sub: "從法人設立到團體家屋的開設與營運" },
      { href: "/legal/services/visa", label: "在留資格（簽證）申請", sub: "可用中文・英文諮詢的申請取次" },
      { href: "/legal/services/gaikokujin-shain", label: "外籍員工的接受準備", sub: "為企業人事・總務。從在留資格認定證明書到入境後的申報" },
      { href: "/legal/services/inheritance", label: "繼承・遺囑・信託", sub: "遺產分割協議書・遺囑的製作" },
      { href: "/legal/services/company", label: "公司設立・各類許可", sub: "外國人創業・經營管理簽證亦可對應" },
      { href: "/legal/services/subsidy", label: "補助金申請支援", sub: "前記者執筆「能打動人的事業計畫書」" },
    ],
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio:
      `曾任每日新聞中國總局長（記者資歷34年）。行政書士（登錄編號 第25087022號）・宅地建物取引士。${SR_BIO.zhTw}。「把事實整理成能傳達的形式」——34年的記者功夫，現在傾注於行政書士的文件與申請。`,
    profileLabel: "個人檔案：",
    membershipsHeading: "所屬團體",
    nav: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/faq", label: "常見問題" },
      { href: "/legal/column", label: "專欄" },
      { href: "/legal/about", label: "事務所簡介" },
    ],
  },
  zh: {
    heroAlt: "四葉行政書士事務所（东京文京区）",
    services: [
      { href: "/legal/services/shogai-fukushi", label: "残障福祉服务指定申请", sub: "从法人设立到团体家屋的开设与运营" },
      { href: "/legal/services/visa", label: "在留资格（签证）申请", sub: "可用中文・英文咨询的申请取次" },
      { href: "/legal/services/gaikokujin-shain", label: "外籍员工的接收准备", sub: "为企业人事・总务。从在留资格认定证明书到入境后的申报" },
      { href: "/legal/services/inheritance", label: "继承・遗嘱・信托", sub: "遗产分割协议书・遗嘱的制作" },
      { href: "/legal/services/company", label: "公司设立・各类许可", sub: "外国人创业・经营管理签证亦可对应" },
      { href: "/legal/services/subsidy", label: "补助金申请支援", sub: "前记者执笔“能打动人的事业计划书”" },
    ],
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio:
      `曾任每日新闻中国总局长（记者经历34年）。行政书士（登录编号 第25087022号）・宅地建物取引士。${SR_BIO.zh}。“把事实整理成能传达的形式”——34年的记者功夫，现在倾注于行政书士的文件与申请。`,
    profileLabel: "个人简介：",
    membershipsHeading: "所属团体",
    nav: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/faq", label: "常见问题" },
      { href: "/legal/column", label: "专栏" },
      { href: "/legal/about", label: "事务所简介" },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: LEGAL_TOP_V10_COPY[locale].title,
    description: LEGAL_TOP_V10_COPY[locale].description,
    path: "/legal",
    locale,
    // absoluteTitle=true 維持：サイトトップ（/・/legal）は title に社名を含める方式で統一しているため、
    // レイアウトの「%s | 四葉行政書士事務所」テンプレートは付与しない（社名重複防止）。
    // V10の訴求語を先頭、事務所名を末尾に置く。OG/Twitterにも同じtitleを使用する。
    absoluteTitle: true,
  });
}

export default async function LegalPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const v = LEGAL_TOP_V10_COPY[locale];
  const crossLinks = getCrossLinks("/legal", SR_LAUNCHED);
  const foreignCross = crossLinks.find(link => link.id === "C17");
  const ghCross = crossLinks.find(link => link.id === "C18");
  const faqs = [...v.faqs, { q: v.laborQuestion, a: SR_LAUNCHED ? v.labor : v.unavailable }];
  const featuredPaths = new Set(["/legal/services/visa", "/legal/services/gaikokujin-shain", "/legal/services/company", "/legal/services/shogai-fukushi"]);
  const otherServices = c.services.filter(service => !featuredPaths.has(service.href));
  return (
    <>
      <section className="relative">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-b-3xl bg-surface md:grid-cols-2 sm:mt-4 sm:rounded-3xl">
          <div className="p-5 sm:p-8 md:py-12">
            <p className="text-sm font-semibold text-primary">四葉行政書士事務所</p>
            <h1 className="mt-3 font-serif text-3xl font-bold leading-snug text-ink sm:text-4xl">{SR_LAUNCHED ? v.hero : v.beforeLaunchHero}</h1>
            <p className="mt-4 leading-relaxed text-text">{v.sub}</p>
            {SR_LAUNCHED && <p className="mt-3 text-sm leading-relaxed text-text">{v.dual}</p>}
            <p className="mt-3 font-semibold text-primary">{v.chineseShort}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={addLocalePrefix("/legal/services/visa", locale)} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">{v.visaCta}</Link>
              <Link href={addLocalePrefix("/legal/contact", locale)} className="rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary">{v.contactCta}</Link>
            </div>
            <p className="mt-4 text-sm"><Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">{v.foreignCta}</Link></p>
          </div>
          <img src="/hero/legal-top-16x9.webp" alt={c.heroAlt} width={1600} height={900} className="h-full max-h-[420px] w-full object-cover md:max-h-none" fetchPriority="high" />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.visaTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.visa}</p>
          <p className="mt-3 leading-relaxed text-text">{v.consistency}</p>
          <p className="mt-4"><Link href={addLocalePrefix("/legal/services/visa", locale)} className="text-primary underline">{v.visaCta}</Link></p>
        </section>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.foreignTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.foreign}</p>
          <p className="mt-4"><Link href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)} className="text-primary underline">{v.foreignCta}</Link></p>
          {foreignCross && <CrossLinkBanner link={foreignCross} lead={v.labor} />}
        </section>
        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.chineseTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.chinese}</p>
        </section>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.companyTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.company}</p>
          <p className="mt-4"><Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">{v.companyLink}</Link></p>
        </section>
        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-primary">{v.industry}</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">{v.ghTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.gh}</p>
          <p className="mt-4"><Link href={addLocalePrefix("/legal/services/shogai-fukushi", locale)} className="text-primary underline">{v.ghLink}</Link></p>
          {ghCross && <CrossLinkBanner link={ghCross} lead={v.ghLabor} />}
        </section>
        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.filingTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{v.filing}</p>
        </section>

        {/* 代表紹介（E-E-A-T） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <img
            src="/staff/uramatsu.webp"
            alt="四葉行政書士事務所 代表 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            {SR_LAUNCHED && <p className="mb-2 text-sm font-semibold text-primary">{v.dualTitle}</p>}
            <h2 className="font-serif text-lg font-semibold text-ink">{c.repName}</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{c.repBio}</p>
            <p className="mt-2 text-xs">
              {c.profileLabel}
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                士業ドットコム
              </a>
              ／
              <a
                href="https://www.wikidata.org/wiki/Q139738129"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Wikidata
              </a>
            </p>
          </div>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.laborTitle}</h2>
          <p className="mt-3 leading-relaxed text-text">{SR_LAUNCHED ? v.labor : v.unavailable}</p>
          {foreignCross && <CrossLinkBanner link={foreignCross} lead={v.dual} />}
        </section>
        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-ink">{v.otherTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherServices.map(service => <Link key={service.href} href={addLocalePrefix(service.href, locale)} className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-serif text-lg font-semibold text-ink">{service.label}</h3>
              <p className="mt-1 text-sm text-text-muted">{service.sub}</p>
            </Link>)}
          </div>
        </section>
        <div className="mt-10"><Faq bare items={faqs} heading={v.faqTitle} ariaLabel={v.faqTitle} withJsonLd inLanguage={BCP47_BY_LOCALE[locale]} /></div>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">{v.disclaimer}</p>

        {/* 所属団体（固有名詞＝全ロケール日本語正式名） */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-4 text-sm">
          <h2 className="font-serif text-base font-semibold text-ink">{c.membershipsHeading}</h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {MEMBERSHIPS.map((m) => (
              <li key={m.url}>
                <a href={m.url} target="_blank" rel="noreferrer" className="underline">
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 導線 */}
        <nav aria-label="site links" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          {c.nav.map((n) => (
            <Link key={n.href} href={addLocalePrefix(n.href, locale)} className="underline">
              {n.label}
            </Link>
          ))}
        </nav>
      </main>

      {/* 既存の言語別問い合わせ導線 */}
      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="legal" />
      </div>
      {/* いい相続との相互リンクは TenantLayout のフッター（資格表記の直下）へ移設した
          （浦松指示 2026-08-07）。このページ固有の実装は持たない。 */}
    </>
  );
}
