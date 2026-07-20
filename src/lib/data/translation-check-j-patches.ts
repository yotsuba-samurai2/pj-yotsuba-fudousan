// 翻訳チェック §J（DB翻訳値側）の一括是正パッチ（2026-07-20 浦松の翻訳チェック結果より）。
//
// 背景：修正シート §J のうち以下はソースコードではなく DB translation テーブル（4言語）側の値。
//   - J5 /about（繁）資質 → 資格／證照
//   - J6 /contact（繁）定休日 → 公休日
//   - J7 フッター/住所（簡）「東」（繁/日字体）→ 东
// これらは「ロケール限定＋キーパス・アンカー限定」の部分文字列置換で安全に是正できる。
// find は誤り側の字体/語のみに一致し、既に正しい値には一致しない（冪等）。
//
// J4 /legal-notice（英）「専任」の誤訳（"Chief"）は legalNotice.items 配列内の値。現行値の細かな
//   語形に依存しないよう whole モード（find を含むリーフの値全体を確定値へ）で是正。必ずプレビュー確認。
// J9 コラム記事の社名は翻訳辞書ではなく Prisma のコラムデータ側＝本パッチ対象外（/admin/columns で手修正）。
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
  /** 誤り側の部分文字列（find を含むリーフのみ対象＝冪等） */
  find: string;
  /** 置換後 */
  replace: string;
  /**
   * true のとき：find を含むリーフの「値全体」を replace で置き換える（部分置換ではない）。
   * 現行値の細かな語形に依存せず確定値へ揃えたい場合に使う（例：J4 の取引態様ラベル）。
   * 誤って別の値に一致しないよう pathIncludes を十分に絞り、必ずプレビューで確認する。
   */
  whole?: boolean;
};

export const J_PATCHES: JPatch[] = [
  {
    id: "J4",
    label: "/legal-notice（英）取引態様ラベル「Chief …」→ full-time 表記へ統一",
    locale: "en",
    pathIncludes: "legalNotice.items",
    // 「Chief」を含む legalNotice.items のリーフ（＝専任の宅地建物取引士ラベルの誤訳）の値全体を確定値へ。
    find: "Chief",
    replace: "Full-time (dedicated) Licensed Real Estate Transaction Specialist",
    whole: true,
  },
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
        next = p.whole ? p.replace : next.split(p.find).join(p.replace);
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
