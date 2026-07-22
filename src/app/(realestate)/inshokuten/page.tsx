// /inshokuten（飲食店開業ピラー）＝シナジー領域#11（2026-07-22・日本語版のみ・監修前ドラフト実装）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"]・sitemap側も locales:["ja"]。COPYフォールバックで他ロケールにもja本文を表示。
// 表示コンプライアンス（C-2検収準拠）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   ・独占業務の表現＝「作成」が行政書士の独占業務（行政書士法1条の2・19条）。「作成・提出は独占業務」とまとめない。
//   ・保健所の施設基準・消防の届出は自治体差が大きいため数値・条番号を書かず「事前確認」へ誘導（断定禁止）。
//   ・深夜酒類提供の届出は「風営法に基づく届出（警察署経由）」の一般形（条番号は書かない＝未検証のため）。
// FAQPage JSON-LD＝faqJa（kaigyo新設2問＋corporate/companyの既存2問）を参照（文字列コピー禁止）。
// hero＝realestate-toushi-16x9.webp を暫定共用（店舗専用画像は未制作＝TODO）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下）。分離受任の型＝shitei-shinsei確定文言に準拠（監修前ドラフト）
const JA_ANSWER_BLOCK =
  "飲食店の開業では、物件の確保と営業許可の準備が同時に進みます。食品衛生法に基づく飲食店営業の許可には保健所の施設基準を満たす厨房・設備が必要で、その基準を満たせるかどうかは物件選びの段階でほぼ決まります。四葉不動産株式会社が居抜き・スケルトン物件の紹介・仲介を担当し、営業許可申請など官公署に提出する書類の作成は行政書士の独占業務にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。それぞれの契約・担当を分けることで、専門性と適法性を確保します。文京区を含む東京都内に対応します。";

// FAQPage＝faqJa参照（kaigyo新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "飲食店を開業したいのですが、物件探しと営業許可をあわせて相談できますか？",
  "居抜き物件の契約前に確認すべき点は何ですか？",
  "事業用物件の許認可（飲食・古物など）も相談できますか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §2 契約前チェック（宅建業の領分＝物件の確認事項。基準の数値は書かない）
const JA_CHECKS: { title: string; body: string }[] = [
  { title: "用途地域・建物用途", body: "その場所・その建物で飲食店営業ができるか。深夜営業を予定する場合は営めない地域があります。" },
  { title: "貸主の業態承諾", body: "「飲食可」でも、煙・臭気の強い業態（重飲食）は不可という物件は珍しくありません。予定業態を具体的に伝えて承諾を確認します。" },
  { title: "排水・グリストラップ", body: "油脂を含む排水への対応。設置スペースと維持管理の負担を確認します。" },
  { title: "電気・ガス容量", body: "厨房機器の合計容量に対して引込みが足りるか。増設の可否と費用負担。" },
  { title: "換気・ダクト・臭気", body: "近隣トラブルの主要因です。ダクトの経路と排気位置を確認します。" },
  { title: "消防関係", body: "防火対象物の使用開始や火を使用する設備の設置には、所轄消防署への届出が必要になる場合があります（自治体の火災予防条例によります）。避難経路・消防設備の状況も契約前に確認します。" },
  { title: "造作譲渡契約（居抜き）", body: "譲渡の範囲・リース品の有無・原状回復義務が誰に残るかを契約書で明確にします。" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "東京で飲食店を開業するなら｜物件探しと営業許可の完全ガイド | 四葉不動産",
    description:
      "飲食店の開業は「物件（居抜き・スケルトン）」と「営業許可（保健所）」が同時に動きます。店舗物件の紹介・仲介は四葉不動産株式会社が担当し、営業許可申請など官公署に提出する書類の作成は行政書士の独占業務のため併設の四葉行政書士事務所が別契約で受任します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/inshokuten",
    keywords: [
      "飲食店 開業 物件",
      "居抜き物件 東京 注意点",
      "飲食店 営業許可 行政書士",
      "飲食店 開業 文京区",
      "店舗物件 契約前 確認",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/inshokuten"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "飲食店開業" }]}
      serviceName="飲食店開業を見据えた店舗物件の紹介・仲介"
      heroSrc="/hero/realestate-toushi-16x9.webp"
      heroAlt="事業用物件のイメージ"
      h1="飲食店の開業——物件探しと営業許可の完全ガイド"
      lead={
        <p>
          「契約してから、シンクが足りないと言われた」——飲食店の開業では、<strong>物件と営業許可が同時に動きます</strong>。許可が取れるかどうかは契約前にほぼ決まるからこそ、物件選びの段階から施設基準・消防・排水を見据えることが大切です。このページでは、契約前の確認ポイントと<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/toushi", label: "投資用・事業用不動産" },
        { href: "/office", label: "会社設立とオフィス開設の完全ガイド" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/legal/services/company", label: "四葉行政書士事務所・会社設立と許認可" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="営業許可など許認可の書類は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* §1 居抜き/スケルトン。費用の数値断定なし */}
      <div>
        <ReH2>飲食店開業は「物件」と「営業許可」が同時に動く</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          飲食店の開業準備で費用が大きいのは物件と内装です。そして、その物件で営業許可が取れるかどうかは、契約前の確認でほぼ決まります。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">居抜き物件</strong>：前の店の厨房・設備を引き継ぐため初期費用を抑えやすい一方、設備が施設基準を満たしているか、リース品や貸主資産が混ざっていないか（造作譲渡の範囲）の確認が必要です。</li>
          <li><strong className="text-ink">スケルトン物件</strong>：内装を自由に設計できる一方、工事費がかかります。設計段階で保健所の基準を織り込めるのが利点です。</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          「契約してから保健所に相談したら、設備が足りなかった」——こうした手戻りの多くは、契約前に物件と許可要件を突き合わせておけば避けられます。
        </p>
      </div>

      {/* §2 契約前チェックリスト */}
      <div>
        <ReH2>物件選びの落とし穴——契約前の確認ポイント</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          飲食店向け物件の契約前に確認しておきたい主なポイントです。いずれも契約後の変更が難しい項目です。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_CHECKS.map((c) => (
            <li key={c.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{c.title}</strong>
              <span className="mt-1 block">{c.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社（宅地建物取引業）が、業態と許可要件を踏まえた物件探し・仲介を担当します。文京区・茗荷谷を中心に、東京都内に対応します。
        </p>
      </div>

      {/* §3 営業許可。基準の数値・条番号は書かない＝保健所への事前相談に誘導 */}
      <div>
        <ReH2>飲食店営業の許可——保健所の施設基準と事前相談</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          飲食店の営業には、食品衛生法に基づく営業許可が必要です。許可は施設基準への適合が前提で、基準の具体的な内容は自治体により異なります。一般に、営業施設の区画、厨房のシンク・給湯・手洗い設備、冷蔵設備、床・内壁・換気などが確認され、あわせて食品衛生責任者の設置が必要です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          具体的な基準・運用は保健所ごとに異なるため、物件の図面をもって保健所へ事前に相談するのが実務の定石です。営業許可申請など官公署に提出する書類の作成は行政書士の独占業務にあたり、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。事前相談の準備からお手伝いします。
        </p>
      </div>

      {/* §4 業態別の追加手続。風営法は一般形（条番号なし）・地域制限は物件契約前の確認へ誘導 */}
      <div>
        <ReH2>業態によって追加の届出がある</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          深夜0時以降に酒類を主として提供する営業には、風営法に基づく届出（所轄警察署経由）が必要で、営業できない地域があります。接待を伴う営業には風俗営業の許可が必要となり、要件・地域規制が大きく異なります。菓子製造やテイクアウト中心の業態では、別の許可・届出が必要になる場合もあります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          どの手続きが必要かは業態の設計次第です。「やりたい営業の形」を先に固め、必要な手続きを一覧にしてから物件を絞り込む順序をお勧めします。地域の制限は、物件の契約前に確認が必要です。
        </p>
      </div>

      {/* §5 法人化への導線 */}
      <div>
        <ReH2>個人開業か、法人化か</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          飲食店は個人事業として開業することも、会社を設立して開業することもできます。法人化する場合は、定款・許認可・本店所在地（オフィス）の論点が加わります。詳しくは
          <Link href="/office" className="text-primary underline">会社設立とオフィス開設の完全ガイド</Link>
          をご覧ください。税務上の有利不利は個別の事情によるため、提携税理士をご紹介します。
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD＝faqJa参照（サイト内で文言一致） */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
