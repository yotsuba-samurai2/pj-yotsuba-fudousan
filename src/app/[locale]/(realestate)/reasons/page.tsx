// /reasons（選ばれる理由）— 相談先型クエリの最大の受け皿
// 正本＝Drive「四葉_社労士開業2026_サイト切替設計/01_設計書と進行表/00_設計書_社労士開業サイト再設計_v1.md」§1-3
// 指示書＝11B_事前公開_reasons-network.md（v1.3・2026-08-05）
//
// 【設計意図】実測で〈相談先を尋ねる型 × 専用ページあり〉は引用12/13・名指し11/13、
//   〈専用ページなし〉は0/3。名指し（＝受任導線）を取るには「誰に相談するか」に答える面が要る。
//   H2は疑問文型＋各H2直下に直答（yotsuba-ai-visibility-improve 第3条・型B）。
//   「四葉◯◯は、何ができますか？」を事業体ごとに独立H2で置くのが名指しを取る型。
//
// 【表示コンプライアンス】yotsuba-sharoushi-kaigyo 第6条／shigyo-compliance-gate
//   ・一括受任と読める語を使わない（ワンストップ／一括対応／まとめて契約／一気通貫）
//   ・「窓口は一つ」型は使ってよい（第6条6-3・2026-07-29 浦松判断／石井弁護士確認済）。
//     ただし同一ページ内に分離受任の明示（別契約・請求別・紹介料授受なし）を必ず併記する
//   ・競合を名指しで批判しない。国数表記を使わない（「中国総局長として中国や台湾、タイに駐在」）
//   ・実績・事例・口コミ・評価・受賞歴を書かない
//   ・「提携税理士」等と書かない（U12＝書面での提携が未確認）。「ご紹介します」にとどめる
//
// 【社労士の扱い】2026-08-05 方針変更（指示書11B v1.3）。
//   従来は SR_LAUNCHED ゲートで全非表示だったが、footer・CannotHandle・/about/uramatsu・
//   /toushi/shitei-shinsei が既に「2026年9月開業予定（現時点では未開業）」を可視表示しており、
//   本ページだけ伏せる合理性がない。よって「未開業注記＋未来形」に限定して可視化する。
//   受任できると読める現在形（「承ります」）は SR_LAUNCHED の内側にのみ置く
//   （社会保険労務士法第27条／昭和43年法律第89号＝業務の制限）。
//   事務所名は必ず SR_OFFICE_NAME 経由で取得する（sr-name.ts の実行時結合）。
//
// 【事務所数】第6条6-4-8「開業前に事務所数を数えない」。第4条「数えるならゲートで出し分ける」に従い、
//   「契約は三つ」は SR_LAUNCHED=true のときだけ出す（開業前は「契約は分かれます」）。PR #147 の是正を維持。
//
// 【ja先行】多言語展開は指示書13で別途行う（手本＝/kikoku の availableLocales:["ja"]）。
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";
import { SR_REGISTRATION_ID } from "@/lib/shared/sr-registration";

const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";

/** 可視の最終更新日（luck428-column-seo 第7条6） */
const LAST_UPDATED_JA = "2026年8月5日";
/** JSON-LD の dateModified（可視表示と一致させる） */
const DATE_MODIFIED = "2026-08-05";

const PAGE_URL = `${SITE_URL}/reasons`;
/** 実測値（U2・2026-08-05）。仮の @id を作らない */
const ORG_REALESTATE = `${SITE_URL}/#organization`;
const ORG_LEGAL = `${SITE_URL}/legal/#organization`;

/** 中核メッセージ。開業前は事務所数を数えない（第6条6-4-8） */
const TAGLINE = SR_LAUNCHED ? "窓口は一つ、契約は三つ" : "窓口は一つ、契約は分かれます";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: `四葉が選ばれる理由｜${TAGLINE}`,
    description:
      "四葉では、ご相談の窓口は一つですが、契約は事務所ごとに分かれます。不動産の取引は四葉不動産株式会社、許認可や書類の作成は四葉行政書士事務所が、それぞれ別の契約で受任します。どの部分をどの事務所が担い、いくらかかるのかを、ご契約の前にお示しします。文京区小日向・茗荷谷駅から徒歩5分。",
    path: "/reasons",
    keywords: [
      "文京区 不動産 行政書士 どこがいい",
      "グループホーム 開設 相談先",
      "不動産 許認可 相談先 東京",
      "分離受任 士業",
      "紹介料なし 士業",
    ],
    locale: "ja",
    absoluteTitle: true,
  });
}

/** 役割分担（共通コンポーネントCC-1の先行実装。指示書12でコンポーネント化する） */
type Yakuwari = { office: string; work: string; license: string };

const YAKUWARI_BASE: Yakuwari[] = [
  {
    office: "四葉不動産株式会社",
    work: "宅地建物の売買・賃貸の媒介、賃貸物件の管理",
    license: "宅地建物取引業 東京都知事(1)第113304号",
  },
  {
    office: "四葉行政書士事務所",
    work: "官公署に提出する書類、権利義務または事実証明に関する書類の作成（行政書士法第1条の3）、提出手続の代理・書類作成の相談（同第1条の4）",
    license: "行政書士 登録番号第25087022号",
  },
];

/** 開業後＝受任主体として並ぶ */
const YAKUWARI_SR_LAUNCHED: Yakuwari = {
  office: SR_OFFICE_NAME,
  work: "労働・社会保険の手続き、就業規則をはじめとする社内規程の作成、労務管理の相談",
  // 登録番号＝2026-09-01 登録証で確認（正本 sr-registration.ts）。行政書士の行と同じ体裁。
  license: `社会保険労務士 登録番号${SR_REGISTRATION_ID}`,
};

/** 開業前＝未開業であることを表の中で明示する（現在形で受任できると読ませない） */
const YAKUWARI_SR_UNLAUNCHED: Yakuwari = {
  office: SR_OFFICE_NAME,
  work: "（開業後）労働・社会保険の手続き、就業規則をはじめとする社内規程の作成、労務管理の相談",
  license: "2026年9月開業予定・現時点では未開業（登録番号は登録完了後に記載）",
};

const FAQ_BASE: { question: string; answer: string }[] = [
  {
    question: "事務所は同じ会社ですか？",
    answer:
      "いいえ。同じ所在地にありますが、それぞれ独立した事業体です。契約・請求・入金も事務所ごとに分かれます。",
  },
  {
    question: "料金はどうなりますか？",
    answer:
      "事務所ごとに別建てです。合算したご請求や、複数の事務所へご依頼いただいたことによるお値引きはありません。必要な部分だけをご依頼いただけます。",
  },
  {
    question: "紹介料はかかりますか？",
    answer:
      "いただきません。四葉が扱わない業務について専門家をご紹介する場合も、ご紹介先から受け取ることも、ご紹介先にお支払いすることもありません。",
  },
];

const ANSWER_JA = SR_LAUNCHED
  ? `四葉では、ご相談の窓口は一つですが、契約は事務所ごとに分かれます。不動産の取引は四葉不動産株式会社が、許認可や書類の作成は四葉行政書士事務所が、労働・社会保険の手続きは${SR_OFFICE_NAME}が、それぞれ別の契約で受任します。同じ所在地にある独立した三つの事務所です。ご相談の段階で、どの部分をどの事務所が担い、それぞれいくらかかるのかをお示しします。必要な部分だけをご依頼いただけます。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。`
  : `四葉では、ご相談の窓口は一つですが、契約は事務所ごとに分かれます。不動産の取引は四葉不動産株式会社が、許認可や書類の作成は四葉行政書士事務所が、それぞれ別の契約で受任します。労働・社会保険の手続きは、2026年9月に開業を予定している${SR_OFFICE_NAME}が開業後に承ります（現時点では未開業）。同じ所在地にある独立した事務所です。ご相談の段階で、どの部分をどの事務所が担い、それぞれいくらかかるのかをお示しします。必要な部分だけをご依頼いただけます。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。`;

/** H2の直答。FAQPage にも同文を載せる（型B＝設問への直答＋誰が担うかの明示） */
const A_WHY_SPLIT = SR_LAUNCHED
  ? "宅地建物取引業、行政書士、社会保険労務士は、それぞれ別の法律に基づく業務です。業務ごとに受任する主体を分けることが法令上の求めです。代表は同一人物ですが、事務所は独立した事業体です。"
  : "宅地建物取引業と行政書士は、それぞれ別の法律に基づく業務です。業務ごとに受任する主体を分けることが法令上の求めです。代表は同一人物ですが、事務所は独立した事業体です。";

const A_COMPLEX =
  "契約書と請求書は事務所ごとに分かれます。ただし必要な書類は、どの手続きにどの書類が使われるかを一覧にしてお示しします。ご依頼は、必要な事務所とだけ結んでいただけます。";

const A_PARTIAL =
  "できます。物件の媒介は四葉不動産株式会社が、書類の作成は四葉行政書士事務所が、それぞれ別契約で承ります。一つの事務所だけへのご依頼も、他の部分を他社にご依頼いただくことも差し支えありません。";

const A_FUDOSAN =
  "四葉不動産株式会社は、東京都知事(1)第113304号の宅地建物取引業者です。文京区小日向を拠点に、賃貸・売買・管理、相続した不動産の活用・売却、障害福祉サービス事業所の物件探しを承ります。日本語・英語・中国語（繁体字・簡体字）に対応します。";

const A_GYOSEI =
  "四葉行政書士事務所は、登録番号第25087022号の行政書士事務所です。官公署に提出する書類、権利義務または事実証明に関する書類の作成（行政書士法第1条の3）と、提出手続の代理・書類作成の相談（同第1条の4）を承ります。相続・遺言・信託、在留資格、各種許認可を扱います。";

const A_SR = SR_LAUNCHED
  ? `${SR_OFFICE_NAME}は、労働・社会保険の手続き、就業規則をはじめとする社内規程の作成、労務管理のご相談を、別契約で承ります。`
  : `${SR_OFFICE_NAME}は2026年9月に開業を予定しています（現時点では未開業）。開業後は、労働・社会保険の手続き、就業規則をはじめとする社内規程の作成、労務管理のご相談を、別契約で承ります。開業までの間、労務のご相談は社会保険労務士をご紹介します。`;

const A_CANNOT = SR_LAUNCHED
  ? "税務の申告と代理は税理士、登記は司法書士、紛争性のある事案の代理と法律相談は弁護士の業務です。三つの事務所のいずれも取り扱っておりません。ご希望があればご紹介します（紹介料の授受はありません）。"
  : "税務の申告と代理は税理士、登記は司法書士、紛争性のある事案の代理と法律相談は弁護士の業務です。四葉の事務所はいずれも取り扱っておりません。ご希望があればご紹介します（紹介料の授受はありません）。";

const faqItems = [
  { question: SR_LAUNCHED ? "なぜ契約が三つに分かれるのですか？" : "なぜ契約が分かれるのですか？", answer: A_WHY_SPLIT },
  { question: "窓口が一つで契約が分かれると、手続きが煩雑になりませんか？", answer: A_COMPLEX },
  { question: "一部だけ依頼することはできますか？", answer: A_PARTIAL },
  { question: "四葉不動産株式会社は、何ができますか？", answer: A_FUDOSAN },
  { question: "四葉行政書士事務所は、何ができますか？", answer: A_GYOSEI },
  { question: `${SR_OFFICE_NAME}は、何ができますか？`, answer: A_SR },
  { question: "四葉が扱わない業務は何ですか？", answer: A_CANNOT },
  ...FAQ_BASE,
];

const RELATED: { href: string; label: string }[] = [
  // 2026-07-28：ラベルで事務所数を数えない（開業前は2事務所）。/network のH1と同じ理由
  {
    href: "/network",
    label: SR_LAUNCHED
      ? "三つの事務所が扱わない業務と、そのご相談先"
      : "四葉が扱わない業務と、そのご相談先",
  },
  { href: "/about", label: "会社概要" },
  { href: "/about/uramatsu", label: "代表・浦松丈二のプロフィール" },
  { href: "/ryokin", label: "四葉不動産の料金" },
  { href: "/legal/ryokin", label: "四葉行政書士事務所の報酬額表" },
  { href: "/toushi/group-home", label: "グループホームの開設と物件" },
  { href: "/shataku", label: "借り上げ社宅の導入と物件" },
];

/** WebPage。組織の再定義はせず、既存 @id の参照にとどめる（設計書・指示書11B）。
 *  社労士事務所の @id は /labor の公開と同時に追加する（ゲート1）。ここでは作らない。 */
const WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: `四葉が選ばれる理由｜${TAGLINE}`,
  description: ANSWER_JA,
  inLanguage: "ja",
  dateModified: DATE_MODIFIED,
  about: [{ "@id": ORG_REALESTATE }, { "@id": ORG_LEGAL }],
  mentions: [{ "@id": PERSON_ID }],
  publisher: { "@id": ORG_REALESTATE },
};

export default async function Page() {
  const rows = [
    ...YAKUWARI_BASE,
    SR_LAUNCHED ? YAKUWARI_SR_LAUNCHED : YAKUWARI_SR_UNLAUNCHED,
  ];

  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: "選ばれる理由" }]} />
      <JsonLd data={WEBPAGE_JSONLD} />
      <FAQJsonLd items={faqItems} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            四葉が選ばれる理由
          </h1>
          <p className="mt-2 font-serif text-lg text-primary">{TAGLINE}</p>
          <p className="mt-4 leading-relaxed text-text">{ANSWER_JA}</p>
        </header>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            {SR_LAUNCHED ? "なぜ契約が三つに分かれるのですか？" : "なぜ契約が分かれるのですか？"}
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_WHY_SPLIT}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    事務所
                  </th>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    担当する業務
                  </th>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    登録・免許
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.office}>
                    <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                      {r.office}
                    </th>
                    <td className="border border-border px-3 py-2 text-text">{r.work}</td>
                    <td className="border border-border px-3 py-2 text-text">{r.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {SR_LAUNCHED ? "三つの事務所は" : "これらの事務所は"}
            同一の所在地にありますが、それぞれ独立した事業体です。業務はそれぞれ別の契約で受任し、料金・請求・お振込先も事務所ごとに分かれます。合算したご請求はいたしません。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            窓口が一つで契約が分かれると、手続きが煩雑になりませんか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_COMPLEX}</p>
          <p className="mt-3 leading-relaxed text-text">
            増える部分もあります。ご契約いただく事務所の数だけ契約書が必要になり、ご請求もそれぞれ届きます。この点は分けたことによる負担です。一方で、同じ書類を何度も取り直していただくことのないよう、ご相談の段階で整理します。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            一部だけ依頼することはできますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_PARTIAL}</p>
          <p className="mt-3 leading-relaxed text-text">分けることで、次の3つがはっきりします。</p>
          <ul className="mt-3 space-y-2 text-text">
            <li className="leading-relaxed">
              <span className="font-medium text-ink">誰が担当するか</span>
              ——どの手続きをどの事務所が受任するかを、ご契約の前に書面でお示しします。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">いくらかかるか</span>
              ——料金は事務所ごとに分かれます。合算した見積書は作りません。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">どこまで頼むか</span>
              ——必要な部分だけをご依頼いただけます。他の部分を他社へご依頼いただいても差し支えありません。
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            四葉不動産株式会社は、何ができますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_FUDOSAN}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            四葉行政書士事務所は、何ができますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_GYOSEI}</p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            行政書士の独占業務は書類の「作成」です（行政書士法第19条第1項は、同法第1条の3に規定する業務を非行政書士が報酬を得て業として行うことを禁じています）。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            {SR_OFFICE_NAME}は、何ができますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_SR}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            四葉が扱わない業務は何ですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_CANNOT}</p>
          <p className="mt-3 text-sm">
            <Link href="/network" className="text-primary underline">
              扱わない業務とそのご相談先を詳しく見る
            </Link>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">代表はどういう人ですか？</h2>
          <div className="mt-4 flex items-start gap-4">
            <Image
              src="/staff/uramatsu-square.webp"
              alt="四葉不動産株式会社 代表取締役 浦松丈二"
              width={96}
              height={96}
              className="h-20 w-20 flex-shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
            />
            <p className="leading-relaxed text-text">
              浦松丈二。宅地建物取引士（東京）第293544号・行政書士（登録番号第25087022号）。毎日新聞の記者として34年間、取材・編集・海外報道に携わり、中国総局長として中国や台湾、タイに駐在しました。中国語と英語でのご相談に対応します。
            </p>
          </div>
          <p className="mt-3 text-sm">
            <Link href="/about/uramatsu" className="text-primary underline">
              代表のプロフィールを詳しく見る
            </Link>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">どの言語で相談できますか？</h2>
          <p className="mt-3 leading-relaxed text-text">
            日本語・英語・中国語（繁体字・簡体字）でご相談を承ります。代表が中国語と英語に対応するため、外部の翻訳会社を挟みません。ただし公的機関へ提出する書類など、内容によっては別途ご相談が必要です。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">なぜ文京区小日向なのですか？</h2>
          <p className="mt-3 leading-relaxed text-text">
            東京メトロ丸ノ内線「茗荷谷」駅から徒歩5分の場所に事務所を構えています。文京区とその周辺は、相続した実家をどうするか、空き家をどう扱うかというご相談が続く地域です。地元に事務所があることで、物件を実際に見て、周辺の環境を確かめたうえでご相談に応じられます。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">よくあるご質問</h2>
          <dl className="mt-4 space-y-5">
            {FAQ_BASE.map((f) => (
              <div key={f.question}>
                <dt className="font-medium text-ink">{f.question}</dt>
                <dd className="mt-1 leading-relaxed text-text">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-10">
          <CannotHandle />
        </div>

        <section aria-label="関連ページ" className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">関連するページ</h2>
          <ul className="mt-4 space-y-2">
            {RELATED.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-primary underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* このページの根拠（/legal/services/oyanakiato §7 の形式に合わせる） */}
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">このページの根拠</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
            <li>
              行政書士の業務＝行政書士法（昭和26年法律第4号）第1条の3第1項。官公署に提出する書類その他権利義務又は事実証明に関する書類の作成を業とする。提出手続の代理・書類作成の相談は同法第1条の4第1項。独占業務の範囲は同法第19条第1項（「第一条の三に規定する業務」を参照）
            </li>
            <li>
              ※令和8年（2026年）1月1日施行の改正で第1条の2（職責）が新設され、条番号が繰り下がりました。改正前の「第1条の2＝業務」は、現行では第1条の3にあたります（e-Gov法令検索で2026年8月5日に確認）
            </li>
            <li>
              社会保険労務士の業務＝社会保険労務士法（昭和43年法律第89号）第2条第1項。同法第27条は、社会保険労務士でない者が報酬を得て第2条第1項第1号から第2号までの事務を業として行うことを禁じています（＝当事務所は開業・登録まで社会保険労務士業務を行いません）
            </li>
            <li>税務代理・税務書類の作成・税務相談＝税理士法（昭和26年法律第237号）第2条第1項</li>
            <li>登記又は供託に関する手続の代理＝司法書士法（昭和25年法律第197号）第3条第1項（業務）</li>
            <li>
              報酬を得る目的での法律事務の取扱い＝弁護士法（昭和24年法律第205号）第72条（非弁護士の法律事務の取扱い等の禁止）
            </li>
            <li>宅地建物取引業の免許＝宅地建物取引業法（昭和27年法律第176号）第3条第1項</li>
          </ul>
        </section>

        <p className="mt-8 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。
        </p>
        <p className="mt-2 text-xs leading-relaxed text-text-muted">
          文責：浦松丈二（四葉不動産株式会社 代表取締役・宅地建物取引士（東京）第293544号／四葉行政書士事務所
          代表行政書士・登録番号第25087022号）。
          <Link href="/about/uramatsu" className="text-primary underline">
            執筆者について
          </Link>
        </p>
        <p className="mt-2 text-xs text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
      </article>

      <CtaBand businessKey="realestate" />
    </>
  );
}
