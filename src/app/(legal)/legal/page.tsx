// /legal（型F・士業トップ）＝原稿_行政書士 #10（D-4改修）＋フェーズI多言語化（2026-07-10）
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=HomePageContent b68871d）。Firestoreは書き換えない。
// H1＝事務所名のみ（業法分離・全ロケール同一表記）。en/zh-tw/zh訳＝監修前ドラフト（フェーズI後半で台湾監修）。
// 業際：全ロケールで社労士側の金銭支援用語を書かない（「補助金」のみ）。JSON-LDはlayout出力＝ここでは出さない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

type LegalTopCopy = {
  metaTitle: string;
  metaDesc: string;
  heroAlt: string;
  lead: React.ReactNode;
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
    metaTitle: "四葉行政書士事務所｜文京区・茗荷谷の行政書士",
    metaDesc:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉行政書士事務所。障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請に対応。元毎日新聞中国総局長の行政書士が、中国語・英語も交え、書類作成から申請までお手伝いします。",
    heroAlt: "四葉行政書士事務所のイメージ（文京区の事務所）",
    lead: (
      <>
        <strong>東京都文京区小日向の行政書士事務所です。</strong>複雑な手続きを、整理して前に進める。——障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請を、元毎日新聞中国総局長の行政書士がお手伝いします。中国語・英語での相談にも対応します。
      </>
    ),
    services: [
      { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの指定申請", sub: "グループホーム開設を法人設立から運営まで" },
      { href: "/legal/services/visa", label: "在留資格・ビザ申請", sub: "中国語・英語で相談できる申請取次" },
      { href: "/legal/services/inheritance", label: "相続・遺言・信託", sub: "遺産分割協議書・遺言書の作成" },
      { href: "/legal/services/company", label: "会社設立・各種許認可", sub: "外国人の起業・経営管理ビザにも対応" },
      { href: "/legal/services/subsidy", label: "補助金申請サポート", sub: "元記者が書く「伝わる事業計画書」" },
    ],
    repName: "浦松 丈二（うらまつ・じょうじ）",
    repBio:
      "元毎日新聞中国総局長（記者歴34年）。行政書士（登録番号 第25087022号）・宅地建物取引士。社会保険労務士試験合格（2026年9月開業予定）。「事実を整理して、伝わる形にする」——記者として34年続けた仕事を、いまは行政書士の書類と申請に注いでいます。",
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
    metaTitle: "四葉行政書士事務所｜Gyoseishoshi (Administrative Scrivener) Office in Bunkyo, Tokyo",
    metaDesc:
      "Yotsuba Gyoseishoshi Office, a 5-minute walk from Myogadani Station in Kohinata, Bunkyo-ku, Tokyo. Disability-welfare service designation, visas and residence status, inheritance paperwork, company formation, and subsidy applications—handled by a former Mainichi Shimbun China bureau chief, with support in Chinese and English.",
    heroAlt: "Yotsuba Gyoseishoshi Office in Bunkyo, Tokyo",
    lead: (
      <>
        <strong>A gyoseishoshi (administrative scrivener) office in Kohinata, Bunkyo-ku, Tokyo.</strong> We untangle complex procedures and move them forward—disability-welfare service designation, visas and residence status, inheritance, company formation, and subsidy applications, handled by a former Mainichi Shimbun China bureau chief. Consultations available in Chinese and English.
      </>
    ),
    services: [
      { href: "/legal/services/shogai-fukushi", label: "Disability-Welfare Service Designation", sub: "From incorporation to opening and running a group home" },
      { href: "/legal/services/visa", label: "Visa & Residence Status", sub: "Certified application agent—consultations in Chinese and English" },
      { href: "/legal/services/inheritance", label: "Inheritance, Wills & Trusts", sub: "Estate-division agreements and will drafting" },
      { href: "/legal/services/company", label: "Company Formation & Licensing", sub: "Also for foreign founders and business-manager visas" },
      { href: "/legal/services/subsidy", label: "Subsidy Application Support", sub: "Business plans that persuade, written by a former journalist" },
    ],
    repName: "Joji Uramatsu",
    repBio:
      "Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Gyoseishoshi (Reg. No. 25087022) and licensed real estate broker. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026). Thirty-four years of turning facts into clear writing now go into every application we file.",
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
    metaTitle: "四葉行政書士事務所｜文京區・茗荷谷的行政書士",
    metaDesc:
      "位於東京都文京區小日向、茗荷谷站步行5分鐘的四葉行政書士事務所。受理障礙福祉服務指定申請、在留資格（簽證）、繼承、公司設立、補助金申請。曾任每日新聞中國總局長的行政書士，提供中文・英文諮詢，從文件製作到申請全程協助。",
    heroAlt: "四葉行政書士事務所（東京文京區）",
    lead: (
      <>
        <strong>位於東京都文京區小日向的行政書士事務所。</strong>把複雜的手續整理清楚、向前推進。——障礙福祉服務的指定申請、在留資格（簽證）、繼承、公司設立、補助金申請，由曾任每日新聞中國總局長的行政書士為您協助。提供中文・英文諮詢。
      </>
    ),
    services: [
      { href: "/legal/services/shogai-fukushi", label: "障礙福祉服務指定申請", sub: "從法人設立到團體家屋的開設與營運" },
      { href: "/legal/services/visa", label: "在留資格（簽證）申請", sub: "可用中文・英文諮詢的申請取次" },
      { href: "/legal/services/inheritance", label: "繼承・遺囑・信託", sub: "遺產分割協議書・遺囑的製作" },
      { href: "/legal/services/company", label: "公司設立・各類許可", sub: "外國人創業・經營管理簽證亦可對應" },
      { href: "/legal/services/subsidy", label: "補助金申請支援", sub: "前記者執筆「能打動人的事業計畫書」" },
    ],
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio:
      "曾任每日新聞中國總局長（記者資歷34年）。行政書士（登錄編號 第25087022號）・宅地建物取引士。已通過社會保險勞務士考試（預定2026年9月開業）。「把事實整理成能傳達的形式」——34年的記者功夫，現在傾注於行政書士的文件與申請。",
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
    metaTitle: "四葉行政書士事務所｜文京区・茗荷谷的行政书士",
    metaDesc:
      "位于东京都文京区小日向、茗荷谷站步行5分钟的四葉行政書士事務所。受理残障福祉服务指定申请、在留资格（签证）、继承、公司设立、补助金申请。曾任每日新闻中国总局长的行政书士，提供中文・英文咨询，从文件制作到申请全程协助。",
    heroAlt: "四葉行政書士事務所（东京文京区）",
    lead: (
      <>
        <strong>位于东京都文京区小日向的行政书士事务所。</strong>把复杂的手续整理清楚、向前推进。——残障福祉服务的指定申请、在留资格（签证）、继承、公司设立、补助金申请，由曾任每日新闻中国总局长的行政书士为您协助。提供中文・英文咨询。
      </>
    ),
    services: [
      { href: "/legal/services/shogai-fukushi", label: "残障福祉服务指定申请", sub: "从法人设立到团体家屋的开设与运营" },
      { href: "/legal/services/visa", label: "在留资格（签证）申请", sub: "可用中文・英文咨询的申请取次" },
      { href: "/legal/services/inheritance", label: "继承・遗嘱・信托", sub: "遗产分割协议书・遗嘱的制作" },
      { href: "/legal/services/company", label: "公司设立・各类许可", sub: "外国人创业・经营管理签证亦可对应" },
      { href: "/legal/services/subsidy", label: "补助金申请支援", sub: "前记者执笔“能打动人的事业计划书”" },
    ],
    repName: "浦松 丈二（Uramatsu Joji）",
    repBio:
      "曾任每日新闻中国总局长（记者经历34年）。行政书士（登录编号 第25087022号）・宅地建物取引士。已通过社会保险劳务士考试（预定2026年9月开业）。“把事实整理成能传达的形式”——34年的记者功夫，现在倾注于行政书士的文件与申请。",
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
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal",
    locale,
    absoluteTitle: true,
  });
}

export default async function LegalPage() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <>
      {/* ヒーロー（H1＝事務所名のみ・全ロケール同一＝業法分離。30%透過・SP縦積みは現状維持） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/legal-top-16x9.webp"
            alt={c.heroAlt}
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          <div className="md:absolute md:inset-0 md:flex md:items-center">
            <div className="bg-surface p-5 md:m-8 md:max-w-xl md:rounded-2xl md:bg-white/30 md:p-7 md:backdrop-blur-sm">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">四葉行政書士事務所</h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">{c.lead}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* 取扱業務カード */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {c.services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{s.label}</div>
              <div className="mt-1 text-sm text-text-muted">{s.sub}</div>
            </Link>
          ))}
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
                SAMURAI
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
            <Link key={n.href} href={n.href} className="underline">
              {n.label}
            </Link>
          ))}
        </nav>
      </main>

      {/* CTA帯＝共通部品（ja固定）＝フェーズI後半の翻訳キー対応まで既知の残課題 */}
      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
