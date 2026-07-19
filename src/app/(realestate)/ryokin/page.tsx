// /ryokin（不動産・料金）＝タスクB-1（2026-07-19）／多言語化＝タスクC-6-3（2026-07-19）
// 四葉不動産株式会社の料金ページ。既存 /legal/ryokin（四葉行政書士事務所の報酬額表）とは別ページ＝本文からリンクのみ（/legal/ryokin側は無変更）。
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/access・/faq）。C-6-3 で en/zh-tw/zh を追加＝全4ロケール公開。
//   availableLocales は既定（全4ロケール）＝hreflang4本相互設定。sitemap側も /ryokin の locales 指定を外して全4ロケール出力。
//   訳語は C-6-1・C-6-2 の確定語（另行簽訂契約承辦／另行签订合同承办 等）と C-6-3 第1段階承認の英語統一訳語に従う。
//   金額・料率・法定上限の速算式（売買価格×3%＋6万円＋税／借賃1か月分＋税）は全ロケールで日本語版と完全一致。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   行政書士業務は「併設の四葉行政書士事務所が別契約・別料金で受任」の形でのみ記載。
// 料金＝法令上の上限（速算式）の説明のみ。当社独自の料率・行政書士報酬の具体額・値引き示唆は書かない
//   ＝確定値なしのため PriceSpecification は出力しない（/access と同じ規則）。
// FAQPage JSON-LD＝タスクB-1指示によりこのページで3問を出力（withJsonLd）。
//   ※既存規則「FAQPage は各サイト1本＝/faq のみ」（委任§4-6・URL構造設計v1 §1）の例外＝浦松承認前提。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE } from "@/lib/seo";
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

// 英語（C-6-3 第1段階で浦松承認の統一訳語）：
//   行政書士＝Gyoseishoshi (Administrative Scrivener)／宅地建物取引士＝Licensed Real Estate Transaction Specialist／
//   宅地建物取引業法＝Real Estate Brokerage Act (宅地建物取引業法)（法令名は日本語原名を併記）／
//   別契約で受任＝engaged under a separate contract。one-stop 等の一体提供を示唆する語は使用しない。
const EN: RyokinCopy = {
  metaTitle: "Fees｜Brokerage Commissions and How Consultations Work",
  metaDesc:
    "Fee information for Yotsuba Real Estate Co., Ltd. Brokerage commissions for sales and leasing are within the statutory maximum under the Real Estate Brokerage Act (宅地建物取引業法), and your first consultation is free. Legal work such as inheritance procedures is undertaken by Yotsuba Gyoseishoshi Office under a separate contract and separate fees. Specific amounts are quoted individually. TEL 03-6161-9428.",
  breadcrumbHome: "Home",
  breadcrumbCurrent: "Fees",
  h1: "Our Fees",
  answerBlock:
    "Brokerage commissions for sales at Yotsuba Real Estate Co., Ltd. are within the maximum prescribed by the Real Estate Brokerage Act (宅地建物取引業法). Your first consultation is free. Legal work such as inheritance procedures is undertaken by Yotsuba Gyoseishoshi Office under a separate contract and separate fees. Because the specific amount varies with the property and the scope of your request, we provide a quotation.",
  sections: [
    {
      h2: "Brokerage commission (sales)",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            For sales, the Real Estate Brokerage Act (宅地建物取引業法) sets a maximum commission. Where the sale price exceeds 4 million yen, the statutory maximum is calculated by the following formula.
          </p>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink">
            <strong>Statutory maximum (where the sale price exceeds 4 million yen)</strong>
            : sale price × 3% + 60,000 yen + consumption tax
          </p>
          <p className="mt-3 leading-relaxed text-text">
            * Where the sale price is 4 million yen or less, a different rate applies. Our brokerage commission is quoted individually within this statutory maximum, according to the property and the scope of your request.
          </p>
        </>
      ),
    },
    {
      h2: "Brokerage commission (leasing)",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          For leasing, the Real Estate Brokerage Act (宅地建物取引業法) sets the statutory maximum at{" "}
          <strong>one month&apos;s rent plus consumption tax</strong>. Our brokerage commission is offered within this statutory maximum.
        </p>
      ),
    },
    {
      h2: "Consultation fees",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          <strong>Your first consultation is free.</strong> How consultations from the second time onward are handled depends on the nature of the matter. Please feel free to contact us first.
        </p>
      ),
    },
    {
      h2: "Fees for gyoseishoshi work",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            Legal work such as inheritance documents and permits and licenses is undertaken by the affiliated Yotsuba Gyoseishoshi Office under a separate contract and separate fees. Because fees vary with the scope of work, we provide a quotation.
          </p>
          {/* /legal/ryokin は en 版が実在する（同ページ COPY に en あり）＝英語版へリンクする */}
          <p className="mt-3 text-sm">
            <Link href={addLocalePrefix("/legal/ryokin", "en")} className="text-primary underline">
              Fee schedule for gyoseishoshi work (Yotsuba Gyoseishoshi Office)
            </Link>
          </p>
        </>
      ),
    },
    {
      h2: "Please note",
      body: (
        <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
          The amounts on this page are an explanation of the statutory maximums; an individual quotation is presented at the time of consultation.
        </p>
      ),
    },
  ],
  faqHeading: "Frequently asked questions about our fees",
  faqItems: [
    {
      q: "How much is the brokerage commission?",
      a: "For both sales and leasing, we work within the statutory maximum prescribed by the Real Estate Brokerage Act (宅地建物取引業法). For sales (where the sale price exceeds 4 million yen), the statutory maximum is “sale price × 3% + 60,000 yen + consumption tax”; for leasing it is within “one month's rent plus consumption tax.” Because the specific amount varies with the property and the scope of your request, we quote it individually.",
    },
    {
      q: "Is the consultation free?",
      a: "Your first consultation is free. How consultations from the second time onward are handled depends on the nature of the matter. Please feel free to contact us first.",
    },
    {
      q: "Are gyoseishoshi fees separate?",
      a: "Yes, they are separate. Legal work such as inheritance documents and permits and licenses is undertaken by the affiliated Yotsuba Gyoseishoshi Office under a separate contract and separate fees. Because fees vary with the scope of work, we provide a quotation. For details, see the “Fee schedule for gyoseishoshi work” page (/legal/ryokin).",
    },
  ],
  relatedAria: "Related links",
  relatedHeading: "Related pages",
  relatedLinks: [
    { href: "/souzoku", label: "Inheriting real estate in Bunkyo" },
    { href: "/toushi", label: "Investment and business-use properties" },
    { href: "/legal", label: "Yotsuba Gyoseishoshi Office" },
    { href: "/contact", label: "Contact" },
  ],
  authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
  authorLabel: "About the author",
  authorBio:
    "Joji Uramatsu｜Representative Director of Yotsuba Real Estate Co., Ltd.; full-time Licensed Real Estate Transaction Specialist (宅地建物取引士). Gyoseishoshi (Administrative Scrivener). Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Stationed in China, Taiwan, and Thailand. Passed the Certified Social Insurance and Labor Consultant (Sharoushi) examination (office opening scheduled for September 2026).",
};

// 繁体字（C-6-1・C-6-2 の確定語彙を踏襲。宅地建物取引業法＝宅地建物交易業法（日本語：宅地建物取引業法））
const ZH_TW: RyokinCopy = {
  metaTitle: "費用說明｜仲介手續費與諮詢方式",
  metaDesc:
    "四葉不動産株式会社的費用說明。買賣・租賃的仲介手續費（日本語：仲介手数料）在宅地建物交易業法（日本語：宅地建物取引業法）所定法定上限的範圍內，初次諮詢免費。繼承手續等法務業務，由四葉行政書士事務所另行簽訂契約、另行計費承辦。具體金額將個別報價。TEL 03-6161-9428。",
  breadcrumbHome: "首頁",
  breadcrumbCurrent: "費用說明",
  h1: "費用說明",
  answerBlock:
    "四葉不動産株式会社的買賣仲介手續費（日本語：仲介手数料），在宅地建物交易業法（日本語：宅地建物取引業法）所定上限的範圍內提供。初次諮詢免費。繼承手續等法務業務，由四葉行政書士事務所另行簽訂契約、另行計費承辦。具體金額因物件與委託內容而異，將為您報價。",
  sections: [
    {
      h2: "不動產仲介手續費（買賣）",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            買賣的仲介手續費，依宅地建物交易業法（日本語：宅地建物取引業法）訂有報酬上限。買賣價格超過400萬日圓時的法定上限，以下列速算公式計算。
          </p>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink">
            <strong>法定上限（買賣價格超過400萬日圓時）</strong>
            ：買賣價格×3%＋6萬日圓＋消費稅
          </p>
          <p className="mt-3 leading-relaxed text-text">
            ※買賣價格在400萬日圓以下時，適用不同的費率。本公司的仲介手續費，在此法定上限的範圍內，依物件與委託內容個別報價。
          </p>
        </>
      ),
    },
    {
      h2: "仲介手續費（租賃）",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          租賃的仲介手續費，依宅地建物交易業法（日本語：宅地建物取引業法）訂定法定上限為
          <strong>租金1個月份＋消費稅以內</strong>。本公司的仲介手續費在此法定上限的範圍內提供。
        </p>
      ),
    },
    {
      h2: "諮詢費用",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          <strong>初次諮詢免費。</strong>
          第2次以後的處理方式，因諮詢內容而異。請先隨時與我們聯絡。
        </p>
      ),
    },
    {
      h2: "行政書士業務的費用",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            繼承文件、許可認可等法務業務，由併設的四葉行政書士事務所另行簽訂契約、另行計費承辦。因業務內容而異，將為您報價。
          </p>
          {/* /legal/ryokin は zh-tw 版が実在する（同ページ COPY に zh-tw あり）＝繁体字版へリンクする */}
          <p className="mt-3 text-sm">
            <Link href={addLocalePrefix("/legal/ryokin", "zh-tw")} className="text-primary underline">
              行政書士業務的報酬金額表請見此（四葉行政書士事務所）
            </Link>
          </p>
        </>
      ),
    },
    {
      h2: "請您確認",
      body: (
        <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
          本頁的金額為法令上上限的說明，個別報價將於諮詢時提出。
        </p>
      ),
    },
  ],
  faqHeading: "常見問題",
  faqItems: [
    {
      q: "仲介手續費是多少？",
      a: "買賣・租賃均在宅地建物交易業法（日本語：宅地建物取引業法）所定法定上限的範圍內提供。買賣（買賣價格超過400萬日圓時）的法定上限為「買賣價格×3%＋6萬日圓＋消費稅」，租賃的法定上限為「租金1個月份＋消費稅」以內。具體金額因物件與委託內容而異，將個別報價。",
    },
    {
      q: "諮詢免費嗎？",
      a: "初次諮詢免費。第2次以後的處理方式，因諮詢內容而異。請先隨時與我們聯絡。",
    },
    {
      q: "行政書士業務的費用是分開的嗎？",
      a: "是分開的。繼承文件、許可認可等法務業務，由併設的四葉行政書士事務所另行簽訂契約、另行計費承辦。因業務內容而異，將為您報價。詳情請參閱「行政書士業務的報酬金額表」頁面（/legal/ryokin）。",
    },
  ],
  relatedAria: "相關連結",
  relatedHeading: "本頁的相關連結",
  relatedLinks: [
    { href: "/souzoku", label: "在文京區繼承不動產" },
    { href: "/toushi", label: "投資用・事業用不動產" },
    { href: "/legal", label: "四葉行政書士事務所" },
    { href: "/contact", label: "聯絡我們" },
  ],
  authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  authorLabel: "本文作者",
  // C-6-2 で確定した繁体字の署名文言（日本語原文が同一のため一字一句そのまま使用）
  authorBio:
    "浦松 丈二｜四葉不動産株式会社 代表取締役（負責人）・專任宅地建物交易士（日本語：宅地建物取引士）。行政書士。前每日新聞中國總局長（記者資歷34年）。曾派駐中國、台灣與泰國。社會保險勞務士考試合格（預計2026年9月開業）。",
};

// 簡体字（C-6-1・C-6-2 の確定語彙を踏襲。大陸読者に自然な語彙＝中介手续费・合同）
const ZH: RyokinCopy = {
  metaTitle: "费用说明｜中介手续费与咨询方式",
  metaDesc:
    "四葉不動産株式会社的费用说明。买卖・租赁的中介手续费（日本語：仲介手数料）在宅地建物交易业法（日本語：宅地建物取引業法）所定法定上限的范围内，首次咨询免费。继承手续等法务业务，由四葉行政书士事务所另行签订合同、另行计费承办。具体金额将个别报价。TEL 03-6161-9428。",
  breadcrumbHome: "首页",
  breadcrumbCurrent: "费用说明",
  h1: "费用说明",
  answerBlock:
    "四葉不動産株式会社的买卖中介手续费（日本語：仲介手数料），在宅地建物交易业法（日本語：宅地建物取引業法）所定上限的范围内提供。首次咨询免费。继承手续等法务业务，由四葉行政书士事务所另行签订合同、另行计费承办。具体金额因房屋与委托内容而异，将为您报价。",
  sections: [
    {
      h2: "不动产中介手续费（买卖）",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            买卖的中介手续费，依宅地建物交易业法（日本語：宅地建物取引業法）订有报酬上限。买卖价格超过400万日元时的法定上限，以下列速算公式计算。
          </p>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink">
            <strong>法定上限（买卖价格超过400万日元时）</strong>
            ：买卖价格×3%＋6万日元＋消费税
          </p>
          <p className="mt-3 leading-relaxed text-text">
            ※买卖价格在400万日元以下时，适用不同的费率。本公司的中介手续费，在此法定上限的范围内，依房屋与委托内容个别报价。
          </p>
        </>
      ),
    },
    {
      h2: "中介手续费（租赁）",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          租赁的中介手续费，依宅地建物交易业法（日本語：宅地建物取引業法）订定法定上限为
          <strong>租金1个月份＋消费税以内</strong>。本公司的中介手续费在此法定上限的范围内提供。
        </p>
      ),
    },
    {
      h2: "咨询费用",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          <strong>首次咨询免费。</strong>
          第2次以后的处理方式，因咨询内容而异。请先随时与我们联系。
        </p>
      ),
    },
    {
      h2: "行政书士业务的费用",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            继承文件、许可认可等法务业务，由并设的四葉行政书士事务所另行签订合同、另行计费承办。因业务内容而异，将为您报价。
          </p>
          {/* /legal/ryokin は zh 版が実在する（同ページ COPY に zh あり）＝簡体字版へリンクする */}
          <p className="mt-3 text-sm">
            <Link href={addLocalePrefix("/legal/ryokin", "zh")} className="text-primary underline">
              行政书士业务的报酬金额表请见此（四葉行政书士事务所）
            </Link>
          </p>
        </>
      ),
    },
    {
      h2: "请您确认",
      body: (
        <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
          本页的金额为法令上上限的说明，个别报价将于咨询时提出。
        </p>
      ),
    },
  ],
  faqHeading: "常见问题",
  faqItems: [
    {
      q: "中介手续费是多少？",
      a: "买卖・租赁均在宅地建物交易业法（日本語：宅地建物取引業法）所定法定上限的范围内提供。买卖（买卖价格超过400万日元时）的法定上限为“买卖价格×3%＋6万日元＋消费税”，租赁的法定上限为“租金1个月份＋消费税”以内。具体金额因房屋与委托内容而异，将个别报价。",
    },
    {
      q: "咨询免费吗？",
      a: "首次咨询免费。第2次以后的处理方式，因咨询内容而异。请先随时与我们联系。",
    },
    {
      q: "行政书士业务的费用是分开的吗？",
      a: "是分开的。继承文件、许可认可等法务业务，由并设的四葉行政书士事务所另行签订合同、另行计费承办。因业务内容而异，将为您报价。详情请参阅“行政书士业务的报酬金额表”页面（/legal/ryokin）。",
    },
  ],
  relatedAria: "相关链接",
  relatedHeading: "本页的相关链接",
  relatedLinks: [
    { href: "/souzoku", label: "在文京区继承不动产" },
    { href: "/toushi", label: "投资用・事业用不动产" },
    { href: "/legal", label: "四葉行政书士事务所" },
    { href: "/contact", label: "联系我们" },
  ],
  authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  authorLabel: "本文作者",
  // C-6-2 で確定した簡体字の署名文言（日本語原文が同一のため一字一句そのまま使用）
  authorBio:
    "浦松 丈二｜四葉不動産株式会社 代表取締役（负责人）・专任宅地建物交易士（日本語：宅地建物取引士）。行政书士。前每日新闻中国总局长（记者资历34年）。曾派驻中国、台湾与泰国。社会保险劳务士考试合格（预计2026年9月开业）。",
};

const COPY: Record<LangCode, RyokinCopy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

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
    // C-6-3：全4ロケール公開＝availableLocales は既定（ja/en/zh-Hant/zh-Hans の hreflang 4本）
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
          <Faq
            items={c.faqItems}
            heading={c.faqHeading}
            withJsonLd
            inLanguage={BCP47_BY_LOCALE[locale]}
            ariaLabel={c.faqHeading}
          />
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
