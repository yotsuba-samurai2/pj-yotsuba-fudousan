/** Editorial supplement for one Japanese article; no DB/seed changes or partnership claim. */
export function OverseasTaxReference({ slug, locale }: { slug: string; locale: string }) {
  if (locale !== "ja" || slug !== "chugoku-chuzai-shakaihosho-kyotei-nijukanyu") return null;
  return (
    <aside aria-labelledby="overseas-tax-reference" className="mx-auto my-8 max-w-3xl rounded-xl border border-border bg-surface p-6">
      <h2 id="overseas-tax-reference" className="text-lg font-semibold">税務についての参考記事</h2>
      <p className="mt-3 text-sm leading-relaxed">
        社会保険の二重加入と所得税の二重課税は、別の制度です。海外赴任に伴う税務の一般的な解説として、次の記事も参考になります。
      </p>
      <p className="mt-3 text-sm leading-relaxed">
        <a href="https://arimura-cpa.com/column/kaigai-funin-kakuteishinkoku/tax-treaty/" className="text-primary underline underline-offset-4">
          海外駐在員の確定申告における租税条約と二重課税の解消方法
        </a>（有村公認会計士・税理士事務所）
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        外部サイトの解説です。個別の税務判断は税理士へご相談ください。
      </p>
    </aside>
  );
}
