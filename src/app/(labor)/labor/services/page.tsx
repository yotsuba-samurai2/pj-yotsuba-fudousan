// /labor/services（型E・業務ハブ）＝ページ割v2 §2-C・ワイヤwireframe_labor_services.html準拠
// 文言＝原稿_社労士#1の業務カード。旧実装のFAQPage/HowTo/Service JSON-LDは廃止
// （FAQPageは/labor/faq専用・BreadcrumbListはBreadcrumb部品のみ＝委任§4-6）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "業務案内｜四葉社会保険労務士事務所",
    description:
      "四葉社会保険労務士事務所（文京区小日向）の取扱業務の一覧です。処遇改善加算のサポート、介護・障害福祉の労務管理、雇用関係助成金、外国人雇用（介護・育成就労）の労務。各業務の内容・料金・受任の流れをご案内します。",
    path: "/labor/services",
    locale,
    absoluteTitle: true,
  });
}

const ROWS = [
  {
    href: "/labor/services/shogu-kaizen",
    label: "処遇改善加算のサポート",
    audience: "加算の要件整備・計画・実績報告を任せたい介護・障害福祉事業所",
  },
  {
    href: "/labor/services/kaigo-roumu",
    label: "介護・障害福祉の労務管理",
    audience: "人員配置基準を踏まえた就業規則・シフト・社会保険手続きが必要な事業所",
  },
  {
    href: "/labor/services/joseikin",
    label: "雇用関係助成金の申請",
    audience: "キャリアアップ助成金等の受給を検討する事業者",
  },
  {
    href: "/labor/services/gaikokujin-koyo",
    label: "外国人雇用（介護・育成就労）の労務",
    audience: "外国人材の雇用契約・社会保険・受入準備を整えたい事業者",
  },
];

export default function LaborServicesPage() {
  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/labor" }, { name: "業務案内" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">業務案内</h1>
          <p className="mt-3 leading-relaxed text-text">
            <strong>四葉社会保険労務士事務所の取扱業務の一覧です。</strong>{" "}
            各業務の詳しい内容・費用・流れは、それぞれのページをご覧ください。
          </p>
        </header>

        <section className="mt-6 space-y-3">
          {ROWS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{r.label}</div>
              <div className="mt-1 text-sm text-text-muted">こんな方に：{r.audience}</div>
            </Link>
          ))}
        </section>

        <p className="mt-6 text-sm">
          料金は{" "}
          <Link href="/labor/ryokin" className="text-primary underline">料金</Link>
          、依頼の手順は{" "}
          <Link href="/labor/nagare" className="text-primary underline">受任の流れ</Link>{" "}
          をご覧ください。
        </p>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
