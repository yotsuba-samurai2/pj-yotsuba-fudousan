// /global/chinese（型A・中国語圏特化ハブ）＝タスクC-3（2026-07-19・日本語版のみ）
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開：
//   availableLocales:["ja"] で hreflang を実在ロケールに限定・sitemap側も locales:["ja"]（手本=/ryokin B-1）。
//   多言語版（中国語）はC-6で展開＝このファイルでは ja のみ。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
// 準拠法（§2）＝法の適用に関する通則法36条「相続は、被相続人の本国法による」の一般的枠組みの紹介に留める。
//   法的結論（「結果として日本法で進む」等）は書かない。「実際の適用は事案により異なり…専門家にご相談ください」
//   の注記は必須（2026-07-19浦松検収）。
// 代表の駐在歴＝「中国総局長として中国や台湾、タイに駐在しました」で固定（国数表記は一切使わない）。
// FAQPage JSON-LD＝faqJa（B-3既存2問＋C-3新規2問）を参照（文字列コピー禁止＝表記ゆれ防止）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";

// 冒頭の回答ブロック（H1直下）。浦松指定の確定文言（2026-07-19検収）＝一字一句変更しないこと。
const JA_ANSWER_BLOCK =
  "四葉不動産株式会社は、中国語（繁体字・簡体字）で日本の不動産の相続・売却・お部屋探しに対応します。物件の査定・売却は四葉不動産が担当し、相続登記に関わる書類の準備や翻訳などの法務手続きは併設の四葉行政書士事務所が別契約で受任します。海外にお住まいの相続人でも、オンラインで相談を始められます。台湾・大陸のいずれの書類にも対応します。";

// FAQPage＝faqJa（B-3既存2問＋C-3新規2問）を参照
const JA_FAQ_QUESTIONS = [
  "中国語で相続不動産の相談ができますか？",
  "繁体字と簡体字の両方に対応していますか？",
  "海外在住のまま日本の不動産を売却できますか？",
  "相続登記まで頼めますか？",
];

// §5 担当の分担表（構成・スタイル＝shitei-shinsei §4に準拠）
const JA_ROLES: { task: string; owner: string }[] = [
  { task: "物件の査定・売却・賃貸（宅地建物取引業）", owner: "四葉不動産株式会社" },
  { task: "相続関係書類の作成・翻訳", owner: "四葉行政書士事務所（別契約で受任）" },
  { task: "相続登記の申請", owner: "提携司法書士をご紹介" },
  { task: "相続税などの税務申告", owner: "提携税理士をご紹介" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "中国語で相談できる不動産・相続｜繁体字・簡体字対応 | 四葉不動産",
    description:
      "日本の不動産の相続・売却・お部屋探しを、中国語（繁体字・簡体字）でご相談いただけます。物件の査定・売却は四葉不動産株式会社が担当し、戸籍・公証書類の翻訳など相続関係書類の準備は併設の四葉行政書士事務所が別契約で受任します。海外在住の相続人のオンライン相談にも対応します。",
    path: "/global/chinese",
    keywords: ["中国語 不動産 相談", "在日中国人 相続 不動産", "中国語 不動産 売却 東京"],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/global/chinese"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "外国人・多言語のお部屋探し", href: "/global" },
        { name: "中国語対応" },
      ]}
      serviceName="中国語（繁体字・簡体字）での不動産相続・売却・お部屋探しサポート"
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt="中国語対応の不動産相談のイメージ（多国籍の相談者）"
      h1="中国語対応｜相続・売却・お部屋探し"
      lead={
        <p>
          在日中国人・台湾出身の方とそのご家族の、日本の不動産に関するご相談を<strong>中国語（繁体字・簡体字）で承ります</strong>。相続した不動産の売却から、海外在住のままのご相談、現地書類の翻訳・準備まで、担当する専門家を分けながら一つずつ進めます。
        </p>
      }
      internalLinks={[
        { href: "/global", label: "外国人・多言語のお部屋探し" },
        { href: "/souzoku", label: "相続不動産の相談" },
        { href: "/column/overseas-owners-guide-japan-real-estate-sale", label: "海外オーナーのための日本不動産売却ガイド" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/legal", label: "四葉行政書士事務所" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="相続関係書類の作成・翻訳や在留資格の手続きは、関連事業の四葉行政書士事務所が別契約で受任します。"
    >
      {/* ─── C-3 本文5セクション（2026-07-19浦松検収済み草稿） ─── */}
      {/* §1 対応範囲。駐在歴＝共通ルール8の固定文言（B-3 FAQ「中国語で不動産の相談ができますか？」と同一表現） */}
      <div>
        <ReH2>中国語で相談できること — 相続・売却・お部屋探し</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社は、日本の不動産に関する相続のご相談、売却（査定を含む）、賃貸のお部屋探しを、中国語で承ります。繁体字・簡体字のどちらにも対応しており、台湾・香港の方には繁体字で、中国大陸の方には簡体字でご案内できます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          代表の浦松丈二は元毎日新聞記者で、中国総局長として中国や台湾、タイに駐在しました。言葉だけでなく、中華圏と日本の制度や商習慣の違いを踏まえてご相談いただけます。もちろん日本語・英語でのご相談も可能です。
        </p>
      </div>

      {/* §2 準拠法の概説。根拠＝法の適用に関する通則法（平成18年法律第78号）36条。一般的枠組みの紹介のみ・
          法的結論は書かない。「専門家にご相談ください」注記は必須（浦松検収） */}
      <div>
        <ReH2>在日中国人の相続は、どの国の法律によりますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          日本に住む中国籍・台湾出身の方が亡くなった場合、相続の手続きを進める前に「どの国・地域の法律を基準にするか（準拠法）」の整理が必要になります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          日本の「法の適用に関する通則法」は、相続について「被相続人の本国法による」という枠組みを定めています（同法第36条）。つまり、亡くなった方の国籍がどこにあるかが出発点となり、日本国内の不動産であっても、日本法だけを見て手続きが完結するとは限りません。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ただし、実際にどの法律がどのように適用されるかは、国籍の認定、本国法の内容、反致の有無など、事案ごとに検討すべき点が多くあります。<strong>実際の適用は事案により異なり、法的判断を要するため、個別の状況については専門家にご相談ください。</strong>当社は不動産の面からご相談を承り、相続関係の書類作成は併設の四葉行政書士事務所が別契約で受任します。
        </p>
      </div>

      {/* §3 遠隔手続き。署名証明・在留証明＝一般的な必要書類の例示（断定しない「必要になることがあります」） */}
      <div>
        <ReH2>海外に住んだまま、相談・売却を進められますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          進められます。ご相談はオンライン（ビデオ通話）でお受けでき、現地の物件確認は当社が行います。必要な書類のやり取りは郵送で進められるため、来日を前提とせずにご相談を始められます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ただし、海外在住の相続人が日本の不動産を売却する場合、署名証明（サイン証明）や在留証明など、現地の在外公館や公証機関で取得する書類が必要になることがあります。こうした書類の準備には時間がかかる場合がありますので、売却をお考えの段階で、早めにご相談いただくことをお勧めします。必要な書類はご状況（在住国・在留状況など）により異なりますので、個別に確認しながら進めます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          海外在住のまま進める売却の流れは、コラム
          <Link href="/column/overseas-owners-guide-japan-real-estate-sale" className="text-primary underline">
            「海外オーナーのための日本不動産売却ガイド」
          </Link>
          で詳しく解説しています。
        </p>
      </div>

      {/* §4 書類の翻訳・準備＝四葉行政書士事務所の別契約受任（独立事業体・紹介料授受なし＝B-3 FAQと同一表現） */}
      <div>
        <ReH2>中国・台湾の戸籍や公証書類の翻訳・準備</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          中華圏の相続手続きでは、中国大陸の戸口簿や公証処の公証書、台湾の戸籍謄本や除戸謄本など、現地の書類を日本の手続きで使える形に整える作業が必要になります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          こうした外国語書類の翻訳と、相続関係を証明する書類の作成支援は、併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体で、紹介料等の授受はありません）。台湾・大陸のいずれの書類にも対応します。不動産のご相談とあわせて、窓口をご案内できます。
        </p>
      </div>

      {/* §5 担当の分担表（構成・スタイル＝shitei-shinsei §4に準拠） */}
      <div>
        <ReH2>どの手続きを、誰が担当しますか</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          物件・書類・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。
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
              <tr key={r.task}>
                <td className="border border-border px-3 py-2">{r.task}</td>
                <td className="border border-border px-3 py-2">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-text-muted">
          それぞれの専門家とは分離受任・個別契約です。ご相談の入口はどこからでも構いません。状況を伺ったうえで、必要な窓口をご案内します。
        </p>
      </div>

      {/* 対応できないこと＝B-4共通コンポーネント（浦松確定文言・一字一句変更なし） */}
      <CannotHandle bare />

      {/* FAQPage JSON-LD＝B-4の例外（浦松承認）。設問はfaqJaを参照＝サイト内で文言一致 */}
      <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
    </RealestateServicePage>
  );
}
