// /labor/services/shogu-kaizen（型A・中核）＝原稿_社労士 #2
// クロスリンク＝C10（→/legal/services/shogai-fukushi）・C13相当はkaigo-roumu側。launchFlag=SR_LAUNCHED。
// 制度数値（加算率等）は改定が頻繁なため断定しない（ページ割v2 §2-C コンプラ注意）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "処遇改善加算のサポート｜四葉社会保険労務士事務所",
    description:
      "障害福祉・介護事業所の処遇改善加算の取得・届出・要件整備を、文京区の四葉社会保険労務士事務所が支援します。賃金規程・就業規則の整備から計画・実績報告まで。複雑な加算の要件を整理し、事業所の収入と職員の待遇改善を両立させます。",
    path: "/labor/services/shogu-kaizen",
    keywords: ["処遇改善加算 社労士", "処遇改善加算 届出 依頼", "障害福祉 処遇改善加算"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LaborServicePage
      slug="shogu-kaizen"
      crumbLabel="処遇改善加算のサポート"
      serviceName="処遇改善加算の取得・届出・要件整備サポート"
      heroAlt="処遇改善加算のサポートのイメージ（賃金規程の整備）"
      h1="処遇改善加算のサポート"
      lead={
        <p>
          障害福祉・介護事業所の<strong>処遇改善加算</strong>——その要件整備と手続きは、<strong>社会保険労務士に依頼できます</strong>。四葉社会保険労務士事務所は、加算の前提となる<strong>賃金規程・就業規則の整備</strong>から、計画の作成、実績報告までを一体で支援します。処遇改善加算は「届を出せば終わり」ではなく、<strong>賃金体系との整合が問われる制度</strong>です。就業規則と賃金の専門家である社労士が関わる意味は、ここにあります。
          <Placeholder reason="浦松＝対応する加算区分・サービス種別" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "処遇改善加算サポートの料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="指定申請・体制届は行政書士の領域です——指定が取れたら次は「人」。両輪で進められます。"
    >
      <div>
        <LaborH2>処遇改善加算は、何をすれば取れますか？</LaborH2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          一般的な流れは次のとおりです（制度の詳細は改定が多いため、最新の告示・通知にもとづきご案内します）。
        </p>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li><strong>1. 現状整理</strong>：賃金体系・キャリアパス・研修体制の現状を確認</li>
          <li><strong>2. 規程整備</strong>：就業規則・賃金規程を加算の要件に合わせて整備</li>
          <li><strong>3. 計画の作成・届出</strong>：処遇改善計画を作成し、期限までに届出</li>
          <li><strong>4. 実行と記録</strong>：計画どおりの賃金改善を実施・記録</li>
          <li><strong>5. 実績報告</strong>：年度終了後に実績を報告</li>
        </ol>
        <Placeholder reason="浦松＝実務の対応範囲（どこまで代行し、どこを事業所側が行うか）" />
      </div>

      <div>
        <LaborH2>加算の届出は、行政書士と社労士のどちらに頼むのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          処遇改善加算は、指定関係の届出（行政書士の領域）と、賃金・就業規則（社会保険労務士の領域）が重なり合う分野です。<strong>四葉では、案件の内容に応じて適切な資格者が担当する体制</strong>をとっています。個別のご相談時に、どちらが担当するかを明確にしてご案内します。
          <Placeholder reason="石井弁護士＝処遇改善加算の行政書士／社労士の業際（両サイトで断定しない方針の最終文言）" />
        </p>
      </div>

      <div>
        <LaborH2>費用・受任の流れ</LaborH2>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href="/labor/ryokin" className="text-primary underline">処遇改善加算サポートの料金</Link>
        </p>
        <p className="mt-1 text-sm">
          →{" "}
          <Link href="/labor/nagare" className="text-primary underline">ご相談から契約までの流れ</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LaborServicePage>
  );
}
