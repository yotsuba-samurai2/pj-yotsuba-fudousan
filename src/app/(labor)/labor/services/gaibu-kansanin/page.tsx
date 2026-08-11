// /labor/services/gaibu-kansanin（型A）＝2026-08-11 新規。設計＝61_外部監査人_導線設計.md
// ★「相談先を尋ねる型」（luck428-column-seo 第7条：引用12/13・名指し11/13の型）。
// 業際：監理支援機関の許可申請書類の作成は四葉行政書士事務所。当事務所は外部監査人の就任のみ。
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
    title: "外部監査人｜四葉社会保険労務士事務所",
    description:
      "育成就労制度では監理支援機関に外部監査人の設置が義務づけられます。四葉社会保険労務士事務所（文京区小日向・茗荷谷駅徒歩5分）が外部監査人をお引き受けします。代表は監理責任者等講習を修了済み。要件・頻度・費用と、当事務所が取り扱わない範囲を整理しました。",
    path: "/labor/services/gaibu-kansanin",
    keywords: ["外部監査人 誰に頼む", "育成就労 監理支援機関 外部監査人", "外部監査人 社労士"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="gaibu-kansanin"
      crumbLabel="外部監査人"
      serviceName="監理支援機関の外部監査人の受託"
      heroAlt="外部監査人のイメージ（書類を確認する専門家）"
      h1="外部監査人"
      lead={
        <p>
          育成就労制度では、<strong>監理支援機関に外部監査人の設置が義務づけられます</strong>
          。技能実習制度で認められていた指定外部役員による方式は選べなくなります。四葉社会保険労務士事務所が外部監査人をお引き受けします。代表は
          <strong>監理責任者等講習を2026年7月10日に修了</strong>しています。
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "外部監査人の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務" },
      ]}
      crossLinkLead="監理支援機関の許可申請書類の作成は四葉行政書士事務所、外部監査人の就任は当事務所が、それぞれ別の契約で受任します。"
    >
      <div>
        <LaborH2>外部監査人は誰に頼めばよいのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          外部監査人になれるのは、<strong>監理支援機関と密接な関係を持たず</strong>、かつ
          <strong>主務大臣が認めた養成講習を過去3年以内に修了した人</strong>
          です。実務では社会保険労務士や行政書士が就任することが一般的です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          監査の中身は、<strong>監理・監査の業務が適正に行われているかの確認</strong>
          です。確認の対象になるのは労働時間・賃金・安全衛生・住環境といった労働関係法令の遵守状況であり、
          <strong>労務そのもの</strong>です。当事務所が社会保険労務士としてお引き受けするのは、この理由によります。
        </p>
      </div>

      <div>
        <LaborH2>育成就労で何が変わるのですか？</LaborH2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  項目
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  技能実習（現行）
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  育成就労
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">機関の名称</th>
                <td className="border border-border px-3 py-2 text-text">監理団体</td>
                <td className="border border-border px-3 py-2 text-text">監理支援機関</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">外部の目</th>
                <td className="border border-border px-3 py-2 text-text">
                  指定外部役員 または 外部監査人 の選択制
                </td>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>外部監査人の設置が義務</strong>
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">許可</th>
                <td className="border border-border px-3 py-2 text-text">既存の許可が有効</td>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>取り直しが必要</strong>（自動的には移行しません）
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          育成就労制度の施行日および施行日前申請の受付期間・推奨申請期限については、本ページ作成時点で一次資料による確認を行っていません（
          <strong>未検証</strong>）。実際の日程は主務省庁の公表資料をご確認ください。
        </p>
      </div>

      <div>
        <LaborH2>外部監査人は何をするのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">現行制度では、次のとおり定められています。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  項目
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  内容
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">頻度</th>
                <td className="border border-border px-3 py-2 text-text">
                  <strong>各事業所につき3か月に1回以上</strong>
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  確認すること
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  監理・監査その他の業務が適正に実施されているか
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">成果物</th>
                <td className="border border-border px-3 py-2 text-text">
                  確認の結果を記載した書類を作成し、監理支援機関へ提出
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  許可申請での扱い
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  申請書に外部監査人の氏名・名称を記載。概要書・就任承諾書・誓約書の写しを添付
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <LaborH2>費用はいくらですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>お見積り</strong>
          です。事業所の数、実地確認への同行の有無によって作業量が変わるためです。お問い合わせの際に、事業所数と受入れの規模をお知らせください。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            報酬額表
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>監理支援機関の許可申請もお願いできますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>当事務所では取り扱いません。</strong>
          許可申請書類の作成は行政書士の業務です。四葉行政書士事務所で承ることも可能ですが、
          <strong>外部監査人の就任とは別々にご契約いただきます</strong>。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal", locale)} className="text-primary underline">
            四葉行政書士事務所
          </Link>
        </p>
        <p className="mt-3 leading-relaxed text-text">
          また、実習実施者（受入企業）に対する監査そのものは監理支援機関の業務であり、外部監査人が代わって行うものではありません。外部監査人は、その監査が適正に行われているかを外から確認する立場です。
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      <div>
        <LaborH2>顧問先の会社が受け入れている場合はどうなりますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>その監理支援機関の外部監査人はお受けしません。</strong>
          外部監査人には、監理支援機関やその関係先と密接な関係を持たないことが求められます。当事務所は法令上の欠格事由を確認するだけでなく、
          <strong>方針として次のとおり切り分けています</strong>。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            外部監査人をお引き受けした監理支援機関の関係先（傘下の実習実施者・受入企業）とは、労務の顧問契約を結びません
          </li>
          <li>既存の顧問先が加入している監理支援機関の外部監査人は、お引き受けしません</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          外から確認する立場と、内側で相談に応じる立場を、同じ事務所が兼ねないためです。ご相談の際に、まず関係の有無を確認させてください。
        </p>
      </div>

      <div>
        <LaborH2>なぜ社会保険労務士に頼むのですか？</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>監査の中身が労務だから</strong>
            ——確認の対象は労働時間・賃金・安全衛生・住環境の遵守状況です
          </li>
          <li>
            <strong>養成講習を修了しているから</strong>
            ——代表は監理責任者等講習を2026年7月10日に修了しました（修了後3年間有効）
          </li>
          <li>
            <strong>中国語で確認できるから</strong>
            ——代表は元毎日新聞中国総局長で、中国語（繁体字・簡体字）と英語に対応します
          </li>
        </ul>
      </div>

      <div>
        <LaborH2>このページの根拠</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          <li>
            外部監査の根拠＝外国人の技能実習の適正な実施及び技能実習生の保護に関する法律（平成28年法律第89号）第25条第1項第5号ロ
          </li>
          <li>外部監査の定義＝同法施行規則（平成28年法務省・厚生労働省令第3号）第1条第11号</li>
          <li>
            外部役員及び外部監査人＝同規則第30条。<strong>各事業所につき3か月に1回以上</strong>
            の頻度で確認し、結果を記載した書類を提出することが定められています
          </li>
          <li>申請書の記載事項＝同規則第26条／申請書の添付書類＝同規則第27条</li>
          <li>
            育成就労制度＝出入国管理及び難民認定法及び外国人の技能実習の適正な実施及び技能実習生の保護に関する法律の一部を改正する法律（令和6年法律第60号）による改正。施行規則は令和7年法務省・厚生労働省令第4号として公布
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※技能実習法および同法施行規則の条番号は2026年8月11日にe-Gov法令検索で確認しました。
          <strong>
            育成就労制度における外部監査人の条番号、施行日、施行日前申請の受付期間および推奨申請期限は、本ページ作成時点で一次資料による確認を行っていません（未検証）。
          </strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。
        </p>
      </div>
    </LaborServicePage>
  );
}
