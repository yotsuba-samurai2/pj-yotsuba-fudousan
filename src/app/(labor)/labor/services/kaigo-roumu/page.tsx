// /labor/services/kaigo-roumu（型A）＝原稿_社労士 #3
// クロスリンク＝C10（→shogai-fukushi）・C13（→/toushi/group-home）がpathで自動（launchFlag=SR_LAUNCHED）。
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
    title: "介護・障害福祉の労務管理｜四葉社会保険労務士事務所",
    description:
      "介護・障害福祉事業所の人員配置基準、就業規則、シフト・勤怠、社会保険手続きを、文京区の四葉社会保険労務士事務所が承ります。指定基準に直結する人員体制づくりから日々の手続きまで、労務の範囲を当事務所が別契約で受任します。",
    path: "/labor/services/kaigo-roumu",
    keywords: ["介護 事業所 社労士 顧問", "障害福祉 労務管理", "人員配置基準 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <LaborServicePage
      slug="kaigo-roumu"
      crumbLabel="介護・障害福祉の労務管理"
      serviceName="介護・障害福祉事業所の労務管理サポート"
      heroAlt="介護・障害福祉の労務管理のイメージ（事業所のシフト表）"
      h1="介護・障害福祉の労務管理"
      lead={
        <p>
          介護・障害福祉事業所の労務管理——<strong>人員配置基準、就業規則、シフト・勤怠、社会保険手続き</strong>——は、社会保険労務士に依頼できます。この分野の労務が特殊なのは、<strong>人員体制がそのまま指定基準・加算要件に直結する</strong>ことです。四葉社会保険労務士事務所は、「基準を満たす体制づくり」と「日々の手続き」のいずれも承ります。指定申請の書類作成は四葉行政書士事務所、物件は四葉不動産株式会社が、それぞれ別契約で受任します。
          <Placeholder reason="浦松＝対応範囲・顧問形態" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "介護・障害福祉の労務管理の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート" },
        { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用の労務" },
      ]}
      crossLinkLead="開設の準備では物件・指定申請・労務体制の3つが必要です。それぞれ四葉不動産株式会社・四葉行政書士事務所・当事務所が別の契約で受任します。"
    >
      <div>
        <LaborH2>どんなことを頼めますか？</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>就業規則・賃金規程の作成・見直し（夜勤・宿直・変形労働時間制への対応を含む）</li>
          <li>労働・社会保険の手続き（入退社・労災・雇用保険 ほか）</li>
          <li>人員配置基準を踏まえたシフト・勤怠の設計</li>
          <li>
            処遇改善加算の賃金要件に沿った規程の整備 →{" "}
            <Link href={addLocalePrefix("/labor/services/shogu-kaizen", locale)} className="text-primary underline">
              処遇改善加算のサポート
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <LaborH2>顧問契約とスポット依頼の違いは何ですか？</LaborH2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          顧問契約は日常の労務相談と基本手続きを継続的に、スポット依頼は個別の手続き・規程整備を単発でお受けする形です。詳細は料金ページをご覧ください。
          <Placeholder reason="浦松＝顧問/スポットの提供形態・料金の違い" />
        </p>
      </div>

      {/* 2026-07-29追加：指示書11 第4章A（A1〜A5）への回答 */}
      <div>
        <LaborH2>世話人は常勤と非常勤、どちらで雇うべきですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          どちらが良いと一律には決まりません。判断の材料になるのは次の4点です。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>指定基準上、そのサービス種別で常勤の配置が求められている職種かどうか</li>
          <li>常勤換算の分母となる所定労働時間を、就業規則でいくらに定めているか</li>
          <li>社会保険の被保険者となる勤務時間・日数の条件を満たすかどうか</li>
          <li>夜間の支援体制を組む場合、交替制にするか宿直で対応するか</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          常勤換算と就業規則の関係は
          <Link
            href={addLocalePrefix("/labor/services/jinin-kijun-roumu", locale)}
            className="text-primary underline"
          >
            人員基準と労務
          </Link>
          で詳しく整理しています。個別の判断は、面談のうえ資格者が行います。
        </p>
      </div>

      <div>
        <LaborH2>夜間支援は、労働時間としてどう扱われますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          夜間の勤務は、実際の働き方によって扱いが変わります。一般的には次のように整理されます。
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>
            <strong>夜勤</strong>
            ：通常の業務を行う時間帯。全体が労働時間となり、深夜（原則22時から翌5時）の割増賃金の対象になります（労働基準法第37条第4項）
          </li>
          <li>
            <strong>宿直</strong>
            ：常態としてほとんど労働する必要のない勤務。所轄労働基準監督署長の許可を受けた場合に、労働時間や休憩の規定の適用が除外されるとされています（労働基準法第41条第3号）
          </li>
          <li>
            <strong>仮眠・待機</strong>
            ：呼び出しに備えて待機している時間が労働時間にあたるかどうかは、拘束の程度によって判断されます
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          宿直の許可を受けずに宿直として扱うと、後から未払賃金の問題になる場合があります。許可の要否と申請は、面談のうえご案内します。
        </p>
      </div>

      <div>
        <LaborH2>開設するとき、就業規則と社会保険はいつまでに整えますか？</LaborH2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  やること
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  時期の目安
                </th>
                <th className="border border-border bg-primary-tint px-3 py-2 text-left font-medium text-ink">
                  根拠・備考
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  労働条件の明示
                </th>
                <td className="border border-border px-3 py-2 text-text">雇用契約を結ぶとき</td>
                <td className="border border-border px-3 py-2 text-text">労働基準法第15条第1項</td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  就業規則の作成・届出
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  常時10人以上の労働者を使用するに至ったとき
                </td>
                <td className="border border-border px-3 py-2 text-text">
                  労働基準法第89条。10人未満でも指定基準や加算の要件で必要になる場合があります
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  社会保険の新規適用
                </th>
                <td className="border border-border px-3 py-2 text-text">
                  適用事業所に該当したとき
                </td>
                <td className="border border-border px-3 py-2 text-text">
                  健康保険法・厚生年金保険法。届出の期限は事実の発生から定められています
                </td>
              </tr>
              <tr>
                <th className="border border-border px-3 py-2 text-left font-medium text-ink">
                  労働保険の成立
                </th>
                <td className="border border-border px-3 py-2 text-text">労働者を雇い入れたとき</td>
                <td className="border border-border px-3 py-2 text-text">
                  労働保険徴収法・雇用保険法
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          ※届出の具体的な期限日数は、本ページ作成時点で個別に一次確認していません（<strong>未検証</strong>
          ）。実際の期限は面談のうえご案内します。
        </p>
      </div>

      <div>
        <LaborH2>これから開設する事業者も相談できますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          できます。開設の準備では、<strong>物件・指定申請・労務体制</strong>の3つが必要になります。物件は四葉不動産株式会社、指定申請の書類作成は四葉行政書士事務所、労務体制は当事務所が、それぞれ<strong>別の契約で</strong>受任します。3事務所は同一の所在地にありますが独立した事業体で、料金・請求も分かれます。必要な部分だけをご依頼いただけます。
        </p>
      </div>
    </LaborServicePage>
  );
}
