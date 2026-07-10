// /labor/services/gaikokujin-koyo（型A）＝原稿_社労士 #5
// クロスリンク＝C14（→/legal/services/visa・/toushi/shataku）がpathで自動（launchFlag=SR_LAUNCHED）。
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
    title: "外国人雇用の労務｜四葉社会保険労務士事務所",
    description:
      "外国人（介護・育成就労）の雇用に伴う労務・社会保険手続きを、文京区の四葉社会保険労務士事務所が支援します。日本語・英語・中国語に対応。2027年4月施行の育成就労制度への受入準備も。在留資格は四葉行政書士事務所（別事業体）と連携します。",
    path: "/labor/services/gaikokujin-koyo",
    keywords: ["外国人 雇用 社労士", "育成就労 受入 準備", "介護 外国人材 労務"],
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LaborServicePage
      slug="gaikokujin-koyo"
      crumbLabel="外国人雇用（介護・育成就労）の労務"
      serviceName="外国人雇用（介護・育成就労）の労務・社会保険サポート"
      heroAlt="外国人雇用の労務のイメージ（多国籍の介護スタッフ）"
      h1="外国人雇用（介護・育成就労）の労務"
      lead={
        <p>
          外国人——とくに介護分野・育成就労——の雇用に伴う<strong>労務・社会保険手続き</strong>は、社会保険労務士に依頼できます。四葉社会保険労務士事務所は、雇用契約・社会保険・労働条件の説明を<strong>日本語・英語・中国語</strong>で支援できるのが特長です。<strong>2027年4月施行の育成就労制度</strong>への受入準備にも対応します。
          <Placeholder reason="浦松＝育成就労対応の範囲" />
        </p>
      }
      internalLinks={[
        { href: "/labor/ryokin", label: "外国人雇用の労務の料金" },
        { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
        { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
      ]}
      crossLinkLead="入口（在留資格の申請）は行政書士、住まいの手配は宅建業。受け入れの前後を切れ目なく進められます。"
    >
      <div>
        <LaborH2>在留資格と労務は、どう分担するのですか？</LaborH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong>入口（在留資格の申請）＝行政書士、入社後（労務・社会保険）＝社会保険労務士</strong>です。四葉では、在留資格を四葉行政書士事務所が、雇用後の労務を当事務所が担当し、受け入れの前後を切れ目なく支援します。住まいの手配は四葉不動産株式会社が多言語で対応します。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href="/legal/services/visa" className="text-primary underline">
            在留資格・ビザ申請（四葉行政書士事務所）
          </Link>
          ／
          <Link href="/toushi/shataku" className="text-primary underline">
            社宅・法人賃貸（四葉不動産）
          </Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>
    </LaborServicePage>
  );
}
