// /toushi/shataku（型A）＝原稿_不動産 #4
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
    title: "社宅・法人賃貸のサポート｜四葉不動産",
    description:
      "法人向けの社宅・法人契約の賃貸を、四葉不動産株式会社がサポートします。外国人従業員の住居手配は日本語・英語・中国語（繁体字・簡体字）で対応。従業員の受け入れに必要な在留資格の手続きとあわせて、住まいの確保を一つの窓口で相談できます。",
    path: "/toushi/shataku",
    keywords: ["社宅 法人契約 賃貸", "外国人 従業員 住居 手配"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <RealestateServicePage
      path="/toushi/shataku"
      crumbs={[
        { name: "ホーム", href: "/" },
        { name: "投資用・事業用不動産", href: "/toushi" },
        { name: "社宅・法人賃貸" },
      ]}
      serviceName="社宅・法人賃貸のサポート"
      heroSrc="/hero/realestate-shataku-16x9.webp"
      heroAlt="社宅・法人賃貸のイメージ（オフィス街の集合住宅）"
      h1="社宅・法人賃貸のサポート"
      lead={
        <p>
          四葉不動産株式会社は、<strong>法人向けの社宅・法人契約の賃貸</strong>をサポートします。特長は、<strong>外国人従業員の住居手配を日本語・英語・中国語（繁体字・簡体字）で</strong>支援できること。入居審査・保証・生活ルールの説明など、外国人の入居でつまずきやすい点を、言葉の壁ごと引き受けます。
        </p>
      }
      internalLinks={[
        { href: "/toushi", label: "投資用・事業用不動産トップ" },
        { href: "/global", label: "外国人・多言語のお部屋探し" },
        { href: "/access", label: "アクセス・料金" },
      ]}
      crossLinkLead="外国人材の受け入れに必要な在留資格の手続きは、関連事業の四葉行政書士事務所が対応します。"
    >
      <div>
        <ReH2>外国人従業員の社宅も対応できますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          できます。言語・保証会社・入居審査——外国人の住居手配で問題になりやすい3点を、四葉不動産が整理してサポートします。従業員個人のお部屋探しは{" "}
          <Link href="/global" className="text-primary underline">外国人・多言語のお部屋探し</Link>{" "}
          をご覧ください。受け入れに必要な<strong>在留資格の手続き</strong>は、関連事業の四葉行政書士事務所が対応します。
        </p>
        <Placeholder reason="浦松＝社宅・法人賃貸の対応範囲・実績（確定分のみ）" />
      </div>
    </RealestateServicePage>
  );
}
