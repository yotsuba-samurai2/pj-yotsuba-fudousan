// LaborServicePage — 社労士 型A業務ページの共通シェル（LegalServicePageの社労士版）
// ⚠️ /labor 全ルートは (labor)/layout.tsx が SR_LAUNCHED=false の間 notFound()＝本番非表示。
// JSON-LD＝Service（provider=@id /labor/#organization・author=Person @id参照のみ）。
// 登録番号は【開業時確定】＝本文に出力しない（Placeholderのみ）。
// クロスリンク（C8/C10/C12/C13/C14）はpathで自動（launchFlag=SR_LAUNCHED）。
import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { PERSON_ID } from "@/lib/seo";

const SITE = "https://luck428.com";

export type LaborServicePageProps = {
  slug: string; // "shogu-kaizen" 等
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  lead: ReactNode;
  internalLinks: { href: string; label: string }[];
  crossLinkLead?: string;
  children: ReactNode;
};

export function LaborServicePage(p: LaborServicePageProps) {
  const path = `/labor/services/${p.slug}`;
  const url = SITE + path;
  const crossLinks = getCrossLinks(path, SR_LAUNCHED);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": url + "#service",
        name: p.serviceName,
        provider: { "@id": SITE + "/labor/#organization" },
        author: { "@id": PERSON_ID },
        areaServed: "東京都文京区およびその周辺",
        url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/labor" },
          { name: "業務案内", href: "/labor/services" },
          { name: p.crumbLabel },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <img
          src={`/hero/labor-${p.slug}-16x9.webp`}
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

        {/* 署名（E-E-A-T・原稿_社労士サイト共通。登録番号＝開業時確定まで非出力） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士
            <Placeholder reason="開業時確定＝社労士登録番号" />
            ・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}

/** H2セクションの見出し */
export function LaborH2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-xl font-semibold text-ink">{children}</h2>;
}
