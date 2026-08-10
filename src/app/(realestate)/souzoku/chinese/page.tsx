// /souzoku/chinese（中国語相続ハブ）＝定点#7（2026-07-25・日本語版のみ・浦松検収済みドラフト実装）
// 方式＝RealestateServicePage（手本=/souzoku/taiwan）。ja単一公開（availableLocales:["ja"]・sitemap側も locales:["ja"]）。
// 住み分け（検収済み）：/global/chinese＝中国語で読む層向けの総合ハブ（繁簡）／本ページ＝日本語検索層向けの
//   「中国語で相談できる不動産相続」特化。title・見出しの語を/global/chineseと重複させない。相互リンクで接続。
//   /souzoku/taiwan＝台湾深掘りスポークとして本ページから接続。
// 表示コンプライアンス（taiwan検収準拠＋国際私法の特則）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   ・【最重要】準拠法・外国法（中国大陸・台湾・香港法）の内容は一切断定しない。通則法第36条（平成18年法律第78号・
//     平成19年1月1日施行）は「一般的な枠組み」の紹介に留め、個別判断は提携弁護士へ
//     （taiwan確定文言「この判断は個別の事案によるため、必要に応じて提携弁護士と連携して進めます。」を踏襲）。
//   ・香港＝2026-07-25浦松検収により title・見出しに含めず、本文一文＋個別確認誘導のみ（制度名の断定なし）。
//   ・駐在歴は確定表記「中国総局長として中国や台湾、タイに駐在しました」（国数表記禁止）。実在の人物名（顧問等）は書かない。
//   ・独占業務境界：作成＝行政書士（別契約）／登記＝提携司法書士／税務＝提携税理士／法的判断・紛争＝提携弁護士。
// FAQPage JSON-LD＝faqJa参照（foreign既存3問＋2026-07-25新設1問＋company既存1問＝計5問・文字列コピー禁止）。
// hero＝bunkyo-sakura-16x9.webp（taiwanページと暫定共用・専用画像TODO）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下・検収済みドラフト§1の確定文言）
const JA_ANSWER_BLOCK =
  "日本の不動産の相続を、中国語（繁体字・簡体字）で相談できます。在日中国人の方の相続も、中国大陸・台湾・香港に相続人がいる相続も、書類の集め方の整理から、遺産分割協議書などの作成（併設の四葉行政書士事務所が別契約で受任）、不動産の管理・活用・売却（四葉不動産株式会社）まで、同じテーブルで進めます。どの国・地域の法律によるかなど法的判断が必要な場合は、弁護士におつなぎします。";

// FAQPage＝faqJa参照（foreign既存3問＋新設1問＋company既存1問＝計5問）
const JA_FAQ_QUESTIONS = [
  "中国語で相続不動産の相談ができますか？",
  "繁体字と簡体字の両方に対応していますか？",
  "中国大陸に相続人がいる場合、どんな書類が必要ですか？",
  "在日中国人の相続は、どの国の法律によりますか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §1 何が違うか。準拠法・外国法は断定せず、通則法は一般的な枠組みの紹介に留める
const JA_DIFFS: { title: string; body: string }[] = [
  {
    title: "手続きと書類が国境をまたぐ",
    body: "被相続人や相続人が中国大陸・台湾にいる場合も、在日中国人の方が日本の不動産を相続する場合も、日本側の相続手続きと中華圏側の身分関係書類の収集が並行して動きます。誰がどこにいるかで、必要な書類と段取りが変わります。",
  },
  {
    title: "どの国・地域の法律で相続するか（準拠法）",
    body: "日本の国際私法である「法の適用に関する通則法」（平成18年法律第78号・平成19年1月1日施行）は、第36条で「相続は、被相続人の本国法による」と定めています。ただしこれは一般的な枠組みの紹介であり、実際にどの国・地域の法律で整理するかは事案ごとの検討が必要です。この判断は個別の事案によるため、必要に応じて弁護士におつなぎします。",
  },
  {
    title: "地域ごとに身分関係書類の制度が異なる",
    body: "台湾には日本に近い戸籍制度がある一方、中国大陸では公証処が発行する公証書で身分関係を証明するのが一般的です。香港は別の制度によるため、個別に確認しながら進めます。",
  },
  {
    title: "言語と距離",
    body: "海外在住の相続人との連絡・書類のやり取り・意思確認を、言語の壁を越えて進める必要があります。当方は繁体字・簡体字の両方に対応し、中国語の説明資料もご用意できます。",
  },
];

// §5 役割分担表（検収済みドラフト§5・内容／担当／契約の3列）
const JA_ROLES: { work: string; who: string; contract: string }[] = [
  {
    work: "不動産の管理・活用・売却",
    who: "四葉不動産株式会社（宅地建物取引業）",
    contract: "直接契約",
  },
  {
    work: "遺産分割協議書・翻訳文など書類の作成（作成は行政書士の独占業務）",
    who: "併設の四葉行政書士事務所（中国語対応）",
    contract: "別契約で受任",
  },
  {
    work: "準拠法など法的判断・紛争性のある事案",
    who: "弁護士をご紹介",
    contract: "直接契約",
  },
  { work: "相続登記", who: "司法書士をご紹介", contract: "直接契約" },
  { work: "相続税の申告", who: "税理士をご紹介", contract: "直接契約" },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "中国語で相談できる不動産相続｜中国・台湾の書類から売却まで | 四葉不動産",
    description:
      "在日中国人の方の相続、中国大陸・台湾・香港に相続人がいる相続——日本の不動産相続を中国語（繁体字・簡体字）で相談できます。戸籍・公証書類の収集の整理や、遺産分割協議書など官公署に提出する書類の作成は併設の四葉行政書士事務所が別契約で受任。不動産の管理・活用・売却は四葉不動産株式会社が担当します。準拠法など法的判断は弁護士と連携。東京都文京区小日向・茗荷谷駅徒歩5分。",
    path: "/souzoku/chinese",
    keywords: [
      "外国人 相続 中国語",
      "在日中国人 相続 不動産",
      "中国 相続人 日本 不動産",
      "香港 相続 日本",
      "台湾 相続",
      "相続 繁体字 簡体字 相談",
      "文京区 行政書士 中国語",
    ],
    // 【2026-08-10 canonical是正】availableLocales:["ja"] のページはロケール接頭辞つきURLでも
    // 同じ日本語本文を返すため、canonical は常に ja を指す（手本＝/office・/kikoku・/reasons）。
    // リクエストロケールを渡すと /en/・/zh/・/zh-tw/ が自己canonicalの重複URLになる。
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/souzoku/chinese"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "相続不動産", href: "/souzoku" },
        { name: "中国語で相談できる相続" },
      ]}
      serviceName="中国語（繁体字・簡体字）で相談できる相続不動産の管理・活用・売却"
      heroSrc="/hero/bunkyo-sakura-16x9.webp"
      heroAlt="文京区・播磨坂の桜並木のイメージ"
      h1="中国語で相談できる不動産相続——中国・台湾の書類から売却まで"
      lead={
        <p>
          「相続人が中国大陸にいる」「在日中国人の家族が日本の家を相続する」——中国語がからむ相続は、<strong>日本側の手続きと中華圏側の書類が並行して</strong>動きます。このページでは、通常の相続との違い、公証書・戸籍など書類の集め方、不動産の出口、そして<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/souzoku", label: "相続不動産の完全ガイド（管理・活用・売却）" },
        { href: "/souzoku/taiwan", label: "台湾がからむ不動産相続の完全ガイド" },
        { href: "/global/chinese", label: "中国語圏の方へ（繁体字・簡体字）" },
        { href: "/legal", label: "四葉行政書士事務所" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="遺産分割協議書など相続書類の作成は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* §1 何が違うか。準拠法は一般的な枠組みのみ＝個別判断は提携弁護士へ（AI判断禁止の中核） */}
      <div>
        <ReH2>中国語がからむ相続は、何が違うのか</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          相続人や被相続人に中国大陸・台湾とのつながりがある場合や、在日中国人の方が相続人になる場合、通常の相続に次の論点が加わります。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_DIFFS.map((d) => (
            <li key={d.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{d.title}</strong>
              <span className="mt-1 block">{d.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          段取りを正しく組めば、着実に進められます。まず「誰がどこにいて、不動産がどこにあるか」の整理から始めましょう。
        </p>
      </div>

      {/* §2 書類。認証は断定せず「最新の取り扱いを確認」＋提出先確認へ誘導。香港の制度記述は§1の一文のみ（検収） */}
      <div>
        <ReH2>書類の集め方——公証書・戸籍・翻訳</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          日本側では、被相続人の出生から死亡までの戸籍謄本・除籍謄本、相続人の戸籍・印鑑証明、住民票の除票、固定資産評価証明書などを揃えます（全体の流れは
          <Link href="/souzoku" className="text-primary underline">相続不動産の完全ガイド</Link>
          をご覧ください）。中華圏側は、一般的な整理として次のように進めます。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li>
            <strong className="text-ink">中国大陸</strong>：公証処が発行する公証書（親族関係・出生・婚姻など）で身分関係を証明し、日本語訳を付して使うのが一般的です。中国については、2023年（令和5年）11月7日に外国公文書の認証を不要とする条約（アポスティーユ条約）が対日発効し、従来の領事認証が原則不要になりました。もっとも、提出先により求められる書類・認証の範囲は異なるため、最新の取り扱いを確認しながら進めます。
          </li>
          <li>
            <strong className="text-ink">台湾</strong>：戸籍謄本などの戸籍書類を取り寄せ、日本語訳を付します。取り寄せ方や認証の要否は提出先により異なります（詳しくは
            <Link href="/souzoku/taiwan" className="text-primary underline">台湾がからむ不動産相続の完全ガイド</Link>
            で解説しています）。
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          中国語の書類は、日本の手続きで使うために日本語訳が必要です。必要書類の収集の整理と、翻訳文の作成を含む書類の作成は、併設の四葉行政書士事務所が別契約で受任します（行政書士の業務範囲内の書類に限ります）。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          相続登記の申請は司法書士に、相続税の申告は税理士におつなぎします。
        </p>
      </div>

      {/* §3 不動産の出口。souzoku本体のフレーム再掲＋海外相続人特有の実務論点 */}
      <div>
        <ReH2>不動産をどうするか——管理・活用・売却</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          書類が整ったら、不動産の出口を決めます。考え方は国内の相続と同じ「管理・活用・売却」の3択です（詳しくは
          <Link href="/souzoku" className="text-primary underline">相続不動産の完全ガイド</Link>
          ）。海外に相続人がいる場合は、次の点で段取りが必要になります。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li>
            <strong className="text-ink">署名・本人確認書類のやり取り</strong>：海外在住の相続人の署名や本人確認の書類は、地域により取り付け方が異なります。提出先の要件を確認しながら準備します。
          </li>
          <li>
            <strong className="text-ink">送金</strong>：売却代金などの海外送金には、金融機関の確認手続きが伴います。事前に段取りを整理しておくと滞りません。
          </li>
          <li>
            <strong className="text-ink">遠隔での意思確認</strong>：オンラインの相談・確認を交えて、日本側のご親族と海外の相続人に同じ内容を説明しながら進めます。
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          出口の実務は、四葉不動産株式会社（宅地建物取引業）が査定から売却・賃貸活用・管理までを担当します。文京区・茗荷谷を中心に、東京都内に対応します。
        </p>
      </div>

      {/* §4 なぜ四葉か。駐在歴は確定表記（一字一句固定）・/globalの確定文言（台湾師範大学・当事者）を踏襲 */}
      <div>
        <ReH2>「当事者」として中国語で対応できる事務所</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          代表の浦松丈二は元毎日新聞記者（記者歴34年）で、中国総局長として中国や台湾、タイに駐在しました。台湾師範大学で学び、中国語（繁体字・簡体字）で折衝してきた「当事者」です。日本側のご親族には日本語で、中華圏の相続人には中国語で、同じ内容を説明しながら進めます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          繁体字・簡体字の両方に対応し、中華圏の相続人向けの説明資料を中国語でご用意することもできます。中国語で読む方向けの解説は
          <Link href="/global/chinese" className="text-primary underline">中国語圏の方へ</Link>
          をご覧ください。
        </p>
      </div>

      {/* §5 役割分担表（3列＝内容・担当・契約）。分離受任・紹介料なしの確定注記 */}
      <div>
        <ReH2>担当・契約の分担</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          不動産・書類・法的判断・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">内容</th>
              <th className="border border-border px-3 py-2">担当</th>
              <th className="border border-border px-3 py-2">契約</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {JA_ROLES.map((r) => (
              <tr key={r.work}>
                <td className="border border-border px-3 py-2">{r.work}</td>
                <td className="border border-border px-3 py-2">{r.who}</td>
                <td className="border border-border px-3 py-2">{r.contract}</td>
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
