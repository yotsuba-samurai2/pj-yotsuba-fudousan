// /reasons（選ばれる理由）— 相談先型クエリの最大の受け皿
// 正本＝Drive「四葉_社労士開業2026_サイト切替設計/01_設計書と進行表/00_設計書_社労士開業サイト再設計_v1.md」§1-3
// 指示書＝同 02_ClaudeCode指示書/11_事前_新規6ページ執筆.md「5. /reasons」
//
// 【設計意図】実測で〈相談先を尋ねる型 × 専用ページあり〉は引用12/13・名指し11/13、
//   〈専用ページなし〉は0/3。名指し（＝受任導線）を取るには「誰に相談するか」に答える面が要る。
//   本ページは設計書 第4章 F1・F2・F4・G3 を受ける。
//
// 【表示コンプライアンス】yotsuba-sharoushi-kaigyo 第6条／shigyo-compliance-gate
//   ・一体提供を示唆する語を使わない（婉曲表現を含む）。「並走」「伴走」「連携して対応」「まとめて」も不可
//   ・「窓口はひとつ」「相談の入口は同じ」「まず当方へ」型を使わない（U6＝適法性の確認が未了）
//   ・競合を名指しで批判しない。自社の開示内容だけを書く
//   ・国数表記を使わない。「中国総局長として中国や台湾、タイに駐在」
//   ・実績・事例・口コミ・評価・受賞歴・報酬額を書かない
//
// 【社労士の扱い】2026年9月1日の登録まで、社労士事務所に関する記述は
//   NEXT_PUBLIC_SR_LAUNCHED ゲートの内側にのみ置く（社会保険労務士法第27条／昭和43年法律第89号の趣旨）。
//   事務所名は必ず SR_OFFICE_NAME 経由で取得する（sr-name.ts の実行時結合＝
//   クライアントJSチャンクに事務所名の連続リテラルを残さないための実装）。本ページはServer Component。
//
// 【ja先行】多言語展開は指示書13で別途行う（手本＝/kikoku の availableLocales:["ja"]）。
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";

const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";

/** 可視の最終更新日（luck428-column-seo 第7条6）*/
const LAST_UPDATED_JA = "2026年7月28日";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "四葉が選ばれる理由｜契約の前に、誰が何を担うかをお示しします",
    description:
      "四葉では、不動産の取引と、許認可や書類の作成を、それぞれ別の事務所が別の契約で受任します。どの部分をどの事務所が担い、いくらかかるのかを、ご契約の前にお示しします。文京区小日向・茗荷谷駅から徒歩5分。",
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

const YAKUWARI: Yakuwari[] = [
  {
    office: "四葉不動産株式会社",
    work: "宅地建物の売買・賃貸の媒介、賃貸物件の管理",
    license: "宅地建物取引業 東京都知事(1)第113304号",
  },
  {
    office: "四葉行政書士事務所",
    work: "官公署に提出する書類、権利義務または事実証明に関する書類の作成（行政書士法第1条の2）、提出手続の代理・書類作成の相談（同第1条の3）",
    license: "行政書士 登録番号第25087022号",
  },
];

const YAKUWARI_SR: Yakuwari = {
  office: SR_OFFICE_NAME,
  work: "労働・社会保険の手続き、就業規則等の作成、労務管理の相談",
  license: "社会保険労務士 登録番号【登録完了後に記載】",
};

const FAQ_BASE: { question: string; answer: string }[] = [
  {
    question: "事務所は同じ会社ですか？",
    answer:
      "いいえ。同じ場所にありますが、それぞれ独立した事業体です。契約・請求・入金も事務所ごとに分かれます。",
  },
  {
    question: "一部だけ依頼することはできますか？",
    answer:
      "できます。物件の媒介は四葉不動産株式会社が、書類の作成は四葉行政書士事務所が、それぞれ別契約で承ります。1つの事務所だけにご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。",
  },
  {
    question: "契約が分かれると手続きが煩雑になりませんか？",
    answer:
      "契約書は事務所ごとに分かれます。必要な書類については、どの手続きにどの書類が使われるかを一覧にしてお示しします。ご依頼は、必要な事務所とだけ結んでいただけます。",
  },
  {
    question: "料金はどうなりますか？",
    answer:
      "事務所ごとに別建てです。合算したご請求や、複数の事務所へご依頼いただいたことによるお値引きはありません。必要な部分だけをご依頼いただけます。",
  },
];

/** 開業後は2問目を社労士を含む文面へ差し替える（同一デプロイで切り替わる） */
const FAQ_SR_ANSWER =
  "できます。物件の媒介は四葉不動産株式会社が、許認可の書類は四葉行政書士事務所が、労働・社会保険の手続きは" +
  SR_OFFICE_NAME +
  "が、それぞれ別契約で承ります。1つの事務所だけにご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。";

const faqItems = SR_LAUNCHED
  ? FAQ_BASE.map((f, i) => (i === 1 ? { ...f, answer: FAQ_SR_ANSWER } : f))
  : FAQ_BASE;

const ANSWER_JA = SR_LAUNCHED
  ? `四葉では、不動産の取引は四葉不動産株式会社が、許認可や書類の作成は四葉行政書士事務所が、労働・社会保険の手続きは${SR_OFFICE_NAME}が、それぞれ別の契約で受任します。同じ場所にありますが、独立した事務所です。ご相談の段階で、どの部分をどの事務所が担い、それぞれいくらかかるのかをお示しします。必要な部分だけをご依頼いただくこともできます。税務の代理は税理士、登記は司法書士、紛争性のある事案は弁護士へおつなぎします。`
  : `四葉では、不動産の取引は四葉不動産株式会社が、許認可や書類の作成は四葉行政書士事務所が、それぞれ別の契約で受任します。同じ場所にありますが、独立した事務所です。ご相談の段階で、どの部分をどの事務所が担い、それぞれいくらかかるのかをお示しします。必要な部分だけをご依頼いただくこともできます。税務の代理は税理士、登記は司法書士、紛争性のある事案は弁護士へおつなぎします。`;

const RELATED: { href: string; label: string }[] = [
  { href: "/network", label: "3つの事務所が扱わない業務と、そのご相談先" },
  { href: "/about", label: "会社概要" },
  { href: "/about/uramatsu", label: "代表・浦松丈二のプロフィール" },
  { href: "/ryokin", label: "四葉不動産の料金" },
  { href: "/legal/ryokin", label: "四葉行政書士事務所の報酬額表" },
  { href: "/toushi/group-home", label: "グループホームの開設と物件" },
];

export default async function Page() {
  const rows = SR_LAUNCHED ? [...YAKUWARI, YAKUWARI_SR] : YAKUWARI;
  const officeCount = rows.length;

  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: "選ばれる理由" }]} />
      <FAQJsonLd items={faqItems} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            四葉が選ばれる理由
          </h1>
          <p className="mt-4 leading-relaxed text-text">{ANSWER_JA}</p>
        </header>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            どの事務所が、何を担いますか？
          </h2>
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
            {officeCount}つの事務所は同一の所在地にありますが、それぞれ独立した事業体です。業務はそれぞれ別の契約で受任し、料金・請求・お振込先も事務所ごとに分かれます。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            なぜ、契約を分けているのですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            資格ごとに、法律で扱える業務の範囲が定められているためです。宅地建物取引業の免許で扱えるのは不動産の取引で、官公署へ提出する書類の作成は行政書士の業務です。ひとつの契約に含めてしまうと、どの部分をどの資格で受任しているのかが不明確になります。
          </p>
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
            契約が分かれると、手間が増えませんか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            増える部分があります。ご契約いただく事務所の数だけ契約書が必要になり、ご請求もそれぞれ届きます。この点は分けたことによる負担です。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            一方で、必要な書類については、どの手続きにどの書類が使われるかを一覧にしてお示しします。同じ書類を何度も取り直していただくことのないよう、ご相談の段階で整理します。
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
            {faqItems.map((f) => (
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

        <p className="mt-8 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。
        </p>
        <p className="mt-2 text-xs text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
      </article>

      <CtaBand businessKey="realestate" />
    </>
  );
}
