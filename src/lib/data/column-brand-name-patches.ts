// コラム記事内の社名表記ゆれ是正（翻訳チェック §J9・2026-07-20）。
//
// 背景：/zh/global 等の関連コラムで、社名が「四叶房产股份公司」（＝株式会社ではなく "股份公司"、
//   かつ簡体「叶／房产」）になっていた。正しくは登記名の「四葉不動産株式会社」（漢字・全ロケール共通）。
// コラムは Prisma（columns テーブル）管理＝翻訳辞書（/admin/translations）ではなくコラム側。
//
// 対象フィールド：title / excerpt / content / author.name / author.title、および
//   translations.{en, zh-tw, zh}.{title, excerpt, content, author.*}。全文字列リーフを再帰走査。
// 変種吸収：四[叶葉]房[产產]股份(有限)?公司 を1つの正規表現でまとめて「四葉不動産株式会社」へ。
//   （簡体/繁体の叶・葉／产・產、股份公司／股份有限公司 のゆれを吸収。冪等＝置換後は再一致しない）

/** 正しい登記名（全ロケール共通・漢字保持） */
export const CORRECT_BRAND = "四葉不動産株式会社";

/** 誤った社名表記（四叶/四葉 ＋ 房产/房產 ＋ 股份(有限)?公司） */
export const BAD_BRAND_RE = /四[叶葉]房[产產]股份(?:有限)?公司/g;

export type BrandMatch = { path: string; before: string; after: string };

/** 文字列リーフを再帰置換。変更の有無と before/after を収集して返す。 */
function walkPatch(node: unknown, path: string, matches: BrandMatch[]): { value: unknown; changed: boolean } {
  if (typeof node === "string") {
    if (!BAD_BRAND_RE.test(node)) return { value: node, changed: false };
    BAD_BRAND_RE.lastIndex = 0; // /g のステート初期化
    const after = node.replace(BAD_BRAND_RE, CORRECT_BRAND);
    BAD_BRAND_RE.lastIndex = 0;
    if (after === node) return { value: node, changed: false };
    matches.push({ path, before: node, after });
    return { value: after, changed: true };
  }
  if (Array.isArray(node)) {
    let changed = false;
    const out = node.map((v, i) => {
      const r = walkPatch(v, `${path}.${i}`, matches);
      if (r.changed) changed = true;
      return r.value;
    });
    return { value: changed ? out : node, changed };
  }
  if (node && typeof node === "object") {
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      const r = walkPatch(v, `${path}.${k}`, matches);
      if (r.changed) changed = true;
      out[k] = r.value;
    }
    return { value: changed ? out : node, changed };
  }
  return { value: node, changed: false };
}

/**
 * 1コラムを走査し、変更が必要なトップレベルフィールドのみのパッチと、全一致点を返す。
 * matches が空なら該当なし。patchedFields は updateColumn へそのまま渡せる（変更フィールドのみ）。
 */
export function patchColumnBrand(col: Record<string, unknown>): {
  patchedFields: Record<string, unknown>;
  matches: BrandMatch[];
} {
  const matches: BrandMatch[] = [];
  const patchedFields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(col)) {
    const r = walkPatch(v, k, matches);
    if (r.changed) patchedFields[k] = r.value;
  }
  return { patchedFields, matches };
}
