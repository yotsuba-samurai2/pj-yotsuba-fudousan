// RealestateServicePage — 不動産 型A業務ページの共通シェル（LegalServicePageの不動産版）
// /toushi・/toushi/group-home・/toushi/shataku・/global で使用。
// JSON-LD＝Service（provider=@id /#organization・author=Person @id参照のみ）。
// BreadcrumbListは<Breadcrumb>部品が出力・FAQPageは/faq専用（疑問文H2は表示のみ）。
// クロスリンクはpathで自動（getCrossLinks・C3/C6）＋独立受任注記。
// 2026-07-11 ロケール保持（診断_ロケール保持リンク_v1 §B-7）：async化し、シェルが直接描画する
//   internalLinks の素Linkのみ addLocalePrefix（ここで1回だけ付与）。Breadcrumb/CtaBand/CrossLinkBanner
//   は各部品が自前付与＝シェルでは触らない（二重適用禁止）。Service JSON-LD の url は接頭辞なし維持（診断§C-3）。
//   既存の多言語上書きprops（relatedAria等）は維持。
import type { ReactNode } from "react";
import Link from "next/link";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb, type Crumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { PERSON_ID } from "@/lib/seo";
import type { Column } from "@/lib/columns";

const SITE = "https://luck428.com";

export type RealestateServicePageProps = {
  /** 内部パス（例 "/toushi/group-home"） */
  path: string;
  /** パンくず（先頭=ホーム(/)・末尾=現在ページ） */
  crumbs: Crumb[];
  /** JSON-LD Service name */
  serviceName: string;
  /** ヒーロー画像（/hero/realestate-*-16x9.webp） */
  heroSrc: string;
  heroAlt: string;
  h1: string;
  /** 結論（回答ファースト） */
  lead: ReactNode;
  /**
   * 冒頭の回答ブロック（B-4・2026-07-19）。H1直下・lead の前に描画する自己完結の150〜200字。
   * 「誰に・何を・どの地域で・誰が担当するか・分離受任の明示」を1段落に収めた確定文言を渡す。
   * 日本語版のみ運用のため、呼び出し側で locale === "ja" のときだけ渡すこと。
   */
  answerBlock?: ReactNode;
  internalLinks: { href: string; label: string }[];
  /** クロスリンク導入文の上書き（分担説明トーン） */
  crossLinkLead?: string;
  /** 多言語上書き（省略時=ja既定文言のまま・既存ページの出力は不変。2026-07-11 /toushi/shataku 4ロケール化で追加） */
  relatedAria?: string;
  relatedHeading?: string;
  authorAlt?: string;
  authorLabel?: string;
  authorBio?: string;
  /** テーマ関連コラム（内部リンク）。省略・空配列なら非表示。current locale で localize 済みを渡す */
  relatedColumns?: Column[];
  /** 関連コラム見出し（省略時「関連コラム」） */
  relatedColumnsHeading?: string;
  children: ReactNode;
};

export async function RealestateServicePage(p: RealestateServicePageProps) {
  const locale = await getRequestLocale();
  const url = SITE + p.path;
  const crossLinks = getCrossLinks(p.path, SR_LAUNCHED);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": url + "#service",
        name: p.serviceName,
        provider: { "@id": SITE + "/#organization" },
        author: { "@id": PERSON_ID },
        areaServed: "東京都文京区およびその周辺",
        url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb items={p.crumbs} />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <img
          src={p.heroSrc}
          alt={p.heroAlt}
          width={1600}
          height={900}
          className="mt-3 w-full rounded-2xl object-cover"
          fetchPriority="high"
        />

        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{p.h1}</h1>
          {p.answerBlock && (
            <p className="mt-4 leading-relaxed text-text">{p.answerBlock}</p>
          )}
          <div className="mt-4 leading-relaxed text-text">{p.lead}</div>
        </header>

        <section className="mt-8 space-y-8">{p.children}</section>

        <nav aria-label={p.relatedAria ?? "関連リンク"} className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">{p.relatedHeading ?? "このページの関連リンク"}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {p.internalLinks.map((l) => (
              <li key={l.href}>
                <Link href={addLocalePrefix(l.href, locale)} className="underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {p.relatedColumns && p.relatedColumns.length > 0 && (
          <nav
            aria-label={p.relatedColumnsHeading ?? "関連コラム"}
            className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm"
          >
            <div className="font-medium text-ink">
              {p.relatedColumnsHeading ?? "関連コラム"}
            </div>
            <ul className="mt-3 space-y-2">
              {p.relatedColumns.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={addLocalePrefix(`/column/${col.slug}`, locale)}
                    className="text-primary underline"
                  >
                    {col.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {crossLinks.map((c) => (
          <CrossLinkBanner key={c.id} link={c} lead={p.crossLinkLead} />
        ))}

        {/* 署名（E-E-A-T・原稿_不動産サイト共通） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt={p.authorAlt ?? "四葉不動産株式会社 代表取締役 浦松丈二"}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{p.authorLabel ?? "この記事の著者"}</strong>{" "}
            {p.authorBio ??
              "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。"}
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}

/** H2セクションの見出し（本文内で使い回す） */
export function ReH2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-xl font-semibold text-ink">{children}</h2>;
}
