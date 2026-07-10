// ★参考ページ（型A）＝ /legal/services/subsidy　※原稿_行政書士 #5・共通シェル使用
// 配置＝src/app/(legal)/legal/services/subsidy/page.tsx。
// 【業際】補助金のみ。助成金は「対比教育」として明記（社労士独占）＝自社サービスとして提供しない。
// クロスリンク C11(→/labor/services/joseikin) は SR_LAUNCHED=false の間 getCrossLinks が返さない＝非表示。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "補助金申請サポート｜四葉行政書士事務所",
    description:
      "補助金の事業計画作成・申請を、文京区の四葉行政書士事務所が支援します。元新聞記者の行政書士が、採択のカギとなる「伝わる事業計画書」を作成。雇用関係の助成金は社会保険労務士の領域のため、範囲の違いからご案内します。",
    path: "/legal/services/subsidy",
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LegalServicePage
      slug="subsidy"
      crumbLabel="補助金申請サポート"
      serviceName="補助金の事業計画作成・申請支援"
      heroAlt="補助金申請のイメージ（事業計画書と成長）"
      h1="補助金申請サポート"
      lead={
        <p>
          補助金の申請サポート——事業計画の整理と申請書類の作成——は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所の強みは、<strong>採択のカギを握る「伝わる事業計画書」</strong>です。代表の浦松 丈二は元毎日新聞の記者として34年、事業や人の物語を第三者に伝える文章を書いてきました。審査員に伝わる計画書づくりに、この技術をそのまま使います。
          <Placeholder reason="石井弁護士＝補助金/助成金の業際表現" />
        </p>
      }
      internalLinks={[
        { href: "/legal/ryokin", label: "報酬額表" },
        { href: "/legal/nagare", label: "受任の流れ" },
        { href: "/legal/services/company", label: "会社設立・各種許認可" },
      ]}
    >
      <div>
        <H2>補助金と助成金は何が違いますか？</H2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2"></th>
                <th className="border border-border px-3 py-2">補助金</th>
                <th className="border border-border px-3 py-2">助成金</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <th className="border border-border px-3 py-2 text-left">所管</th>
                <td className="border border-border px-3 py-2">主に経済産業省系</td>
                <td className="border border-border px-3 py-2">主に厚生労働省系（雇用関係）</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left">性質</th>
                <td className="border border-border px-3 py-2">事業計画の審査があり、採択・不採択が分かれる</td>
                <td className="border border-border px-3 py-2">要件を満たせば受給できるものが中心</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left">依頼先</th>
                <td className="border border-border px-3 py-2"><strong>行政書士</strong>（四葉行政書士事務所が対応）</td>
                <td className="border border-border px-3 py-2"><strong>社会保険労務士</strong>の領域</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-text">
          四葉行政書士事務所は現在、<strong>補助金</strong>の申請サポートに対応しています。雇用関係の<strong>助成金</strong>は社会保険労務士の領域です。代表は社会保険労務士試験に合格しており（2026年9月開業予定）、開業後の対応を予定しています。
        </p>
      </div>

      <div>
        <H2>費用・受任の流れ</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">補助金申請サポートの報酬額（報酬額表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href="/legal/nagare" className="text-primary underline">ご相談から完了までの受任の流れ</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
