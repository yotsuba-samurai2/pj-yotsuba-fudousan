// Faq — FAQアコーディオン（<details> 静的・JSなし）
// 表示HTMLと構造化データは同じ items から生成＝完全一致（Rich Results 合格の条件）。
// 規則（委任§4-6）：FAQPage JSON-LD は各サイトの専用FAQページ（/faq・/legal/faq・/labor/faq）のみ。
// 業務ページの疑問文セクションでは withJsonLd を渡さない（既定 false＝表示のみ）。
export type FaqItem = { q: string; a: string };

type Props = {
  items: FaqItem[];
  heading?: string;
  /** FAQPage JSON-LD を出力するか（専用FAQページのみ true にする） */
  withJsonLd?: boolean;
  /** 先頭を開いた状態にするか */
  openFirst?: boolean;
};

export function Faq({ items, heading, withJsonLd = false, openFirst = true }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
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
          </details>
        ))}
      </div>
      {withJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </section>
  );
}
