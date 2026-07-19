// Faq — FAQアコーディオン（<details> 静的・JSなし）
// 表示HTMLと構造化データは同じ items から生成＝完全一致（Rich Results 合格の条件）。
// 規則（委任§4-6）：FAQPage JSON-LD は各サイトの専用FAQページ（/faq・/legal/faq・/labor/faq）のみ。
// 業務ページの疑問文セクションでは withJsonLd を渡さない（既定 false＝表示のみ）。
// links＝回答末尾の内部リンク（2026-07-19 B-3）。表示のみで JSON-LD の Answer text には含めない
// （Answer text＝回答本文 a と完全一致を維持）。多言語で使う場合は items 側でロケール済み href を渡すこと。
import Link from "next/link";

export type FaqLink = { href: string; label: string };
export type FaqItem = { q: string; a: string; links?: FaqLink[] };

/** FAQPage JSON-LD を items から生成（Answer text＝回答本文のみ。links は含めない） */
export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

type Props = {
  items: FaqItem[];
  heading?: string;
  /** FAQPage JSON-LD を出力するか（専用FAQページのみ true にする） */
  withJsonLd?: boolean;
  /** 先頭を開いた状態にするか */
  openFirst?: boolean;
};

export function Faq({ items, heading, withJsonLd = false, openFirst = true }: Props) {
  const jsonLd = buildFaqJsonLd(items);
  return (
    <section aria-label="よくあるご質問" className="mx-auto max-w-3xl px-4 py-6">
      {heading && <h2 className="mb-4 font-serif text-2xl font-semibold text-ink">{heading}</h2>}
      <div className="divide-y divide-border rounded-xl border border-border bg-surface">
        {items.map((it, i) => (
          <details key={i} open={openFirst && i === 0} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-ink">
              <span>{it.q}</span>
              <span aria-hidden className="text-text-muted transition-transform group-open:rotate-45">
                ＋
              </span>
            </summary>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-muted">{it.a}</p>
            {it.links && it.links.length > 0 && (
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {it.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-primary underline">
                    {l.label}
                  </Link>
                ))}
              </p>
            )}
          </details>
        ))}
      </div>
      {withJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </section>
  );
}
