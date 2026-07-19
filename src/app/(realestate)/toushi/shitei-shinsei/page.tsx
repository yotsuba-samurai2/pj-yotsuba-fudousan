// /toushi/shitei-shinsei（型A・指定申請と物件の分離受任）＝タスクC-2（2026-07-19・日本語版のみ）
// 方式＝RealestateServicePage（手本=/toushi/group-home）。ja先行公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定・sitemap側も locales:["ja"]（手本=/ryokin B-1）。
//   COPY[locale] ?? JA のフォールバックで /en /zh-tw /zh からのアクセスにも ja 本文を表示（多言語は監修後に追加）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   独占業務の表現＝「作成」が行政書士の独占業務（行政書士法1条の2・19条）。「作成・提出は独占業務」と
//   まとめて書かない（2026-07-19浦松検収での修正指示）。
// FAQPage JSON-LD＝faqJa（B-3のQ19＋C-2新規3問）を参照（文字列コピー禁止＝表記ゆれ防止）。
// 法人要件は「原則必要です」（2026-07-19浦松検収）。所要期間は断定せず「自治体により異なります」で統一。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下）。浦松指定の確定文言（2026-07-19検収＝「作成」を独占業務とする修正済み）
// ＝一字一句変更しないこと。
const JA_ANSWER_BLOCK =
  "障害者グループホームの指定申請書類の作成は、行政書士法上の官公署提出書類作成として行政書士の独占業務にあたり、四葉行政書士事務所が別契約で受任します。物件の紹介・仲介は宅地建物取引業として四葉不動産株式会社が担当します。両者は独立した事業体ですが、同一の拠点にあるため、物件探しと申請準備を並行して進められます。それぞれの契約・担当を分けることで、専門性と適法性を確保します。";

// FAQPage＝faqJa（B-3のQ19＋C-2新規3問）を参照
const JA_FAQ_QUESTIONS = [
  "指定申請の書類は誰に頼めますか？",
  "物件探しと申請を別々に頼むと、二度手間になりませんか？",
  "グループホーム開設の全体の流れを教えてください。",
  "物件と法人設立は、どちらを先に進めるべきですか？",
];

// §2 開設の全体フロー（所要期間は断定しない＝タスク指定）
const JA_FLOW_STEPS: { title: string; body: string }[] = [
  {
    title: "法人の準備",
    body: "指定を受けるには法人であることが原則必要です。定款の事業目的に障害福祉サービスの実施を含めるなど、法人側の準備を整えます。",
  },
  {
    title: "物件の選定",
    body: "立地・用途地域、居室面積、消防設備など、指定基準を見据えて候補物件を選びます。",
  },
  {
    title: "指定権者への事前相談",
    body: "東京都をはじめ、申請前の事前相談・事前協議の手続を設けている自治体があります。物件・人員・事業計画の見通しを持って、早めに相談します。",
  },
  {
    title: "指定申請",
    body: "指定申請書類の作成は行政書士の独占業務にあたり、書類の作成・提出は四葉行政書士事務所が別契約で受任します。",
  },
  {
    title: "指定",
    body: "指定権者の審査を経て、指定を受けます。",
  },
  {
    title: "開設",
    body: "指定後、利用者の受け入れを開始します。",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "グループホーム等の指定申請｜物件と申請の分離受任 | 四葉不動産",
    description:
      "障害者グループホーム等の指定申請と物件の関係を解説。指定申請書類の作成は行政書士の独占業務にあたり、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任し、物件の紹介・仲介は宅地建物取引業として四葉不動産株式会社が担当します。開設までの流れと担当・契約の分担をご案内します。",
    path: "/toushi/shitei-shinsei",
    keywords: ["グループホーム 指定申請 物件", "共同生活援助 指定申請 流れ", "指定申請 行政書士 独占業務"],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/toushi/shitei-shinsei"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "投資用・事業用不動産", href: "/toushi" },
        { name: "指定申請と物件" },
      ]}
      serviceName="グループホーム等の指定申請を見据えた物件の紹介・仲介"
      heroSrc="/hero/realestate-group-home-16x9.webp"
      heroAlt="グループホームに使える物件のイメージ（住宅街の一軒家）"
      h1="障害福祉サービスの指定申請と物件の関係"
      lead={
        <p>
          「物件は不動産会社、申請は行政書士」――グループホームの開設では、<strong>担当と契約が法律上分かれます</strong>。このページでは、指定申請書類の作成が行政書士の業務である根拠、開設までの全体フロー、そして<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/toushi/group-home", label: "グループホームに使える物件探し" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/legal", label: "四葉行政書士事務所" },
        { href: "/legal/ryokin", label: "四葉行政書士事務所・報酬額表" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="指定申請の要件・流れは、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* ─── C-2 本文5セクション（2026-07-19浦松検収済み草稿） ─── */}
      {/* §1 独占業務の根拠。根拠＝行政書士法1条の2第1項（官公署提出書類の作成を業とする）／19条1項（業務の制限）。
          条文全文は引用しない（タスク指定）。独占は「作成」＝「作成・提出は独占業務」と書かない（浦松検収）。
          「ご自身での作成・提出は可能」＝独占の対象が「業として」行う場合に限られることの裏返し */}
      <div>
        <ReH2>指定申請書類の作成が行政書士の業務である根拠</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          行政書士法第1条の2は、他人の依頼を受け、報酬を得て、官公署に提出する書類を作成することを行政書士の業務と定めています。障害福祉サービスの指定申請書類は、都道府県などの指定権者（官公署）に提出する書類にあたるため、その作成を業務として引き受けられるのは、原則として行政書士に限られます。あわせて同法第19条は、行政書士でない者が、業としてこれらの書類を作成することを、法律に別段の定めがある場合を除いて禁じています。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          このため、宅地建物取引業者である四葉不動産株式会社が、指定申請書類の作成のご依頼をお受けすることはできません。当社では、指定申請書類の作成・提出のご依頼は、併設の四葉行政書士事務所が別契約で受任する体制をとっています。なお、事業者の方がご自身の申請書類をご自分で作成・提出することは、もとより可能です。
        </p>
      </div>

      {/* §2 開設の全体フロー（段階図）。法人要件＝「原則必要です」（浦松検収）。所要期間・事前相談は断定しない */}
      <div>
        <ReH2>グループホーム開設の全体フロー</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          グループホーム（共同生活援助）の開設は、おおむね次の流れで進みます。各段階の所要期間は自治体により異なります。
        </p>
        <ol className="mt-4 space-y-3">
          {JA_FLOW_STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <span aria-hidden className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-tint font-medium text-primary">
                {i + 1}
              </span>
              <span>
                <strong className="text-ink">{step.title}</strong>
                <span className="mt-1 block">
                  {step.body}
                  {step.title === "物件の選定" && (
                    <>
                      {" "}物件の探し方は
                      <Link href="/toushi/group-home" className="text-primary underline">
                        「障害者グループホームに使える物件の探し方」
                      </Link>
                      で解説しています。
                    </>
                  )}
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-text-muted">
          ※各段階の所要期間・必要書類は自治体により異なります。最新の取り扱いは指定権者にご確認ください。
        </p>
      </div>

      {/* §3 並行の利点。「同一の拠点」「並行して進められます」＝回答ブロックの確定文言と同一趣旨。禁止語（ワンストップ等）不使用 */}
      <div>
        <ReH2>物件と申請を並行して進める利点</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          グループホームに使う物件は、立地や居室面積、消防設備など、指定基準との適合が前提になります。物件探しと申請準備を別々の時期に進めると、契約した後に基準を満たさないことが判明し、開設の遅れや想定外の改修費につながることがあります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社と四葉行政書士事務所は同一の拠点にあるため、候補物件が指定基準を満たすかどうかの確認を、申請準備と同時に進められます。契約前の段階で要件との適合を見通せることが、並行して進める最大の利点です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ただし、ご契約と受任は事業体ごとに分かれます。物件の紹介・仲介は四葉不動産株式会社との媒介契約、指定申請書類の作成・提出は四葉行政書士事務所との別契約です。両者は独立した事業体であり、それぞれの契約・費用・責任の範囲を分けることで、専門性と適法性を確保しています。
        </p>
      </div>

      {/* §4 担当・契約の分担表。構成・スタイル＝group-home §4に準拠。社労士の未開業注記は必須。
          独占業務の注記は「作成は…独占業務」（浦松検収） */}
      <div>
        <ReH2>担当・契約の分担</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          物件・許認可・労務・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">業務</th>
              <th className="border border-border px-3 py-2">担当</th>
            </tr>
          </thead>
          <tbody className="text-text">
            <tr>
              <td className="border border-border px-3 py-2">物件の紹介・仲介（宅地建物取引業）</td>
              <td className="border border-border px-3 py-2">四葉不動産株式会社</td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2">指定申請書類の作成・提出（作成は行政書士の独占業務・別契約）</td>
              <td className="border border-border px-3 py-2">併設の四葉行政書士事務所</td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2">労務・人員配置のご相談</td>
              <td className="border border-border px-3 py-2">四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）</td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2">不動産登記</td>
              <td className="border border-border px-3 py-2">提携司法書士をご紹介</td>
            </tr>
            <tr>
              <td className="border border-border px-3 py-2">税務（税務申告等）</td>
              <td className="border border-border px-3 py-2">提携税理士をご紹介</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-text-muted">
          各事業体・専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。
        </p>
      </div>

      {/* §5 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD＝B-4の例外（浦松承認）。設問はfaqJaを参照＝サイト内で文言一致 */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
