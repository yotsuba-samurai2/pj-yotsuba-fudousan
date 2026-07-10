// /labor（型F・社労士トップ・開業版）＝原稿_社労士 #1
// ⚠️ SR_LAUNCHED=false の間は (labor)/layout.tsx が notFound()＝本番非表示（sitemap非掲載・被リンクなし）。
// JSON-LD＝layoutの OrganizationJsonLd（ProfessionalService・フラグ内のみ）＋WebSiteJsonLd が出力済み＝重複出力しない。
// 登録番号は【開業時確定】まで出力しない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "四葉社会保険労務士事務所｜文京区・障害福祉に強い社労士",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉社会保険労務士事務所。障害福祉・介護事業所の労務管理、処遇改善加算、社会保険手続き、雇用関係助成金、外国人介護人材の労務に対応。元新聞記者の社労士が、複雑な労務を整理してお手伝いします。",
    path: "/labor",
    keywords: ["社労士 文京区", "障害福祉 社労士", "介護 事業所 労務"],
    locale,
    absoluteTitle: true,
  });
}

const SERVICES = [
  { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート", sub: "賃金規程の整備から計画・実績報告まで" },
  { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理", sub: "人員配置基準と日々の手続き" },
  { href: "/labor/services/joseikin", label: "雇用関係助成金の申請", sub: "キャリアアップ助成金ほか" },
  { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務", sub: "多言語対応" },
];

export default function LaborTopPage() {
  return (
    <>
      {/* ヒーロー（H1＝事務所名のみ） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/labor-top-16x9.webp"
            alt="四葉社会保険労務士事務所のイメージ（文京区の事務所）"
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="m-4 max-w-xl rounded-2xl bg-white/80 p-5 backdrop-blur-sm sm:m-8 sm:p-7">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">四葉社会保険労務士事務所</h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>東京都文京区小日向の社会保険労務士事務所です。</strong>人の手続きを、事業の力に。——障害福祉・介護事業所の労務管理、処遇改善加算、社会保険手続き、雇用関係助成金、外国人介護人材の労務を、元新聞記者の社労士がお手伝いします。
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* 取扱業務カード（具体アンカー・内部リンク一覧§1どおり） */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{s.label}</div>
              <div className="mt-1 text-sm text-text-muted">{s.sub}</div>
            </Link>
          ))}
        </section>

        {/* 代表紹介（E-E-A-T・登録番号は開業時確定まで非出力） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <img
            src="/staff/uramatsu.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">浦松 丈二（うらまつ・じょうじ）</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              元毎日新聞中国総局長（記者歴34年）。社会保険労務士
              <Placeholder reason="開業時確定＝社労士登録番号" />
              ・行政書士（登録番号 第25087022号）・宅地建物取引士。制度と現場のあいだにある「複雑さ」を整理して伝える——記者の仕事を、労務に活かします。
            </p>
            <p className="mt-2 text-xs">
              プロフィール：
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                士業ドットコム
              </a>
              ／
              <a
                href="https://www.wikidata.org/wiki/Q139738129"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Wikidata
              </a>
            </p>
          </div>
        </section>

        {/* 四葉グループとの連携（原稿#1・独立受任注記＝3者版） */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">四葉グループとの連携</h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            障害福祉事業の立ち上げは、<strong>物件（四葉不動産株式会社）→ 指定申請（四葉行政書士事務所）→ 労務（当事務所）</strong>の順に進みます。四葉はこの3つを関連事業として持つため、開設から運営までを見通した相談ができます。
          </p>
          <p className="mt-2 text-sm">
            →{" "}
            <Link href="/toushi/group-home" className="text-primary underline">
              グループホームに使える物件探し（四葉不動産）
            </Link>
            ／
            <Link href="/legal/services/shogai-fukushi" className="text-primary underline">
              障害福祉サービスの指定申請（四葉行政書士事務所）
            </Link>
          </p>
          <p className="mt-2 text-xs text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
          </p>
        </section>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href="/labor/ryokin" className="underline">料金</Link>
          <Link href="/labor/nagare" className="underline">受任の流れ</Link>
          <Link href="/labor/faq" className="underline">よくある質問</Link>
          <Link href="/labor/about" className="underline">事務所概要</Link>
        </nav>
      </main>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
