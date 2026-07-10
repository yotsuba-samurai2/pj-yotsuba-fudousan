// /faq（型B・FAQPage）＝原稿_不動産 #8
// FAQPage JSON-LDはこの専用ページのみ（各サイト1本＝URL構造設計v1 §1）。HTMLと構造化データは同じITEMSから生成＝完全一致。
// 【要確認】の項目（対応エリア・査定のみ対応）は断定しない安全文で公開可能な形にしてある（未検証を出力しない原則）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "よくある質問｜文京区・茗荷谷の四葉不動産株式会社",
    description:
      "四葉不動産株式会社への「相続の相談は無料か」「中国語・英語で相談できるか」「文京区以外も対応か」「グループホーム物件や社宅を扱えるか」などのよくある質問に、一問一答でお答えします。文京区小日向・茗荷谷駅徒歩5分。まずはお気軽にご相談ください。",
    path: "/faq",
    keywords: ["四葉不動産 よくある質問", "文京区 不動産 相談 無料", "不動産 多言語 相談"],
    locale,
    absoluteTitle: true,
  });
}

const ITEMS: FaqItem[] = [
  {
    q: "相続や不動産の相談は無料ですか？",
    a: "当社に売買・賃貸の媒介をご依頼いただく前提のご相談は無料です。媒介を伴わない不動産コンサルティング（セカンドオピニオン、資産全体の活用・保有方針の助言など）は、別途の合意のうえ原則30分5,500円（税込・オンライン可）で承ります。まずはLINEか電話で一言からで大丈夫です。",
  },
  {
    q: "中国語・英語でも相談できますか？",
    a: "できます。代表の浦松丈二は元毎日新聞中国総局長で海外4カ国の在住経験があり、日本語・英語・中国語で対応します。外国人の方のお部屋探しは「外国人・多言語のお部屋探し」ページもご覧ください。",
  },
  {
    q: "文京区以外の物件でも相談できますか？",
    a: "四葉不動産株式会社は文京区・茗荷谷を中心に対応します。エリア外については個別にご相談ください。",
  },
  {
    q: "グループホームや障害福祉に使える物件を探せますか？",
    a: "探せます。四葉不動産株式会社は、グループホーム（共同生活援助）等に使う物件のご相談を扱います。物件の用途・立地・消防などの指定基準に関わる点は、行政書士等の専門家と確認しながら進めます。指定申請そのものは、関連事業の四葉行政書士事務所（別事業体・独立受任・紹介料等の授受はありません）が対応します。",
  },
  {
    q: "社宅・法人賃貸の手配もできますか？",
    a: "できます。四葉不動産株式会社は、企業・施設向けの社宅手配や法人賃貸に対応します。外国人材の住まい確保にも対応します。",
  },
  {
    q: "相続登記や相続税も頼めますか？",
    a: "相続登記は司法書士、相続税は税理士の領域です。四葉不動産株式会社は不動産の相談・売買・賃貸・管理を扱い、これらの手続きは提携する専門家と連携して進めます。相続に関する書類作成・許認可は、四葉行政書士事務所（別事業体）が対応できます。",
  },
  {
    q: "査定だけでもお願いできますか？",
    a: "お気軽にご相談ください。物件の状況を伺い、対応の可否と進め方をご案内します。",
  },
  {
    q: "仲介手数料はいくらですか？",
    a: "売買・賃貸の仲介手数料は、宅地建物取引業法の法定上限の範囲です。具体的な金額は物件ごとに算出します。詳しくは「アクセス・料金」ページをご覧ください。",
  },
];

export default function Page() {
  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/" }, { name: "よくある質問" }]} />
      {/* FAQPage JSON-LD はこの専用ページのみ出力 */}
      <Faq items={ITEMS} heading="よくある質問" withJsonLd />
      <div className="mx-auto max-w-3xl px-4 pb-8">
        {/* 署名（E-E-A-T・原稿_不動産サイト共通） */}
        <aside className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉不動産株式会社 代表取締役 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）・海外4カ国在住経験。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
