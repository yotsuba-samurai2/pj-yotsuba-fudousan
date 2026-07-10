// ★参考ページ（型A）＝ /legal/services/visa　※原稿_行政書士 #2・共通シェル LegalServicePage 使用
// 配置＝src/app/(legal)/legal/services/visa/page.tsx
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
    title: "在留資格・ビザ申請の取次｜四葉行政書士事務所",
    description:
      "在留資格の認定・変更・更新、永住・帰化のご相談を、文京区の四葉行政書士事務所が支援します。中国語・英語対応。元新聞記者で海外4カ国の在住経験を持つ行政書士が、外国人の在留手続きを言葉と制度の両面からお手伝いします。",
    path: "/legal/services/visa",
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LegalServicePage
      slug="visa"
      crumbLabel="在留資格・ビザ申請"
      serviceName="在留資格・ビザ申請の取次・支援"
      heroAlt="在留資格・ビザ申請のイメージ（パスポートと地球儀）"
      h1="在留資格・ビザ申請"
      lead={
        <p>
          在留資格（ビザ）の認定・変更・更新の手続きは、<strong>申請取次行政書士に依頼できます</strong>。四葉行政書士事務所は、就労・経営管理・家族滞在などの在留資格申請と、永住・帰化のご相談に対応します。代表の浦松 丈二は<strong>海外4カ国での在住経験</strong>を持ち、<strong>日本語・英語・中国語</strong>で相談できます。
          <Placeholder reason="浦松＝申請取次の届出有無・対応する在留資格種別の確定" />
        </p>
      }
      governmentService
      internalLinks={[
        { href: "/legal/ryokin", label: "報酬額表" },
        { href: "/legal/nagare", label: "受任の流れ" },
        { href: "/legal/services/company", label: "会社設立・各種許認可" },
      ]}
    >
      <div>
        <H2>どんな在留資格に対応していますか？</H2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          四葉行政書士事務所が扱う主な在留資格は次のとおりです。
          <Placeholder reason="浦松＝対応種別の確定" />
        </p>
        <ul className="mt-2 space-y-1 text-sm text-text">
          <li>就労系：技術・人文知識・国際業務、経営・管理、特定技能 ほか</li>
          <li>身分系：日本人の配偶者等、永住者 ほか</li>
          <li>家族滞在・留学 ほか</li>
          <li>
            <strong>経営・管理</strong>：会社設立と一体で進められます →{" "}
            <Link href="/legal/services/company" className="text-primary underline">会社設立と経営管理ビザ</Link>
          </li>
          <li>
            育成就労（2027年4月施行）への対応は、制度の施行にあわせてご案内します
            <Placeholder reason="浦松＝育成就労対応の範囲" />
          </li>
        </ul>
      </div>

      <div>
        <H2>中国語・英語での相談はできますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          できます。代表の浦松 丈二は元毎日新聞中国総局長で、日本語・英語・中国語で相談に対応します。在留手続きは、言語と制度の両方でつまずきやすい分野です。四葉行政書士事務所は、<strong>母語での相談</strong>と<strong>制度の整理</strong>の両面からお手伝いします。
        </p>
      </div>

      <div>
        <H2>住まいや会社設立も一緒に相談できますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          できます。経営・管理の在留資格は会社設立と一体で進むため、<strong>設立書類と在留資格申請を一体で</strong>扱えます。また、来日する従業員やご家族の<strong>住まい（社宅・賃貸）</strong>は、関連事業の四葉不動産株式会社が多言語で対応します →{" "}
          <Link href="/toushi/shataku" className="text-primary underline">社宅・法人賃貸のサポート</Link>／
          <Link href="/global" className="text-primary underline">外国人・多言語のお部屋探し</Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
      </div>

      <div>
        <H2>費用・受任の流れ</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">在留資格・ビザ申請の報酬額（報酬額表）</Link>
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
