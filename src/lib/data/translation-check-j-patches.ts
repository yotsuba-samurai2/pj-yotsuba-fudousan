// 翻訳チェック §J（DB翻訳値側）の一括是正パッチ（2026-07-20 浦松の翻訳チェック結果より）。
//
// 背景：修正シート §J のうち以下はソースコードではなく DB translation テーブル（4言語）側の値。
//   - J5 /about（繁）資質 → 資格／證照
//   - J6 /contact（繁）定休日 → 公休日
//   - J7 フッター/住所（簡）「東」（繁/日字体）→ 东
// これらは「ロケール限定＋キーパス・アンカー限定」の部分文字列置換で安全に是正できる。
// find は誤り側の字体/語のみに一致し、既に正しい値には一致しない（冪等）。
//
// J4 /legal-notice（英）「専任」の誤訳（"Chief"）は legalNotice.items 配列内の値で、
//   現行値の形が不確実なため自動置換の対象にしない（誤置換防止）。ルート側で現行値を表示し、
//   管理エディタ（特定商取引法・en）で手修正する運用とする。
// J9 コラム記事の社名は翻訳辞書ではなくコラムデータ側＝本パッチの対象外。
import type { LangCode } from "@/config/languages";

export type JPatch = {
  /** シート項目ID（表示用） */
  id: string;
  /** 人間可読の説明 */
  label: string;
  /** 対象ロケール辞書 */
  locale: LangCode;
  /** 安全スコープ：ドットパスにこの部分文字列を含むリーフのみ対象 */
  pathIncludes: string;
  /** 誤り側の部分文字列（正しい値には一致しない＝冪等） */
  find: string;
  /** 置換後 */
  replace: string;
};

export const J_PATCHES: JPatch[] = [
  {
    id: "J5",
    label: "/about（繁）資格見出し「資質」→「資格／證照」",
    locale: "zh-tw",
    pathIncludes: "realestate.aboutPage",
    find: "資質",
    replace: "資格／證照",
  },
  {
    id: "J6",
    label: "/contact（繁）「定休日」→「公休日」",
    locale: "zh-tw",
    pathIncludes: "contact",
    find: "定休日",
    replace: "公休日",
  },
  {
    id: "J7-address",
    label: "住所（簡）「東」字体 → 「东」",
    locale: "zh",
    pathIncludes: "address",
    find: "東",
    replace: "东",
  },
  {
    id: "J7-footer",
    label: "フッター（簡）「東京」→「东京」",
    locale: "zh",
    pathIncludes: "footer",
    find: "東京",
    replace: "东京",
  },
];

/** J4（手修正案内用）：英 legalNotice.items 内「取引態様（専任）」の誤訳。 */
export const J4_MANUAL = {
  id: "J4",
  locale: "en" as LangCode,
  pathIncludes: "legalNotice.items",
  wrong: "Chief",
  recommend: "Full-time (dedicated) Licensed Real Estate Transaction Specialist",
  note: "legalNotice.items（特定商取引法・en）の該当値を管理エディタで手修正。他ページの \"full-time\" 表記に統一。",
};

export type JChange = {
  patchId: string;
  /** translations/<locale> からのドットパス */
  path: string;
  before: string;
  after: string;
};

/**
 * 指定ロケールの翻訳ツリーに、そのロケール向けパッチを適用した新ツリーと変更点を返す。
 * dryRun でも同じ結果（変更点の算出）を得られる＝呼び出し側で保存の有無を制御する。
 */
export function applyJPatchesToLocale(
  locale: LangCode,
  data: Record<string, unknown>,
): { tree: Record<string, unknown>; changes: JChange[] } {
  const patches = J_PATCHES.filter((p) => p.locale === locale);
  const changes: JChange[] = [];

  function walk(node: unknown, path: string): unknown {
    if (typeof node === "string") {
      let next = node;
      for (const p of patches) {
        if (!path.includes(p.pathIncludes)) continue;
        if (!next.includes(p.find)) continue;
        const before = next;
        next = next.split(p.find).join(p.replace);
        if (next !== before) changes.push({ patchId: p.id, path, before, after: next });
      }
      return next;
    }
    if (Array.isArray(node)) return node.map((v, i) => walk(v, `${path}.${i}`));
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node)) out[k] = walk(v, `${path}.${k}`);
      return out;
    }
    return node;
  }

  const tree = walk(JSON.parse(JSON.stringify(data)), `translations/${locale}`) as Record<
    string,
    unknown
  >;
  return { tree, changes };
}

/** J4 手修正対象：en legalNotice.items 内の値のうち wrong を含む文字列を列挙（表示用）。 */
export function scanJ4Manual(data: Record<string, unknown>): { path: string; value: string }[] {
  const hits: { path: string; value: string }[] = [];
  function walk(node: unknown, path: string) {
    if (typeof node === "string") {
      if (path.includes(J4_MANUAL.pathIncludes) && node.includes(J4_MANUAL.wrong)) {
        hits.push({ path, value: node });
      }
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${path}.${i}`));
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    }
  }
  walk(data, "translations/en");
  return hits;
}
