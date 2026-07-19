// /jirei（相談事例＝モデルケース）＝タスクC-5（2026-07-19・日本語版のみ）
// 方式＝RealestateServicePage（手本=/souzoku/akiya C-4）。ja先行公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定・sitemap側も locales:["ja"]。
//
// 【事実の厳守（本ページ最重要）】本ページは実績紹介ではない。以下を厳守すること：
//   ・実在の顧客・成約を示唆する記述を書かない（「〜しました」等の完了形の事例談は禁止）
//   ・具体的な金額・成約価格・期間・地名番地・人物属性の詳細を創作しない
//   ・各事例は「想定される進め方」として記述する（「〜を想定しています」「〜します」）
//   ・冒頭注記（NOTICE）と各事例末尾の「※モデルケースです」は必須。一字一句変更しないこと
//   ・社会保険労務士＝「2026年9月開業予定・現時点では未開業」の注記を維持（登録済み資格と横並びにしない）
//
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ／一体で／
//   一括対応／まとめて対応 等）は全文・全メタデータで使用禁止。
//   行政書士業務＝「併設の四葉行政書士事務所が別契約で受任」。登記申請＝提携司法書士を紹介。税務＝税理士へ誘導。
//
// 構造化データ：ItemList（本ファイルで出力）＋ BreadcrumbList（<Breadcrumb>部品が出力＝ここでは出さない）。
//   Service JSON-LD は RealestateServicePage シェルが出力する。
// ヒーロー画像＝jirei専用画像が未制作のため bunkyo-sakura-16x9.webp（文京区の汎用画像）を再利用。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";

const SITE = "https://luck428.com";
const PATH = "/jirei";

// 冒頭注記＝浦松指定の確定文言（2026-07-19・タスクC-5）＝一字一句変更しないこと。
// 枠囲みで目立たせる（lead 内の先頭に配置＝H1直下）。
const NOTICE =
  "本ページの事例は、実際のご相談を想定したモデルケース（想定される相談の流れ）です。特定の実在のお客様・取引を紹介するものではありません。";

// 各事例末尾の注記＝必須。一字一句変更しないこと。
const CASE_NOTE = "※モデルケースです";

// 冒頭の回答ブロック（H1直下）。B-4方式。実績と誤読されないよう「想定」であることを明示する。
const JA_ANSWER_BLOCK =
  "本ページは、四葉不動産株式会社に寄せられることが想定されるご相談を、モデルケース（想定される相談の流れ）としてまとめたものです。グループホーム開設、中国語での相続不動産の売却、文京区の空き家の出口整理、海外在住オーナーの遠隔売却の4つについて、四葉不動産株式会社の担当範囲と、併設の四葉行政書士事務所が別契約で受任する範囲、他の専門家との連携を示します。実在のお客様・取引を紹介するものではありません。";

type CaseLink = { href: string; label: string };
type ModelCase = {
  /** アンカーid（ItemList の url にも使う） */
  id: string;
  /** ItemList の name・H2 見出し。実績と誤読されないよう先頭に「モデルケース」を含める */
  title: string;
  /** 共通フォーマット5段（相談のきっかけ→四葉不動産→四葉行政書士事務所→他の専門家→まとめ） */
  sections: { heading: string; body: string }[];
  links: CaseLink[];
};

// 4事例の本文＝2026-07-19浦松検収済み草稿（各400〜600字）。
// 骨子にない具体的事実・数値を加えないこと。追記・改稿時は浦松の再検収を要する。
const CASES: ModelCase[] = [
  {
    id: "case-group-home",
    title: "モデルケース①　グループホーム開設：物件探しと指定申請",
    sections: [
      {
        heading: "相談のきっかけ",
        body: "障害者グループホーム（共同生活援助）の開設を目指す法人のご担当者から、物件探しの段階でご相談をいただく場面を想定しています。",
      },
      {
        heading: "四葉不動産株式会社の担当範囲",
        body: "四葉不動産株式会社が、指定基準に関わる条件——用途地域、居室面積、消防設備など——を見据えて候補物件を絞り込み、ご紹介と仲介を担当します。要件を満たさない物件を先に契約してしまうと、想定外の改修が必要になったり、改修しても基準を満たせなかったりすることがあります。そのため、契約前の段階で指定権者（自治体）への事前相談を経てから物件を決める進め方をご案内します。",
      },
      {
        heading: "四葉行政書士事務所の担当範囲（別契約）",
        body: "指定申請書類の作成は行政書士の独占業務にあたるため、書類の作成・提出は、併設の四葉行政書士事務所が別契約で受任します。",
      },
      {
        heading: "他の専門家との連携",
        body: "労務や人員配置に関するご相談は、四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）が、開業後に別契約で受任する予定です。",
      },
      {
        heading: "想定される進め方のまとめ",
        body: "想定される進め方は、要件の整理、指定権者への事前相談、物件のご契約、指定申請という順序です。ご契約は事業体ごとに分かれ、物件は四葉不動産株式会社との媒介契約、指定申請は四葉行政書士事務所との別契約となります。各事業体・専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
      },
    ],
    links: [
      { href: "/toushi/group-home", label: "グループホームに使える物件探し" },
      { href: "/toushi/shitei-shinsei", label: "指定申請と物件の関係" },
    ],
  },
  {
    id: "case-chinese-souzoku",
    title: "モデルケース②　中国語での相続不動産の売却",
    sections: [
      {
        heading: "相談のきっかけ",
        body: "台湾にお住まいの相続人の方から、文京区にあるご実家を相続したものの、どこから手をつければよいかわからない、というご相談を想定しています。繁体字でのオンライン相談から始める流れです。",
      },
      {
        heading: "四葉不動産株式会社の担当範囲",
        body: "四葉不動産株式会社が、査定と売却活動を担当します。日本にお越しいただかなくても、オンラインでの打ち合わせと郵送でのやりとりで進められる部分をご案内し、現地確認が必要になる場面をあらかじめ整理します。ご相談は日本語のほか、中国語繁体字でも承ります。",
      },
      {
        heading: "四葉行政書士事務所の担当範囲（別契約）",
        body: "台湾で取得する公証書類など、売却に必要となる書類の準備や翻訳は、併設の四葉行政書士事務所が別契約で受任します。",
      },
      {
        heading: "他の専門家との連携",
        body: "相続登記の申請は司法書士の業務にあたるため、提携する司法書士をご紹介します。海外送金の取り扱いや譲渡所得の税務については、税理士へのご相談をご案内します。",
      },
      {
        heading: "想定される進め方のまとめ",
        body: "想定される進め方は、オンラインでのご相談、必要書類の整理と取得、相続登記、査定と売却活動という順序です。ご契約は事業体ごとに分かれ、各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
      },
    ],
    links: [{ href: "/global/chinese", label: "華人・中国語圏のお客様へ" }],
  },
  {
    id: "case-akiya",
    title: "モデルケース③　文京区の空き家の出口整理",
    sections: [
      {
        heading: "相談のきっかけ",
        body: "親御さまから相続した文京区の空き家を、数年にわたり使わないまま置いている、という方からのご相談を想定しています。",
      },
      {
        heading: "四葉不動産株式会社の担当範囲",
        body: "四葉不動産株式会社が、建物の状態と立地をふまえて、売却、賃貸としての活用、当面の管理という三つの選択肢を比較しながら、方針を整理するお手伝いをします。管理が不十分な状態が続くと、空家法にもとづく指導等の対象となる可能性もあるため、特定空家等に指定される前の段階で出口を考えておくことをご案内します。どの選択肢が向くかは建物の傷み具合によって変わるため、まず現況の確認から始めます。",
      },
      {
        heading: "四葉行政書士事務所の担当範囲（別契約）",
        body: "相続人が複数いらっしゃる場合の遺産分割協議書など、必要となる書類の作成は、併設の四葉行政書士事務所が別契約で受任します。",
      },
      {
        heading: "他の専門家との連携",
        body: "保有を続けた場合と売却した場合の税負担の比較は税務の専門領域にあたるため、税理士へのご相談をご案内します。",
      },
      {
        heading: "想定される進め方のまとめ",
        body: "想定される進め方は、現況の確認、三つの選択肢の比較、必要書類の整理、方針の決定という順序です。ご契約は事業体ごとに分かれ、各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
      },
    ],
    links: [{ href: "/souzoku/akiya", label: "文京区の空き家、どうする？——売却・活用・管理" }],
  },
  {
    id: "case-overseas-owner",
    title: "モデルケース④　海外在住オーナーの遠隔売却",
    sections: [
      {
        heading: "相談のきっかけ",
        body: "海外に長くお住まいのオーナーの方から、日本に所有している不動産を売却したい、というご相談を想定しています。",
      },
      {
        heading: "四葉不動産株式会社の担当範囲",
        body: "四葉不動産株式会社が、査定と売却活動を担当します。ご来店が難しい場合を前提に、オンラインでのお打ち合わせと郵送での書類のやりとりを組み合わせて進める流れをご案内します。日本語のほか、英語・中国語でのご相談にも対応します。",
      },
      {
        heading: "四葉行政書士事務所の担当範囲（別契約）",
        body: "日本国内にお住まいがない方が不動産を売却する場合、納税管理人の選任が必要になることがあります。これに関連する書類の作成は、併設の四葉行政書士事務所が別契約で受任します。",
      },
      {
        heading: "他の専門家との連携",
        body: "納税管理人が必要となるかどうかの判断や、源泉徴収・確定申告など税務の詳細については、税理士へのご相談をご案内します。",
      },
      {
        heading: "想定される進め方のまとめ",
        body: "想定される進め方は、オンラインでのご相談、必要書類と手続きの整理、査定、売却活動という順序です。海外との時差や郵送に日数がかかることをふまえ、余裕をもった日程で進めます。ご契約は事業体ごとに分かれ、各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
      },
    ],
    links: [
      { href: "/global/chinese", label: "華人・中国語圏のお客様へ" },
      { href: "/souzoku/akiya", label: "文京区の空き家、どうする？——売却・活用・管理" },
    ],
  },
];

// ItemList JSON-LD＝4事例の一覧。BreadcrumbList は <Breadcrumb> 部品が出力するためここでは出さない。
// name に「モデルケース」を含める（検索結果上で実績と誤読されないため）。
const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": SITE + PATH + "#itemlist",
  name: "相談事例（モデルケース）",
  description: NOTICE,
  numberOfItems: CASES.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: CASES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title,
    url: `${SITE}${PATH}#${c.id}`,
  })),
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "相談事例（モデルケース）｜四葉不動産",
    description:
      "四葉不動産株式会社に寄せられることが想定されるご相談を、モデルケース（想定される相談の流れ）としてご紹介します。グループホーム開設、中国語での相続不動産の売却、文京区の空き家の出口整理、海外在住オーナーの遠隔売却の4例。実在のお客様・取引を紹介するものではありません。書類作成など法務手続きは併設の四葉行政書士事務所が別契約で受任します。",
    path: PATH,
    keywords: [
      "文京区 不動産 相談事例",
      "グループホーム 開設 物件",
      "相続不動産 売却 中国語",
      "空き家 相続 相談",
      "海外在住 不動産 売却",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path={PATH}
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "相談事例" },
      ]}
      serviceName="文京区の不動産に関するご相談（モデルケースのご紹介）"
      heroSrc="/hero/bunkyo-sakura-16x9.webp"
      heroAlt="文京区の街並み（相談事例のイメージ）"
      h1="相談事例（モデルケース）"
      lead={
        <>
          {/* 冒頭注記＝浦松確定文言。枠囲みで目立たせる。一字一句変更しないこと */}
          <p
            role="note"
            className="rounded-xl border-2 border-primary bg-primary-tint p-4 text-sm font-medium leading-relaxed text-ink"
          >
            {NOTICE}
          </p>
          <p className="mt-4">
            どのご相談も、<strong>四葉不動産株式会社が担当する範囲</strong>と、<strong>併設の四葉行政書士事務所が別契約で受任する範囲</strong>、そして他の専門家にお繋ぎする範囲に分かれます。それぞれのモデルケースで、その分かれ方をご確認ください。
          </p>
        </>
      }
      internalLinks={[
        { href: "/toushi/group-home", label: "グループホームに使える物件探し" },
        { href: "/toushi/shitei-shinsei", label: "指定申請と物件の関係" },
        { href: "/global/chinese", label: "華人・中国語圏のお客様へ" },
        { href: "/souzoku/akiya", label: "文京区の空き家、どうする？" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="書類の作成など法務手続きに関わる部分は、併設の四葉行政書士事務所が別契約で受任します。"
    >
      {/* ItemList JSON-LD（4事例の一覧）。BreadcrumbListは<Breadcrumb>部品が出力＝重複出力しない */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_JSON_LD) }}
      />

      {CASES.map((c) => (
        <div key={c.id} id={c.id} className="scroll-mt-24">
          <ReH2>{c.title}</ReH2>
          <dl className="mt-3 space-y-4">
            {c.sections.map((s) => (
              <div key={s.heading}>
                <dt className="text-sm font-semibold text-ink">{s.heading}</dt>
                <dd className="mt-1 leading-relaxed text-text">{s.body}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {c.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* 各事例末尾の注記＝必須。一字一句変更しないこと */}
          <p className="mt-3 text-xs text-text-muted">{CASE_NOTE}</p>
        </div>
      ))}

      {/* 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし） */}
      <CannotHandle bare />
    </RealestateServicePage>
  );
}
