// BreadcrumbJsonLd — パンくず表示＋BreadcrumbList JSON-LD（server/client両文脈で使用される）
// 2026-07-11 ロケール保持（診断_ロケール保持リンク_v1 §B-9・§C-2）：
//   - client文脈（各PageContent）でも使われるため getRequestLocale は使えない。
//   - 表示リンク＝LocaleLink（内部で1回だけ接頭辞付与＝items のhrefは接頭辞なしで渡す規約・二重適用禁止）。
//   - JSON-LD＝`locale` prop（既定 "ja"）を canonicalUrl に通す。既定jaのため未対応callerの出力は現状不変（漸進導入可）。
//     callerは既取得のlocaleを渡すことで canonical・hreflang と同形のロケール付きURLになる。
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { canonicalUrl } from "@/lib/seo";
import type { LangCode } from "@/config/languages";

type BreadcrumbItem = { name: string; href: string };

export function BreadcrumbJsonLd({
  items,
  businessKey,
  locale = "ja",
}: {
  items: BreadcrumbItem[];
  businessKey: string;
  /** JSON-LD URL用ロケール（省略時ja＝既存出力バイト不変）。表示リンクはLocaleLinkが自前で付与する */
  locale?: LangCode;
}) {
  return (
    <>
      {/* JSON-LD structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            ...(i < items.length - 1
              ? { item: canonicalUrl(businessKey, item.href, locale) }
              : {}),
          })),
        }}
      />
      {/* Visible breadcrumb UI — sits between header and hero */}
      <nav
        aria-label="パンくずリスト"
        className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-3 sm:px-6 md:pt-24 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={12} className="shrink-0 text-text-muted/50" />
                )}
                {isLast ? (
                  <span className="font-medium text-text line-clamp-1">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
