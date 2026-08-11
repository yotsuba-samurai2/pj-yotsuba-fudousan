// /labor/services/gaibu-kansanin（型A）＝2026-08-11 新規。設計＝61_外部監査人_導線設計.md
//
// 【役割分担】luck428-column-seo 第2条・第6条。**主語で分ける。**
//   ・/legal/services/ikuseishuro-gaibu-kansa（2026-08-06 新設・定点#26/#27の主力）
//       ＝「誰に依頼できるか」「要件は何か」「いつから始まるか」＝**探している側**
//   ・本ページ ＝「監査では何を見られるか」「何を備えておけばよいか」＝**備える側**
//     要件・誰に依頼できるかは書かない。legal 側へ発リンクして評価を集約する（第6条5）
//
// 【なぜ両方あるか】施行規則第47条第2項第2号は弁護士・社会保険労務士・行政書士を列挙しており、
//   浦松はいずれの資格でも就任できる。四葉行政書士事務所・四葉社会保険労務士事務所の
//   どちらでもお受けできるため、両方に窓口を置く。契約は事務所ごとに別々。
//
// 【法令の裏取り】2026-08-06 に /legal 側で e-Gov法令API v2・出入国在留管理庁により確認済みの値を使う。
//   ・育成就労法＝**平成28年法律第89号**（技能実習法を令和6年法律第60号が改正し題名を差し替えたもの）
//   ・法第25条第1項第5号＝外部監査の措置が許可の基準（技能実習法のイ／ロ選択制が単一号になった）
//   ・施行規則＝令和7年法務省・厚生労働省令第4号（技能実習法施行規則の全部改正）第47条ほか
//   ・施行日＝令和9年4月1日（令和7年政令第340号）
//   ・**施行日前の許可申請の受付開始時期は未公表**（令和6年法律第60号 附則第5条第3項）
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
    title: "外部監査で見られる労務｜四葉社会保険労務士事務所",
    description:
      "育成就労の外部監査では、労働時間・賃金・安全衛生・住環境といった労働関係法令の遵守状況が確認されます。監理支援機関と受入企業が何を備えておけばよいかを、社会保険労務士の立場から整理しました。外部監査人の就任もお受けします。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/labor/services/gaibu-kansanin",
    keywords: ["育成就労 外部監査 何を見られる", "監理支援機関 労務 備え", "外部監査 賃金台帳"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="gaibu-kansanin"
      crumbLabel="外部監査で見られる労務"
      serviceName="育成就労の外部監査に備える労務整備・外部監査人の受託"
      heroAlt="外部監査で見られる労務のイメージ（賃金台帳と勤怠記録の確認）"
      h1="外部監査で見られる労務"
      lead={
        <p>
          育成就労の外部監査で確認されるのは、<strong>労働関係法令が守られているか</strong>です。労働時間・賃金・安全衛生・住環境といった、
          <strong>労務そのもの</strong>が対象になります。監理支援機関と受入企業が何を備えておけばよいかを、社会保険労務士の立場から整理しました。
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "外部監査人の料金" },
        { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
      ]}
      crossLinkLead="外部監査人の要件と依頼先については、四葉行政書士事務所のページで整理しています。"
    >
      <div>
        <LaborH2>外部監査では、何を見られるのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          外部監査人が確認するのは、監理支援機関の<strong>監理・監査の業務が適正に行われているか</strong>です。その監理・監査が向き合っているのは、受入企業における労働関係法令の遵守状況にほかなりません。したがって、実際に問われるのは次のような労務です。
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>労働時間</strong>——記録の方法、時間外・休日労働の上限、36協定の内容と実態の一致
          </li>
          <li>
            <strong>賃金</strong>——最低賃金、割増賃金の計算、控除の根拠、賃金台帳の記載
          </li>
          <li>
            <strong>安全衛生</strong>——健康診断、教育、作業環境
          </li>
          <li>
            <strong>住環境</strong>——宿舎の状況、費用の徴収額と実費との関係
          </li>
          <li>
            <strong>受入れの条件</strong>——雇用契約の内容が、日本人と同等以上になっているか
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          ※確認の対象となる書類の範囲は、出入国在留管理庁「育成就労制度運用要領」第5章に示されています。制度は施行前で、下位の告示や運用の細目がこれから示される部分があります（
          <strong>未検証</strong>）。
        </p>
      </div>

      <div>
        <LaborH2>備えるとしたら、どこから手をつけますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          監査の場で困るのは、<strong>制度を知らないことより、記録が残っていないこと</strong>です。順序としては次のようになります。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  順
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  やること
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  なぜ先か
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">1</th>
                <td className="border border-border px-3 py-2 text-text">勤怠の記録方法をそろえる</td>
                <td className="border border-border px-3 py-2 text-text">
                  賃金の計算も36協定の管理も、ここが元になります
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">2</th>
                <td className="border border-border px-3 py-2 text-text">
                  賃金台帳と雇用契約の内容を突き合わせる
                </td>
                <td className="border border-border px-3 py-2 text-text">
                  控除の根拠が契約に書かれていないと説明できません
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">3</th>
                <td className="border border-border px-3 py-2 text-text">就業規則と実態を合わせる</td>
                <td className="border border-border px-3 py-2 text-text">
                  規則にない運用は、監査で必ず理由を聞かれます
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">4</th>
                <td className="border border-border px-3 py-2 text-text">
                  宿舎の費用と実費の関係を整理する
                </td>
                <td className="border border-border px-3 py-2 text-text">
                  住環境は育成就労で重く見られる項目です
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <LaborH2>言葉が通じないところは、どうしますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          監査では、育成就労外国人本人からの聞き取りが行われます。通訳を介すると、労働時間や賃金の説明が正確に伝わらないことがあります。当事務所の代表は元毎日新聞中国総局長で、
          <strong>中国語（繁体字・簡体字）と英語に対応</strong>します。外部の通訳を挟まずに確認できます。
        </p>
      </div>

      <div>
        <LaborH2>外部監査人は、行政書士と社会保険労務士のどちらに頼めますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          施行規則は、外部監査人になれる者として<strong>弁護士・社会保険労務士・行政書士</strong>（およびそれぞれの法人）と、育成就労に関する知見を有する者を挙げています。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          四葉では、<strong>四葉行政書士事務所と四葉社会保険労務士事務所のどちらでもお受けできます</strong>
          。ご契約は事務所ごとに別々になりますので、すでにいずれかとお取引がある場合は、そちらに合わせていただけます。
        </p>
        <p className="mt-2 text-sm">
          外部監査人の<strong>要件</strong>（講習の修了、独立性、欠格事由、氏名の公表への同意）と、依頼先の選び方は次のページで整理しています。 →{" "}
          <Link
            href={addLocalePrefix("/legal/services/ikuseishuro-gaibu-kansa", locale)}
            className="text-primary underline"
          >
            育成就労の外部監査人（四葉行政書士事務所）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      <div>
        <LaborH2>顧問先の会社が受け入れている場合はどうなりますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>その監理支援機関の外部監査人はお受けしません。</strong>
          外部監査人には、監理支援機関やその関係先から独立していることが求められます。当事務所は要件の確認にとどめず、
          <strong>方針として次のとおり切り分けています</strong>。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            外部監査人をお引き受けした監理支援機関の関係先（傘下の受入企業）とは、労務の顧問契約を結びません
          </li>
          <li>既存の顧問先が加入している監理支援機関の外部監査人は、お引き受けしません</li>
          <li>
            <strong>この切り分けは、行政書士事務所・社会保険労務士事務所のどちらで受けた場合にも適用します</strong>
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          外から確認する立場と、内側で相談に応じる立場を、同じ人が兼ねないためです。事務所を分けても同じ人である以上、扱いは変えません。ご相談の際に、まず関係の有無を確認させてください。
        </p>
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
        <LaborH2>このページの根拠</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          <li>
            外国人の育成就労の適正な実施及び育成就労外国人の保護に関する法律（
            <strong>平成28年法律第89号</strong>）第25条第1項第5号／施行日 令和9年4月1日／最終改正
            令和6年法律第60号。本法は2024年に新たに制定されたものではなく、外国人の技能実習の適正な実施及び技能実習生の保護に関する法律を令和6年法律第60号が改正して題名を改めたものです
          </li>
          <li>
            同法施行規則（<strong>令和7年法務省・厚生労働省令第4号</strong>・公布 令和7年9月30日）第47条／施行日
            令和9年4月1日／最終改正 令和8年法務省・厚生労働省令第3号。第2項第2号に弁護士・社会保険労務士・行政書士の明文があります
          </li>
          <li>
            外部監査の方法・確認対象書類＝出入国在留管理庁「育成就労制度運用要領」第5章（令和8年8月5日更新版・2026年8月6日確認）
          </li>
          <li>労働時間・賃金・安全衛生の根拠＝労働基準法（昭和22年法律第49号）、労働安全衛生法（昭和47年法律第57号）、最低賃金法（昭和34年法律第137号）</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※法令の条番号は、四葉行政書士事務所のページで2026年8月6日に一次資料により確認したものを引用しています。
          <strong>
            確認対象書類の具体的な範囲、監査の頻度、施行日前の許可申請の受付開始時期は、いずれも本ページ作成時点で確定していません（未検証）。
          </strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。
        </p>
      </div>
    </LaborServicePage>
  );
}
