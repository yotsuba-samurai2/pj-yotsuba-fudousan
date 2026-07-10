// Breadcrumb — パンくず（トップ以外の全ページ）＋ BreadcrumbList JSON-LD
// items は先頭=ホーム、末尾=現在ページ（href無し）。表示HTMLと構造化データを一致させる。
// 規則（委任§4-6）：BreadcrumbList はこの部品からのみ出力（ページ側で重複出力しない）。
import Link from "next/link";

export type Crumb = { name: string; href?: string };

type Props = {
  items: Crumb[];
  /** 絶対URL生成用のオリジン（JSON-LD用・省略時は luck428.com） */
  baseUrl?: string;
};

export function Breadcrumb({ items, baseUrl = "https://luck428.com" }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: c.href.startsWith("http") ? c.href : baseUrl + c.href } : {}),
    })),
  };
  return (
    <nav aria-label="パンくず" className="mx-auto max-w-5xl px-4 py-3">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link href={c.href} className="transition-colors hover:text-primary">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : ""}>
                  {c.name}
                </span>
              )}
              {!last && <span aria-hidden className="text-border">/</span>}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
