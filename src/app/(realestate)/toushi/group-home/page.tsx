// /toushi/group-home（型A・バリューチェーンの入口）＝原稿_不動産 #3
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示。
// ※賃料水準・稼働率等の数値断定はしない（景表法・ページ割v2）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "グループホームに使える物件探し｜四葉不動産",
    description:
      "グループホーム（共同生活援助）の開設に使える物件を、四葉不動産株式会社がご提案します。指定基準（立地・構造・面積・消防）を見据えた契約前の確認から、開設後を見据えた物件選びまで。文京区の窓口で、物件と手続きをまとめて相談できます。",
    path: "/toushi/group-home",
    keywords: ["グループホーム 物件 探し方", "共同生活援助 物件 基準", "障害福祉 物件"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <RealestateServicePage
      path="/toushi/group-home"
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "投資用・事業用不動産", href: "/toushi" },
        { name: "グループホーム物件" },
      ]}
      serviceName="グループホーム（共同生活援助）向け物件の仲介・提案"
      heroSrc="/hero/realestate-group-home-16x9.webp"
      heroAlt="グループホームに使える物件のイメージ（住宅街の一軒家）"
      h1="グループホームに使える物件探し"
      lead={
        <p>
          グループホーム（共同生活援助）に使う物件は、<strong>「借りてから考える」と失敗します</strong>。事業者指定には立地・構造・面積・消防設備などの基準があり、契約後に「この物件では指定が取れない」と判明する事例が実際にあるからです。四葉不動産株式会社は、<strong>指定基準を見据えた契約前の確認</strong>から物件探しをお手伝いします。指定申請そのものは関連事業の四葉行政書士事務所が対応するため、<strong>物件と申請を一つの窓口で</strong>相談できます。
        </p>
      }
      internalLinks={[
        { href: "/toushi", label: "投資用・事業用不動産トップ" },
        { href: "/access", label: "アクセス・料金" },
      ]}
      crossLinkLead="指定申請の要件・流れは、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
    >
      <div>
        <ReH2>グループホームの物件は、何に気をつければいいですか？</ReH2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          契約前に確認すべき代表的なポイントです。個別の適合判断は自治体・専門家への確認が必要です。
        </p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-text">
          <li><strong>立地・用途地域</strong>：その場所で福祉事業が営めるか、近隣環境はどうか</li>
          <li><strong>構造・面積</strong>：居室の広さ・数、共用部分の要件、バリアフリー</li>
          <li><strong>消防・建築</strong>：消防設備の要否、建築基準への適合</li>
          <li><strong>貸主の理解</strong>：用途（福祉事業）への承諾——ここで止まる案件は少なくありません</li>
        </ul>
        <Placeholder reason="浦松＝実務上のチェックポイントの追加・オーナー向け（GH向け賃貸という出口）の記載可否" />
      </div>

      <div>
        <ReH2>物件探しから開設までは、どう進みますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>①物件のご相談（四葉不動産）→ ②指定基準との突き合わせ → ③指定申請（四葉行政書士事務所・別事業体）→ ④開設</strong>。物件と申請を並行で進めることで、「借りたのに開設できない」を避けられます。
        </p>
      </div>
    </RealestateServicePage>
  );
}
