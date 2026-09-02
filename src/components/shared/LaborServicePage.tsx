// LaborServicePage — 社労士 型A業務ページの共通シェル（LegalServicePageの社労士版）
// ⚠️ /labor 全ルートは (labor)/layout.tsx が SR_LAUNCHED=false の間 notFound()＝本番非表示。
// JSON-LD＝Service（provider=@id /labor/#organization・author=Person @id参照のみ）。
// 登録番号は【開業時確定】＝本文に出力しない（Placeholderのみ）。
// クロスリンク（C8/C10/C12/C13/C14）はpathで自動（launchFlag=SR_LAUNCHED）。
// 2026-07-11 ロケール保持（診断_ロケール保持リンク_v1 §B-8）：async化し、シェルが直接描画する
//   internalLinks の素Linkのみ addLocalePrefix（ここで1回だけ付与）。Breadcrumb/CtaBand/CrossLinkBanner
//   は各部品が自前付与＝シェルでは触らない（二重適用禁止）。Service JSON-LD の url は接頭辞なし維持（診断§C-3）。
import type { ReactNode } from "react";
import Link from "next/link";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { PERSON_ID } from "@/lib/seo";
import type { LangCode } from "@/config/languages";
import { srRegParen } from "@/lib/shared/sr-registration";

const SITE = "https://luck428.com";

/**
 * シェル直書き部分の4ロケール文言（2026-09-01 第2波）。
 * パンくず・関連リンク見出し・署名。本文（children）は各ページが持つ。
 * 未翻訳ページ（本文ja）でも、シェルはロケールに追従して問題ない。
 */
const SHELL_I18N: Record<
  LangCode,
  { bcHome: string; bcServices: string; related: string; authorTitle: string; authorBody1: string; authorBody2: string }
> = {
  ja: {
    bcHome: "ホーム",
    bcServices: "業務案内",
    related: "このページの関連リンク",
    authorTitle: "この記事の著者",
    authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士",
    authorBody2: "・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。",
  },
  en: {
    bcHome: "Home",
    bcServices: "Services",
    related: "Related pages",
    authorTitle: "Author",
    authorBody1: " Joji Uramatsu | Representative, 四葉社会保険労務士事務所; Certified Social Insurance and Labor Consultant",
    authorBody2: "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist).",
  },
  "zh-tw": {
    bcHome: "首頁",
    bcServices: "業務案內",
    related: "本頁的相關連結",
    authorTitle: "本文作者",
    authorBody1: " 浦松 丈二｜四葉社會保險勞務士事務所 代表 社會保險勞務士",
    authorBody2: "・行政書士（登錄號 第25087022號）・宅地建物取引士。曾任每日新聞中國總局長（記者資歷34年）。",
  },
  zh: {
    bcHome: "首页",
    bcServices: "业务指南",
    related: "本页的相关链接",
    authorTitle: "本文作者",
    authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保险劳务士",
    authorBody2: "・行政书士（登录号 第25087022号）・宅地建物取引士。曾任每日新闻中国总局长（记者经历34年）。",
  },
};

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

export async function LaborServicePage(p: LaborServicePageProps) {
  const locale = await getRequestLocale();
  const sh = SHELL_I18N[locale] ?? SHELL_I18N.ja;
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
          { name: sh.bcHome, href: "/labor" },
          { name: sh.bcServices, href: "/labor/services" },
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
          <div className="font-medium text-ink">{sh.related}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {p.internalLinks.map((l) => (
              <li key={l.href}>
                <Link href={addLocalePrefix(l.href, locale)} className="underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {crossLinks.map((c) => (
          <CrossLinkBanner key={c.id} link={c} lead={p.crossLinkLead} />
        ))}

        {/* 署名（E-E-A-T・原稿_社労士サイト共通。登録番号＝sr-registration.ts） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{sh.authorTitle}</strong>
            {sh.authorBody1}
            {srRegParen(locale)}
            {sh.authorBody2}
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
