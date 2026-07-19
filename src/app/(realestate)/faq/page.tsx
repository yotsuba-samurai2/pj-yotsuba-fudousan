// /faq（型B・FAQPage）＝原稿_不動産 #8
// FAQPage JSON-LDはこの専用ページのみ（各サイト1本＝URL構造設計v1 §1）。HTMLと構造化データは同じitems配列から生成＝完全一致。
// 多言語化でもFaq部品にロケール済みitemsを渡すためHTMLとJSON-LDは自動一致（withJsonLd不変）。
// 【要確認】の項目（対応エリア・査定のみ対応）は断定しない安全文で公開可能な形にしてある（未検証を出力しない原則）。
// フェーズI多言語化（2026-07-11）：COPY: Record<LangCode,…>＋getRequestLocale 方式（手本= /legal/faq・/access）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（文京區・茗荷谷站・繼承・不動產）／zh=大陸表記。
// 相談料（Q1）＝2026-07-11浦松確定文言（改訂版）：媒介に関する相談＝仲介手数料の範囲（別途相談料なし）／
// 媒介を伴わないコンサル（媒介以外の関連業務）＝初回無料・2回目以降のみ事前同意で30分5,500円（税込）。
// ＝/access・/services・/souzoku/nagare と同一基準（国交省 解釈・運用＝媒介以外の関連業務は明確区分・事前設定・別合意）。
// ※宅建業法上の相談料の切り分けは石井弁護士の最終確認を通すこと。
// 業法訳は/access既訳と統一（仲介手数料=brokerage commission／法定上限=statutory maximum (cap) under the Real Estate Brokerage Act）。金額・率は全ロケール不変。
// 2026-07-19 B-3：ja=40問6分野（アンカーナビ＋セクション表示）。FAQPage JSON-LDは全40問を1本で出力（各サイト1本原則を維持）。
// 回答末尾の内部リンクは表示のみ（JSON-LDのAnswer text＝回答本文と完全一致）。en/zh-tw/zh＝既存8問のまま変更なし（監修後に拡充）。
// 法制度の断定は事実アンカーのみ（相続登記義務化2024年4月・原則3年以内／特定空家等・管理不全空家等の勧告で特例除外・最大6倍の場合／
// GH居室原則7.43㎡以上／指定申請書類の作成・提出＝行政書士の独占業務／仲介手数料の法定上限）。それ以外は「自治体・個別の事情により異なります」。
// 分離受任の定型＝「併設の四葉行政書士事務所が別契約で受任します」（独立事業体・紹介料等の授受なし）。一体提供を示唆する語は使用禁止。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, buildFaqJsonLd, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import { JA_FAQ_SECTIONS } from "@/data/faqJa";
import type { LangCode } from "@/config/languages";

type FaqPageCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heading: string;
  items: FaqItem[];
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

const COPY: Record<LangCode, FaqPageCopy> = {
  ja: {
    metaTitle: "よくある質問｜文京区・茗荷谷の四葉不動産株式会社",
    metaDesc:
      "四葉不動産株式会社への「相続の相談は無料か」「中国語・英語で相談できるか」「文京区以外も対応か」「グループホーム物件や社宅を扱えるか」などのよくある質問に、一問一答でお答えします。文京区小日向・茗荷谷駅徒歩5分。まずはお気軽にご相談ください。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "よくある質問",
    heading: "よくある質問",
    // ja＝41問6分野（B-3の40問＋C-1の1問・JA_FAQ_SECTIONS）を平坦化。JSON-LDはこの配列から1本生成（表示HTMLと同一ソース＝完全一致）
    items: JA_FAQ_SECTIONS.flatMap((s) => s.items),
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "FAQ | 四葉不動産株式会社 (Yotsuba Real Estate) — Bunkyo & Myogadani, Tokyo",
    metaDesc:
      "Answers to frequently asked questions about Yotsuba Real Estate Co., Ltd.: Is an inheritance consultation free? Can I consult in Chinese or English? Do you cover areas outside Bunkyo-ku? Can you handle group-home properties or company housing? Kohinata, Bunkyo-ku, Tokyo — a 5-minute walk from Myogadani Station. Feel free to contact us.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "FAQ",
    heading: "Frequently Asked Questions",
    items: [
      {
        q: "Is a consultation about inheritance or real estate free?",
        a: "Your first consultation is free of charge. From the second session onward, real-estate consulting that does not involve brokerage (a second opinion, advice on utilizing or holding your overall assets, and the like — i.e., related work other than brokerage) is, in principle, ¥5,500 (tax incl.) per 30 minutes — only with your prior consent, and online sessions are available. Consultations relating to a sale or lease we broker are covered by the brokerage commission. Feel free to start with a single line via LINE or phone.",
      },
      {
        q: "Can I consult in Chinese or English?",
        a: "Yes. 浦松丈二 (Joji Uramatsu), our representative, is a former China General Bureau Chief of the Mainichi Shimbun who was stationed in China, Taiwan, and Thailand, and handles consultations in Japanese, English, Traditional Chinese, and Simplified Chinese. If you are looking for a room as a foreign resident, please also see the “Multilingual Room-Hunting Support” page.",
      },
      {
        q: "Can I consult about properties outside Bunkyo-ku?",
        a: "Yotsuba Real Estate Co., Ltd. mainly serves Bunkyo-ku and the Myogadani area. For properties outside this area, please contact us individually.",
      },
      {
        q: "Can you find properties usable for group homes or disability-welfare services?",
        a: "Yes. Yotsuba Real Estate Co., Ltd. handles consultations on properties used for group homes (shared-living support, kyodo seikatsu enjo) and similar purposes. Points related to designation standards — such as the property's permitted use, location, and fire-safety requirements — are confirmed together with specialists such as a gyoseishoshi (administrative scrivener) as we proceed. The designation application itself is handled by 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), an affiliated but separate entity that accepts engagements independently (no referral fees are exchanged).",
      },
      {
        q: "Can you also arrange company housing and corporate leases?",
        a: "Yes. Yotsuba Real Estate Co., Ltd. arranges company housing for companies and facilities and handles corporate leases. We also help secure housing for international staff.",
      },
      {
        q: "Can you also handle inheritance registration and inheritance tax?",
        a: "Inheritance registration is the domain of a judicial scrivener (shiho-shoshi), and inheritance tax that of a licensed tax accountant. Yotsuba Real Estate Co., Ltd. handles real-estate consultation, sales, leasing, and management, and moves these procedures forward in coordination with partner specialists. Inheritance-related document preparation and permits/licenses can be handled by 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), a separate entity.",
      },
      {
        q: "Can I request just a property valuation?",
        a: "Please feel free to contact us. We will ask about the property's situation and explain whether we can assist and how we would proceed.",
      },
      {
        q: "How much is the brokerage commission?",
        a: "Brokerage commissions for sales and leasing are within the statutory maximum (cap) under the Real Estate Brokerage Act (宅地建物取引業法). The specific amount is calculated for each property. See the “Access & Fees” page for details.",
      },
    ],
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "常見問題｜文京區・茗荷谷的四葉不動産株式会社",
    metaDesc:
      "關於四葉不動産株式会社的常見問題——「繼承諮詢是否免費」「可否用中文・英文諮詢」「文京區以外是否對應」「可否處理團體家屋物件或員工宿舍」等，以一問一答方式回答。文京區小日向・茗荷谷站步行5分鐘。歡迎隨時諮詢。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "常見問題",
    heading: "常見問題",
    items: [
      {
        q: "繼承或不動產的諮詢是免費的嗎？",
        a: "初次諮詢免費。第2次起，不涉及仲介的不動產顧問服務（第二意見、整體資產的活用・持有方針建議等＝仲介以外的相關業務），經事先同意後原則上以每30分鐘5,500日圓（含稅・可線上進行）承接。與本公司承辦之買賣・租賃仲介相關的諮詢，包含於仲介手續費範圍內。歡迎先透過LINE或電話說一句話。",
      },
      {
        q: "可以用中文或英文諮詢嗎？",
        a: "可以。代表・浦松丈二曾任每日新聞中國總局長，旅居海外4國，可用日文、英文、中文（繁體・簡體）對應。外國人士找房，也請參閱「外國人・多語言找房服務」頁面。",
      },
      {
        q: "文京區以外的物件也可以諮詢嗎？",
        a: "四葉不動産株式会社以文京區・茗荷谷為中心提供服務。區域外的物件請個別洽詢。",
      },
      {
        q: "可以找適合團體家屋或障礙福祉用途的物件嗎？",
        a: "可以。四葉不動産株式会社受理團體家屋（共同生活援助）等用途物件的諮詢。物件的用途、地點、消防等與指定基準相關的事項，將與行政書士等專家確認後推進。指定申請本身由關聯事業・四葉行政書士事務所（另一事業體・獨立受任・不收受介紹費等）對應。",
      },
      {
        q: "也可以安排員工宿舍・法人租賃嗎？",
        a: "可以。四葉不動産株式会社對應企業・設施的員工宿舍（社宅）安排與法人租賃，也對應外國人才的住居確保。",
      },
      {
        q: "繼承登記或繼承稅也可以委託嗎？",
        a: "繼承登記屬司法書士、繼承稅（日本相續稅）屬稅理士的領域。四葉不動産株式会社負責不動產的諮詢・買賣・租賃・管理，這些手續將與合作的專家協同推進。與繼承相關的文件製作・許認可，可由四葉行政書士事務所（另一事業體）對應。",
      },
      {
        q: "只做估價也可以嗎？",
        a: "歡迎隨時諮詢。我們將了解物件狀況後，說明可否對應及進行方式。",
      },
      {
        q: "仲介手續費是多少？",
        a: "買賣・租賃的仲介手續費在宅地建物取引業法的法定上限範圍內。具體金額將按各物件個別計算。詳情請參閱「交通與費用」頁面。",
      },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "常见问题｜文京区・茗荷谷的四葉不動産株式会社",
    metaDesc:
      "关于四葉不動産株式会社的常见问题——「继承咨询是否免费」「可否用中文・英文咨询」「文京区以外是否对应」「可否处理团体家屋物件或员工宿舍」等，以一问一答方式回答。文京区小日向・茗荷谷站步行5分钟。欢迎随时咨询。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "常见问题",
    heading: "常见问题",
    items: [
      {
        q: "继承或不动产的咨询是免费的吗？",
        a: "初次咨询免费。第2次起，不涉及中介的不动产顾问服务（第二意见、整体资产的活用・持有方针建议等＝中介以外的相关业务），经事先同意后原则上以每30分钟5,500日元（含税・可在线进行）承接。与本公司承办之买卖・租赁中介相关的咨询，包含在中介手续费范围内。欢迎先通过LINE或电话说一句话。",
      },
      {
        q: "可以用中文或英文咨询吗？",
        a: "可以。代表・浦松丈二曾任每日新闻中国总局长，旅居海外4国，可用日语、英语、中文（繁体・简体）对应。外国人士找房，也请参阅「外国人・多语言找房服务」页面。",
      },
      {
        q: "文京区以外的物件也可以咨询吗？",
        a: "四葉不動産株式会社以文京区・茗荷谷为中心提供服务。区域外的物件请个别洽询。",
      },
      {
        q: "可以找适合团体家屋或残障福祉用途的物件吗？",
        a: "可以。四葉不動産株式会社受理团体家屋（共同生活援助）等用途物件的咨询。物件的用途、地点、消防等与指定基准相关的事项，将与行政书士等专家确认后推进。指定申请本身由关联事业・四葉行政書士事務所（另一事业体・独立受任・不收受介绍费等）对应。",
      },
      {
        q: "也可以安排员工宿舍・法人租赁吗？",
        a: "可以。四葉不動産株式会社对应企业・设施的员工宿舍（社宅）安排与法人租赁，也对应外国人才的住居确保。",
      },
      {
        q: "继承登记或继承税也可以委托吗？",
        a: "继承登记属司法书士、继承税（日本相续税）属税理士的领域。四葉不動産株式会社负责不动产的咨询・买卖・租赁・管理，这些手续将与合作的专家协同推进。与继承相关的文件制作・许认可，可由四葉行政書士事務所（另一事业体）对应。",
      },
      {
        q: "只做估价也可以吗？",
        a: "欢迎随时咨询。我们将了解物件状况后，说明可否对应及进行方式。",
      },
      {
        q: "中介手续费是多少？",
        a: "买卖・租赁的中介手续费在日本《宅地建物取引业法》的法定上限范围内。具体金额将按每个物件单独计算。详情请参阅「交通与费用」页面。",
      },
    ],
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・旅居海外4国。已通过社会保险劳务士考试（预定2026年9月开业）。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/faq",
    keywords: ["四葉不動産 よくある質問", "文京区 不動産 相談 無料", "不動産 多言語 相談"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const isJa = c === COPY.ja;
  return (
    <>
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]} />
      {/* FAQPage JSON-LD はこの専用ページのみ出力（ロケール済みitemsを渡す＝HTMLと構造化データは自動一致） */}
      {isJa ? (
        <>
          {/* ja＝6分野セクション＋アンカーナビ。JSON-LDは全40問を1本で出力（各サイト1本原則） */}
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-ink">{c.heading}</h2>
            <nav aria-label="分野別もくじ" className="mt-4 flex flex-wrap gap-2">
              {JA_FAQ_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink hover:text-primary"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
          {JA_FAQ_SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <Faq items={s.items} heading={s.title} openFirst={i === 0} />
            </section>
          ))}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(c.items)) }}
          />
        </>
      ) : (
        <Faq items={c.items} heading={c.heading} withJsonLd />
      )}
      <div className="mx-auto max-w-3xl px-4 pb-8">
        {/* 署名（E-E-A-T・原稿_不動産サイト共通）＝/access既訳と同一文言（社労士試験合格の表記は署名のみ可の規程どおり） */}
        <aside className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
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
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
