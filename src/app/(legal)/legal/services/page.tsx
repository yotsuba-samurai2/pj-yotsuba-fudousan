// ★参考ページ（型E・ハブ）＝ /legal/services　※原稿_行政書士 #6
// 配置＝src/app/(legal)/legal/services/page.tsx。JSON-LD＝CollectionPage＋BreadcrumbList。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";

const SITE = "https://luck428.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "業務案内｜四葉行政書士事務所",
    description:
      "四葉行政書士事務所（文京区小日向）の取扱業務の一覧です。障害福祉サービスの指定申請、在留資格・ビザ、相続・遺言、会社設立・許認可、補助金申請サポート。各業務の内容・報酬・受任の流れをご案内します。",
    path: "/legal/services",
    locale,
    absoluteTitle: true,
  });
}

const SERVICES = [
  { name: "障害福祉サービスの指定申請", who: "グループホーム・放課後等デイ等を開設したい事業者", href: "/legal/services/shogai-fukushi" },
  { name: "在留資格・ビザ申請", who: "在留資格の取得・変更・更新をしたい外国人・受入企業", href: "/legal/services/visa" },
  { name: "相続・遺言・信託", who: "遺産分割協議書・遺言書を整えたい方", href: "/legal/services/inheritance" },
  { name: "会社設立・各種許認可", who: "起業・許認可が必要な事業者（外国人の起業含む）", href: "/legal/services/company" },
  { name: "補助金申請サポート", who: "伝わる事業計画書で補助金に挑みたい事業者", href: "/legal/services/subsidy" },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": SITE + "/legal/services#collection",
        name: "業務案内｜四葉行政書士事務所",
        url: SITE + "/legal/services",
        hasPart: SERVICES.map((s) => ({ "@type": "Service", name: s.name, url: SITE + s.href })),
      },
      // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）
    ],
  };
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <Breadcrumb items={[{ name: "ホーム", href: "/legal" }, { name: "業務案内" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">業務案内</h1>
          <p className="mt-3 leading-relaxed text-text">
            <strong>四葉行政書士事務所の取扱業務の一覧です。</strong>各業務の詳しい内容・費用・流れは、それぞれのページをご覧ください。
          </p>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link key={s.href} href={s.href} className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm">
              <div className="font-serif text-lg font-semibold text-ink">{s.name}</div>
              <div className="mt-1 text-sm text-text-muted">こんな方に：{s.who}</div>
              <div className="mt-2 text-sm font-medium text-primary underline">詳しく見る →</div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-sm text-text-muted">
          料金は <Link href="/legal/ryokin" className="text-primary underline">報酬額表</Link>、依頼の手順は{" "}
          <Link href="/legal/nagare" className="text-primary underline">受任の流れ</Link> をご覧ください。
        </p>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
