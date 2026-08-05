// /network（四葉が扱わない業務と、そのご相談先）
// 正本＝Drive「四葉_社労士開業2026_サイト切替設計/01_設計書と進行表/00_設計書_社労士開業サイト再設計_v1.md」§2-A-2
// 指示書＝11B_事前公開_reasons-network.md（v1.3・2026-08-05）
//
// 【表記上の注意（指示書11B・設計書2-A-2）】
//   ・H1・本文で「連携」の語を使わない。「連携して対応」は業務の一体提供を示唆しうる。
//     「おつなぎ」「ご紹介」に統一する
//   ・「提携税理士」「提携司法書士」「提携弁護士」と書かない。書面での提携の有無は未確認（U12）。
//     「取り扱っておりません。ご希望があれば◯◯士をご紹介します（紹介料の授受はありません）」にとどめる
//   ・ご紹介先の個人名・事務所名は、本人の掲載同意が確認できるものに限る。同意が未確認のものは
//     資格種別のみ記載する（本ページ公開時点では個人名・事務所名を一切記載しない）
//   ・紹介料は受領・支払の両面を否認する
//   ・士業ドットコムは「代表が運営する士業ネットワークのプラットフォーム。参加費無料、
//     紹介料の授受を禁止。四葉が業務を受任する主体ではない」と書く
//
// 【社労士の扱い】2026-08-05 方針変更（指示書11B v1.3）。冒頭直答で事務所名を出すが、
//   必ず「2026年9月開業予定・現時点では未開業」を併記する（社会保険労務士法第27条／
//   昭和43年法律第89号＝業務の制限）。事務所名は SR_OFFICE_NAME 経由（sr-name.ts の実行時結合）。
//
// 【事務所数】開業前に事務所数を数えない（第6条6-4-8）。H1・関連リンクのラベルは
//   SR_LAUNCHED で出し分ける（第4条「数えるならゲートで出し分ける」）。PR #147 の是正を維持。
//
// 【ja先行】多言語展開は指示書13で別途行う。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";

const SR_LAUNCHED = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";

const LAST_UPDATED_JA = "2026年8月5日";
const DATE_MODIFIED = "2026-08-05";

const PAGE_URL = `${SITE_URL}/network`;
/** 実測値（U2・2026-08-05）。仮の @id を作らない */
const ORG_REALESTATE = `${SITE_URL}/#organization`;
const ORG_LEGAL = `${SITE_URL}/legal/#organization`;

// 2026-07-28：H1・関連リンクのラベルで事務所数を数えない（開業前は2事務所のため）。
// 設計書2-A-2のH1「三つの事務所が扱わない業務と、そのご相談先」は開業後の表現であり、
// 開業前にそのまま出すと社労士事務所が既に受任主体として存在するかのような表示になる（法27条の趣旨）。
const H1_JA = SR_LAUNCHED
  ? "三つの事務所が扱わない業務と、そのご相談先"
  : "四葉が扱わない業務と、そのご相談先";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "四葉が扱わない業務のご相談先｜税理士・司法書士・弁護士との関係",
    description:
      "税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。四葉はこれらを取り扱わず、必要な場合は専門家をご紹介します。紹介料は受け取ることも支払うこともありません。ご紹介した専門家とは、お客様が直接ご契約いただきます。",
    path: "/network",
    keywords: [
      "不動産 相続 税理士 司法書士 誰に頼む",
      "行政書士 できないこと",
      "士業 紹介料",
      "相続 手続き 担当 資格",
    ],
    locale: "ja",
    absoluteTitle: true,
  });
}

/** 業務と担当資格の対応表。四葉が扱うか扱わないかを主語にして書く */
type Row = { work: string; shikaku: string; yotsuba: string };

const ROWS_BASE: Row[] = [
  {
    work: "宅地建物の売買・賃貸の媒介、賃貸物件の管理",
    shikaku: "宅地建物取引業",
    yotsuba: "四葉不動産株式会社が承ります",
  },
  {
    work: "官公署へ提出する書類の作成、権利義務または事実証明に関する書類の作成",
    shikaku: "行政書士",
    yotsuba: "四葉行政書士事務所が別契約で承ります",
  },
  {
    work: "不動産・法人の登記の申請代理",
    shikaku: "司法書士",
    yotsuba: "取り扱っておりません。ご希望があれば司法書士をご紹介します",
  },
  {
    work: "相続税・贈与税・所得税などの申告と税務代理、税務相談",
    shikaku: "税理士",
    yotsuba: "取り扱っておりません。ご希望があれば税理士をご紹介します",
  },
  {
    work: "紛争性のある事案の代理・交渉、訴訟、法律相談",
    shikaku: "弁護士",
    yotsuba: "取り扱っておりません。ご希望があれば弁護士をご紹介します",
  },
];

const ROW_SR: Row = {
  work: "労働・社会保険の手続き、就業規則等の作成、労務管理の相談",
  shikaku: "社会保険労務士",
  yotsuba: `${SR_OFFICE_NAME}が別契約で承ります`,
};

const ROW_SR_UNLAUNCHED: Row = {
  work: "労働・社会保険の手続き、就業規則等の作成、労務管理の相談",
  shikaku: "社会保険労務士",
  yotsuba:
    "現時点では取り扱っておりません（2026年9月開業予定）。それまでは社会保険労務士をご紹介します",
};

const A_OUTSIDE = SR_LAUNCHED
  ? "登記の申請代理は司法書士、税務の申告と代理は税理士、紛争性のある事案の代理と法律相談は弁護士の業務です。三つの事務所のいずれも取り扱っておりません。"
  : `登記の申請代理は司法書士、税務の申告と代理は税理士、紛争性のある事案の代理と法律相談は弁護士の業務です。四葉の事務所はいずれも取り扱っておりません。労働・社会保険の手続きは、${SR_OFFICE_NAME}の開業（2026年9月予定）まで取り扱いがありません。`;

const A_FEE =
  "いただきません。ご紹介先から受け取ることも、ご紹介先にお支払いすることもありません。ご紹介した専門家とは、お客様が直接ご契約いただきます。";

const A_NOT_FORCED =
  "いいえ。他の専門家をご自身で選んでいただいて差し支えありません。すでにお付き合いのある税理士や司法書士がいらっしゃる場合は、その方とお進めいただけます。";

const A_WHEN =
  "ご相談の段階で、必要な手続きと担当する資格・事務所の対応表をお渡しします。ご契約は、ご依頼される事務所とのみ結んでいただきます。";

const A_SAMURAI =
  "士業ドットコムは代表が運営する士業ネットワークのプラットフォームです。参加費は無料で、紹介料の授受を禁止しています。四葉が業務を受任する主体ではありません。";

const FAQ: { question: string; answer: string }[] = [
  { question: "どの業務が、四葉の取り扱いの外ですか？", answer: A_OUTSIDE },
  { question: "紹介料はかかりますか？", answer: A_FEE },
  { question: "紹介された専門家に必ず依頼しなければいけませんか？", answer: A_NOT_FORCED },
  { question: "どの手続きを誰が担うかは、いつ分かりますか？", answer: A_WHEN },
  { question: "士業ドットコムとは、どういう関係ですか？", answer: A_SAMURAI },
  {
    question: "ご紹介した専門家との契約は、四葉が間に入るのですか？",
    answer:
      "入りません。お客様と各専門家が直接ご契約いただきます。料金のお支払いも直接お願いします。",
  },
];

const ANSWER_JA = SR_LAUNCHED
  ? `手続きによっては、三つの事務所のいずれも扱えない業務が含まれます。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案の代理と法律相談は弁護士の業務です。四葉不動産株式会社、四葉行政書士事務所、${SR_OFFICE_NAME}のいずれもこれらを取り扱わず、必要な場合は専門家をご紹介します。ご紹介にあたって手数料をお客様からいただくことはなく、ご紹介先から受け取ることも、ご紹介先にお支払いすることもありません。ご紹介した専門家とは、お客様が直接ご契約いただきます。`
  : `手続きによっては、四葉の事務所のいずれも扱えない業務が含まれます。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案の代理と法律相談は弁護士の業務です。四葉不動産株式会社、四葉行政書士事務所、${SR_OFFICE_NAME}（2026年9月開業予定・現時点では未開業）のいずれもこれらを取り扱わず、必要な場合は専門家をご紹介します。ご紹介にあたって手数料をお客様からいただくことはなく、ご紹介先から受け取ることも、ご紹介先にお支払いすることもありません。ご紹介した専門家とは、お客様が直接ご契約いただきます。`;

const RELATED: { href: string; label: string }[] = [
  { href: "/reasons", label: "四葉が選ばれる理由" },
  { href: "/legal/services", label: "四葉行政書士事務所の業務案内" },
  { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
  { href: "/ryokin", label: "四葉不動産の料金" },
];

/** WebPage。組織の再定義はせず、既存 @id の参照にとどめる。
 *  社労士事務所の @id は /labor の公開と同時に追加する（ゲート1）。ここでは作らない。 */
const WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: "四葉が扱わない業務のご相談先｜税理士・司法書士・弁護士との関係",
  description: ANSWER_JA,
  inLanguage: "ja",
  dateModified: DATE_MODIFIED,
  about: [{ "@id": ORG_REALESTATE }, { "@id": ORG_LEGAL }],
  mentions: [{ "@id": PERSON_ID }],
  publisher: { "@id": ORG_REALESTATE },
};

export default async function Page() {
  const rows = SR_LAUNCHED
    ? [ROWS_BASE[0], ROWS_BASE[1], ROW_SR, ...ROWS_BASE.slice(2)]
    : [ROWS_BASE[0], ROWS_BASE[1], ROW_SR_UNLAUNCHED, ...ROWS_BASE.slice(2)];

  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: "扱わない業務とご相談先" }]} />
      <JsonLd data={WEBPAGE_JSONLD} />
      <FAQJsonLd items={FAQ} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{H1_JA}</h1>
          <p className="mt-4 leading-relaxed text-text">{ANSWER_JA}</p>
        </header>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            どの業務が、四葉の取り扱いの外ですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_OUTSIDE}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    業務
                  </th>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    担当する資格
                  </th>
                  <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                    四葉の取り扱い
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.work}>
                    <td className="border border-border px-3 py-2 text-text">{r.work}</td>
                    <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                      {r.shikaku}
                    </th>
                    <td className="border border-border px-3 py-2 text-text">{r.yotsuba}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">紹介料はかかりますか？</h2>
          <p className="mt-3 leading-relaxed text-text">{A_FEE}</p>
          <ul className="mt-4 space-y-3 text-text">
            <li className="leading-relaxed">
              <span className="font-medium text-ink">紹介料をいただきません。</span>
              お客様から紹介手数料を申し受けることはありません。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">紹介料を受け取りません。</span>
              ご紹介先の専門家から手数料や謝礼を受け取ることはありません。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">紹介料を支払いません。</span>
              ご紹介先へ手数料をお支払いすることもありません。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">直接ご契約いただきます。</span>
              ご紹介した専門家とは、お客様が直接ご契約ください。四葉が間に入って再委託する形はとりません。
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            ご紹介先の氏名・事務所名は、掲載のご同意をいただけたものに限って本ページに記載します。現時点では資格の種別のみを記載しています。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            紹介された専門家に必ず依頼しなければいけませんか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_NOT_FORCED}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            どの手続きを誰が担うかは、いつ分かりますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_WHEN}</p>
          <ol className="mt-4 space-y-3 text-text">
            <li className="leading-relaxed">
              <span className="font-medium text-ink">1. 手続きを分解します。</span>
              ご相談の内容を伺い、必要な手続きを洗い出します。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">2. 担当を表にします。</span>
              どの手続きをどの資格が担うか、四葉が受任する部分はどこかを表でお示しします。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">3. ご希望を伺います。</span>
              四葉が扱わない部分について、ご紹介が必要かどうかを確認します。すでにお付き合いのある専門家がいらっしゃれば、そのままで差し支えありません。
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-ink">4. おつなぎします。</span>
              ご希望があれば専門家をご紹介します。以後のご契約とお支払いは、お客様と専門家の間で直接お願いします。
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            士業ドットコムとは、どういう関係ですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">{A_SAMURAI}</p>
          <p className="mt-3 text-sm">
            <a
              href="https://www.samurai.co.jp/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              士業ドットコム（samurai.co.jp）
            </a>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">よくあるご質問</h2>
          <dl className="mt-4 space-y-5">
            {FAQ.slice(5).map((f) => (
              <div key={f.question}>
                <dt className="font-medium text-ink">{f.question}</dt>
                <dd className="mt-1 leading-relaxed text-text">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

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
              登記又は供託に関する手続の代理＝司法書士法（昭和25年法律第197号）第3条第1項（業務）
            </li>
            <li>
              税務代理・税務書類の作成・税務相談＝税理士法（昭和26年法律第237号）第2条第1項（税理士の業務）
            </li>
            <li>
              報酬を得る目的での法律事務の取扱い＝弁護士法（昭和24年法律第205号）第72条（非弁護士の法律事務の取扱い等の禁止）
            </li>
            <li>
              行政書士の業務＝行政書士法（昭和26年法律第4号）第1条の3第1項。同法第1条の4第1項は提出手続の代理・書類作成の相談。令和8年（2026年）1月1日施行の改正で第1条の2（職責）が新設され、条番号が繰り下がりました（e-Gov法令検索で2026年8月5日に確認）
            </li>
            <li>
              社会保険労務士の業務＝社会保険労務士法（昭和43年法律第89号）第2条第1項。同法第27条は、社会保険労務士でない者が報酬を得て第2条第1項第1号から第2号までの事務を業として行うことを禁じています
            </li>
            <li>宅地建物取引業の免許＝宅地建物取引業法（昭和27年法律第176号）第3条第1項（免許）</li>
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
