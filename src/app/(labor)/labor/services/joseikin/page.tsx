// /labor/services/joseikin（型A）＝原稿_社労士 #4
// 【業際】雇用関係助成金＝社労士独占。事業の補助金＝行政書士（C12で分界を明示・launchFlag=SR_LAUNCHED）。
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
    title: "雇用関係助成金の申請｜四葉社会保険労務士事務所",
    description:
      "雇用関係の助成金（キャリアアップ助成金等）の申請を、文京区の四葉社会保険労務士事務所が支援します。要件確認から計画届、支給申請まで。事業の補助金（経済産業省系）は行政書士の領域のため、範囲の違いからご案内します。",
    path: "/labor/services/joseikin",
    keywords: ["助成金 申請 社労士", "キャリアアップ助成金 代行"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LaborServicePage
      slug="joseikin"
      crumbLabel="雇用関係助成金の申請"
      serviceName="雇用関係助成金の申請支援"
      heroAlt="雇用関係助成金の申請のイメージ（申請書類）"
      h1="雇用関係助成金の申請"
      lead={
        <p>
          雇用関係の<strong>助成金</strong>（キャリアアップ助成金など）の申請代行は、<strong>社会保険労務士の独占業務</strong>です。四葉社会保険労務士事務所が、要件確認から計画届・支給申請までを支援します。助成金は「後から要件を満たす」ことができない制度が多く、<strong>雇い入れや制度変更の前に</strong>相談いただくのが鉄則です。
          <Placeholder reason="浦松＝対応する助成金の種類" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "助成金申請の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="事業の補助金（経済産業省系）をお考えの場合は、行政書士の領域です。"
    >
      <div>
        <LaborH2>助成金と補助金は、何が違いますか？</LaborH2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2 w-20"></th>
                <th className="border border-border px-3 py-2">助成金</th>
                <th className="border border-border px-3 py-2">補助金</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left text-ink">所管</th>
                <td className="border border-border px-3 py-2">主に厚生労働省（雇用関係）</td>
                <td className="border border-border px-3 py-2">主に経済産業省（事業）</td>
              </tr>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left text-ink">性質</th>
                <td className="border border-border px-3 py-2">要件を満たせば受給できるものが中心</td>
                <td className="border border-border px-3 py-2">審査で採択・不採択が分かれる</td>
              </tr>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left text-ink">依頼先</th>
                <td className="border border-border px-3 py-2">
                  <strong className="text-text">社会保険労務士</strong>（当事務所）
                </td>
                <td className="border border-border px-3 py-2">
                  <strong className="text-text">行政書士</strong>（四葉行政書士事務所・別事業体）
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          事業の補助金をお考えの場合は →{" "}
          <Link href="/legal/services/subsidy" className="text-primary underline">
            補助金申請サポート（四葉行政書士事務所）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      <div>
        <LaborH2>費用・受任の流れ</LaborH2>
        <p className="mt-2 text-sm">
          → <Link href="/labor/ryokin" className="text-primary underline">助成金申請の料金</Link>／
          <Link href="/labor/nagare" className="text-primary underline">受任の流れ</Link>
          <Placeholder reason="Notion＝料金／浦松＝受任フロー実運用" />
        </p>
      </div>
    </LaborServicePage>
  );
}
