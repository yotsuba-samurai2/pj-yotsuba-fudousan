// /labor/services/shogu-kaizen（型A・中核）＝原稿_社労士 #2
// クロスリンク＝C10（→/legal/services/shogai-fukushi）・C13相当はkaigo-roumu側。launchFlag=SR_LAUNCHED。
// 制度数値（加算率等）は改定が頻繁なため断定しない（ページ割v2 §2-C コンプラ注意）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
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

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="shogu-kaizen"
      crumbLabel="処遇改善加算のサポート"
      serviceName="処遇改善加算の取得・届出・要件整備サポート"
      heroAlt="処遇改善加算のサポートのイメージ（賃金規程の整備）"
      h1="処遇改善加算のサポート"
      lead={
        <p>
          障害福祉・介護事業所の<strong>処遇改善加算</strong>——その要件整備と手続きは、<strong>社会保険労務士に依頼できます</strong>。四葉社会保険労務士事務所は、加算の前提となる<strong>賃金規程・就業規則の整備</strong>、計画の作成、実績報告のいずれも承ります。処遇改善加算は「届を出せば終わり」ではなく、<strong>賃金体系との整合が問われる制度</strong>です。就業規則と賃金の専門家である社労士が関わる意味は、ここにあります。
          <Placeholder reason="浦松＝対応する加算区分・サービス種別" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "処遇改善加算サポートの料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="指定申請・体制届の書類作成は四葉行政書士事務所が別の契約で受任します。当事務所が承るのは賃金・労務の側です。"
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
        {/* ★2026-08-13 書き換え。旧文は「四葉では、案件の内容に応じて適切な資格者が
            担当する体制をとっています」だったが、これは一体提供に読まれる。
            四葉の方針は「別事業体として個別に受任」で、料金表にもそう明記している。
            コラム 01-shogu-kaizen-dochira が「2つの契約に分かれます」と正しく書いており、
            そちらに揃えた。 */}
        <p className="mt-3 leading-relaxed text-text">
          <strong>工程で分かれます。</strong>
          処遇改善加算は「賃金を上げること」と「上げたと届け出ること」の2つでできていて、
          この2つは<strong>別々の法律の管轄</strong>に入るためです。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">工程</th>
                <th className="border border-border px-3 py-2 w-32">担当</th>
                <th className="border border-border px-3 py-2">根拠</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <td className="border border-border px-3 py-2">
                  就業規則・賃金規程・キャリアパス要件などの<strong className="text-text">賃金制度の設計</strong>、
                  <strong className="text-text">賃金改善額の算定</strong>
                </td>
                <td className="border border-border px-3 py-2">
                  <strong className="text-text">社会保険労務士</strong><br />（当事務所）
                </td>
                <td className="border border-border px-3 py-2">
                  社会保険労務士法 第2条第1項第3号（労務管理その他の労働に関する事項についての相談・指導）
                </td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">
                  加算体制届・計画書・実績報告書など、
                  <strong className="text-text">指定権者（自治体）へ提出する書類の作成</strong>
                </td>
                <td className="border border-border px-3 py-2">
                  <strong className="text-text">行政書士</strong><br />（四葉行政書士事務所）
                </td>
                <td className="border border-border px-3 py-2">
                  行政書士法 第1条の2第1項（官公署に提出する書類の作成）
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-text">
          <strong>ひとつの事務所が両方を名乗ることはできません。</strong>
          両方をご依頼いただく場合は、<strong>四葉社会保険労務士事務所と四葉行政書士事務所に、
          それぞれ別々にご契約いただく</strong>形になります。同じ代表者が営んでいますが、
          別の事業体です。<strong>事務所間で紹介料の授受は行いません。</strong>
          当事務所へのご依頼が、行政書士事務所へのご依頼の条件になることもありません。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          ウェブで検索すると、社会保険労務士事務所も行政書士事務所も、どちらも「処遇改善加算に対応します」と
          書いています。矛盾しているように見えますが、それぞれ違う工程を指しているだけです。
          くわしくは{" "}
          <Link
            href={addLocalePrefix("/labor/column/shogu-kaizen-sharoushi-gyoseishoshi-dochira", locale)}
            className="text-primary underline"
          >
            処遇改善加算は、社労士と行政書士のどちらに頼むのか
          </Link>{" "}
          に書いています。
          <Placeholder reason="石井弁護士＝業際の整理について確認継続中（2026-08-13：コラムの断定に合わせて記載。確認後に見直す）" />
        </p>
      </div>

      <div>
        <LaborH2>費用・受任の流れ</LaborH2>
        <p className="mt-3">
          <strong>賃金要件の設計・算定支援は、お見積りとしています。</strong>
          事業所の規模、サービス種別、既存の賃金規程がどこまで整っているかで作業量が大きく変わるためです。
          <strong>金額は着手前に書面でお出しします。</strong>
          就業規則・賃金規程の作成は、報酬額表の単価どおりに申し受けます。
        </p>
        <p className="mt-3">
          手続きと給与計算は <strong>freee人事労務</strong> で行い、顧問先と
          <strong>同じデータを見ながら</strong>進めます。賃金改善額の算定は、
          給与計算のデータをそのまま使えるため、資料を作り直していただく必要がありません。
        </p>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">報酬額表</Link>
          ／{" "}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">ご相談から契約までの流れ</Link>
        </p>
      </div>
    </LaborServicePage>
  );
}
