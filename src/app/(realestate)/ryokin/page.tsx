// /ryokin（不動産・料金）＝タスクB-1（2026-07-19）
// 四葉不動産株式会社の料金ページ。既存 /legal/ryokin（四葉行政書士事務所の報酬額表）とは別ページ＝本文からリンクのみ（/legal/ryokin側は無変更）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access・/faq）。現フェーズ＝ja のみ公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定（lessons: 存在しないロケールURLをGoogleに広告しない）。
//   sitemap側も locales:["ja"] で ja のみ出力。多言語展開（en/zh-tw/zh）は後続ステップで COPY に追加する。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   行政書士業務は「併設の四葉行政書士事務所が別契約・別料金で受任」の形でのみ記載。
// 料金＝法令上の上限（速算式）の説明のみ。当社独自の料率・行政書士報酬の具体額・値引き示唆は書かない
//   ＝確定値なしのため PriceSpecification は出力しない（/access と同じ規則）。
// FAQPage JSON-LD＝タスクB-1指示によりこのページで3問を出力（withJsonLd）。
//   ※既存規則「FAQPage は各サイト1本＝/faq のみ」（委任§4-6・URL構造設計v1 §1）の例外＝浦松承認前提。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

type Section = { h2: string; body: React.ReactNode };
type RyokinCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  h1: string;
  /** 冒頭の回答ブロック（タスクB-1確定文言＝一字一句不変） */
  answerBlock: string;
  sections: Section[];
  faqHeading: string;
  faqItems: FaqItem[];
  relatedAria: string;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const JA: RyokinCopy = {
  metaTitle: "料金｜仲介手数料・相談の考え方",
  metaDesc:
    "四葉不動産株式会社の料金のご案内。売買・賃貸の仲介手数料は宅地建物取引業法の法定上限の範囲内で、初回のご相談は無料です。相続手続きなどの法務業務は、四葉行政書士事務所が別契約・別料金で受任します。具体的な金額は個別にお見積りいたします。TEL 03-6161-9428。",
  breadcrumbHome: "ホーム",
  breadcrumbCurrent: "料金",
  h1: "料金のご案内",
  answerBlock:
    "四葉不動産株式会社の売買仲介手数料は、宅地建物取引業法の定める上限の範囲内でご案内します。初回相談は無料です。相続手続きなどの法務業務は、四葉行政書士事務所が別契約・別料金で受任します。具体的な金額は物件やご依頼内容により異なるため、お見積りいたします。",
  sections: [
    {
      h2: "不動産仲介手数料（売買）",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            売買の仲介手数料は、宅地建物取引業法により報酬の上限が定められています。売買価格400万円超の場合の法定上限は、次の速算式で計算されます。
          </p>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink">
            <strong>法定上限（売買価格400万円超の場合）</strong>
            ：売買価格×3%＋6万円＋消費税
          </p>
          <p className="mt-3 leading-relaxed text-text">
            ※売買価格400万円以下の場合は、別の料率が適用されます。当社の仲介手数料は、この法定上限の範囲内で、物件やご依頼内容に応じて個別にお見積りいたします。
          </p>
        </>
      ),
    },
    {
      h2: "仲介手数料（賃貸）",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          賃貸の仲介手数料は、宅地建物取引業法により<strong>借賃1か月分＋消費税以内</strong>
          が法定上限と定められています。当社の仲介手数料は、この法定上限の範囲内でご案内します。
        </p>
      ),
    },
    {
      h2: "相談料",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          <strong>初回のご相談は無料です。</strong>
          2回目以降の扱いは、ご相談内容により異なります。まずはお気軽にお問い合わせください。
        </p>
      ),
    },
    {
      h2: "行政書士業務の費用",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            相続書類・許認可などの法務業務は、併設の四葉行政書士事務所が別契約・別料金で受任します。業務内容により異なるためお見積りいたします。
          </p>
          <p className="mt-3 text-sm">
            <Link href="/legal/ryokin" className="text-primary underline">
              行政書士業務の報酬額表はこちら（四葉行政書士事務所）
            </Link>
          </p>
        </>
      ),
    },
    {
      h2: "ご確認ください",
      body: (
        <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
          本ページの金額は法令上の上限の説明であり、個別の見積りはご相談時にご提示します。
        </p>
      ),
    },
  ],
  faqHeading: "料金についてよくあるご質問",
  faqItems: [
    {
      q: "仲介手数料はいくらですか？",
      a: "売買・賃貸とも、宅地建物取引業法の定める法定上限の範囲内でご案内します。売買（売買価格400万円超の場合）の法定上限は「売買価格×3%＋6万円＋消費税」、賃貸の法定上限は「借賃1か月分＋消費税」以内です。具体的な金額は物件やご依頼内容により異なるため、個別にお見積りいたします。",
    },
    {
      q: "相談は無料ですか？",
      a: "初回のご相談は無料です。2回目以降の扱いは、ご相談内容により異なります。まずはお気軽にお問い合わせください。",
    },
    {
      q: "行政書士業務の費用は別ですか？",
      a: "別です。相続書類・許認可などの法務業務は、併設の四葉行政書士事務所が別契約・別料金で受任します。業務内容により異なるためお見積りいたします。詳しくは「行政書士業務の報酬額表」ページ（/legal/ryokin）をご覧ください。",
    },
  ],
  relatedAria: "関連リンク",
  relatedHeading: "このページの関連リンク",
  relatedLinks: [
    { href: "/souzoku", label: "文京区で不動産を相続したら" },
    { href: "/toushi", label: "投資用・事業用不動産" },
    { href: "/legal", label: "四葉行政書士事務所" },
    { href: "/contact", label: "お問い合わせ" },
  ],
  authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  authorLabel: "この記事の著者",
  authorBio:
    "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
};

// 現フェーズ＝jaのみ。多言語展開時にこの Partial へ en/zh-tw/zh を追加し、
// availableLocales・sitemap の locales も合わせて広げる。
const COPY: Partial<Record<LangCode, RyokinCopy>> = { ja: JA };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "realestate",
    // 社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/ryokin",
    keywords: [
      "四葉不動産 料金",
      "文京区 不動産 仲介手数料",
      "仲介手数料 法定上限",
      "不動産 相談 無料 文京区",
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
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          {/* 冒頭の回答ブロック（タスクB-1確定文言） */}
          <p className="mt-4 rounded-xl border border-border bg-primary-tint p-4 leading-relaxed text-ink">
            {c.answerBlock}
          </p>
        </header>

        {c.sections.map((s) => (
          <section key={s.h2} className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink">{s.h2}</h2>
            {s.body}
          </section>
        ))}

        {/* FAQPage JSON-LD＝タスクB-1指示によりこのページで出力（ヘッダーコメント参照） */}
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

        {/* 署名（E-E-A-T・原稿_不動産サイト共通）＝/access・/faq と同一文言 */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt={c.authorAlt}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{c.authorLabel}</strong> {c.authorBio}
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
