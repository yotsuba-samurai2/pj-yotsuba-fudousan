// /minpaku（民泊開業ピラー）＝シナジー領域#13（2026-07-22・日本語版のみ・監修前ドラフト実装）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"]・sitemap側も locales:["ja"]。COPYフォールバックで他ロケールにもja本文を表示。
// 表示コンプライアンス（C-2検収準拠）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   ・独占業務の表現＝「作成」が行政書士の独占業務（行政書士法1条の2・19条）。「作成・提出は独占業務」とまとめない。
//   ・住宅宿泊事業法＝2018年6月15日施行・年180日上限のみ本文記載（条番号は書かない）。特区民泊は区名を書かず一般形
//     （最新状況未検証のため）。条例の上乗せ制限は「例：」の一般形＋自治体確認へ誘導（文京区条例の現行内容は監修時確認）。
//   ・消防法令適合通知書は「求められる場合があります」（自治体運用差）。
// FAQPage JSON-LD＝faqJa（kaigyo新設2問＋corporate/companyの既存2問）を参照（文字列コピー禁止）。
// hero＝realestate-toushi-16x9.webp を暫定共用（専用画像は未制作＝TODO）。
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
  "民泊を始めるときは、物件と届出が同時に動きます。住宅宿泊事業法（2018年6月15日施行）に基づく届出による民泊は年間提供日数に上限（180日）があり、自治体の条例で区域や期間がさらに制限される場合があります。そのため、その物件で民泊ができるか——分譲マンションなら管理規約、賃貸なら貸主の承諾、戸建てでも条例や消防設備——は契約前の確認でほぼ決まります。四葉不動産株式会社が物件の紹介・仲介を担当し、住宅宿泊事業の届出など官公署に提出する書類の作成は行政書士の独占業務にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。文京区を含む東京都内に対応します。";

// FAQPage＝faqJa参照（kaigyo新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "民泊（住宅宿泊事業）を始めたいのですが、物件探しと届出をあわせて相談できますか？",
  "民泊に使える物件を選ぶときの注意点は何ですか？",
  "事業用物件の許認可（飲食・古物など）も相談できますか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §2 契約前チェック（宅建業の領分＝物件の確認事項。基準の数値は書かない）
const JA_CHECKS: { title: string; body: string }[] = [
  { title: "分譲マンションの管理規約", body: "民泊（住宅宿泊事業）を禁止する規約の定めがあるマンションでは届出できません。規約・使用細則の確認が最優先です。" },
  { title: "賃貸物件の転貸承諾", body: "借りた部屋で民泊を行うことは転貸にあたるため、貸主の承諾（契約書上の明記）が必要です。無断で行えば契約解除のリスクがあります。" },
  { title: "自治体の条例による制限", body: "東京23区の多くは、条例で実施区域や実施期間（例：住居専用地域の平日制限など）を独自に定めています。同じ東京でも区によって「できる場所・できる曜日」が違うため、候補物件の所在地ごとに確認します。" },
  { title: "消防設備", body: "自動火災報知設備や誘導灯など、消防法令への適合が求められ、届出時に消防法令適合通知書の取得を求められる場合があります。設置費用は物件選びの費用に直結します。" },
  { title: "近隣との関係", body: "ごみ出し・騒音は民泊トラブルの典型です。標識の掲示や苦情対応の体制も制度上求められます。" },
  { title: "家主不在型の管理委託", body: "家主が住んでいない物件で営む場合、住宅宿泊管理業者への管理委託が必要です。委託費用を収支に織り込みます。" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "東京で民泊を始めるなら｜物件探しと住宅宿泊事業の届出の完全ガイド | 四葉不動産",
    description:
      "民泊は「物件」と「届出（住宅宿泊事業）」が同時に動きます。管理規約・転貸承諾・条例・消防を見据えた物件の紹介・仲介は四葉不動産株式会社が担当し、住宅宿泊事業の届出など官公署に提出する書類の作成は行政書士の独占業務のため併設の四葉行政書士事務所が別契約で受任します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/minpaku",
    keywords: [
      "民泊 開業 物件",
      "住宅宿泊事業 届出 行政書士",
      "民泊 物件 東京",
      "マンション 民泊 管理規約",
      "民泊 賃貸 転貸承諾",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/minpaku"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "民泊開業" }]}
      serviceName="民泊（住宅宿泊事業）開業を見据えた物件の紹介・仲介"
      heroSrc="/hero/realestate-toushi-16x9.webp"
      heroAlt="事業用物件のイメージ"
      h1="民泊の開業——物件探しと住宅宿泊事業の届出の完全ガイド"
      lead={
        <p>
          「借りてから、この区では平日できないと知った」——民泊では、<strong>物件と届出が同時に動きます</strong>。制度の選択・管理規約・条例・消防で「使える物件」の条件が変わるからこそ、契約前の確認が決定的です。このページでは、制度の入口の整理と物件選びの確認ポイント、<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/toushi", label: "投資用・事業用不動産" },
        { href: "/inshokuten", label: "飲食店開業の完全ガイド" },
        { href: "/office", label: "会社設立とオフィス開設の完全ガイド" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="届出など許認可の書類は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* §1 3制度の入口整理。適否の断定なし＝自治体確認へ誘導。特区民泊は区名を書かない（未検証） */}
      <div>
        <ReH2>民泊の3つの制度——どれを選ぶかで物件の条件が変わる</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          「民泊」と一口に言っても、制度上の入口は主に3つあります。
        </p>
        <ol className="mt-4 space-y-3">
          <li className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">住宅宿泊事業（届出）</strong>
            <span className="mt-1 block">住宅宿泊事業法に基づく届出制。年間提供日数の上限（180日）があり、自治体の条例で区域・期間がさらに制限される場合があります。住宅のまま始めやすいのが特徴です。</span>
          </li>
          <li className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">旅館業（簡易宿所）の許可</strong>
            <span className="mt-1 block">年間日数の上限なく営業する場合の選択肢。ただし用途地域や構造設備の基準など、物件へ求められる条件が大きく変わります。</span>
          </li>
          <li className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">特区民泊</strong>
            <span className="mt-1 block">国家戦略特別区域の認定制度で、実施できる地域が限られます（東京では一部の区のみ）。</span>
          </li>
        </ol>
        <p className="mt-3 leading-relaxed text-text">
          どの制度で始めるかによって、「使える物件」の条件がまったく違ってきます。収支計画（180日でも成り立つか）と物件条件をセットで考えることが出発点です。制度の適否や最新の要件は、自治体への事前確認を踏まえて進めます。
        </p>
      </div>

      {/* §2 契約前チェックリスト */}
      <div>
        <ReH2>物件選びの落とし穴——契約前の確認ポイント</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          民泊は「物件を借りて（買って）から届出」の順で進めると、高い確率で手戻りが起きます。契約前に確認したい主なポイントです。
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
          四葉不動産株式会社（宅地建物取引業）が、制度の見通しを踏まえた物件探し・仲介を担当します。文京区・茗荷谷を中心に、東京都内に対応します。
        </p>
      </div>

      {/* §3 届出。作成＝独占業務の型・継続義務・自治体差＝事前相談へ誘導 */}
      <div>
        <ReH2>住宅宿泊事業の届出——「届出の準備は物件の確認そのもの」</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          住宅宿泊事業の届出は、都道府県知事等への届出として行います。届出書類のほか、住宅の図面、消防法令適合通知書、管理規約の写し（マンションの場合）や転貸承諾書（賃貸の場合）など、物件に関する書類が中心になります。つまり、届出の準備は物件の確認そのものです。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          官公署に提出する書類の作成は行政書士の独占業務（行政書士法第1条の2）にあたるため、書類の作成・提出は併設の四葉行政書士事務所が別契約で受任します。届出後も、標識の掲示、宿泊者名簿の備付け、定期報告など継続的な義務があります。具体的な要件・様式は自治体により異なるため、事前相談を踏まえて進めます。
        </p>
      </div>

      {/* §4 転貸型の注意。貸主・借主双方の視点＝宅建業の領分 */}
      <div>
        <ReH2>賃貸物件で民泊——「転貸型」の注意点</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          自宅以外で民泊を始める場合、賃貸物件を借りて運営する「転貸型」が選択肢になりますが、貸主にとっては利用者が入れ替わり続ける、リスクの大きい契約です。転貸承諾の交渉は、収支計画・管理体制・保険を示して信頼を得られるかがポイントになります。当社は貸主・借主双方の立場を踏まえた物件探しと契約条件の調整を担当します。契約書に転貸・民泊利用の承諾を明記することが重要です。
        </p>
      </div>

      {/* §5 展開の導線 */}
      <div>
        <ReH2>法人化・他の事業との組み合わせ</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          民泊を事業として広げる場合、法人化や、簡易宿所・飲食提供との組み合わせが論点になります。会社設立と本店所在地（オフィス）は
          <Link href="/office" className="text-primary underline">会社設立とオフィス開設の完全ガイド</Link>
          を、飲食の提供を伴う場合は
          <Link href="/inshokuten" className="text-primary underline">飲食店開業の完全ガイド</Link>
          をご覧ください。税務は提携税理士をご紹介します。
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD＝faqJa参照（サイト内で文言一致） */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
