// /labor/services/jinin-kijun-roumu（型A）＝指示書11「3. 障害福祉事業所の人員基準と労務」
// 正本＝Drive「四葉_社労士開業2026_サイト切替設計」設計書 §2-A-5・第4章B（B1〜B4）
//
// 【役割分担・カニバリ防止（luck428-column-seo 第3条／指示書11の役割分担表）】
//   ・/toushi/shitei-shinsei ＝指定申請（行政書士）。申請要件の解説はそちら
//   ・/legal/column/group-home-sewanin-seikatsushienin-haichi ＝人員配置基準を
//     「指定基準の側から」解説した既存記事。本ページは「雇用・労務の側から」書き、
//     指定基準の要件解説を繰り返さず既存記事へリンクする
//   ・/labor/services/kaigo-roumu ＝労務全般。本ページは人員基準との接続に絞る
//
// 【表示コンプライアンス】yotsuba-sharoushi-kaigyo 第6条／shigyo-compliance-gate
//   ・一体提供を示唆する語を使わない（婉曲表現を含む）
//   ・断定的な法的判断を書かない。「判断材料」「一般的な取り扱い」の形にする
//   ・報酬額を書かない（別契約・別料金／要見積り）
//   ・実績・事例・口コミ・評価を作成しない
//
// 【SR_LAUNCHED】本ページはゲートの内側（LaborServicePage が判定）。2026年9月1日まで非公開。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { LaborServicePage, LaborH2 } from "@/components/shared/LaborServicePage";

/** 可視の最終更新日（luck428-column-seo 第7条6） */
const LAST_UPDATED_JA = "2026年7月29日";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "障害福祉事業所の人員基準と労務｜四葉社会保険労務士事務所",
    description:
      "指定基準の「常勤換算」と、就業規則で定める所定労働時間は別の話です。基準を満たす体制を、雇用として成立させる側の論点を整理しました。文京区の四葉社会保険労務士事務所。指定申請の書類作成は四葉行政書士事務所が別契約で受任します。",
    path: "/labor/services/jinin-kijun-roumu",
    keywords: [
      "常勤換算 就業規則 所定労働時間",
      "障害福祉 人員基準 労務",
      "人員配置基準 雇用契約",
      "管理者 サービス管理責任者 兼務 労務",
    ],
    locale,
    absoluteTitle: true,
  });
}

/** 手続きと担当の対応表（B4）。指定基準側と労務側を分け、担当事務所を明記する */
type TetsuzukiRow = { when: string; shitei: string; roumu: string };

const TETSUZUKI: TetsuzukiRow[] = [
  {
    when: "職員を採用したとき",
    shitei: "体制に変更があれば変更届（指定権者へ）",
    roumu: "健康保険・厚生年金の資格取得届、雇用保険の資格取得届",
  },
  {
    when: "職員が退職したとき",
    shitei: "同上",
    roumu: "資格喪失届、離職票の交付",
  },
  {
    when: "管理者・サービス管理責任者が交代したとき",
    shitei: "変更届（指定権者へ）",
    roumu: "雇用契約・職務内容の変更、就業規則上の位置づけの確認",
  },
  {
    when: "勤務形態を変えたとき（常勤と非常勤の別・時間数の変更）",
    shitei: "常勤換算に影響する場合は体制の見直し",
    roumu: "労働条件通知書の再交付、社会保険の被保険者区分の確認",
  },
];

export default async function Page() {
  const locale = await getRequestLocale();

  return (
    <LaborServicePage
      slug="jinin-kijun-roumu"
      crumbLabel="人員基準と労務"
      serviceName="障害福祉事業所の人員基準に対応する労務体制の整備"
      heroAlt="障害福祉事業所の人員基準と労務のイメージ（勤務体制一覧表）"
      h1="障害福祉事業所の人員基準と労務"
      lead={
        <p>
          指定基準でいう<strong>「常勤換算」</strong>と、就業規則で定める
          <strong>所定労働時間</strong>
          は、別の話です。基準を満たす人数を並べても、雇用契約・就業規則・勤怠の実態がそれに伴っていなければ、体制として成り立ちません。このページでは、
          <strong>基準を満たす体制を「雇用として」成立させる側</strong>
          の論点を整理します。指定基準そのものの要件解説と申請書類の作成は、四葉行政書士事務所が
          <strong>別の契約で</strong>受任します。
        </p>
      }
      internalLinks={[
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
        { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート" },
        { href: "/labor/ryokin", label: "料金のご案内" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
      ]}
      crossLinkLead="指定申請の書類作成は四葉行政書士事務所、物件は四葉不動産株式会社が、それぞれ別の契約で受任します。"
    >
      <div>
        <LaborH2>「常勤換算」と就業規則の所定労働時間は、どう関係しますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          常勤換算は、非常勤職員の勤務時間を「常勤職員なら何人分にあたるか」に置き換える考え方です。その分母になるのが、
          <strong>その事業所で定めた常勤職員の所定労働時間</strong>
          です。所定労働時間は就業規則や雇用契約で定めるものなので、
          <strong>就業規則の内容が変われば、同じ勤務実態でも常勤換算の数値が変わります</strong>。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          そのため、申請書類の上で人数が足りていても、就業規則の定めや実際の勤務実態とずれていれば、後の実地指導で説明を求められる場面があります。基準の充足を「書類の数字」だけで考えず、
          <strong>就業規則・雇用契約・勤怠記録の3つが同じ前提で書かれているか</strong>
          を確認しておくのが要点です。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          常勤換算の計算方法や必要な配置人数そのものは、指定基準の側の論点です。
          <Link
            href={addLocalePrefix(
              "/legal/column/group-home-sewanin-seikatsushienin-haichi",
              locale,
            )}
            className="text-primary underline"
          >
            世話人・生活支援員の人員配置基準（四葉行政書士事務所のコラム）
          </Link>
          をご覧ください。
        </p>
      </div>

      <div>
        <LaborH2>人員配置基準を満たすことと、労働法上きちんと雇うことは何が違いますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          見ている法律が違います。人員配置基準は、障害者総合支援法にもとづく指定の基準として「どういう職種を何人置くか」を定めます。一方で、その人をどう雇うかは労働基準法などの労働関係法令が、社会保険への加入は健康保険法・厚生年金保険法などが定めます。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>指定基準の側</strong>：職種、必要人数、常勤と非常勤の別、資格の要件
          </li>
          <li>
            <strong>労働関係法令の側</strong>
            ：労働条件の明示、労働時間・休憩・休日、割増賃金、年次有給休暇
          </li>
          <li>
            <strong>社会保険の側</strong>：適用事業所の要件、被保険者となる人の範囲、届出の期限
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          「基準を満たす人を確保する」ことと「その人を適法に雇う」ことは、どちらか一方だけでは足りません。開設の準備では、両方を並べて確認しておくことをお勧めします。
        </p>
      </div>

      <div>
        <LaborH2>管理者とサービス管理責任者を兼務させる場合、労務上の注意点はありますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          兼務が指定基準上認められるかどうかは、サービス種別・事業所の規模・指定権者の取り扱いによって異なります。ここでは、兼務が認められる前提で
          <strong>労務の側で確認しておく点</strong>を挙げます。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>雇用契約書・労働条件通知書に、担う職務の範囲がどう書かれているか</li>
          <li>就業規則上の職位・役職手当と、実際の職務内容が対応しているか</li>
          <li>労働時間の管理を、兼務する職務ごとに分けて記録する必要があるか</li>
          <li>
            管理監督者にあたるかどうかの判断（労働基準法第41条第2号）を、役職名ではなく実態で確認しているか
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          管理監督者にあたるかどうかは、役職の名称ではなく職務内容・権限・待遇の実態で判断されるとされています。個別の判断は、面談のうえ資格者が行います。
        </p>
      </div>

      <div>
        <LaborH2>申請書に書いた人員体制と、実際の勤務シフトがずれたらどうなりますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          指定を受けた後も、体制に変更があれば指定権者への届出が必要になる場合があります。これは指定基準の側の手続きです。あわせて、労務の側でも社会保険・雇用保険の届出が必要になることがあります。
          <strong>この2つは提出先も期限も別</strong>
          なので、どちらか一方だけを出して終わりにしないことが要点です。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  こういうとき
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  指定基準の側（四葉行政書士事務所が別契約で受任）
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  労務の側（当事務所が承ります）
                </th>
              </tr>
            </thead>
            <tbody>
              {TETSUZUKI.map((r) => (
                <tr key={r.when}>
                  <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                    {r.when}
                  </th>
                  <td className="border border-border px-3 py-2 text-text">{r.shitei}</td>
                  <td className="border border-border px-3 py-2 text-text">{r.roumu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          届出の要否・期限・様式は、サービス種別と指定権者によって異なります。上表は担当が分かれることを示すための整理で、個別の事案の判断材料としてそのまま用いるものではありません。
        </p>
      </div>

      <div>
        <LaborH2>人員基準の相談は、行政書士と社労士のどちらにすればいいですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">聞きたいことによって分かれます。</p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>「何人配置すればいいか」「申請書にどう書くか」</strong>
            ——指定基準の側。四葉行政書士事務所が別の契約で受任します
          </li>
          <li>
            <strong>「その人をどう雇えばいいか」「就業規則をどう直すか」</strong>
            ——労務の側。当事務所が承ります
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          どちらか判断がつかない段階でも差し支えありません。ご相談の内容を伺って、どの部分をどの事務所が担うかを最初にお示しします。
          <strong>2つの事務所は同一の所在地にありますが、それぞれ独立した事業体です。</strong>
          契約・請求・お振込先も分かれます。必要な部分だけをご依頼いただけます。
        </p>
        <p className="mt-3 text-sm">
          <Link href={addLocalePrefix("/reasons", locale)} className="text-primary underline">
            四葉が選ばれる理由（契約が分かれる理由）
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>料金はいくらですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          業務の範囲と事業所の規模により異なるため、お見積りをお示しします。四葉不動産株式会社・四葉行政書士事務所の料金とは
          <strong>別建て</strong>です。
        </p>
        <p className="mt-3 text-sm">
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
            料金のご案内
          </Link>
        </p>
      </div>

      <div>
        <LaborH2>このページの根拠</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-muted">
          <li>
            人員配置基準＝障害者の日常生活及び社会生活を総合的に支援するための法律（平成17年法律第123号）にもとづく指定基準（サービス種別ごとの省令）
          </li>
          <li>管理監督者の範囲＝労働基準法（昭和22年法律第49号）第41条第2号</li>
          <li>労働条件の明示＝労働基準法第15条第1項</li>
          <li>
            社会保険の適用・届出＝健康保険法（大正11年法律第70号）、厚生年金保険法（昭和29年法律第115号）
          </li>
          <li>雇用保険の届出＝雇用保険法（昭和49年法律第116号）</li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※各法令の最終改正日および省令の条項番号は、本ページ作成時点で個別に一次確認していません（
          <strong>未検証</strong>
          ）。常勤換算の算定方法・届出の期限・様式はサービス種別と指定権者により異なります。最新の取り扱いは指定権者の要綱をご確認いただくか、面談のうえご案内します。
        </p>
      </div>

      <div>
        <p className="text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。指定申請の書類作成は四葉行政書士事務所、不動産の取引は四葉不動産株式会社が、それぞれ別の契約で受任します。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。
        </p>
        <p className="mt-2 text-xs text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
      </div>
    </LaborServicePage>
  );
}
