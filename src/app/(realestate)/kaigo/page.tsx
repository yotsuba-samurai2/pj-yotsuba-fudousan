// /kaigo（介護事業所開設ピラー）＝シナジー領域#14（2026-07-22・日本語版のみ・監修前ドラフト実装）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"]・sitemap側も locales:["ja"]。COPYフォールバックで他ロケールにもja本文を表示。
// 表示コンプライアンス（C-2検収準拠）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   ・独占業務の表現＝「作成」が行政書士の独占業務（行政書士法1条の2・19条）。「作成・提出は独占業務」とまとめない。
//   ・法人要件＝「原則必要です」（GH shitei-shinsei 浦松検収済み表現を踏襲）。指定の有効期間は数字を書かず
//     「有効期間があり、更新の手続が必要」の一般形。設備基準の数値・指定権者の割り振りは断定せず事前確認へ誘導。
//   ・社労士は未開業注記の確定文言「四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）」を一字一句踏襲。
// FAQPage JSON-LD＝faqJa（kaigyo新設2問＋corporate/companyの既存2問）を参照（文字列コピー禁止）。
// hero＝labor-kaigo-roumu-16x9.webp を暫定共用（介護イメージ既存アセット。専用画像は未制作＝TODO）。
// クラスタ＝グループホーム（/group-home・/toushi/shitei-shinsei）と福祉系開設の相互リンクを形成。
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
  "訪問介護・デイサービス（通所介護）・居宅介護支援などの介護事業所を開設するには、介護保険法に基づく指定権者の指定が必要で、事務室・相談室など設備の基準を満たす物件の確保が前提になります。基準を満たせるかどうかは物件選びの段階でほぼ決まるため、物件と指定申請は同時に進めるのが安全です。四葉不動産株式会社が物件の紹介・仲介を担当し、指定申請書類など官公署に提出する書類の作成は行政書士の独占業務にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。文京区を含む東京都内に対応します。";

// FAQPage＝faqJa参照（kaigyo新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "介護事業所（訪問介護・デイサービスなど）の開設で、物件探しと指定申請をあわせて相談できますか？",
  "介護事業所に使える物件を選ぶときの注意点は何ですか？",
  "事業用物件の許認可（飲食・古物など）も相談できますか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §1 サービス類型（物件条件の違い）
const JA_TYPES: { title: string; body: string }[] = [
  { title: "訪問系（訪問介護など）", body: "利用者宅でサービスを提供するため、事業所自体は事務室・相談スペースが中心。比較的小さな物件で始められます。" },
  { title: "通所系（デイサービスなど）", body: "食堂・機能訓練室など利用者が過ごすスペースが必要で、面積・動線・送迎の駐車まで物件条件が厳しくなります。" },
  { title: "居宅介護支援（ケアマネ事業所）", body: "事務室・相談室が中心。人員（ケアマネジャー）の確保が核になります。" },
];

// §2 契約前チェック（宅建業の領分。基準の数値は書かない）
const JA_CHECKS: { title: string; body: string }[] = [
  { title: "用途地域・建物用途", body: "その場所・その建物で介護事業を営めるか。規模・用途によっては建築基準法上の用途変更の要否が論点になります。" },
  { title: "設備基準", body: "事務室・相談室（プライバシー確保）、通所系では食堂・機能訓練室の面積など。基準はサービス類型・自治体により異なります。" },
  { title: "バリアフリー・動線", body: "段差・廊下幅・トイレ。改修費用は物件選びの費用に直結します。" },
  { title: "消防", body: "消防設備の設置・防火管理。自治体・建物条件により必要な設備が変わるため、契約前に所轄消防署への確認を織り込みます。" },
  { title: "送迎・駐車（通所系）", body: "送迎車の駐車スペースと乗降の安全確保。近隣との関係にも関わります。" },
  { title: "貸主の用途承諾", body: "事務所可の物件でも、介護事業（不特定の来訪・送迎）への承諾は別途確認が必要です。" },
];

// §5 役割分担表（shitei-shinsei検収済み構成を踏襲。社労士＝未開業注記の確定文言）
const JA_ROLES: { work: string; who: string }[] = [
  { work: "物件の紹介・仲介（宅地建物取引業）", who: "四葉不動産株式会社" },
  { work: "指定申請書類の作成・提出（作成は行政書士の独占業務・別契約）", who: "併設の四葉行政書士事務所" },
  { work: "労務・人員配置のご相談", who: "四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）" },
  { work: "登記", who: "提携司法書士をご紹介" },
  { work: "税務（税務申告等）", who: "提携税理士をご紹介" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "東京で介護事業所を開設するなら｜物件探しと指定申請の完全ガイド | 四葉不動産",
    description:
      "訪問介護・デイサービスなど介護事業所の開設は、「物件」と「指定申請」が同時に動きます。設備基準・用途・消防を見据えた物件の紹介・仲介は四葉不動産株式会社が担当し、指定申請など官公署に提出する書類の作成は行政書士の独占業務のため併設の四葉行政書士事務所が別契約で受任します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/kaigo",
    keywords: [
      "介護事業所 開設 物件",
      "デイサービス 開業 物件 基準",
      "訪問介護 事業所 開設 指定申請",
      "介護 指定申請 行政書士",
      "介護事業所 開設 東京 文京区",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/kaigo"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "介護事業所開設" }]}
      serviceName="介護事業所の開設を見据えた物件の紹介・仲介"
      heroSrc="/hero/labor-kaigo-roumu-16x9.webp"
      heroAlt="介護事業所のイメージ"
      h1="介護事業所の開設——物件探しと指定申請の完全ガイド"
      lead={
        <p>
          「物件を借りてから、相談室が足りないと言われた」——介護事業所の開設では、<strong>物件と指定申請が同時に動きます</strong>。サービス類型で必要な物件の条件が変わるからこそ、「どのサービスを・どの区で」を決めてから物件を探す順序が大切です。このページでは、類型ごとの物件条件と契約前の確認ポイント、<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/group-home", label: "グループホーム開設の完全ガイド" },
        { href: "/toushi", label: "投資用・事業用不動産" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/legal/services/shogai-fukushi", label: "四葉行政書士事務所・障害福祉の指定申請" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="指定申請など許認可の書類は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* §1 類型と指定権者。割り振りの断定なし＝事前確認へ誘導 */}
      <div>
        <ReH2>サービス類型で「必要な物件」が変わる</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          一口に介護事業所といっても、サービス類型によって物件に求められる条件が大きく違います。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_TYPES.map((t) => (
            <li key={t.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{t.title}</strong>
              <span className="mt-1 block">{t.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          さらに、指定権者（都道府県か区市町村か）もサービス類型により異なり、地域密着型サービスでは区市町村ごとの公募・総量の調整が行われる場合もあります。「どのサービスを・どの区で」を決めてから物件を探す——この順序が手戻りを防ぎます。最新の要件・取り扱いは指定権者への事前確認を踏まえて進めます。
        </p>
      </div>

      {/* §2 契約前チェックリスト */}
      <div>
        <ReH2>物件選びの落とし穴——契約前の確認ポイント</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          介護事業所向け物件の契約前に確認しておきたい主なポイントです。いずれも契約後の変更が難しい項目です。
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
          四葉不動産株式会社（宅地建物取引業）が、指定基準を見据えた物件探し・仲介を担当します。文京区・茗荷谷を中心に、東京都内に対応します。障害福祉のグループホームをお考えの方は
          <Link href="/group-home" className="text-primary underline">グループホーム開設の完全ガイド</Link>
          をご覧ください。
        </p>
      </div>

      {/* §3 指定申請。法人＝原則必要（検収済み表現）・作成＝独占業務・更新は一般形 */}
      <div>
        <ReH2>指定申請——法人・定款・事前相談</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          指定を受けるには法人であることが原則必要です。定款の事業目的に介護保険事業の実施を含めるなど、法人側の準備も並行して進めます。指定申請書類は、平面図・設備の写真・人員体制など、物件と人の準備がそのまま書類になる構成です。多くの自治体が申請前の事前相談・事前協議の手続を設けています。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          官公署に提出する書類の作成は行政書士の独占業務（行政書士法第1条の2）にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。指定には有効期間があり、更新の手続が必要です。具体的な様式・期間は指定権者にご確認ください。
        </p>
      </div>

      {/* §4 人員・労務。社労士＝未開業注記の確定文言（一字一句） */}
      <div>
        <ReH2>人員基準と労務——開設後を見据えて</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          介護事業の指定は、管理者・サービス提供責任者・介護職員など人員基準の充足が核になります。採用・雇用契約・処遇改善加算など労務の設計は社会保険労務士の領域です。四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）の開業後は、労務・人員配置のご相談にも対応する予定です。
        </p>
      </div>

      {/* §5 役割分担表 */}
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
            {JA_ROLES.map((r) => (
              <tr key={r.work}>
                <td className="border border-border px-3 py-2">{r.work}</td>
                <td className="border border-border px-3 py-2">{r.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-text-muted">
          各事業体・専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD＝faqJa参照（サイト内で文言一致） */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
