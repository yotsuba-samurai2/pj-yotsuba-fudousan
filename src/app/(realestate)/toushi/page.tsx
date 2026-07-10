// /toushi（型A・柱Bピラー）＝原稿_不動産 #2
// クロスリンク＝C3（→/legal/services/shogai-fukushi）がpathで自動表示（独立受任注記付き）。
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
    title: "投資用・事業用不動産｜文京区の四葉不動産",
    description:
      "四葉不動産株式会社が、投資用・事業用の不動産を扱います。グループホーム・障害福祉事業所に使える物件、社宅・法人賃貸、収益物件を、事業の目的から逆算してご提案。物件確保からその後の手続きまで見据えて相談できるのが特長です。",
    path: "/toushi",
    keywords: ["事業用 不動産 文京区", "グループホーム 物件", "収益物件 東京"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <RealestateServicePage
      path="/toushi"
      crumbs={[{ name: "ホーム", href: "/" }, { name: "投資用・事業用不動産" }]}
      serviceName="投資用・事業用不動産の仲介・提案"
      heroSrc="/hero/realestate-toushi-16x9.webp"
      heroAlt="投資用・事業用不動産のイメージ（一棟収益物件）"
      h1="投資用・事業用不動産"
      lead={
        <p>
          四葉不動産株式会社は、<strong>投資用・事業用の不動産</strong>を扱います。中心は3つ——<strong>グループホーム（障害福祉事業所）に使える物件</strong>、<strong>社宅・法人賃貸</strong>、<strong>収益物件</strong>です。共通するのは「物件そのもの」ではなく<strong>事業の目的から逆算して選ぶ</strong>こと。用途に合わない物件は、安くても高い買い物になります。四葉不動産は、目的・要件・収支の順に整理してご提案します。
        </p>
      }
      internalLinks={[
        { href: "/toushi/group-home", label: "グループホーム物件" },
        { href: "/toushi/shataku", label: "社宅・法人賃貸" },
        { href: "/access", label: "アクセス・料金" },
      ]}
      crossLinkLead="グループホームの開設には、物件のほかに事業者指定の申請が必要です。指定申請は関連事業の四葉行政書士事務所が扱います。"
    >
      <div>
        <ReH2>どんな投資・事業用不動産を扱っていますか？</ReH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>グループホーム・障害福祉事業所向け物件</strong>——指定基準を見据えた物件選び →{" "}
            <Link href="/toushi/group-home" className="text-primary underline">グループホームに使える物件探し</Link>
          </li>
          <li>
            <strong>社宅・法人賃貸</strong>——外国人従業員の住居手配も多言語で →{" "}
            <Link href="/toushi/shataku" className="text-primary underline">社宅・法人賃貸のサポート</Link>
          </li>
          <li>
            <strong>収益物件（区分・一棟）</strong>
            <Placeholder reason="浦松＝収益物件の対応範囲" />
          </li>
          <li>
            対応エリア
            <Placeholder reason="浦松＝対応エリアの確定" />
          </li>
        </ul>
      </div>

      <div>
        <ReH2>なぜ四葉不動産に相談するのですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          理由は「隣」にあります。グループホームの開設には物件のほかに<strong>事業者指定の申請</strong>が、外国人従業員の受け入れには<strong>在留資格</strong>が必要です。四葉不動産の関連事業には、これらを扱う四葉行政書士事務所があるため、<strong>物件確保からその後の手続きまでを見据えた相談</strong>が一つの窓口でできます。
        </p>
      </div>

      <div>
        <ReH2>費用について</ReH2>
        <p className="mt-3 text-sm leading-relaxed text-text">
          売買・賃貸の仲介手数料は、宅地建物取引業法の定めの範囲によります（一般情報）。詳細は{" "}
          <Link href="/access" className="text-primary underline">アクセス・料金</Link> へ。
          <Placeholder reason="Notion＝料金の掲載範囲" />
        </p>
      </div>
    </RealestateServicePage>
  );
}
