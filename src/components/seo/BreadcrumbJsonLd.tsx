import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { canonicalUrl } from "@/lib/seo";

type BreadcrumbItem = { name: string; href: string };

export function BreadcrumbJsonLd({
  items,
  businessKey,
}: {
  items: BreadcrumbItem[];
  businessKey: string;
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
              ? { item: canonicalUrl(businessKey, item.href) }
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
