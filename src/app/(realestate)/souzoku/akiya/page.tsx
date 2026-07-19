// /souzoku/akiya（相続空き家の売却・活用・管理）＝タスクC-4（2026-07-19・日本語版のみ）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定・sitemap側も locales:["ja"]。
//   本文はja固定（多言語は監修後に追加）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   行政書士業務＝「併設の四葉行政書士事務所が別契約で受任」。登記申請＝提携司法書士を紹介。
// 税制・空家法の記述は制度の存在の紹介に留め、断定しない（2026-07-19浦松検収済み草稿）：
//   ・空家法リスク＝「〜になる場合があります」＋「指定・課税の詳細は文京区および税理士にご確認ください」注記必須
//   ・3,000万円特別控除＝存在の紹介のみ。要件の詳細列挙・適用可否の断定はしない（税理士へ誘導）
//   ・恐怖を煽る表現は使わない（制度の事実として淡々と記述）
// FAQPage JSON-LD＝faqJa（B-3の空き家分野5問）を参照（文字列コピー禁止＝表記ゆれ防止）。
// ヒーロー画像＝akiya専用画像が未制作のため realestate-group-home-16x9.webp（住宅街の一戸建て）を再利用。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下）。浦松指定の確定文言（2026-07-19・タスクC-4）＝一字一句変更しないこと。
const JA_ANSWER_BLOCK =
  "相続した空き家を放置し、勧告を受けて特定空家等・管理不全空家等に指定されると、住宅用地特例が外れ、土地の固定資産税額が最大6倍になることがあります。四葉不動産株式会社は、文京区の空き家について売却・賃貸活用・管理を提案します。再建築不可や借地権付きなど条件の難しい物件にも対応します。相続登記など法務手続きに関わる書類作成は併設の四葉行政書士事務所が別契約で受任します。遠方にお住まいでも、オンラインと郵送で売却を進められます。";

// FAQPage＝faqJa（B-3の空き家分野5問）を参照
const JA_FAQ_QUESTIONS = [
  "空き家を放置するとどうなりますか？",
  "相続した空き家の売却で「3,000万円特別控除」は使えますか？",
  "遠方に住んでいても空き家を売却できますか？",
  "再建築不可の物件でも売れますか？",
  "相続した空き家をグループホームに使えますか？",
];

// §2 出口の比較の判断軸（4軸）。税額の断定はしない（税理士へ誘導）
const JA_EXIT_AXES: { title: string; body: string }[] = [
  {
    title: "立地",
    body: "駅からの距離や周辺環境により、売りやすさ・貸しやすさは大きく変わります。文京区の相場をふまえて査定します。",
  },
  {
    title: "建物の状態",
    body: "そのまま貸せるのか、修繕やリフォームが必要か。かかる費用は「売る場合」「貸す場合」の収支に直結します。",
  },
  {
    title: "ご家族の意向",
    body: "将来住む可能性があるか、思い入れのある実家か、相続人の間で現金化して分けたいか。",
  },
  {
    title: "税負担",
    body: "保有し続ける場合の固定資産税等と、売却した場合の譲渡所得課税。具体的な税額の判断は税理士にご確認ください。",
  },
];

// §2 3つの出口。文言＝/souzoku「3つの出口」セクションと整合（2026-07-19浦松検収済み草稿）
const JA_EXITS: { title: string; body: string }[] = [
  {
    title: "売却",
    body: "住む予定がなく、維持費や税負担が重いときの現実的な出口です。文京区の相場をふまえた査定から進めます。",
  },
  {
    title: "賃貸活用",
    body: "立地の良い物件を収益源に変える選択肢です。「貸した場合」の収支を試算し、売却した場合と数字で比べます。",
  },
  {
    title: "管理",
    body: "すぐに決められないときに、資産価値を保ちながら次の一手を考えるための選択肢です。",
  },
];

// §6 遠隔売却の流れ（3ステップ）。文言＝faqJa「遠方に住んでいても空き家を売却できますか？」と整合
const JA_REMOTE_STEPS: { title: string; body: string }[] = [
  {
    title: "オンライン相談",
    body: "ご相談はオンラインや電話・LINEで進められます。現地の確認は当社が対応します。",
  },
  {
    title: "郵送での書類手続き",
    body: "契約や手続きに必要な書類は郵送でやり取りできます。必要書類やお立ち会いの要否は個別の事情により異なりますので、状況を伺ったうえでご案内します。",
  },
  {
    title: "売却",
    body: "査定から引き渡しまで、文京区の地元会社として伴走します。",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "文京区の空き家を売却・活用したい｜相続空き家の対処法 | 四葉不動産",
    description:
      "相続した空き家を放置し、勧告を受けて特定空家等・管理不全空家等に指定されると、住宅用地特例が外れ、土地の固定資産税額が最大6倍になることがあります。文京区小日向の四葉不動産株式会社が、空き家の売却・賃貸活用・管理を提案します。再建築不可や借地権付きなど条件の難しい物件、遠方・海外からのご相談にも対応します。",
    path: "/souzoku/akiya",
    keywords: [
      "文京区 空き家 売却",
      "相続 空き家 どうする",
      "空き家 放置 固定資産税",
      "空き家 3000万円特別控除",
      "再建築不可 売却",
      "空き家 遠方 売却",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/souzoku/akiya"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "相続不動産", href: "/souzoku" },
        { name: "空き家" },
      ]}
      serviceName="文京区の相続空き家の売却・賃貸活用・管理の提案"
      heroSrc="/hero/realestate-group-home-16x9.webp"
      heroAlt="文京区の住宅街の一戸建て（空き家のイメージ）"
      h1="文京区の空き家、どうする？——売却・活用・管理"
      lead={
        <p>
          相続した実家が空き家のまま——そんなご相談が増えています。このページでは、空き家を放置した場合の<strong>制度上のリスク</strong>と、<strong>売却・賃貸活用・管理という3つの出口</strong>の選び方、遠方にお住まいの方の進め方を解説します。
        </p>
      }
      internalLinks={[
        { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
        { href: "/souzoku/nagare", label: "売却までの流れ" },
        { href: "/toushi/group-home", label: "グループホームに使える物件探し" },
        { href: "/global/chinese", label: "華人・中国語圏のお客様へ" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="相続登記など法務手続きに関わる書類作成は、併設の四葉行政書士事務所が別契約で受任します。"
    >
      {/* ─── C-4 本文6セクション（2026-07-19浦松検収済み草稿） ─── */}
      {/* §1 放置のリスク。根拠＝空家等対策の推進に関する特別措置法（平成26年法律第127号）。
          管理不全空家等への勧告＝令和5年法律第50号改正で導入・2023年12月13日施行（出典：国土交通省）。
          住宅用地特例からの除外＝地方税法349条の3の2（小規模住宅用地＝課税標準1/6も同条）。
          「最大6倍」＝1/6特例が外れた場合の理論上の上限＝「〜になる場合があります」に留める。
          注記「指定・課税の詳細は文京区および税理士にご確認ください」は必須（タスク指定） */}
      <div>
        <ReH2>空き家を放置した場合の制度上のリスク</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          空き家の管理が不十分な状態が続くと、空家等対策の推進に関する特別措置法（空家法）に基づき、市区町村による指導・勧告等の対象になることがあります。勧告を受けて「特定空家等」または「管理不全空家等」に指定されると、固定資産税の住宅用地特例——小規模住宅用地（200㎡以下の部分）は課税標準が6分の1になる措置——の対象から除外され、土地の固定資産税額が最大6倍になる場合があります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          これは罰則ではなく、住宅が建つ土地への軽減措置が適用されなくなるという税制上の仕組みです。建物の老朽化や近隣への影響が進む前に、管理・活用・売却のいずれかへ動き始めることが、負担を抑える現実的な備えになります。
        </p>
        <p className="mt-3 text-xs text-text-muted">
          ※指定・課税の詳細は文京区および税理士にご確認ください。
        </p>
      </div>

      {/* §2 出口の選択。判断軸4つ＋3つの出口＝/souzoku「3つの出口」と整合。制度事実の記述なし */}
      <div>
        <ReH2>3つの出口——売却・賃貸活用・管理</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          空き家の出口は、大きく「売却」「賃貸活用」「管理」の3つです。どれか一つに今すぐ決める必要はありません。次の4つの判断軸で並べて比較するところから始めます。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_EXIT_AXES.map((axis) => (
            <li key={axis.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{axis.title}</strong>
              <span className="mt-1 block">{axis.body}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {JA_EXITS.map((exit) => (
            <div key={exit.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{exit.title}</strong>
              <span className="mt-1 block">{exit.body}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社は、3つを比較する材料づくりからお手伝いします。
        </p>
      </div>

      {/* §3 3,000万円特別控除。根拠＝租税特別措置法35条3項（国税庁タックスアンサーNo.3306）。
          存在の紹介のみ＝要件の詳細（耐震・建築年・譲渡対価・適用期限等）は列挙しない（タスク指定）。
          留保水準＝faqJa「相続した空き家の売却で『3,000万円特別控除』は使えますか？」と同一 */}
      <div>
        <ReH2>相続空き家の「3,000万円特別控除」という制度</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          相続した空き家を売却したとき、譲渡所得から最大3,000万円を控除できる特例（被相続人の居住用財産（空き家）に係る譲渡所得の特別控除）が設けられています。相続空き家の売却を検討する際に、知っておきたい制度の一つです。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ただし、適用には建物・期間・売却条件などの要件があり、使えるかどうかの判断は税務の専門領域です。適用要件の判断は税理士にご確認ください。当社は提携税理士のご紹介と、売却そのもののサポートを承ります。
        </p>
      </div>

      {/* §4 条件の難しい物件。結果保証なし＝「売却の可否や条件をお約束するものではありませんが」を明示。
          留保水準＝faqJa「再建築不可の物件でも売れますか？」と同一 */}
      <div>
        <ReH2>条件の難しい空き家もご相談ください</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          「再建築不可と言われた」「借地権付きで売れるか分からない」「共有名義で話が進まない」——条件の難しい空き家も、あきらめる前にご相談ください。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          再建築の可否や活用の選択肢は、接道の状況や隣地との関係など個別の事情により異なるため、まず現状の確認から始めます。借地権付きの物件は地主の方との関係整理が、共有名義の物件は共有者間の合意形成が、それぞれ進め方の鍵になります。売却の可否や条件をお約束するものではありませんが、条件が難しい物件こそ、進め方のご提案が価値を持ちます。
        </p>
      </div>

      {/* §5 グループホーム転用。group-homeページ§5（C-1）・faqJa「相続した空き家をグループホームに
          使えますか？」と同一趣旨・同一の留保。基準の具体値（7.43㎡等）はここに書かない（group-homeに委ねる）。
          相互リンク＝group-home側のコメントアウト済みリンクをC-4で有効化 */}
      <div>
        <ReH2>グループホーム等への転用という選択肢</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          相続した空き家が障害者グループホーム（共同生活援助）の指定基準を満たせば、福祉の住まいとして活用できる場合があります。住宅街の一戸建てという立地・形状は共同生活援助の住まいと親和性があり、空き家の管理負担を活用に変える選択肢の一つです。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ただし、用途地域・居室面積・消防設備など障害福祉サービスの指定基準に関わる確認が必要で、基準は自治体・事業類型により異なります。改修や契約の前の段階でご相談ください。
        </p>
        <p className="mt-2 text-sm">
          <Link href="/toushi/group-home" className="text-primary underline">グループホームに使える物件探し</Link>
        </p>
      </div>

      {/* §6 遠隔売却の流れ。分離受任の明示＝行政書士（別契約受任）・司法書士（提携紹介）。
          文言＝faqJa「遠方に住んでいても空き家を売却できますか？」と整合 */}
      <div>
        <ReH2>遠方にお住まいでも——オンラインと郵送で進める売却</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          相続した空き家が文京区にあり、ご自身は遠方や海外にお住まい——そうしたケースでも、売却は進められます。おおまかな流れは次のとおりです。
        </p>
        <ol className="mt-4 space-y-3">
          {JA_REMOTE_STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <span aria-hidden className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-tint font-medium text-primary">
                {i + 1}
              </span>
              <span>
                <strong className="text-ink">{step.title}</strong>
                <span className="mt-1 block">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 leading-relaxed text-text">
          相続登記など法務手続きに関わる書類作成は、併設の四葉行政書士事務所が別契約で受任します。登記申請の代理は司法書士の業務のため、提携司法書士をご紹介します。海外在住の方のご相談にも対応しています。中国語圏にお住まいの方は、
          <Link href="/global/chinese" className="text-primary underline">華人・中国語圏のお客様向けのご案内</Link>
          もご覧ください。
        </p>
      </div>

      {/* 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD。設問はfaqJa（B-3の空き家分野5問）を参照＝サイト内で文言一致 */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
