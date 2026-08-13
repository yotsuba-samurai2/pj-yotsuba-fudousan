// /labor/services（型E・業務ハブ）＝ページ割v2 §2-C・ワイヤwireframe_labor_services.html準拠
// 文言＝原稿_社労士#1の業務カード。旧実装のFAQPage/HowTo/Service JSON-LDは廃止
// （FAQPageは/labor/faq専用・BreadcrumbListはBreadcrumb部品のみ＝委任§4-6）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
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
    // 2026-07-29 新設（指示書11「3. 障害福祉事業所の人員基準と労務」）
    href: "/labor/services/jinin-kijun-roumu",
    label: "障害福祉事業所の人員基準と労務",
    audience: "常勤換算と就業規則の関係、兼務や体制変更の取り扱いを整理したい事業所",
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
  {
    // 2026-08-11 新設。要件・依頼先は /legal/services/ikuseishuro-gaibu-kansa（主力）が扱う。
    // 本ページは「監査で何を見られるか」＝備える側の主語で分ける（luck428-column-seo 第6条）
    href: "/labor/services/gaibu-kansanin",
    label: "外部監査で見られる労務",
    audience: "育成就労の外部監査に備える監理支援機関・受入企業",
  },
];

export default async function LaborServicesPage() {
  const locale = await getRequestLocale();
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
          {/* ★2026-08-13 追加：一覧ページで「受け方」と「取り扱わない業務」を先に示す。
              サービス一覧は並べるだけになりがちだが、
              受任の前提とおつなぎ先を先に出すほうが、問い合わせの空振りが減る。 */}
          <div className="mt-5 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <p>
              <strong>法人・個人事業主のお客さまは、顧問契約を前提としてお受けします。</strong>
              手続だけ、給与計算だけのご依頼は承っておりません。実情を知らないまま届出だけをお受けすると、
              誤りに気づけないためです。
              <strong>障害年金（個人のお客さま）と外部監査人（監理支援機関）は、顧問契約を前提としません。</strong>
            </p>
            <p className="mt-3">
              手続きと給与計算は <strong>freee人事労務</strong> で行い、顧問先と
              <strong>同じデータを見ながら</strong>進めます。料金は
              <strong>着手前に書面</strong>でお出しします。
              <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
                進め方
              </Link>
              に、AIをどこまで使うか（と、使わないところ）を書いています。
            </p>
          </div>
        </header>

        {/* ★取り扱わない業務を一覧に置く。分離受任＝shigyo-compliance-gate */}
        <section className="mt-8">
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
            当事務所が取り扱わない業務
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            下記は社会保険労務士の業務ではありません。その資格をお持ちの方におつなぎします。
            <strong>紹介料の授受は一切行いません。</strong>
          </p>
          <dl className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface text-sm">
            {[
              { w: "年末調整、扶養控除・非課税限度額などの税務判断", t: "税理士" },
              { w: "法人登記の変更", t: "司法書士" },
              { w: "離職理由をめぐる争いなど、紛争性が生じた事案", t: "弁護士" },
              { w: "在留資格の申請書類の作成・申請取次／補助金の申請", t: "四葉行政書士事務所（別事業体・別々にご契約いただきます）" },
              { w: "求職者の紹介・あっせん、応募者の面接代行", t: "取り扱っておりません" },
            ].map((r) => (
              <div key={r.w} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:gap-4">
                <dt className="text-text sm:w-1/2">{r.w}</dt>
                <dd className="font-medium text-ink sm:w-1/2">→ {r.t}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 space-y-3">
          {ROWS.map((r) => (
            <Link
              key={r.href}
              href={addLocalePrefix(r.href, locale)}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{r.label}</div>
              <div className="mt-1 text-sm text-text-muted">こんな方に：{r.audience}</div>
            </Link>
          ))}
        </section>

        <p className="mt-6 text-sm">
          料金は{" "}
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">料金</Link>
          、依頼の手順は{" "}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">受任の流れ</Link>{" "}
          をご覧ください。
        </p>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
