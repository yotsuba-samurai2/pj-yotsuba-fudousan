// /labor/services/saiyo（型A）＝募集・採用の労務
// 2026-08-14 新設。料金表 /labor/ryokin の2列から導出（luck428-column-seo 第7条）：
//   やる＝「募集・採用コンサルタント」（一式・お見積り）
//   やらない＝「求職者の紹介・あっせん、応募者の面接代行、求人媒体の運用代行」→「取り扱っておりません」
// ★境界の根拠＝職業安定法第4条第1項（職業紹介の定義）・第30条第1項（有料職業紹介は厚生労働大臣の許可）。
//   2026-08-14 に e-Gov 法令検索API（法令ID 322AC0000000141）で条文を直接確認済み。
// クロスリンク＝C15（→/legal/services/visa・/shataku）がpathで自動（launchFlag=SR_LAUNCHED）。
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
    title: "募集・採用の労務｜四葉社会保険労務士事務所",
    description:
      "求人票の労働条件の明示、選考から内定までの書面、入社時の手続き、採用に絡む助成金を、文京区の四葉社会保険労務士事務所が承ります。求職者の紹介・あっせんは取り扱っておりません。留学生や外国人の採用では、在留資格の申請を四葉行政書士事務所が別契約で受任します。",
    path: "/labor/services/saiyo",
    keywords: ["募集 採用 社労士", "求人票 労働条件 明示", "留学生 採用 入社日"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="saiyo"
      crumbLabel="募集・採用の労務"
      serviceName="募集・採用の労務サポート"
      heroAlt="募集・採用の労務のイメージ（面接の場面）"
      h1="募集・採用の労務"
      lead={
        <p>
          求人票に書く<strong>労働条件の明示</strong>、選考から内定までの書面、入社時の手続き、採用に絡む
          <strong>助成金</strong>——ここは社会保険労務士の領域です。一方、
          <strong>求職者の紹介・あっせんは取り扱っておりません。</strong>
          有料の職業紹介は、厚生労働大臣の許可を受けた事業者でなければ行えないためです。
          どこまでをお引き受けし、どこからをおつなぎするかを、このページに書きます。
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "募集・採用の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/joseikin", label: "雇用関係助成金の申請" },
        { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務" },
      ]}
      crossLinkLead="在留資格の申請は四葉行政書士事務所、住まいの手配は四葉不動産株式会社、採用後の労務は当事務所が、それぞれ別の契約で受任します。"
    >
      <div>
        <LaborH2>採用のどこからどこまでを、お願いできますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>「人を決める」ところは扱いません。「決めたあと」と「決める前の条件づくり」を扱います。</strong>
          料金表の区分をそのまま表にしました。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  内容
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  四葉の取り扱い
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  求人票・募集要項の労働条件の整理
                </th>
                <td className="border border-border px-3 py-2 text-text">承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  労働条件通知書・雇用契約書の作成
                </th>
                <td className="border border-border px-3 py-2 text-text">承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  内定通知書・誓約書の整備、試用期間の設計
                </th>
                <td className="border border-border px-3 py-2 text-text">承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  入社時の社会保険・雇用保険の手続き
                </th>
                <td className="border border-border px-3 py-2 text-text">承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  採用に絡む雇用関係助成金
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  承ります（顧問先限定）
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  <strong>求職者の紹介・あっせん</strong>
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>取り扱っておりません</strong>
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  <strong>応募者の面接代行</strong>
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>取り扱っておりません</strong>
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  <strong>求人媒体の運用代行</strong>
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>取り扱っておりません</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            報酬額表（募集・採用コンサルタントは一式・お見積り）
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>なぜ「紹介」だけ、お願いできないのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          許可が要る事業だからです。職業安定法は「職業紹介」を
          <strong>「求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあつせんすること」</strong>
          と定めており（同法第4条第1項）、これを有料で行うには
          <strong>厚生労働大臣の許可</strong>が必要です（同法第30条第1項）。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          当事務所はこの許可を受けていません。したがって、
          <strong>「良い人を探してきてほしい」というご依頼にはお応えできません。</strong>
          人材紹介会社や求人媒体は、この許可や届出のうえで事業をしています。
          <strong>役割が違うので、比べるものではありません。</strong>
          当事務所がお引き受けするのは、<strong>採用した人との関係を、書面と手続きで整えるところ</strong>です。
        </p>
      </div>

      <div>
        <LaborH2>求人票には、何を書かなければなりませんか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          募集の段階で、<strong>従事すべき業務の内容、賃金、労働時間その他の労働条件</strong>を明示する義務があります（職業安定法第5条の3第1項）。
          これは<strong>入社時の労働条件の明示（労働基準法第15条）とは別の義務</strong>です。
          「求人票は広告だから、細かいことは面接で」という運用は、この2つを1つだと思っているところから起きます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          そして<strong>求人票と実際の労働条件がずれると、あとで説明を求められます。</strong>
          入社してすぐの離職は、この食い違いから始まることが少なくありません。
          求人票を出す前に一度見せていただくのが、いちばん手戻りの少ない頼み方です。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※職業安定法施行規則で定める明示事項の詳細、および令和4年の改正で追加された事項は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>）。実際の記載事項は面談のうえご案内します。
        </p>
      </div>

      <div>
        <LaborH2>外国人を採用するときは、誰に何を頼みますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>入口（在留資格）＝行政書士、採用後（労務・社会保険）＝社会保険労務士、住まい＝宅地建物取引業者</strong>
          です。ひとりを迎えるだけでも、担当する資格が3つに分かれます。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  やること
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
                  在留資格の変更・認定の申請
                </th>
                <td className="border border-border px-3 py-2 text-text">行政書士（申請取次）</td>
                <td className="border border-border px-3 py-2 text-text">
                  四葉行政書士事務所が別契約で受任
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  労働条件通知書・雇用契約書
                </th>
                <td className="border border-border px-3 py-2 text-text">社会保険労務士</td>
                <td className="border border-border px-3 py-2 text-text">当事務所が承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  外国人雇用状況の届出
                </th>
                <td className="border border-border px-3 py-2 text-text">社会保険労務士</td>
                <td className="border border-border px-3 py-2 text-text">当事務所が承ります</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  社宅・住まいの手配
                </th>
                <td className="border border-border px-3 py-2 text-text">宅地建物取引業者</td>
                <td className="border border-border px-3 py-2 text-text">
                  四葉不動産株式会社が別契約で受任
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm">
          →{" "}
          <Link
            href={addLocalePrefix("/legal/services/gaikokujin-shain", locale)}
            className="text-primary underline"
          >
            外国人社員を海外から迎えるとき（四葉行政書士事務所）
          </Link>
          ／
          <Link href={addLocalePrefix("/shataku", locale)} className="text-primary underline">
            借り上げ社宅の導入（四葉不動産）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします。契約・請求・お振込先も分かれます（紹介料等の授受はありません）。必要な部分だけをご依頼いただけます。
        </p>
      </div>

      <div>
        <LaborH2>留学生を4月1日入社にできますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>在留資格の変更が許可されるまでは、働いてもらえません。</strong>
          内定を出しただけでは足りず、「留学」から就労できる在留資格への変更が必要です。
          申請から許可までに時間がかかるため、<strong>入社日に間に合わないことがあります。</strong>
        </p>
        <p className="mt-3 leading-relaxed text-text">
          当事務所がお引き受けするのは、<strong>許可が下りるまでの労務の設計</strong>です。
          内定通知書に何を書いておくか、入社日をいつに置くか、許可が遅れたときに待機期間をどう扱うか——ここは労働契約の問題です。
          <strong>在留資格の該当性を判断するのは出入国在留管理庁で、申請は四葉行政書士事務所（別契約）が承ります。</strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※変更許可申請の受付開始時期と標準処理期間は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>）。日程は出入国在留管理庁の公表資料をもとに、面談のうえご案内します。
        </p>
      </div>

      <div>
        <LaborH2>四葉社会保険労務士事務所は、何ができますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>採用の「前」と「後」を、書面と手続きで支えます。</strong>
          前は求人票の労働条件と募集要項の整理、後は労働条件通知書・雇用契約書・内定通知書の作成と、入社時の社会保険・雇用保険の手続きです。
          採用に絡む雇用関係助成金は、顧問契約をいただいている場合にお引き受けします。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          代表は<strong>中国語と英語に対応</strong>します。外国人を採用する場面では、労働条件を本人に説明するところまでを、外部の翻訳会社を挟まずに行えます。元新聞記者として中国総局長を務め、中国や台湾、タイに駐在しました。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          <strong>ご相談は初回・2回目以降とも無料です。</strong>
          「求人票を出す前に見てほしい」「内定を出す前に条件を固めたい」という段階でお声がけください。
          出したあとに直すより、出す前に決めておくほうが早く済みます。
        </p>
        <p className="mt-3 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            報酬額表
          </Link>
          ／
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            ご相談から契約までの流れ
          </Link>
          ／
          <Link href={addLocalePrefix("/labor/contact", locale)} className="text-primary underline">
            お問い合わせ
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>このページの根拠</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          <li>
            職業紹介の定義＝職業安定法（昭和22年法律第141号）第4条第1項。「求人及び求職の申込みを受け、求人者と求職者との間における雇用関係の成立をあつせんすること」
          </li>
          <li>有料の職業紹介事業の許可＝同法第30条第1項</li>
          <li>募集の際の労働条件等の明示＝同法第5条の3第1項</li>
          <li>労働契約の締結に際しての労働条件の明示＝労働基準法（昭和22年法律第49号）第15条、同施行規則第5条</li>
          <li>外国人雇用状況の届出＝労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律（昭和41年法律第132号）第28条第1項</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※職業安定法の各条文は、2026年8月14日に e-Gov 法令検索で確認しました。職業安定法施行規則の明示事項、労働基準法施行規則第5条の最終改正、在留資格変更許可申請の標準処理期間は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>）。
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。
        </p>
      </div>
    </LaborServicePage>
  );
}
