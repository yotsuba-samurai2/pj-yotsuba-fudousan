// /global（型A・横断レイヤー）＝原稿_不動産 #5
// クロスリンク＝C6（→/legal/services/visa）がpathで自動表示。
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
    title: "外国人の日本での家探し｜多言語対応の四葉不動産",
    description:
      "日本での家探しを、四葉不動産株式会社が母語でサポートします。入居審査・契約・暮らしの手続きまで、日本語・英語・中国語で対応。元毎日新聞中国総局長で海外4カ国の在住経験を持つ代表が、言葉と制度の両面から外国人のお部屋探しを支えます。",
    path: "/global",
    keywords: ["外国人 賃貸 東京", "外国人 部屋 借りられない", "中国語 不動産 東京"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <RealestateServicePage
      path="/global"
      crumbs={[{ name: "ホーム", href: "/" }, { name: "外国人・多言語のお部屋探し" }]}
      serviceName="外国人・多言語のお部屋探しサポート"
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt="外国人・多言語のお部屋探しのイメージ（多国籍の入居者）"
      h1="外国人・多言語のお部屋探し"
      lead={
        <p>
          外国人の方の日本での家探しは、<strong>四葉不動産株式会社が母語でサポートします</strong>。対応言語は日本語・英語・中国語
          <Placeholder reason="浦松＝繁体字/簡体字の別を含む対応言語の最終確定" />
          。入居審査・保証会社・契約・入居後の手続きまで、一つずつ一緒に進めます。代表の浦松 丈二は元毎日新聞中国総局長として海外4カ国に住み、「外国で家を探す側」の経験があります。だから、何が不安かがわかります。
        </p>
      }
      internalLinks={[
        { href: "/toushi/shataku", label: "社宅・法人賃貸" },
        { href: "/access", label: "アクセス・料金" },
      ]}
      crossLinkLead="在留資格・会社設立の手続きは、関連事業の四葉行政書士事務所が対応します。"
    >
      <div>
        <ReH2>外国人でも日本で部屋を借りられますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          借りられます。ただし、在留資格の種類・言語・保証会社・緊急連絡先など、日本特有の確認事項があり、ここでつまずく方が多いのも事実です。四葉不動産は、<strong>審査に必要な準備を先に整理</strong>し、貸主・保証会社への説明も含めてサポートします。
        </p>
      </div>

      <div>
        <ReH2>在留資格や会社設立も相談できますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          住まいの手続きは四葉不動産が、<strong>在留資格・会社設立の手続き</strong>は関連事業の四葉行政書士事務所が対応します。日本での生活と事業の入口を、同じ窓口で相談できます。
        </p>
      </div>

      <div>
        <ReH2>繁体字（台湾・中華圏）のコンテンツはありますか？</ReH2>
        <p className="mt-3 text-sm leading-relaxed text-text">
          あります。台湾・中華圏の方向けの繁体字コラム（相続・投資・手続き）を公開しています。ページ右上の言語スイッチャーから繁體中文をお選びください →{" "}
          <Link href="/column" className="text-primary underline">コラム一覧</Link>
        </p>
      </div>
    </RealestateServicePage>
  );
}
