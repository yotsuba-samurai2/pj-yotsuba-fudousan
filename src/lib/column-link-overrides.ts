import { getColumnLanguageIndex } from "@/lib/column-language-index";
import { parseColumnLink, resolveColumnLink, type ColumnLinkOverrides } from "@/lib/column-language-links";

/** Markdown本文の自サイトコラムURLだけを照合。本文・公開データの書換えは行わない。 */
export async function getColumnLinkOverrides(content: string): Promise<ColumnLinkOverrides> {
  // 外部URLを先に丸ごと消費し、その中の /en/column/... を相対リンクと誤認しない。
  const candidates = new Set(content.match(/https?:\/\/[^\s)<>]+|(?<![\w/.:])\/(?:en\/|zh-tw\/|zh\/)?(?:legal\/|labor\/)?column\/[a-zA-Z0-9._~%-]+(?:\?[^\s)#]*)?(?:#[^\s)]*)?/g) ?? []);
  const targets = [...candidates].map(href => ({ href, target: parseColumnLink(href) }))
    .filter(item => item.target !== undefined);
  const businesses = [...new Set(targets.map(item => item.target!.business))];
  const indexes = new Map(await Promise.all(businesses.map(async business =>
    [business, await getColumnLanguageIndex(business)] as const,
  )));
  const overrides: ColumnLinkOverrides = {};
  for (const { href, target } of targets) {
    const replacement = resolveColumnLink(href, indexes.get(target!.business)!);
    if (replacement) overrides[href] = replacement;
  }
  return overrides;
}
