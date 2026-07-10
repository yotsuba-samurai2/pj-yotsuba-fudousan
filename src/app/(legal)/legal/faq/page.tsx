// ★参考ページ（型B・FAQ）＝ /legal/faq　※原稿_行政書士 #9・A-3の Faq 部品を使用
// 配置＝src/app/(legal)/legal/faq/page.tsx。Faq が FAQPage JSON-LD を出力／Breadcrumb が BreadcrumbList を出力。
// HTMLと構造化データ完全一致（同じ items から生成）。【要確認】の相談料・オンライン完結は"断定しない安全文"にしてある。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "よくある質問｜四葉行政書士事務所",
    description:
      "四葉行政書士事務所への「初回相談は無料か」「中国語・英語で相談できるか」「障害福祉の指定申請を頼めるか」などのよくある質問に、一問一答でお答えします。文京区小日向・茗荷谷駅徒歩5分。お気軽にご相談ください。",
    path: "/legal/faq",
    locale,
    absoluteTitle: true,
  });
}

// ※【要確認：浦松】の項目は、事実確定後に文言を差し替える（相談料の有無／オンライン完結の範囲）。
//   現状は"断定しない一般表現"で公開可能な形にしてある（未検証を出力しない原則）。
const ITEMS: FaqItem[] = [
  {
    q: "初回相談は無料ですか？",
    a: "初回相談は無料です。以降は原則30分5,500円（税込）。文京区小日向（東京メトロ丸ノ内線「茗荷谷」駅 徒歩5分）とオンラインで承ります。",
  },
  {
    q: "中国語や英語で相談できますか？",
    a: "できます。四葉行政書士事務所の代表・浦松丈二は元毎日新聞中国総局長で、日本語・英語・中国語での相談に対応します。",
  },
  {
    q: "障害福祉サービスの指定申請を頼めますか？",
    a: "頼めます。グループホーム・放課後等デイサービス等の指定申請、前提となる法人設立、指定後の加算届・運営支援まで対応します。詳細は「障害福祉サービスの指定申請」ページをご覧ください。",
  },
  {
    q: "会社設立で行政書士に頼めることと、司法書士との違いは？",
    a: "定款作成などの設立書類は行政書士、法務局への登記申請は司法書士の領域です。四葉行政書士事務所は設立書類の作成を担い、登記は連携する司法書士におつなぎします。",
  },
  {
    q: "相続では何をしてもらえますか？",
    a: "遺産分割協議書の作成、遺言書の起案、戸籍等の収集を行います。相続登記は司法書士、相続税は税理士におつなぎします。相続した不動産の管理・活用・売却は、関連事業の四葉不動産株式会社（別事業体・独立受任）が対応します。",
  },
  {
    q: "不動産の売買や賃貸も一緒に相談できますか？",
    a: "宅地建物取引業は、関連事業の四葉不動産株式会社が別の事業体として独立して受任します（紹介料等の授受はありません）。書類（行政書士）と不動産（宅建業）を同じ窓口でご相談いただけます。",
  },
  {
    q: "雇用関係の助成金も頼めますか？",
    a: "雇用関係の助成金は社会保険労務士の領域です。代表は社会保険労務士試験に合格しており（2026年9月開業予定）、開業後の対応を予定しています。現在は行政書士業務として補助金の申請サポートに対応します。",
  },
  {
    q: "オンラインだけで手続きは完結しますか？",
    a: "オンラインでのご相談に幅広く対応します。手続きによっては書面・郵送が必要な場合があり、その範囲は事案ごとにご案内します。",
  },
];

export default function Page() {
  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/legal" }, { name: "よくある質問" }]} />
      {/* FAQPage JSON-LD はこの専用ページのみ出力（委任§4-6） */}
      <Faq items={ITEMS} heading="よくある質問" withJsonLd />
      <div className="mx-auto max-w-3xl px-4 pb-8">
        {/* 署名（E-E-A-T・原稿サイト共通） */}
        <aside className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉行政書士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
