// /about/uramatsu（代表者プロフィール）＝タスクB-2（2026-07-19）
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/ryokin タスクB-1）。現フェーズ＝ja のみ公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定。sitemap側も locales:["ja"] で ja のみ出力。
//   多言語展開（en/zh-tw/zh）は後続ステップで COPY に追加する。
// 経歴事実の一次資料＝リポジトリ内の既存記載（llms.txt route・/global・/ryokin authorBio）に限定：
//   記者34年／中国総局長として中国や台湾、タイに駐在（中華圏に12年）／国立台湾師範大学に留学／2025年設立。
//   受賞歴・著書・講演実績などリポジトリで確認できない事実は書かない。国数表記（「4カ国」等）は使用禁止（タスクA-1で全廃済み）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   行政書士業務は「併設の四葉行政書士事務所が別契約で受任」の形でのみ記載。
// 社労士＝「2026年9月開業予定・現時点では未開業」の注記を維持（登録済み資格と横並びにしない）。
// JSON-LD：
//   - ProfilePage＋Person（mainEntity）。Personは既存founderと同一 @id（PERSON_ID）のサブセットノード
//     ＝B-2指定フィールドのみ（hasCredential=宅建士・行政書士の2件。社労士試験合格は本文注記のみで出力しない）。
//     Personフルノードの正は従来どおり /about の ProfilePageJsonLd（seo.ts PERSON_JSONLD）＝@id同一でKG上マージ。
//   - FAQPage（3問）＝Faq部品 withJsonLd。※既存規則「FAQPage は各サイト1本＝/faq のみ」（委任§4-6）の
//     例外＝タスクB-2指示による（B-1 /ryokin と同じ扱い）。
//   - BreadcrumbList＝Breadcrumb部品（ホーム＞会社概要＞代表プロフィール）。
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildPageMetadata, PERSON_ID, SAMURAI_URAMATSU_URL } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import type { LangCode } from "@/config/languages";

type Section = { h2: string; body: React.ReactNode };
type ProfileCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbAbout: string;
  breadcrumbCurrent: string;
  h1: string;
  /** 冒頭の回答ブロック（タスクB-2確定文言＝一字一句不変） */
  answerBlock: string;
  portraitAlt: string;
  sections: Section[];
  faqHeading: string;
  faqItems: FaqItem[];
  relatedAria: string;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
};

const JA: ProfileCopy = {
  metaTitle: "代表・浦松丈二プロフィール｜元新聞記者の宅建士・行政書士",
  metaDesc:
    "四葉不動産株式会社 代表取締役・浦松丈二のプロフィール。毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在。宅地建物取引士（東京・第293544号）・行政書士（登録番号第25087022号）。相続や外国人対応の相談に日本語・英語・中国語で応じます。法務手続きは併設の四葉行政書士事務所が別契約で受任します。",
  breadcrumbHome: "ホーム",
  breadcrumbAbout: "会社概要",
  breadcrumbCurrent: "代表プロフィール",
  h1: "浦松丈二（うらまつ・じょうじ）",
  answerBlock:
    "浦松丈二は四葉不動産株式会社の代表取締役で、宅地建物取引士（東京・第293544号）および行政書士（登録番号第25087022号）です。毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。2026年9月に社会保険労務士事務所の開業を予定しています。相続や外国人対応の相談に、日本語・英語・中国語で応じます。不動産取引は四葉不動産、法務手続きは四葉行政書士事務所がそれぞれ別契約で担当します。",
  portraitAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  sections: [
    {
      h2: "経歴",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました（中華圏に12年）。国立台湾師範大学に留学し、中国語（繁体字・簡体字）での取材・折衝を重ねてきました。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            2025年、東京都文京区小日向に四葉不動産株式会社を設立し、代表取締役に就任。あわせて四葉行政書士事務所を開設し、代表行政書士を務めています。不動産取引は四葉不動産株式会社が、相続書類・許認可などの法務手続きは併設の四葉行政書士事務所が、それぞれ別契約で受任します。
          </p>
        </>
      ),
    },
    {
      h2: "保有資格",
      body: (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-text">
            <li>宅地建物取引士（東京）第293544号</li>
            <li>行政書士 登録番号第25087022号</li>
          </ul>
          {/* 社労士は「試験合格」のみ別立て表記（登録済み資格と横並びにしない・社労士_試験合格表記_実装指示_v1 §0） */}
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
            社会保険労務士試験合格（令和7年 第202500525号）。2026年9月に社会保険労務士事務所の開業を予定しており、現時点では未開業です。
          </p>
        </>
      ),
    },
    {
      h2: "多言語対応の背景",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          中国総局長として中国や台湾、タイに駐在した経験と、国立台湾師範大学への留学経験に基づき、日本語・英語・中国語（繁体字・簡体字）でご相談に応じています。中国語での取材・折衝を重ねてきた経験を、外国人のお客さまの住まい探しや契約のサポートに活かしています。
        </p>
      ),
    },
    {
      h2: "士業ドットコムの運営",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            士業の検索・予約サイト「士業ドットコム」（samurai.co.jp）を運営しています。同サイトでは代表のプロフィール・相談予約ページも公開しています。
          </p>
          {/* 外部リンクは代表予約ページ1本のみ（浦松指示 2026-07-19＝samurai.co.jpトップへは張らない） */}
          <p className="mt-3 text-sm">
            <a
              href={SAMURAI_URAMATSU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              士業ドットコムの代表プロフィール・予約ページ
            </a>
          </p>
        </>
      ),
    },
  ],
  faqHeading: "代表・浦松丈二についてよくあるご質問",
  faqItems: [
    {
      q: "浦松丈二はどんな経歴ですか？",
      a: "毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。2025年に東京都文京区小日向で四葉不動産株式会社を設立し、代表取締役を務めています。あわせて四葉行政書士事務所を開設し、代表行政書士を務めています。",
    },
    {
      q: "保有資格は何ですか？",
      a: "宅地建物取引士（東京・第293544号）と行政書士（登録番号第25087022号）です。社会保険労務士は試験に合格しており（令和7年 第202500525号）、2026年9月に事務所の開業を予定しています（現時点では未開業）。",
    },
    {
      q: "中国語対応の背景は？",
      a: "中国総局長として中国や台湾、タイに駐在した経験と、国立台湾師範大学への留学経験に基づいています。日本語・英語・中国語（繁体字・簡体字）でご相談に応じています。",
    },
  ],
  relatedAria: "関連リンク",
  relatedHeading: "このページの関連リンク",
  relatedLinks: [
    { href: "/about", label: "会社概要" },
    { href: "/legal", label: "四葉行政書士事務所" },
    { href: "/souzoku", label: "文京区で不動産を相続したら" },
    { href: "/global", label: "外国人・多言語のお部屋探し" },
    { href: "/contact", label: "お問い合わせ" },
  ],
};

// 現フェーズ＝jaのみ。多言語展開時にこの Partial へ en/zh-tw/zh を追加し、
// availableLocales・sitemap の locales も合わせて広げる。
const COPY: Partial<Record<LangCode, ProfileCopy>> = { ja: JA };

/**
 * ProfilePage＋Person（B-2指定のサブセットノード）。
 * hasCredential＝宅建士・行政書士の2件のみ（seo.ts PERSON_JSONLD と同一構造。
 * 社労士試験合格は本文注記のみ＝ここには含めない）。sameAs＝B-2指定の3本のみ
 * （フルセットは /about の PERSON_JSONLD.sameAs が正＝@id同一でマージされる）。
 */
const PROFILE_PAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://luck428.com/about/uramatsu#profilepage",
  url: "https://luck428.com/about/uramatsu",
  name: "代表・浦松丈二プロフィール｜元新聞記者の宅建士・行政書士 | 四葉不動産",
  inLanguage: "ja",
  mainEntity: {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "浦松 丈二",
    jobTitle: "代表取締役",
    worksFor: {
      "@type": "Organization",
      "@id": "https://luck428.com/#organization",
      name: "四葉不動産株式会社",
    },
    knowsLanguage: ["ja", "en", "zh-Hant", "zh-Hans"],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "宅地建物取引士",
        identifier: "（東京）第293544号",
        recognizedBy: { "@type": "Organization", name: "登録先の都道府県知事" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "行政書士",
        identifier: "第25087022号",
        recognizedBy: {
          "@type": "Organization",
          name: "日本行政書士会連合会",
          url: "https://www.gyosei.or.jp/",
        },
      },
    ],
    sameAs: [
      "https://www.wikidata.org/wiki/Q139738129",
      "https://orcid.org/0009-0007-0460-3473",
      SAMURAI_URAMATSU_URL,
    ],
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "realestate",
    // 社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/about/uramatsu",
    keywords: [
      "浦松丈二",
      "浦松丈二 プロフィール",
      "四葉不動産 代表",
      "元新聞記者 宅建士",
      "文京区 行政書士",
    ],
    locale,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;

  return (
    <>
      <JsonLd data={PROFILE_PAGE_JSONLD} />
      <Breadcrumb
        items={[
          { name: c.breadcrumbHome, href: "/" },
          { name: c.breadcrumbAbout, href: "/about" },
          { name: c.breadcrumbCurrent },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          {/* 冒頭の回答ブロック（タスクB-2確定文言） */}
          <p className="mt-4 rounded-xl border border-border bg-primary-tint p-4 leading-relaxed text-ink">
            {c.answerBlock}
          </p>
          <div className="mt-6 max-w-[220px] overflow-hidden rounded-xl border border-border">
            <Image
              src="/uramatsu.png"
              alt={c.portraitAlt}
              width={400}
              height={533}
              className="h-auto w-full object-cover"
            />
          </div>
        </header>

        {c.sections.map((s) => (
          <section key={s.h2} className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink">{s.h2}</h2>
            {s.body}
          </section>
        ))}

        {/* FAQPage JSON-LD＝タスクB-2指示によりこのページで出力（ヘッダーコメント参照） */}
        <div className="-mx-4 mt-2">
          <Faq items={c.faqItems} heading={c.faqHeading} withJsonLd />
        </div>

        <nav aria-label={c.relatedAria} className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">{c.relatedHeading}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {c.relatedLinks.map((l) => (
              <li key={l.href}>
                <Link href={addLocalePrefix(l.href, locale)} className="underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
