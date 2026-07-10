// /（型F・二本柱トップ）＝原稿_不動産 #1（E-1改修・2026-07-10・単独PR）
// 【社名保護】H1・titleに「四葉不動産」必須（GSCベースライン退避済＝_backup/GSCベースライン_E-0_不動産トップ_2026-07-10.md）。
// JSON-LD＝layoutの OrganizationJsonLd（RealEstateAgent @id=/#organization）＋WebSiteJsonLd が出力済み＝重複出力しない。
// Person＝/aboutにフル集約・ここでは可視の代表カードのみ（@id参照はlayout側のfounderで表現）。
// 【1ページ1LINKA】本文の60秒診断枠がLINKA＝右下FABは出さない（TenantLayoutShellがpathname==="/"でsuppressed）。
// AI接続（/api/linka）はフェーズK＝それまで診断枠は各ピラーへの静的導線＋LINE（「準備中」明記・優良誤認回避）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import { LINE_URL } from "@/lib/shared/office";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "四葉不動産｜文京区の相続不動産と投資・事業用不動産",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉不動産株式会社。相続した不動産の管理・活用・売却と、投資用・事業用（グループホーム・社宅）の不動産を扱います。元新聞記者で宅建士・行政書士の代表が、多言語で最初の一歩からお手伝いします。",
    path: "/",
    keywords: ["四葉不動産", "文京区 相続 不動産", "文京区 不動産会社"],
    locale,
    absoluteTitle: true,
  });
}

const PILLARS = [
  {
    href: "/souzoku",
    tag: "柱A",
    title: "相続した不動産、どうする？",
    body: "出口は「管理・活用・売却」の3つ。期限のある相続登記から出口の選び方まで、1本のガイドに整理しました。",
    anchor: "文京区で不動産を相続したら——完全ガイド",
  },
  {
    href: "/toushi",
    tag: "柱B",
    title: "投資用・事業用の不動産を探す",
    body: "グループホーム物件・社宅・収益物件を、事業の目的から逆算してご提案します。",
    anchor: "投資用・事業用不動産",
  },
  {
    href: "/global",
    tag: "多言語",
    title: "外国人のお部屋探し",
    body: "日本での家探しを、母語で。",
    anchor: "外国人・多言語のお部屋探し",
  },
];

const QA = [
  {
    q: "文京区で不動産を相続したら、まず何をすればいいですか？",
    a: "まず相続登記の期限を確認します（2024年4月から義務化・原則3年以内）。進め方の全体は完全ガイドへ。",
    href: "/souzoku",
    anchor: "相続不動産の完全ガイド",
  },
  {
    q: "グループホームに使える物件はどう探せばいいですか？",
    a: "指定基準（立地・構造・面積・消防）を見据えて、契約前に確認するのが鉄則です。",
    href: "/toushi/group-home",
    anchor: "グループホーム物件",
  },
  {
    q: "外国人でも日本で部屋を借りられますか？",
    a: "借りられます。審査・保証・言語の壁を、四葉不動産が母語でサポートします。",
    href: "/global",
    anchor: "多言語のお部屋探し",
  },
  {
    q: "四葉不動産はどんな会社ですか？",
    a: "文京区小日向の宅地建物取引業者で、相続不動産と投資・事業用不動産が専門です。",
    href: "/about",
    anchor: "わたしたち",
  },
];

const DIAGNOSIS_CHIPS = [
  { href: "/souzoku", label: "相続の相談" },
  { href: "/toushi", label: "投資・事業用を探す" },
  { href: "/global", label: "お部屋探し" },
];

export default function HomePage() {
  return (
    <>
      {/* ヒーロー（H1に社名・回答ファースト・桜=bunkyo-sakura） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/bunkyo-sakura-16x9.webp"
            alt="文京区・播磨坂の桜並木のイメージ"
            width={1600}
            height={900}
            className="h-[60vw] max-h-[480px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="hero-fade-in m-4 max-w-2xl rounded-2xl bg-white/85 p-5 backdrop-blur-sm sm:m-8 sm:p-7">
              <h1 className="font-serif text-2xl font-bold leading-snug text-ink sm:text-3xl">
                四葉不動産｜文京区で、相続の不動産と投資・事業用の不動産を。
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>四葉不動産株式会社は、東京都文京区小日向の不動産会社です。</strong>
                親から受け継いだ家をどうするか。グループホームや社宅に使う物件をどう確保するか。——文京区・茗荷谷の地元で、元新聞記者の宅建士・行政書士である代表が、最初の一歩からお手伝いします。外国人の方のお部屋探しも、日本語・英語・中国語で対応します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* 二本柱カード（＋横断） */}
        <section aria-label="二本柱" className="mt-10 grid gap-3 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="block rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md"
            >
              <span className="inline-block rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-medium text-primary-dark">
                {p.tag}
              </span>
              <div className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">{p.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
              <div className="mt-3 text-sm font-medium text-primary">→ {p.anchor}</div>
            </Link>
          ))}
        </section>

        {/* 60秒診断（LINKA起点枠・AI接続はフェーズK＝準備中） */}
        <section aria-label="60秒診断" className="mt-10 rounded-2xl bg-primary-tint p-6 text-center">
          <h2 className="font-serif text-xl font-semibold text-ink">
            60秒で、あなたの「次の一歩」がわかります。
          </h2>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {DIAGNOSIS_CHIPS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full border border-primary/40 bg-surface px-4 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-text-muted">
            AIコンシェルジュLINKAによる診断は準備中です。いまは上の入口からお進みいただくか、LINEで代表に直接どうぞ——状況を伺い、次の一歩を一緒に整理します。
          </p>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            LINEで一言相談（無料）
          </a>
        </section>

        {/* 代表紹介（E-E-A-T） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <img
            src="/staff/uramatsu.webp"
            alt="四葉不動産株式会社 代表取締役 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">浦松 丈二（うらまつ・じょうじ）</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              元毎日新聞中国総局長（記者歴34年）・海外4カ国在住。宅地建物取引士・行政書士。社会保険労務士試験合格（2026年9月開業予定）。34年、記者として人の話を聞いてきました。あなたの事情を整理するところから、一緒に。
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

        {/* 疑問文H2直答（AIクエリ形・FAQPage JSON-LDは/faq専用＝表示のみ） */}
        <section aria-label="よくある疑問への直答" className="mt-10 space-y-6">
          {QA.map((item) => (
            <div key={item.q}>
              <h2 className="font-serif text-lg font-semibold text-ink">{item.q}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text">
                {item.a}{" "}
                <Link href={item.href} className="text-primary underline">
                  {item.anchor}
                </Link>
              </p>
            </div>
          ))}
        </section>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href="/services" className="underline">サービス一覧</Link>
          <Link href="/column" className="underline">コラム</Link>
          <Link href="/faq" className="underline">よくある質問</Link>
          <Link href="/access" className="underline">アクセス・料金</Link>
        </nav>
      </main>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
