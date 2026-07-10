// ★参考ページ（型A）＝ /legal/services/company　※原稿_行政書士 #4・共通シェル使用
// 配置＝src/app/(legal)/legal/services/company/page.tsx。クロスリンクはこのページには定義なし（getCrossLinksが空を返す）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "会社設立・各種許認可｜四葉行政書士事務所",
    description:
      "株式会社・合同会社の設立書類、建設業・宅建業・古物・飲食などの許認可申請を、文京区の四葉行政書士事務所が支援します。定款作成から許認可まで一体で対応。外国人の経営管理ビザと会社設立の同時進行にも中国語・英語で対応します。",
    path: "/legal/services/company",
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LegalServicePage
      slug="company"
      crumbLabel="会社設立・各種許認可"
      serviceName="会社設立書類の作成・各種許認可申請の支援"
      heroAlt="会社設立・許認可のイメージ（オフィスと設立書類）"
      h1="会社設立・各種許認可"
      lead={
        <p>
          会社設立の書類作成（定款等）と各種許認可の申請は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所は、株式会社・合同会社の設立書類の作成と、事業に必要な許認可申請を扱います。<strong>登記申請は司法書士の領域</strong>のため、連携しておつなぎします。
          <Placeholder reason="浦松＝対応する許認可種別の確定／石井弁護士＝業際表現" />
        </p>
      }
      governmentService
      internalLinks={[
        { href: "/legal/ryokin", label: "報酬額表" },
        { href: "/legal/nagare", label: "受任の流れ" },
        { href: "/legal/services/visa", label: "在留資格・ビザ申請" },
        { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの指定申請" },
      ]}
    >
      <div>
        <H2>どんな許認可に対応していますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          事業に必要な許認可はご相談ください。
          <Placeholder reason="浦松＝対応許認可の確定（建設業・宅建業・古物・飲食・産廃 等）。確定までは「事業に必要な許認可はご相談ください」の一般表現で公開" />
        </p>
        <p className="mt-2 text-sm">
          障害福祉サービスの事業者指定は、専用ページで詳しく解説しています →{" "}
          <Link href="/legal/services/shogai-fukushi" className="text-primary underline">障害福祉サービスの指定申請</Link>
        </p>
      </div>

      <div>
        <H2>外国人の会社設立・経営管理ビザにも対応できますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          できます。外国人の方が日本で起業する場合、<strong>会社設立と「経営・管理」の在留資格は一体</strong>で進みます。四葉行政書士事務所は両方を扱えるため、順序と要件を整理して同時進行できます。中国語・英語での相談にも対応します。
        </p>
        <p className="mt-2 text-sm">
          → <Link href="/legal/services/visa" className="text-primary underline">在留資格・ビザ申請の業務内容</Link>
        </p>
      </div>

      <div>
        <H2>費用・受任の流れ</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">会社設立・許認可の報酬額（報酬額表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href="/legal/nagare" className="text-primary underline">ご相談から完了までの受任の流れ</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
