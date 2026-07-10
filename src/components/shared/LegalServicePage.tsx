// LegalServicePage — 行政書士 型A業務ページの共通シェル
// 各業務ページ（visa/inheritance/company/subsidy…）はこのシェルにデータ＋本文を渡すだけ。
// 差し替えるのは：slug（→URL・/hero/legal-<slug>-16x9.webp）・meta（各ページのexport）・h1・lead・faq・internalLinks・children（H2群）。
// JSON-LD＝Service（BreadcrumbListは<Breadcrumb>部品が出力・FAQPageは/legal/faq専用）。クロスリンクはpathで自動（getCrossLinks）。
// 本番配置＝src/components/shared/LegalServicePage.tsx。※flagship shogai-fukushi は全部入り版を別途保持。
import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { PERSON_ID } from "@/lib/seo";

const SITE = "https://luck428.com";

export type ServiceQA = { q: string; a: string };
export type LegalServicePageProps = {
  slug: string; // "visa" 等
  crumbLabel: string; // パンくず末尾＝ページ名
  serviceName: string; // JSON-LD Service name
  heroAlt: string;
  h1: string;
  lead: ReactNode; // 結論（回答ファースト）
  /** 原稿で GovernmentService 指定のあるページ（shogai-fukushi/visa/company）で true */
  governmentService?: boolean;
  internalLinks: { href: string; label: string }[];
  children: ReactNode; // H2セクション群（疑問文H2＝表示のみ・FAQPageは/faq専用）
};

export function LegalServicePage(p: LegalServicePageProps) {
  const path = `/legal/services/${p.slug}`;
  const url = SITE + path;
  const crossLinks = getCrossLinks(path, SR_LAUNCHED);

  // BreadcrumbList は <Breadcrumb> 部品が出力（二重出力を避ける）。FAQPage は /legal/faq 専用
  // （型Aの疑問文H2は表示のみ＝本文とFAQPage回答文の不一致を避ける）。
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": p.governmentService ? ["Service", "GovernmentService"] : "Service",
        "@id": url + "#service",
        name: p.serviceName,
        provider: { "@id": SITE + "/legal/#organization" },
        author: { "@id": PERSON_ID },
        areaServed: "東京都およびその周辺",
        url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/legal" },
          { name: "業務案内", href: "/legal/services" },
          { name: p.crumbLabel },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {/* ヒーロービジュアル（slug で決まる） */}
        <img
          src={`/hero/legal-${p.slug}-16x9.webp`}
          alt={p.heroAlt}
          width={1600}
          height={900}
          className="mt-3 w-full rounded-2xl object-cover"
          fetchPriority="high"
        />

        {/* 結論・回答ファースト */}
        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{p.h1}</h1>
          <div className="mt-4 leading-relaxed text-text">{p.lead}</div>
        </header>

        {/* 本文 H2 群 */}
        <section className="mt-8 space-y-8">{p.children}</section>

        {/* 内部リンク束（サイロ内・コンパクト） */}
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

        {/* クロスリンク（事業間・独立受任注記＝pathで自動） */}
        {crossLinks.map((c) => (
          <CrossLinkBanner key={c.id} link={c} />
        ))}

        {/* 署名（E-E-A-T） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img src="/staff/uramatsu-square.webp" alt="四葉行政書士事務所 代表 浦松丈二" width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}

/** H2セクションの見出し（本文内で使い回す） */
export function H2({ children }: { children: ReactNode }) {
  return <h2 className="font-serif text-xl font-semibold text-ink">{children}</h2>;
}
