// /shataku（借り上げ社宅ピラー）＝シナジー領域#12（2026-07-24・日本語版のみ・監修前ドラフト実装）
// 方式＝RealestateServicePage（手本=/kaigo・/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"]・sitemap側も locales:["ja"]。COPYフォールバックで他ロケールにもja本文を表示。
// 位置づけ＝借り上げ社宅の「導入・社宅規程・物件」軸。既存 /toushi/shataku（外国人従業員×在留資格の物件手配軸）
//   とは相互リンクで住み分け（浦松承認済み方針・2026-07-24）。
// 表示コンプライアンス（shigyo-compliance-gate・C-2検収準拠）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。分離受任・紹介料なしを明記。
//   ・当方が「今できる」のは借り上げ社宅の物件＝宅建業（法人契約・転貸承諾の確認）に限定。
//   ・社宅規程・現物給与・社会保険は労務の論点として整理にとどめ、実務は社労士（未開業／提携）へ振り分け。
//   ・社労士は未開業注記の確定文言「四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）」を一字一句踏襲。
//   ・給与課税・賃貸料相当額など税務は税理士の独占業務のため断定せず提携税理士へ振り分け（数値の当てはめは書かない）。
//   ・転貸＝民法第612条（賃貸人の承諾）を条番号明記。現物給与の価額・所得税の取り扱いは数値を書かず一般形＋事前確認へ誘導。
// FAQPage JSON-LD＝faqJa（kaigyo新設2問＋corporate/companyの既存2問）を参照（文字列コピー禁止）。
// hero＝realestate-shataku-16x9.webp（社宅の既存アセット・/toushi/shataku と共用）。
// クラスタ＝#11飲食店・#13民泊・#14介護・#15会社設立オフィスと同じ「物件×士業」シナジー群。社労士開業後に /labor 系と連携予定。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";
import { InlineCtaProperty } from "@/components/shared/InlineCtaProperty";

// 冒頭の回答ブロック（H1直下）。当方が今できるのは物件＝宅建業に限定し、労務・税務は分離受任で振り分け（監修前ドラフト・浦松承認）
const JA_ANSWER_BLOCK =
  "企業が従業員の住まいとして借り上げ社宅を導入するときは、「物件」と「社宅規程」を並行して検討するのが安全です。借り上げ社宅は、会社が賃貸物件を契約して従業員に住まわせる仕組みで、貸主の転貸承諾や法人契約の可否が物件選びの段階で決まり、社宅規程で定める従業員の負担割合は税務・社会保険の取り扱いに直結するからです。法人契約・借り上げの物件の紹介・仲介は四葉不動産株式会社が担当します。社宅規程の整備や現物給与・社会保険の取り扱いは労務の論点として整理してお伝えし、実務は社会保険労務士（四葉社会保険労務士事務所は2026年9月開業予定・現時点では未開業のため、提携の社会保険労務士）が別契約で対応します。給与課税など税務の判断は提携税理士がお引き受けします。文京区・茗荷谷を中心に東京都内に対応します。";

// FAQPage＝faqJa参照（kaigyo新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "借り上げ社宅を導入したいのですが、物件探しと社宅規程をあわせて相談できますか？",
  "借り上げ社宅に使う物件を選ぶときの注意点は何ですか？",
  "事業用物件の許認可（飲食・古物など）も相談できますか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §1 導入の流れ（目安）。順序の目安であり、各判断は資格者・提携専門家の確認を要する
const JA_STEPS: { title: string; body: string }[] = [
  { title: "① 制度の方針決定", body: "対象者・予算・エリアなど、社宅制度の大枠を決めます。" },
  { title: "② 社宅規程の整備", body: "負担割合・上限家賃・入退去のルールなどを定めます（労務の論点）。" },
  { title: "③ 物件の選定・法人契約", body: "規程に沿う物件を探し、法人契約・転貸承諾を確認します（宅建業）。" },
  { title: "④ 入居", body: "重要事項説明・契約・入居手続き。外国人従業員は多言語で対応します。" },
  { title: "⑤ 税務・社会保険の運用", body: "給与課税・現物給与の取り扱いを、税理士・社会保険労務士と確認しながら運用します。" },
];

// §2 物件選びの契約前チェック（宅建業の領分。個別の可否・数値は断定せず事前確認へ）
const JA_CHECKS: { title: string; body: string }[] = [
  { title: "法人契約の可否", body: "貸主・管理会社・保証会社が法人名義の契約を受けるか。会社契約に対応していない物件もあります。" },
  { title: "転貸（又貸し）の承諾", body: "会社が借りて従業員を住まわせる形は、民法第612条第1項にいう転貸に当たり得ます。無断転貸は契約解除の理由になり得るため、貸主の承諾（社宅利用可）を契約時に確認します。" },
  { title: "入居者の変更（社員の入替）", body: "転勤・退職にともなう入居者の変更を、契約上どこまで認めてもらえるか。" },
  { title: "契約の型（普通借家・定期借家）", body: "更新・中途解約・違約金の条件が変わります。運用に合う型かを確認します。" },
  { title: "原状回復・保証", body: "原状回復義務の帰属、法人の連帯保証・保証会社の要否。" },
  { title: "社宅規程との整合", body: "上限家賃・対応エリア・従業員の負担割合が、社宅規程で定めた範囲に収まるか。" },
];

// §5 役割分担表（分離受任・紹介料なし。社労士＝未開業注記の確定文言を一字一句踏襲）
const JA_ROLES: { work: string; who: string }[] = [
  { work: "借り上げ社宅の物件の紹介・仲介、法人契約・転貸承諾の確認（宅地建物取引業）", who: "四葉不動産株式会社" },
  { work: "社宅規程の整備・現物給与・社会保険の取り扱い（労務）", who: "四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）／提携の社会保険労務士が別契約で対応" },
  { work: "給与課税・賃貸料相当額など税務（税務代理・税務相談は税理士の独占業務）", who: "提携税理士をご紹介" },
  { work: "外国人従業員の在留資格の申請書類の作成（作成は行政書士の独占業務・別契約）", who: "併設の四葉行政書士事務所" },
  { work: "登記", who: "提携司法書士をご紹介" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "東京で借り上げ社宅を導入するなら｜物件・法人契約と社宅規程の完全ガイド | 四葉不動産",
    description:
      "借り上げ社宅の導入は「物件（法人契約・転貸承諾）」と「社宅規程・現物給与・社会保険の論点」が同時に動きます。法人契約の物件の紹介・仲介は四葉不動産株式会社が担当し、社宅規程や労務の実務は社会保険労務士（四葉社会保険労務士事務所は2026年9月開業予定・現時点では未開業／提携社会保険労務士）、給与課税など税務は提携税理士が、それぞれ別契約で対応します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/shataku",
    keywords: [
      "借り上げ社宅 導入 物件",
      "借り上げ社宅 社宅規程",
      "法人契約 賃貸 社宅",
      "社宅 現物給与 社会保険",
      "借り上げ社宅 東京 相談",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/shataku"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "借り上げ社宅の導入" }]}
      serviceName="借り上げ社宅の導入を見据えた物件の紹介・仲介"
      heroSrc="/hero/realestate-shataku-16x9.webp"
      heroAlt="借り上げ社宅のイメージ（オフィス街の集合住宅）"
      h1="借り上げ社宅の導入——物件・法人契約と社宅規程の完全ガイド"
      ctaVariant="property"
      lead={
        <p>
          「物件を先に契約したら、貸主が社宅利用を認めてくれなかった」——借り上げ社宅の導入では、<strong>物件と社宅規程が同時に動きます</strong>。規程で決める従業員の負担割合が税務・社会保険の取り扱いに直結し、物件側では法人契約や転貸の承諾が前提になるからです。このページでは、導入の流れ、物件選びの契約前チェック、<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/toushi/shataku", label: "社宅・法人賃貸のサポート（外国人従業員の住まい）" },
        { href: "/global", label: "外国人・多言語のお部屋探し" },
        { href: "/toushi", label: "投資用・事業用不動産" },
        { href: "/access", label: "アクセス・料金" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="社宅規程や現物給与・社会保険は労務の論点として整理し、実務は社会保険労務士（開業後・提携）、税務は提携税理士が、それぞれ別契約で担当します。"
    >
      {/* §1 導入の全体像。順序の目安＝断定せず、各判断は資格者・提携専門家へ */}
      <div>
        <ReH2>借り上げ社宅とは——導入の全体像</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          借り上げ社宅は、<strong>会社が賃貸物件を契約して従業員に住まわせる</strong>仕組みです。会社が物件を所有する社有社宅と違い、初期投資が小さく、撤退も柔軟に行えるため、中小企業では借り上げ型が主流です。導入の流れは、おおむね次のとおりです（順序の目安であり、各判断は資格者・提携専門家の確認を踏まえて進めます）。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_STEPS.map((s) => (
            <li key={s.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.title}</strong>
              <span className="mt-1 block">{s.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          社宅規程で「対象者・負担割合・上限家賃・対応エリア」を決めないと物件の条件が定まらず、逆に物件の家賃や負担割合は税務・社会保険の取り扱いに直結します。だからこそ、<strong>物件と規程は並行して</strong>検討するのが安全です。
        </p>
      </div>

      {/* §2 物件選びの契約前チェック（宅建業）。転貸＝民法612条を条番号明記 */}
      <div>
        <ReH2>物件選びの落とし穴——契約前の確認ポイント</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          借り上げ社宅に使う物件の契約前に確認しておきたい主なポイントです。いずれも契約後の変更が難しい項目です。
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
          四葉不動産株式会社（宅地建物取引業）が、社宅規程を見据えた物件探し・法人契約・転貸承諾の確認を担当します。文京区・茗荷谷を中心に、東京都内に対応します。外国人従業員の住まいの手配は
          <Link href="/toushi/shataku" className="text-primary underline">社宅・法人賃貸のサポート</Link>
          もあわせてご覧ください。
        </p>
      </div>

      {/* 中間CTA（2026-07-24 CTA刷新v2）：契約前チェック直後＝高意欲の瞬間に1か所のみ */}
      <InlineCtaProperty page="/shataku" />

      {/* §3 社宅規程（労務・社労士）。未開業注記の確定文言（一字一句） */}
      <div>
        <ReH2>社宅規程——制度の骨格をつくる</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          借り上げ社宅を制度として運用するには、社宅規程で「対象者・入居資格、社宅使用料（従業員の負担）の決め方、上限家賃、対応エリア、入退去・入替、原状回復や費用負担」などを定めます。とくに従業員の負担割合は、次に述べる税務・社会保険の取り扱いに直結します。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          社宅規程の内容の作り込みは労務の判断にあたります。四葉社会保険労務士事務所（2026年9月開業予定・現時点では未開業）の開業後、または提携の社会保険労務士が別契約で対応します。
        </p>
      </div>

      {/* §4 現物給与・社会保険・給与課税の論点（社労士・税理士）。数値の当てはめは書かず断定回避 */}
      <div>
        <ReH2>現物給与・社会保険と給与課税——負担割合で変わる論点</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          社宅を無償または低廉で提供すると、その利益が<strong>現物給与</strong>として社会保険（標準報酬月額）の算定に算入される場合があります。換算は「厚生労働大臣が定める現物給与の価額」（厚生労働省告示）に基づき、住宅の価額は都道府県ごとに定められ、従業員から徴収している額を差し引いて算定します。該当性・金額の算定は社会保険労務士の領域です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          税務では、借り上げ社宅を全額会社負担にすると、原則として従業員への<strong>給与として課税</strong>され得ます。従業員から「賃貸料相当額」（実際の賃料ではなく、建物・敷地の固定資産税の課税標準額をもとに計算する取り扱いが示されています）の一定割合以上を受け取っている場合に、給与課税されない取り扱いがあります。該当性・計算・徴収額の水準の判断は税務にあたり、<strong>税務代理・税務相談は税理士の独占業務</strong>です。提携税理士が別契約で対応します。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          ※本ページは一般的な情報提供です。具体的な価額・計算の当てはめや、個別の税務・社会保険の判断は、資格者・提携専門家の確認を要します。
        </p>
      </div>

      {/* §5 役割分担表 */}
      <div>
        <ReH2>担当・契約の分担</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          物件・労務・税務・在留資格・登記は、それぞれ独立した事業体・専門家が別契約で担当します。ご相談の入口（窓口）は共通です。
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
