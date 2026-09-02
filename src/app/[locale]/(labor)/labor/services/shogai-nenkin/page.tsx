// /labor/services/shogai-nenkin（型A）＝原稿_社労士_障害年金ページ_v0.1.md（2026-07-10作成）の実装。
// 本ページだけ他の労務ページと客層が違う：B2C（ご本人・ご家族）で顧問契約を前提としない。
// 料金の正本＝/labor/ryokin の「障害年金（個人のお客さま）」セクション（着手金30,000円＋成功報酬 年金3ヶ月分）。
// 法令＝社会保険労務士法（昭和43年法律第89号）第2条第1項第1号・第1号の2、第27条。
//   2026-09-02 e-Gov法令検索API（法令ID 343AC1000000089）でXMLを直接取得し条文を確認。
//   表記は /labor/ryokin と揃えて「社会保険労務士の業務です」とし、業務独占を断定する語は用いない
//   （石井弁護士の確認前。断定表現を避ける＝shigyo-compliance-gate 第1条）。
// 年金額・等級表・遡及請求の時効は書かない（改定・未検証のため。原稿の【未検証】3件に対応）。
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
    title: "障害年金の裁定請求｜四葉社会保険労務士事務所",
    description:
      "障害年金（障害基礎年金・障害厚生年金）の裁定請求を、文京区の四葉社会保険労務士事務所が承ります。請求書類の作成・提出代行は社会保険労務士の業務です。ご本人・ご家族から直接お受けし、顧問契約は必要ありません。初診日の証明から請求・結果確認までお手伝いします。中国語・英語に対応します。",
    path: "/labor/services/shogai-nenkin",
    keywords: [
      "障害年金 申請 社労士",
      "障害年金 裁定請求 代行",
      "障害年金 文京区",
      "親なき後 障害年金",
      "障害年金 中国語 相談",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="shogai-nenkin"
      crumbLabel="障害年金の裁定請求"
      serviceName="障害年金の裁定請求のサポート"
      heroAlt="障害年金の裁定請求のイメージ（年金請求の書類）"
      h1="障害年金の裁定請求"
      lead={
        <p>
          障害年金の<strong>裁定請求（年金を受け取るための請求手続き）の書類作成・提出代行は、社会保険労務士の業務です</strong>
          （社会保険労務士法第2条第1項第1号・第1号の2、第27条）。四葉社会保険労務士事務所（東京都文京区小日向）は、障害のあるご本人と、そのご家族からのご依頼を
          <strong>直接お受けします。顧問契約は必要ありません。</strong>
          必要書類の整理から請求、結果の確認までお手伝いします。
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "障害年金の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/faq", label: "よくある質問" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="ご家族の備えは、年金のほかに法的な手続きと住まいが関わります。それぞれ四葉行政書士事務所・四葉不動産株式会社が別の契約で受任します。"
    >
      <div>
        <LaborH2>障害年金とは、どんな制度ですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          病気やけがで生活や仕事に支障がある方が受け取れる公的年金です。加入していた制度によって2種類に分かれます。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  種類
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  対象となる方の目安
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  障害基礎年金（国民年金）
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  初診日に国民年金に加入していた方、20歳前に初診日がある方 など
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  障害厚生年金（厚生年金）
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  初診日に厚生年金に加入していた（会社員等の）方
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          受給には、初診日の特定、保険料の納付要件、障害の状態が認定基準に該当すること——の確認が必要です。知的障害・発達障害・精神障害も対象になり得ます。
          等級・年金額・認定基準は日本年金機構の最新の取り扱いによります。年度により改定されるため本ページには金額を記載していません。個別の受給可否は、ご相談のうえ資格者が整理します。
        </p>
      </div>

      <div>
        <LaborH2>申請は誰に頼めますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          社会保険労務士でない者は、報酬を得て、労働社会保険諸法令に基づく申請書等の作成と提出手続の代行を業として行うことができません（社会保険労務士法第27条）。関わる専門家の役割は次のとおりです。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>請求手続きの書類作成・提出代行</strong>＝社会保険労務士（当事務所）
          </li>
          <li>
            <strong>診断書の作成</strong>＝医師（当事務所は、日常生活の状況を医師にお伝えいただく形に整理するお手伝いをします）
          </li>
          <li>
            <strong>遺言・任意後見・各種契約</strong>＝行政書士（四葉行政書士事務所・別事業体・別契約）
          </li>
          <li>
            <strong>争いのある事案・訴訟</strong>＝弁護士（おつなぎします。紹介料の授受は行いません）
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          障害年金の請求は、書類を提出すれば終わりという手続きではありません。
          <strong>初診日の証明と、障害の状態を書面で正確に伝えること</strong>
          が要になります。元新聞記者として34年、事実を整理して伝わる形にする仕事をしてきた代表が、この書類づくりを担います。
        </p>
      </div>

      <div>
        <LaborH2>顧問契約がなくても頼めますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          はい。当事務所は法人・個人事業主のお客さまには顧問契約を前提としていますが、
          <strong>障害年金は個人のお客さま向けのため、顧問契約は不要です</strong>
          。ご本人・ご家族から直接お受けします。初回のご相談は無料です。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          料金は
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            料金ページ
          </Link>
          の「障害年金（個人のお客さま）」に掲載しています。着手金と成功報酬の額は税込です。診断書料等の実費は別途申し受けます。
        </p>
      </div>

      <div>
        <LaborH2>「親なき後」の備えとして、何ができますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          障害のあるお子さまの将来を考えるとき、お金・法的な備え・住まいは切り離せません。四葉グループは、この3つを別々の事業体が担当します。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>障害年金の請求</strong>＝四葉社会保険労務士事務所（当事務所）
          </li>
          <li>
            <strong>遺言・任意後見・各種契約</strong>＝四葉行政書士事務所
          </li>
          <li>
            <strong>グループホーム等の住まい</strong>＝四葉不動産株式会社
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          3つはそれぞれ独立した事業体として、別々にご契約いただきます。料金・請求・お振込先も事務所ごとに分かれます。事業体の間で紹介料の授受は行いません。
          <Placeholder reason="浦松＝親なき後の訴求の濃度" />
        </p>
      </div>

      <div>
        <LaborH2>中国語や英語でも相談できますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          はい。代表は元毎日新聞中国総局長として中国や台湾、タイに駐在し、中国語（繁体字・簡体字）と英語に対応します。
          日本の年金制度に加入していた外国籍の方や、ご家族が日本語での書類のやり取りに不安をお持ちの場合も、同じ窓口でご相談を承ります。
        </p>
      </div>

      <div>
        <LaborH2>依頼するとき、どんな流れになりますか？</LaborH2>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>1. ご相談（初回無料・オンライン可）</li>
          <li>2. 受給の可能性の整理とお見積り</li>
          <li>3. ご契約</li>
          <li>4. 書類の収集・作成（初診日の証明、病歴・就労状況等の整理、診断書の依頼のお手伝い）</li>
          <li>5. 裁定請求（提出代行）</li>
          <li>6. 結果の確認とその後のご相談</li>
        </ol>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          詳しくは
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            ご相談から契約までの流れ
          </Link>
          をご覧ください。
          <Placeholder reason="浦松＝面談回数・標準期間・不支給時の受任範囲（再請求／審査請求）" />
        </p>
      </div>
    </LaborServicePage>
  );
}
