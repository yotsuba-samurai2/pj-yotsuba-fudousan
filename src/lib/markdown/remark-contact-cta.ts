/**
 * Markdownの文字列を分割せず、構文木のトップレベル境界へCTA用ノードを挿入。
 * 参照リンク・脚注・表・コード・リストを壊さず、本文ソースとDBは不変。
 * ローカルな構造型を使うため、新規の実行時依存は不要。
 */
export const CONTACT_CTA_SLOT_ID = "yotsuba-mid-article-cta";

export interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  position?: { start: { offset?: number }; end: { offset?: number } };
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

const SAFE_PREVIOUS = new Set(["paragraph", "list", "table", "blockquote", "code"]);
const NON_BODY = new Set(["definition", "footnoteDefinition", "yaml", "toml"]);

/** 最も中央に近い安全な境界を選ぶ。短文・単一ブロックは無理に分断しない。 */
export function contactCtaInsertionIndex(tree: MarkdownNode): number | null {
  const nodes = tree.children;
  if (!nodes || nodes.length < 2) return null;
  if (nodes.some((node) => node.data?.hProperties?.id === CONTACT_CTA_SLOT_ID)) return null;
  const bodyNodes = nodes.filter((node) => !NON_BODY.has(node.type));
  const total = bodyNodes.at(-1)?.position?.end.offset;
  if (!total || total < 800) return null;

  const candidates: { index: number; distance: number; ratio: number }[] = [];
  for (let i = 1; i < nodes.length; i += 1) {
    const previous = nodes[i - 1];
    const next = nodes[i];
    const end = previous.position?.end.offset;
    if (!SAFE_PREVIOUS.has(previous.type) || NON_BODY.has(next.type) || end === undefined) continue;
    const ratio = end / total;
    // 40–60%に安全な区切りが無ければ30–70%の最寄りを使う。
    if (ratio >= 0.3 && ratio <= 0.7) candidates.push({ index: i, distance: Math.abs(ratio - 0.5), ratio });
  }
  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0]?.index ?? null;
}

export function remarkContactCta() {
  return (tree: MarkdownNode): void => {
    const index = contactCtaInsertionIndex(tree);
    if (index === null || !tree.children) return;
    tree.children.splice(index, 0, {
      type: "paragraph",
      children: [],
      // mdast-util-to-hastの公開data.hName/hProperties拡張。raw HTMLは許可しない。
      data: { hName: "div", hProperties: { id: CONTACT_CTA_SLOT_ID } },
    });
  };
}
