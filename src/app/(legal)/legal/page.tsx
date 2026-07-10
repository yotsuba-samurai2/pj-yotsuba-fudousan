// /legal（型F・士業トップ）＝原稿_行政書士 #10（D-4改修・2026-07-10）
// H1＝事務所名のみ（業法分離）・パンくず無し。
// JSON-LD＝(legal)/layout.tsx の OrganizationJsonLd（@id=/legal/#organization）＋WebSiteJsonLd が出力済み
// ＝このページでは重複出力しない（委任§4-6：@id統一・Personは/aboutにフル集約・他ページは@id参照のみ）。
// 旧トップ（LegalPageContent/UnifiedTopContent）のFAQPage/HowTo/Service JSON-LDは廃止：
// FAQPageは/legal/faq専用・「助成金」訴求は業際（社労士独占）のため出さない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "四葉行政書士事務所｜文京区・茗荷谷の行政書士",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉行政書士事務所。障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請に対応。元毎日新聞中国総局長の行政書士が、中国語・英語も交え、書類作成から申請までお手伝いします。",
    path: "/legal",
    locale,
    absoluteTitle: true,
  });
}

const SERVICES = [
  { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの指定申請", sub: "グループホーム開設を法人設立から運営まで" },
  { href: "/legal/services/visa", label: "在留資格・ビザ申請", sub: "中国語・英語で相談できる申請取次" },
  { href: "/legal/services/inheritance", label: "相続・遺言・信託", sub: "遺産分割協議書・遺言書の作成" },
  { href: "/legal/services/company", label: "会社設立・各種許認可", sub: "外国人の起業・経営管理ビザにも対応" },
  { href: "/legal/services/subsidy", label: "補助金申請サポート", sub: "元記者が書く「伝わる事業計画書」" },
];

// 所属団体（可視表示のみ。Person JSON-LDのmemberOf/affiliationは/aboutに集約済み）
const MEMBERSHIPS = [
  { name: "日本行政書士会連合会", url: "https://www.gyosei.or.jp/" },
  { name: "東京都行政書士会", url: "https://www.tokyo-gyosei.or.jp/" },
  { name: "東京都行政書士会 文京支部", url: "https://gyosei-bunkyo.org/" },
];

export default function LegalPage() {
  return (
    <>
      {/* ヒーロー（H1＝事務所名のみ・業法分離） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/legal-top-16x9.webp"
            alt="四葉行政書士事務所のイメージ（文京区の事務所）"
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          {/* SP・小タブレット＝縦積み（クリップ/ヘッダーかぶり防止）／md+＝オーバーレイ */}
          <div className="md:absolute md:inset-0 md:flex md:items-center">
            <div className="bg-surface p-5 md:m-8 md:max-w-xl md:rounded-2xl md:bg-white/30 md:p-7 md:backdrop-blur-sm">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">四葉行政書士事務所</h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>東京都文京区小日向の行政書士事務所です。</strong>複雑な手続きを、整理して前に進める。——障害福祉サービスの指定申請、在留資格・ビザ、相続、会社設立、補助金申請を、元毎日新聞中国総局長の行政書士がお手伝いします。中国語・英語での相談にも対応します。
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

        {/* 代表紹介（E-E-A-T） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <img
            src="/staff/uramatsu.webp"
            alt="四葉行政書士事務所 代表 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">浦松 丈二（うらまつ・じょうじ）</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              元毎日新聞中国総局長（記者歴34年）。行政書士（登録番号 第25087022号）・宅地建物取引士。社会保険労務士試験合格（2026年9月開業予定）。「事実を整理して、伝わる形にする」——記者として34年続けた仕事を、いまは行政書士の書類と申請に注いでいます。
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

        {/* 所属団体（可視・行政書士会のみ＝業法分離） */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-4 text-sm">
          <h2 className="font-serif text-base font-semibold text-ink">所属団体</h2>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {MEMBERSHIPS.map((m) => (
              <li key={m.url}>
                <a href={m.url} target="_blank" rel="noreferrer" className="underline">
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href="/legal/ryokin" className="underline">報酬額表</Link>
          <Link href="/legal/nagare" className="underline">受任の流れ</Link>
          <Link href="/legal/faq" className="underline">よくある質問</Link>
          <Link href="/legal/column" className="underline">コラム</Link>
          <Link href="/legal/about" className="underline">事務所概要</Link>
        </nav>

        {/* フッター関連事業は TenantLayoutShell（フッターのグループ事業グリッド＋独立受任注記）が描画 */}
      </main>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
