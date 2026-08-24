// /labor/services/joseikin（型A）＝原稿_社労士 #4
// 【業際】雇用関係助成金＝社労士独占。事業の補助金＝行政書士（C12で分界を明示・launchFlag=SR_LAUNCHED）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";

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

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="joseikin"
      crumbLabel="雇用関係助成金の申請"
      serviceName="雇用関係助成金の申請支援"
      heroAlt="雇用関係助成金の申請のイメージ（申請書類）"
      h1="雇用関係助成金の申請"
      lead={
        <>
          <p>
            雇用関係の<strong>助成金</strong>（キャリアアップ助成金など）の申請代行は、<strong>社会保険労務士の独占業務</strong>です。四葉社会保険労務士事務所が、要件確認から計画届・支給申請までを支援します。助成金は「後から要件を満たす」ことができない制度が多く、<strong>雇い入れや制度変更の前に</strong>相談いただくのが鉄則です。
          </p>
          <p className="mt-3">
            <strong>着手金はいただきません。</strong>受給できたときだけ、支給額の20%を成功報酬として申し受けます。不支給だった場合、費用は発生しません。<strong>顧問契約を結んでいる会社さまに限ってお受けします。</strong>
          </p>
        </>
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
          <Link href={addLocalePrefix("/legal/services/subsidy", locale)} className="text-primary underline">
            補助金申請サポート（四葉行政書士事務所）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      <div>
        <LaborH2>いつ相談すればいいですか？</LaborH2>
        <p className="mt-3">
          <strong>人を雇う前、制度を変える前です。</strong>
          助成金は、先に計画を出しておかないと受け取れないものが多いためです。
        </p>
        <p className="mt-3">
          たとえばキャリアアップ助成金の正社員化コースは、
          <strong>キャリアアップ計画を、転換の実施日の前日までに労働局へ提出</strong>していないと、
          それだけで不支給になります。転換したあとで気づいても、遡って出すことはできません。
          計画の期間は3年以上5年以内で設定します。
        </p>
        <p className="mt-3">
          また、<strong>正社員にする前の契約が有期か無期かで、支給額が変わります。</strong>
          パートやアルバイトを迎える時点でどちらにするかが、1年後の金額を決めます。
          <strong>採用の入り口からご相談ください。</strong>
        </p>
      </div>

      <div>
        <LaborH2>受け取れないことがあるのは、どんな場合ですか？</LaborH2>
        <p className="mt-3">先にお伝えしておきます。</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          <li>
            <strong>労働関係法令の違反があると不支給です。</strong>
            実態が雇用なのに業務委託のままになっている、残業代が支払われていない——
            こうした状態のまま申請すると、審査でそこが出ます。
            <strong>是正が先、申請が後</strong>という順序は崩せません。
          </li>
          <li>
            <strong>事業主や取締役の3親等以内の親族は、対象労働者になりません。</strong>
            ご家族を雇う場合は、この点を先に確認します。
          </li>
          <li>
            <strong>不正受給は、返還・違約金・事業主名の公表に加え、申請に関与した社会保険労務士も
            連帯して返還債務を負い、氏名が公表されます。</strong>
            当事務所が要件を満たさない申請をお受けしないのは、このためです。
          </li>
        </ul>
        <p className="mt-4 text-sm text-text-muted">
          ※支給額・要件は年度ごとに改定されます。金額はお見積りの際に、
          申請時点の最新の支給要領で確認したうえでお伝えします。
        </p>
      </div>

      <div>
        <LaborH2>費用・受任の流れ</LaborH2>
        <p className="mt-3">
          <strong>着手金なし ＋ 成功報酬 支給額の20%</strong>（税込）です。顧問契約とセットでお受けします。
          助成金が受け取れなかった場合、成功報酬は発生しません。
        </p>
        <p className="mt-3 text-sm">
          → <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">報酬額表</Link>／
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">ご相談から契約までの流れ</Link>
        </p>
      </div>
    </LaborServicePage>
  );
}
