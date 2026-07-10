// RealestateServicePage — 不動産 型A業務ページの共通シェル（LegalServicePageの不動産版）
// /toushi・/toushi/group-home・/toushi/shataku・/global で使用。
// JSON-LD＝Service（provider=@id /#organization・author=Person @id参照のみ）。
// BreadcrumbListは<Breadcrumb>部品が出力・FAQPageは/faq専用（疑問文H2は表示のみ）。
// クロスリンクはpathで自動（getCrossLinks・C3/C6）＋独立受任注記。
import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb, type Crumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { PERSON_ID } from "@/lib/seo";

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
  internalLinks: { href: string; label: string }[];
  /** クロスリンク導入文の上書き（分担説明トーン） */
  crossLinkLead?: string;
  children: ReactNode;
};

export function RealestateServicePage(p: RealestateServicePageProps) {
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
          <div className="mt-4 leading-relaxed text-text">{p.lead}</div>
        </header>

        <section className="mt-8 space-y-8">{p.children}</section>

        <nav aria-label="関連リンク" className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">このページの関連リンク</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {p.internalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {crossLinks.map((c) => (
          <CrossLinkBanner key={c.id} link={c} lead={p.crossLinkLead} />
        ))}

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

/** H2セクションの見出し（本文内で使い回す） */
export function ReH2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-xl font-semibold text-ink">{children}</h2>;
}
