// /labor/services/kaigo-roumu（型A）＝原稿_社労士 #3
// クロスリンク＝C10（→shogai-fukushi）・C13（→/toushi/group-home）がpathで自動（launchFlag=SR_LAUNCHED）。
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
    title: "介護・障害福祉の労務管理｜四葉社会保険労務士事務所",
    description:
      "介護・障害福祉事業所の人員配置基準、就業規則、シフト・勤怠、社会保険手続きを、文京区の四葉社会保険労務士事務所が支援します。指定基準に直結する人員体制づくりから日々の手続きまで、事業所運営に必要な労務をまとめてお任せいただけます。",
    path: "/labor/services/kaigo-roumu",
    keywords: ["介護 事業所 社労士 顧問", "障害福祉 労務管理", "人員配置基準 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LaborServicePage
      slug="kaigo-roumu"
      crumbLabel="介護・障害福祉の労務管理"
      serviceName="介護・障害福祉事業所の労務管理サポート"
      heroAlt="介護・障害福祉の労務管理のイメージ（事業所のシフト表）"
      h1="介護・障害福祉の労務管理"
      lead={
        <p>
          介護・障害福祉事業所の労務管理——<strong>人員配置基準、就業規則、シフト・勤怠、社会保険手続き</strong>——は、社会保険労務士に依頼できます。この分野の労務が特殊なのは、<strong>人員体制がそのまま指定基準・加算要件に直結する</strong>ことです。四葉社会保険労務士事務所は、「基準を満たす体制づくり」と「日々の手続き」の両方を、まとめて支援します。
          <Placeholder reason="浦松＝対応範囲・顧問形態" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "介護・障害福祉の労務管理の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート" },
        { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用の労務" },
      ]}
      crossLinkLead="開設準備の段階から、物件（四葉不動産）→指定申請（四葉行政書士事務所）→労務体制（当事務所）の順で整えられます。"
    >
      <div>
        <LaborH2>どんなことを頼めますか？</LaborH2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
          <li>就業規則・賃金規程の作成・見直し（夜勤・宿直・変形労働時間制への対応を含む）</li>
          <li>労働・社会保険の手続き（入退社・労災・雇用保険 ほか）</li>
          <li>人員配置基準を踏まえたシフト・勤怠の設計</li>
          <li>
            処遇改善加算との一体整備 →{" "}
            <Link href="/labor/services/shogu-kaizen" className="text-primary underline">
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

      <div>
        <LaborH2>これから開設する事業者も相談できますか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          できます。開設準備の段階から、<strong>物件（四葉不動産）→指定申請（四葉行政書士事務所）→労務体制（当事務所）</strong>の順で、四葉の関連事業と連携しながら整えられます。
        </p>
      </div>
    </LaborServicePage>
  );
}
