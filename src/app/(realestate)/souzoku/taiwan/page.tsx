// /souzoku/taiwan（台湾越境相続）＝地域階層#19（2026-07-22・日本語版のみ・監修前ドラフト実装）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開・/souzoku 配下（勝ちクラスタの子＝権威継承）。
// 表示コンプライアンス（C-2検収準拠＋国際私法の特則）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   ・独占業務の表現＝「作成」が行政書士の独占業務。「作成・提出は独占業務」とまとめない。
//   ・【最重要】準拠法（どの国の法律で相続するか）は一切断定しない＝個別判断は提携弁護士へ（AI判断禁止の中核）。
//     通則法の条番号・台湾民法の期限等の数値は書かない。認証手続きは機関名を書かず一般形＋提出先確認へ誘導。
//   ・顧問等の人物名への言及はしない（2026-07-22 浦松判断・確定）。
// FAQPage JSON-LD＝faqJa（souzoku/foreign新設2問＋既存2問）を参照（文字列コピー禁止）。
// hero＝bunkyo-sakura-16x9.webp（ブランド汎用）を暫定使用（専用画像TODO）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下）。分離受任＋弁護士連携の型（監修前ドラフト）
const JA_ANSWER_BLOCK =
  "台湾籍の方が日本の不動産を相続するとき、また相続人の中に台湾在住の方がいるときは、日本と台湾の両方で戸籍関係の書類を集め、翻訳・認証を経て、遺産分割と不動産の手続きを進めることになります。台湾は日本と同じく戸籍制度のある数少ない地域のため、相続関係の証明は比較的整理しやすい一方、書類のやり取り・認証・言語の壁が実務のハードルになります。四葉不動産株式会社が相続不動産の管理・活用・売却を担当し、遺産分割協議書の作成など書類の作成は併設の四葉行政書士事務所が別契約で受任します。どの国の法律が適用されるかなど法的判断が必要な場合は提携弁護士に、登記は提携司法書士に、税務は提携税理士におつなぎします。日本語・中国語（繁体字）で対応します。";

// FAQPage＝faqJa参照（新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "台湾に相続人がいる（台湾籍の方が相続する）場合も、日本語で相談できますか？",
  "台湾の戸籍謄本などの書類は、どうやって集めればいいですか？",
  "相続した不動産は、管理・活用・売却のどれを選べばいいですか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// §1 何が違うか
const JA_DIFFS: { title: string; body: string }[] = [
  { title: "書類が二か国にまたがる", body: "相続関係を証明するために、日本の戸籍に加えて台湾側の戸籍書類（戸籍謄本など）が必要になる場面があります。" },
  { title: "翻訳・認証", body: "台湾で発行された書類は、日本の手続きで使うために日本語訳を付し、書類によっては認証手続きを経る必要があります。必要な認証の種類・手順は提出先により異なります。" },
  { title: "どの国の法律で相続するか", body: "被相続人の国籍・居住地などによって、適用される法律の整理が必要になることがあります。この判断は個別の事案によるため、必要に応じて提携弁護士と連携して進めます。" },
  { title: "距離と言語", body: "台湾在住の相続人との連絡・書類のやり取り・意思確認を、言語の壁を越えて進める必要があります。" },
];

// §5 役割分担表
const JA_ROLES: { work: string; who: string }[] = [
  { work: "相続不動産の管理・活用・売却（宅地建物取引業）", who: "四葉不動産株式会社" },
  { work: "遺産分割協議書・官公署提出書類の作成（作成は行政書士の独占業務・別契約）", who: "併設の四葉行政書士事務所（中国語対応）" },
  { work: "準拠法の判断・紛争性のある事案", who: "提携弁護士をご紹介" },
  { work: "相続登記", who: "提携司法書士をご紹介" },
  { work: "税務（非居住者の源泉・申告等）", who: "提携税理士をご紹介" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "台湾に相続人がいる不動産相続｜書類・手続き・売却の完全ガイド | 四葉不動産",
    description:
      "台湾籍の方が日本の不動産を相続する、台湾に相続人がいる——台湾がからむ相続は、両国の戸籍書類の収集・翻訳・認証と、不動産の出口（管理・活用・売却）を並行して進めます。四葉不動産株式会社が不動産を担当し、遺産分割協議書など書類の作成は併設の四葉行政書士事務所が別契約で受任。中国語（繁体字）対応。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/souzoku/taiwan",
    keywords: [
      "台湾人 日本 不動産 相続",
      "台湾 相続人 手続き",
      "台湾 戸籍謄本 相続 翻訳",
      "国際相続 台湾 相談",
      "台湾 相続 不動産 売却",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/souzoku/taiwan"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "相続不動産", href: "/souzoku" },
        { name: "台湾がからむ相続" },
      ]}
      serviceName="台湾がからむ相続不動産の管理・活用・売却"
      heroSrc="/hero/bunkyo-sakura-16x9.webp"
      heroAlt="文京区・播磨坂の桜並木のイメージ"
      h1="台湾がからむ不動産相続——書類から売却まで、日本語と繁体字で"
      lead={
        <p>
          「相続人の一人が台湾にいる」「台湾籍の家族が日本の家を相続する」——台湾がからむ相続は、<strong>二か国の書類と言語をまたいで</strong>進みます。幸い台湾は日本と同じ戸籍制度を持つ地域。段取りを正しく組めば着実に進められます。このページでは、通常の相続との違い、書類の集め方、不動産の出口、そして<strong>担当・契約の分担</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/souzoku", label: "相続不動産の完全ガイド（管理・活用・売却）" },
        { href: "/souzoku/akiya", label: "空き家の完全ガイド" },
        { href: "/global/chinese", label: "中国語圏の方へ（繁体字・簡体字）" },
        { href: "/legal", label: "四葉行政書士事務所" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="遺産分割協議書など相続書類の作成は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      {/* §1 何が違うか。準拠法は断定せず弁護士連携へ */}
      <div>
        <ReH2>台湾がからむ相続は、何が違うのか</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          相続人や被相続人に台湾とのつながりがあると、通常の相続に次の論点が加わります。
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
          幸い、台湾は日本と同様の戸籍制度を持つため、「誰が相続人か」を書類で示しやすい地域です。段取りを正しく組めば、着実に進められます。
        </p>
      </div>

      {/* §2 書類。認証は一般形＋提出先確認 */}
      <div>
        <ReH2>書類の集め方——日本側と台湾側</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          日本側では、被相続人の出生から死亡までの戸籍、相続人の戸籍・印鑑証明などを揃えます。台湾側では、台湾の戸籍機関が発行する戸籍書類等を取り寄せ、日本語訳を付します。取り寄せの方法（本人請求・代理請求・現地のご親族経由など）や、認証の要否は、提出先（法務局・金融機関・税務署など）により異なるため、提出先の要件を確認しながら進めるのが実務の定石です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          四葉行政書士事務所（行政書士・中国語対応）が、必要書類の整理と、遺産分割協議書など権利義務・事実証明に関する書類および官公署に提出する書類の作成を別契約で受任します。台湾側の相続人への説明資料を繁体字でご用意することもできます。
        </p>
      </div>

      {/* §3 不動産の出口。souzoku本体・akiyaへ導線＝クラスタ内リンク */}
      <div>
        <ReH2>不動産をどうするか——管理・活用・売却</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          書類が整ったら、不動産の出口を決めます。考え方は国内の相続と同じ「管理・活用・売却」の3択です（詳しくは
          <Link href="/souzoku" className="text-primary underline">相続不動産の完全ガイド</Link>
          ）。台湾がからむ場合に特有なのは、次の3点です。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">遠方・海外からの意思決定</strong>：台湾在住の相続人とオンラインで進める段取りをつくります。</li>
          <li><strong className="text-ink">空き家になりやすい</strong>：相続人が日本に住んでいない場合、放置のリスクが高まります（<Link href="/souzoku/akiya" className="text-primary underline">空き家の完全ガイド</Link>）。</li>
          <li><strong className="text-ink">非居住者の税務</strong>：売却・賃貸には非居住者特有の税務上の取り扱いがあるため、提携税理士と連携して進めます。</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社（宅地建物取引業）が、査定から売却・賃貸活用・管理までを担当します。文京区・茗荷谷を中心に、近隣区にも対応します。
        </p>
      </div>

      {/* §4 なぜ四葉か。名誉顧問の言及は検収確認まで見送り */}
      <div>
        <ReH2>台湾との距離が近い事務所であること</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          代表の浦松丈二は元毎日新聞記者（記者歴34年）で、中国総局長として台湾・中国に駐在した経験があり、中国語での相談に対応します。繁体字での情報発信を継続しており、台湾の相続人向けの説明資料も繁体字でご用意できます。中国語圏の方向けの解説は
          <Link href="/global/chinese" className="text-primary underline">中国語圏の方へ</Link>
          をご覧ください。
        </p>
      </div>

      {/* §5 役割分担表 */}
      <div>
        <ReH2>担当・契約の分担</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          不動産・書類・法的判断・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。
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
