// /labor/services/gaikokujin-koyo（型A）＝原稿_社労士 #5
// クロスリンク＝C14（→/legal/services/visa・/shataku）がpathで自動（launchFlag=SR_LAUNCHED）。
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
    title: "外国人雇用の労務｜四葉社会保険労務士事務所",
    description:
      "外国人（介護・育成就労）の雇用に伴う労務・社会保険手続きを、文京区の四葉社会保険労務士事務所が承ります。日本語・英語・中国語（繁体字・簡体字）に対応。2027年4月施行の育成就労制度への受入準備も。在留資格の申請書類は四葉行政書士事務所が別契約で受任します。",
    path: "/labor/services/gaikokujin-koyo",
    keywords: ["外国人 雇用 社労士", "育成就労 受入 準備", "介護 外国人材 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="gaikokujin-koyo"
      crumbLabel="外国人雇用（介護・育成就労）の労務"
      serviceName="外国人雇用（介護・育成就労）の労務・社会保険サポート"
      heroAlt="外国人雇用の労務のイメージ（多国籍の介護スタッフ）"
      h1="外国人雇用（介護・育成就労）の労務"
      lead={
        <p>
          外国人——とくに介護分野・育成就労——の雇用に伴う<strong>労務・社会保険手続き</strong>は、社会保険労務士に依頼できます。四葉社会保険労務士事務所は、雇用契約・社会保険・労働条件の説明を<strong>日本語・英語・中国語（繁体字・簡体字）</strong>で支援できるのが特長です。<strong>2027年4月施行の育成就労制度</strong>への受入準備にも対応します。
          <Placeholder reason="浦松＝育成就労対応の範囲" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "外国人雇用の労務の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="在留資格の申請は四葉行政書士事務所、住まいの手配は四葉不動産株式会社、雇用後の労務は当事務所が、それぞれ別の契約で受任します。"
    >
      <div>
        <LaborH2>在留資格と労務は、どう分担するのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>入口（在留資格の申請）＝行政書士、入社後（労務・社会保険）＝社会保険労務士</strong>です。四葉では、在留資格の申請書類を四葉行政書士事務所が、雇用後の労務を当事務所が承ります。住まいの手配は四葉不動産株式会社が多言語で対応します。<strong>3事務所はそれぞれ別の契約で受任し</strong>、料金・請求も分かれます。必要な部分だけをご依頼いただけます。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/services/visa", locale)} className="text-primary underline">
            在留資格・ビザ申請（四葉行政書士事務所）
          </Link>
          ／
          <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">
            借り上げ社宅の導入（四葉不動産）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      {/* 2026-07-29追加：指示書11 第4章D（D1〜D5）への回答 */}
      <div>
        <LaborH2>入管への届出と労働局への届出は、別のものですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          別のものです。<strong>提出先も、期限も、担当する資格も分かれます。</strong>
          どちらか一方を出せば足りるというものではありません。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  手続き
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  提出先
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  担当する資格
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  四葉の取り扱い
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  在留資格の申請・変更・更新
                </th>
                <td className="border border-border px-3 py-2 text-text">出入国在留管理庁</td>
                <td className="border border-border px-3 py-2 text-text">行政書士（申請取次）</td>
                <td className="border border-border px-3 py-2 text-text">
                  四葉行政書士事務所が別契約で受任
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  外国人雇用状況の届出
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  ハローワーク（公共職業安定所）
                </td>
                <td className="border border-border px-3 py-2 text-text">社会保険労務士</td>
                <td className="border border-border px-3 py-2 text-text">当事務所が承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  雇用保険の資格取得届
                </th>
                <td className="border border-border px-3 py-2 text-text">ハローワーク</td>
                <td className="border border-border px-3 py-2 text-text">社会保険労務士</td>
                <td className="border border-border px-3 py-2 text-text">当事務所が承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  健康保険・厚生年金の資格取得届
                </th>
                <td className="border border-border px-3 py-2 text-text">年金事務所</td>
                <td className="border border-border px-3 py-2 text-text">社会保険労務士</td>
                <td className="border border-border px-3 py-2 text-text">当事務所が承ります</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※各届出の期限日数は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>）。実際の期限は面談のうえご案内します。
        </p>
      </div>

      <div>
        <LaborH2>在留資格の申請と社会保険の届出は、同じ人に頼めますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          資格が違うため、<strong>同じ契約にまとめることはできません。</strong>
          在留資格の申請取次は行政書士、労働・社会保険の手続きは社会保険労務士の業務です。四葉では前者を四葉行政書士事務所が、後者を当事務所が、
          <strong>それぞれ別の契約で</strong>
          受任します。契約書・請求書・お振込先も分かれます。必要な部分だけをご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。
        </p>
      </div>

      <div>
        <LaborH2>技能実習・特定技能の外国人にも、社会保険は適用されますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          社会保険の適用は、在留資格の種類ではなく<strong>働き方（勤務時間・日数）と事業所の要件</strong>
          で判断されるのが一般的な取り扱いです。国籍や在留資格を理由に適用が除外される仕組みにはなっていません。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          ただし、母国の社会保障制度との二重加入を調整する社会保障協定が結ばれている国の方については、取り扱いが異なる場合があります。協定の締結国と適用の条件は個別の確認が必要です（
          <strong>未検証</strong>）。
        </p>
      </div>

      <div>
        <LaborH2>外国人社員の就業規則は、多言語にする必要がありますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          法令上、就業規則を外国語に翻訳することが義務づけられているわけではありません。ただし就業規則は
          <strong>周知して初めて効力を持つ</strong>
          とされており（労働基準法第106条第1項）、内容を理解できない言語でのみ掲示している状態は、周知として十分かどうかが問われる場面があります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          当事務所は、日本語・英語・中国語（繁体字・簡体字）で内容をご説明できます。代表が中国語と英語に対応するため、外部の翻訳会社を挟みません。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          翻訳・翻訳証明は行政書士や社会保険労務士の独占業務ではありません。公的機関へ提出する書類の翻訳が必要な場合は、内容に応じて別途ご相談ください。
        </p>
      </div>

      <div>
        <LaborH2>このページの根拠</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          <li>外国人雇用状況の届出＝労働施策総合推進法（昭和41年法律第132号）</li>
          <li>就業規則の周知＝労働基準法（昭和22年法律第49号）第106条第1項</li>
          <li>
            社会保険の適用＝健康保険法（大正11年法律第70号）、厚生年金保険法（昭和29年法律第115号）
          </li>
          <li>雇用保険の届出＝雇用保険法（昭和49年法律第116号）</li>
          <li>育成就労制度＝2027年4月施行予定</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※各法令の最終改正日、届出の期限日数、社会保障協定の締結国は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>）。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。
        </p>
      </div>
    </LaborServicePage>
  );
}
