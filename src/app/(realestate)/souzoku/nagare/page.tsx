// /souzoku/nagare（型D・HowTo）＝原稿_不動産 #6
// JSON-LD＝HowTo（既存部品）＋BreadcrumbList（Breadcrumb部品）＋author=Person(@id参照)。
// 不動産の有料相談＝A案（媒介前提の相談は無料／媒介を伴わないコンサルのみ別合意で有料・原則30分5,500円税込）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "相続した不動産の相談から売却・活用までの流れ｜四葉不動産",
    description:
      "相続した不動産をどう進めるか——四葉不動産株式会社が、ご相談から現状の整理、査定、管理・活用・売却の方針決定、契約・引渡しまでの流れをご説明します。文京区・茗荷谷の地元で、元新聞記者の宅建士がLINE・電話・オンラインで最初の一歩からお手伝いします。",
    path: "/souzoku/nagare",
    keywords: ["相続 不動産 相談 流れ", "相続した家 売却 手順", "文京区 相続 不動産 相談"],
    locale,
    absoluteTitle: true,
  });
}

const STEPS = [
  {
    name: "ご相談（無料）",
    text: "LINE・電話・オンライン。「何から手をつけるか分からない」段階で構いません。",
  },
  {
    name: "現状のヒアリング",
    text: "物件の場所・種類、相続の状況、相続登記の有無などを伺います。",
  },
  {
    name: "査定・現状整理",
    text: "物件を確認し、管理・活用・売却それぞれの見通しを整理します。",
  },
  {
    name: "方針のご提案",
    text: "「管理」「活用（賃貸等）」「売却」の3つの出口から、ご希望に合う方向をご提案します。",
  },
  {
    name: "ご契約",
    text: "売却なら媒介契約、賃貸・管理なら管理委託契約を、内容をご説明のうえ締結します。",
  },
  {
    name: "実行・引渡し",
    text: "販売活動や入居者募集、引渡し・精算まで対応します。",
  },
];

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="相続した不動産の相談から解決までの流れ"
        description="四葉不動産株式会社での、相続不動産のご相談から管理・活用・売却の実行までの流れです。"
        steps={STEPS}
      />
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "文京区で不動産を相続したら", href: "/souzoku" },
          { name: "相談〜解決の流れ" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            相続した不動産の相談から売却・活用までの流れ
          </h1>
          <p className="mt-4 leading-relaxed text-text">
            相続した不動産の相談は、<strong>「まず現状を話す」ところから始められます。</strong>{" "}
            四葉不動産株式会社は、ご相談→現状ヒアリング→査定→方針（管理・活用・売却）の整理→ご提案→契約→引渡し、という流れでお手伝いします。相続登記や相続税など不動産会社の業務外の手続きは、司法書士・税理士等の専門家と連携しながら進めます。
          </p>
        </header>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            相続した不動産の相談は、何から始めますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            まずはLINEか電話で「相続した家をどうしたらいい？」の一言からで大丈夫です。四葉不動産株式会社は、状況を伺い、次の一歩を一緒に整理します。<strong>当社に売却・活用（媒介）をご依頼いただく前提のご相談は無料</strong>です。媒介を伴わない不動産コンサルティング（他社物件のセカンドオピニオン、資産全体の活用・保有方針の助言など）をご希望の場合は、別途の合意のうえ原則30分5,500円（税込）で承ります（オンライン可）。
            <Placeholder reason="石井弁護士＝宅建業法上の相談料の切り分け（A案の最終確認）" />
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            相談から解決までの流れは、どうなりますか？（6ステップ）
          </h2>
          <ol className="mt-4 space-y-4">
            {STEPS.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium text-ink">{s.name}</div>
                  <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
                  {i === 1 && <Placeholder reason="浦松＝ヒアリングで確認する項目" />}
                  {i === 2 && <Placeholder reason="浦松＝査定の範囲・費用の有無" />}
                  {i === 5 && <Placeholder reason="浦松＝標準的な所要期間" />}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-semibold text-ink">
            相続登記や相続税は、四葉不動産が手続きしますか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            四葉不動産株式会社は、不動産の相談・売買・賃貸・管理を扱います。<strong>相続登記は司法書士、相続税は税理士</strong>の領域のため、これらは提携する専門家と連携して進めます。相続に関する書類作成・許認可は、関連事業の四葉行政書士事務所（別事業体）が対応できます。
          </p>
          <p className="mt-2 text-sm">
            →{" "}
            <Link href="/souzoku" className="text-primary underline">
              文京区で不動産を相続したら——完全ガイド
            </Link>
            ／
            <Link href="/legal/services/inheritance" className="text-primary underline">
              相続・遺言の手続き（四葉行政書士事務所）
            </Link>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
          </p>
        </section>

        <nav aria-label="関連リンク" className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">このページの関連リンク</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            <li><Link href="/souzoku" className="underline">文京区で不動産を相続したら</Link></li>
            <li><Link href="/access" className="underline">アクセス・料金</Link></li>
          </ul>
        </nav>

        {/* 署名（E-E-A-T・原稿_不動産サイト共通） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉不動産株式会社 代表取締役 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）・海外4カ国在住経験。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
